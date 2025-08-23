'use client';

import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Runner, World, Bodies, Body } from 'matter-js';
import { EmoteEntry } from './types';

type EmotePhysicsProps = {
  emotes: EmoteEntry[];
  onEmoteEnd: (id: string) => void;
};

type EmoteBody = {
  body: Body;
  src: string;
  animated: boolean;
  originalWidth: number;
  originalHeight: number;
  cleanupInterval?: NodeJS.Timeout;
};

const FIXED_HEIGHT = 32;

export default function EmotePhysics({ emotes, onEmoteEnd }: EmotePhysicsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<Render | null>(null);
  const engineRef = useRef<Engine | null>(null);

  const emoteBodiesRef = useRef<Map<string, EmoteBody>>(new Map());
  const processedEmotesRef = useRef<Set<string>>(new Set());
  const [_renderFrame, setRenderFrame] = useState(0);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      setRenderFrame((f) => f + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!containerRef.current || engineRef.current) return;

    const container = containerRef.current;
    const engine = Engine.create();
    engineRef.current = engine;

    const wallThickness = 100;

    const boundaries = [
      Bodies.rectangle(
        window.innerWidth / 2,
        -wallThickness / 2,
        window.innerWidth,
        wallThickness,
        {
          isStatic: true,
          render: { visible: false },
        },
      ),
      Bodies.rectangle(
        -wallThickness / 2,
        window.innerHeight / 2,
        wallThickness,
        window.innerHeight * 2,
        {
          isStatic: true,
          render: { visible: false },
        },
      ),
      Bodies.rectangle(
        window.innerWidth + wallThickness / 2,
        window.innerHeight / 2,
        wallThickness,
        window.innerHeight * 2,
        {
          isStatic: true,
          render: { visible: false },
        },
      ),
    ];

    World.add(engine.world, boundaries);

    const render = Render.create({
      element: container,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      },
    });

    Render.run(render);
    renderRef.current = render;

    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      if (!renderRef.current) return;

      const render = renderRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      render.bounds.max.x = width;
      render.bounds.max.y = height;
      render.options.width = width;
      render.options.height = height;

      render.canvas.width = width;
      render.canvas.height = height;

      Render.setPixelRatio(render, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      window.removeEventListener('resize', handleResize);

      renderRef.current = null;
      engineRef.current = null;

      emoteBodiesRef.current.forEach(({ cleanupInterval }) => {
        if (cleanupInterval) clearInterval(cleanupInterval);
      });
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current || !renderRef.current || !containerRef.current) return;

    const engine = engineRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const { width, height } = containerRect;

    const newEmotes = emotes.filter((emote) => !processedEmotesRef.current.has(emote.id));
    if (newEmotes.length === 0) return;

    newEmotes.forEach(
      ({ id, src, animated, width: originalWidth, height: originalHeight, isTwitch }) => {
        processedEmotesRef.current.add(id);

        let renderWidth = originalWidth;
        let renderHeight = originalHeight;
        let density = 0.013;

        const scale = FIXED_HEIGHT / originalHeight;
        renderHeight = FIXED_HEIGHT;
        renderWidth = originalWidth * scale;

        if (!isTwitch) {
          density = 0.006;
        }

        const body = Bodies.rectangle(
          Math.random() * width,
          height + renderHeight,
          renderWidth,
          renderHeight,
          {
            restitution: 0.8,
            friction: 0.01,
            frictionAir: 0.02,
            density,
            inertia: undefined,
            render: true
              ? { visible: false }
              : {
                  sprite: { texture: src, xScale: 1, yScale: 1 },
                },
          },
        );

        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

        const cleanupInterval = setInterval(() => {
          if (body.position.y > height + 150) {
            World.remove(engine.world, body);
            emoteBodiesRef.current.delete(id);
            processedEmotesRef.current.delete(id);
            onEmoteEnd(id);
            clearInterval(cleanupInterval);
          }
        }, 1000);

        emoteBodiesRef.current.set(id, {
          body,
          src,
          animated,
          cleanupInterval,
          originalWidth,
          originalHeight,
        });

        World.add(engine.world, body);

        const EMOTE_FORCE_SCALE = 0.0022;
        const sizeFactor = Math.sqrt(width * height);

        const baseForce = EMOTE_FORCE_SCALE * sizeFactor;
        const forceMagnitude = animated
          ? baseForce * (0.6 + Math.random() * 0.4)
          : baseForce * (0.5 + Math.random() * 0.4);

        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        Body.applyForce(body, body.position, {
          x: forceMagnitude * Math.cos(angle),
          y: forceMagnitude * Math.sin(angle),
        });

        console.log(emotes);
      },
    );
  }, [emotes, onEmoteEnd]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 opacity-50"
    >
      {[...emoteBodiesRef.current.entries()].map(
        ([id, { body, src, animated, originalWidth, originalHeight }]) => {
          if (!animated) return null;

          const height = FIXED_HEIGHT;
          const width = Math.round((originalWidth / originalHeight) * FIXED_HEIGHT);

          const left = body.position.x - width / 2;
          const top = body.position.y - height / 2;
          const rotation = body.angle;

          return (
            <img
              key={id}
              src={src}
              alt="animated emote"
              style={{
                position: 'absolute',
                width,
                height,
                left,
                top,
                transform: `rotate(${rotation}rad)`,
                willChange: 'transform',
                pointerEvents: 'none',
              }}
            />
          );
        },
      )}
    </div>
  );
}
