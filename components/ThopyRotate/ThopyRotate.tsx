'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const TROPHY_IMAGE_URL =
  'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MsLiSEXeKP31Mm0JBnDg6WiToRbayfvwlQEI7';

interface ThopyRotateProps {
  className?: string;
  width?: number;
  depth?: number;
  outlineRadius?: number;
  spinSpeed?: number;
}

/**
 * Builds the brown side-wall geometry from a dilated alpha silhouette.
 * Returns the side geometry + dimensions needed to place the front/back planes.
 */
function buildSideGeometry(
  image: HTMLImageElement | ImageBitmap,
  worldWidth: number,
  depth: number,
  dilateRadius: number,
  alphaThreshold = 10,
) {
  const imgW = image.width;
  const imgH = image.height;

  // Downsample to a manageable grid
  const MAX_DIM = 128;
  const scale = Math.min(1, MAX_DIM / Math.max(imgW, imgH));
  const gw = Math.max(1, Math.round(imgW * scale));
  const gh = Math.max(1, Math.round(imgH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = gw;
  canvas.height = gh;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, gw, gh);

  const { data } = ctx.getImageData(0, 0, gw, gh);

  // Build base alpha mask
  const base = new Uint8Array(gw * gh);
  for (let i = 0; i < gw * gh; i++) {
    base[i] = data[i * 4 + 3] > alphaThreshold ? 1 : 0;
  }

  // Dilate the mask by `dilateRadius` pixels to create a thicker outline
  const r = Math.max(0, Math.round(dilateRadius * scale));
  const mask = new Uint8Array(gw * gh);
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      let hit = false;
      for (let dy = -r; dy <= r && !hit; dy++) {
        for (let dx = -r; dx <= r && !hit; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < gw && ny >= 0 && ny < gh && base[ny * gw + nx]) {
            hit = true;
          }
        }
      }
      mask[y * gw + x] = hit ? 1 : 0;
    }
  }

  // Find bounding box of dilated mask
  let minX = gw, minY = gh, maxX = -1, maxY = -1;
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      if (mask[y * gw + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX) return null;

  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const ps = worldWidth / cw; // pixel size in world units
  const hd = depth / 2;

  const isSolid = (x: number, y: number) => {
    if (x < 0 || x >= gw || y < 0 || y >= gh) return false;
    return mask[y * gw + x] === 1;
  };

  // Generate side wall quads only at edges of the dilated mask
  const positions: number[] = [];

  const pushQuad = (
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
    dx: number, dy: number, dz: number,
  ) => {
    positions.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    positions.push(ax, ay, az, cx, cy, cz, dx, dy, dz);
  };

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (!isSolid(x, y)) continue;

      const lx = x - minX;
      const ly = y - minY;
      const x0 = (lx - cw / 2) * ps;
      const x1 = x0 + ps;
      const y1 = (ch / 2 - ly) * ps;
      const y0 = y1 - ps;

      // Left edge
      if (!isSolid(x - 1, y)) {
        pushQuad(x0, y0, -hd, x0, y0, hd, x0, y1, hd, x0, y1, -hd);
      }
      // Right edge
      if (!isSolid(x + 1, y)) {
        pushQuad(x1, y0, hd, x1, y0, -hd, x1, y1, -hd, x1, y1, hd);
      }
      // Top edge
      if (!isSolid(x, y - 1)) {
        pushQuad(x0, y1, hd, x1, y1, hd, x1, y1, -hd, x0, y1, -hd);
      }
      // Bottom edge
      if (!isSolid(x, y + 1)) {
        pushQuad(x0, y0, -hd, x1, y0, -hd, x1, y0, hd, x0, y0, hd);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();

  // UV bounds so front/back planes show only the content region of the texture
  const uvMinU = minX / gw;
  const uvMaxU = (maxX + 1) / gw;
  const uvMinV = 1 - (maxY + 1) / gh;
  const uvMaxV = 1 - minY / gh;

  return {
    sideGeometry: geo,
    contentWidth: cw * ps,
    contentHeight: ch * ps,
    uv: { minU: uvMinU, maxU: uvMaxU, minV: uvMinV, maxV: uvMaxV },
  };
}

const ThopyRotate = ({
  className,
  width = 3,
  depth = 0.35,
  outlineRadius = 3,
  spinSpeed = 0.009,
}: ThopyRotateProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(2, 2, 4);
    scene.add(key);

    // --- Materials ---
    const sideMat = new THREE.MeshStandardMaterial({ color: '#8b5a2b' });
    const faceMat = new THREE.MeshStandardMaterial({
      transparent: true,
      alphaTest: 0.1,
      side: THREE.FrontSide,
    });

    const group = new THREE.Group();
    const defaultRotationX = -0.12;
    const defaultRotationY = 0.25;
    const defaultRotationZ = -0.04; // Inclinación lateral (puedes cambiar este valor)
    group.rotation.x = defaultRotationX;
    group.rotation.y = defaultRotationY;
    group.rotation.z = defaultRotationZ;
    scene.add(group);

    // --- Track disposables ---
    let sideGeo: THREE.BufferGeometry | null = null;
    let frontGeo: THREE.PlaneGeometry | null = null;
    let backGeo: THREE.PlaneGeometry | null = null;
    let tex: THREE.Texture | null = null;
    let cancelled = false;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    const load = async () => {
      const loaded = await loader.loadAsync(TROPHY_IMAGE_URL);
      if (cancelled) { loaded.dispose(); return; }

      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.minFilter = THREE.NearestFilter;
      loaded.magFilter = THREE.NearestFilter;
      tex = loaded;

      const img = loaded.image as HTMLImageElement | ImageBitmap;
      const aspect = img.height / img.width;

      // Build side walls from dilated alpha
      const built = buildSideGeometry(img, width, depth, outlineRadius);
      if (!built) { loaded.dispose(); return; }

      sideGeo = built.sideGeometry;
      const planeW = built.contentWidth;
      const planeH = built.contentHeight;
      const hd = depth / 2;

      // UV region that matches the dilated content area
      const { minU, maxU, minV, maxV } = built.uv;

      // Helper: set UVs on a PlaneGeometry to crop to the content region
      const setCroppedUVs = (geo: THREE.PlaneGeometry, flipHorizontal = false) => {
        const uvAttr = geo.getAttribute('uv');
        // PlaneGeometry default UVs: (0,1) (1,1) (0,0) (1,0)
        if (flipHorizontal) {
          // Flip horizontally (swap left/right)
          uvAttr.setXY(0, maxU, maxV);
          uvAttr.setXY(1, minU, maxV);
          uvAttr.setXY(2, maxU, minV);
          uvAttr.setXY(3, minU, minV);
        } else {
          uvAttr.setXY(0, minU, maxV);
          uvAttr.setXY(1, maxU, maxV);
          uvAttr.setXY(2, minU, minV);
          uvAttr.setXY(3, maxU, minV);
        }
        uvAttr.needsUpdate = true;
      };

      // --- Front plane (faces camera at +Z) ---
      frontGeo = new THREE.PlaneGeometry(planeW, planeH);
      setCroppedUVs(frontGeo);
      const frontMesh = new THREE.Mesh(frontGeo, faceMat);
      frontMesh.position.z = hd + 0.001;

      // --- Back plane (faces away at -Z, mirror the image) ---
      backGeo = new THREE.PlaneGeometry(planeW, planeH);
      setCroppedUVs(backGeo, true); // Flip horizontally to match the outline
      const backMesh = new THREE.Mesh(backGeo, faceMat);
      backMesh.position.z = -(hd + 0.001);
      backMesh.rotation.y = Math.PI;

      faceMat.map = loaded;
      faceMat.needsUpdate = true;

      const sideMesh = new THREE.Mesh(sideGeo, sideMat);

      group.add(frontMesh, backMesh, sideMesh);

      camera.position.z = Math.max(6.5, planeH * 1.7);
      resize();
    };

    load().catch((e) => console.error('ThopyRotate load error:', e));

    // --- Resize ---
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // --- Mouse drag interaction ---
    let isDragging = false;
    let isReturning = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotX = defaultRotationX;
    let targetRotY = defaultRotationY;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      isReturning = false;
      prevX = e.clientX;
      prevY = e.clientY;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      targetRotY -= deltaX * 0.01;
      targetRotX -= deltaY * 0.01;
      // Clamp X rotation to avoid flipping upside down
      targetRotX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, targetRotX));
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      isReturning = true;
      container.style.cursor = 'grab';
    };

    container.style.cursor = 'grab';
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // --- Animate ---
    let raf = 0;
    const tick = () => {
      if (isDragging) {
        // User is dragging, apply target rotations directly (no auto-spin)
        group.rotation.x = targetRotX;
        group.rotation.y = targetRotY;
      } else if (isReturning) {
        // Smooth return to default rotations after drag release
        const diffX = defaultRotationX - group.rotation.x;
        const diffY = defaultRotationY - group.rotation.y;
        
        // Normalize Y angle difference to [-π, π]
        let normalizedDiffY = ((diffY + Math.PI) % (2 * Math.PI)) - Math.PI;
        if (normalizedDiffY < -Math.PI) normalizedDiffY += 2 * Math.PI;

        group.rotation.x += diffX * 0.06;
        group.rotation.y += normalizedDiffY * 0.06;

        // Check if close enough to default to stop returning
        if (Math.abs(diffX) < 0.01 && Math.abs(normalizedDiffY) < 0.01) {
          group.rotation.x = defaultRotationX;
          group.rotation.y = defaultRotationY;
          isReturning = false;
        }
      } else {
        // Auto-spin continuously
        group.rotation.y += spinSpeed;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      sideGeo?.dispose();
      frontGeo?.dispose();
      backGeo?.dispose();
      sideMat.dispose();
      faceMat.dispose();
      tex?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [depth, outlineRadius, spinSpeed, width]);

  return (
    <section className={className}>
      <div
        ref={containerRef}
        className="h-[620px] w-full max-w-[680px] rounded-md "
      />
    </section>
  );
};

export default ThopyRotate;