import React, { useRef, useState, useEffect } from 'react';
import { useDvd } from '@/providers/DvdSettings';

interface DvdBounceProps {
    imgSrc: string;
    onSideBounce?: () => void;
    onDVDClick?: () => void;
}

const DvdBounce: React.FC<DvdBounceProps> = ({ imgSrc, onSideBounce, onDVDClick }) => {
    const refEl = useRef<HTMLDivElement>(null);
    const animRef = useRef<number>(0);


    const docPosRef = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 2, y: 2 });
    const position = useRef({ x: 0, y: 0 });
    const { speed, opacity, setEnabled } = useDvd();

    const [isMoving, setIsMoving] = useState(false);
    const [renderPos, setRenderPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const sx = Math.sign(velocity.current.x) || 1;
        const sy = Math.sign(velocity.current.y) || 1;
        velocity.current.x = sx * speed;
        velocity.current.y = sy * speed;
    }, [speed]);

    const animate = () => {
        const el = refEl.current;
        if (!el) return;

        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const maxX = window.innerWidth - w;
        const maxY = window.innerHeight - h;

        let nx = position.current.x + velocity.current.x;
        let ny = position.current.y + velocity.current.y;

        const hitX = nx <= 0 || nx >= maxX;
        const hitY = ny <= 0 || ny >= maxY;

        if (hitX) velocity.current.x *= -1;
        if (hitY) velocity.current.y *= -1;

        if ((hitX || hitY) && onSideBounce) {
            onSideBounce();
        }

        nx = Math.min(Math.max(nx, 0), maxX);
        ny = Math.min(Math.max(ny, 0), maxY);

        position.current = { x: nx, y: ny };
        setRenderPos({ x: nx, y: ny });

        animRef.current = requestAnimationFrame(animate);
    };

    const handleClick = () => {
        if (isMoving) return;
        if (onDVDClick) onDVDClick();

        const rect = refEl.current!.getBoundingClientRect();
        docPosRef.current = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
        };

        setTimeout(() => {
            const { x: docX, y: docY } = docPosRef.current;
            const startX = docX - window.scrollX;
            const startY = docY - window.scrollY;

            const dirX = Math.random() < 0.5 ? -1 : 1;
            const dirY = Math.random() < 0.5 ? -1 : 1;

            velocity.current.x = dirX * Math.abs(velocity.current.x);
            velocity.current.y = dirY * Math.abs(velocity.current.y);

            position.current = { x: startX, y: startY };
            setRenderPos({ x: startX, y: startY });

            setIsMoving(true);
            setEnabled(true);
            animRef.current = requestAnimationFrame(animate);
        }, 3000);
    };


    useEffect(() => {
        const onResize = () => {
            const el = refEl.current;
            if (!el) return;
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            const maxX = window.innerWidth - w;
            const maxY = window.innerHeight - h;

            position.current.x = Math.min(Math.max(position.current.x, 0), maxX);
            position.current.y = Math.min(Math.max(position.current.y, 0), maxY);
            setRenderPos({ ...position.current });
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animRef.current);
        };
    }, []);

    return (
        <>
            <div
                ref={refEl}
                onClick={handleClick}
                style={{
                    width: 100,
                    height: 100,
                    background: `url(${imgSrc}) center/contain no-repeat`,
                    opacity,
                    cursor: isMoving ? 'default' : 'pointer',
                    position: isMoving ? 'fixed' : 'relative',
                    left: isMoving ? renderPos.x : undefined,
                    top: isMoving ? renderPos.y : undefined,
                    zIndex: isMoving ? 20 : undefined,
                    willChange: 'transform',
                }}
            />
            {isMoving && (
                <div className="size-[100px] " />
            )}
        </>

    );
};

export default DvdBounce;
