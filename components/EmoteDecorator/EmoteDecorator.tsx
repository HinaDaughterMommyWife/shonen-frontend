'use client';

import { getEmotesData } from '@/common';
import { EmoteData } from '@/common/emotes';
import { resolveEmoteToken } from '@/common/emoteResolver';
import { effectAnimationMap, effectClassMap, wrapperClassMap } from '@/common/emotesEffects';
import { cn } from '@/lib/utils';
import React, { ReactElement } from 'react';

interface EmoteDecoratorProps {
    children: React.ReactNode;
    emotesDataSSR?: Record<string, EmoteData>;
    displaySize?: number;
}

// Module-level cache: which @keyframes names have already been inserted into the
// document, so repeated renders don't re-scan document.styleSheets[0].cssRules.
const injectedKeyframeNames = new Set<string>();

function EmoteDecorator({ children, emotesDataSSR, displaySize = 64 }: EmoteDecoratorProps) {
    const emotesData: Record<string, EmoteData> = emotesDataSSR ?? getEmotesData();

    function createKeyframes(name: string, emote: any, gridSize: number, scaleFactor: number, displaySize: number) {
        const { frameCount, frameWidth, frameHeight, x, y } = emote;
        const totalWidth = gridSize * frameWidth;

        if (typeof window === 'undefined') return;

        const keyFrameName = `${name}-${displaySize}`;

        if (injectedKeyframeNames.has(keyFrameName)) return;

        const styleSheet = document.styleSheets[0];

        let keyframes = `@keyframes ${keyFrameName} {`;
        for (let i = 0; i < frameCount; i++) {
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);

            let posX = x + col * frameWidth;
            let posY = y + row * frameHeight;

            if (posX >= totalWidth) {
                posX -= totalWidth;
                posY += frameHeight;
            }

            const scaledX = posX * scaleFactor;
            const scaledY = posY * scaleFactor;

            const percentage = (i / frameCount) * 100;
            keyframes += `${percentage}% { background-position: -${scaledX}px -${scaledY}px; }`;
        }
        keyframes += `}`;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        injectedKeyframeNames.add(keyFrameName);
    }

    function transform(node: React.ReactNode): React.ReactNode {
        if (typeof node === 'string') {
            const parts = node.split(/(\s+)/g).filter(Boolean).flatMap(part => {
                const match = part.match(/^(.+?)([.,;:!?¿¡])$/);
                if (match) {
                    return [match[1], match[2]];
                }
                return [part];
            });

            const result: React.ReactNode[] = [];
            let textBuffer = '';

            parts.forEach((part, index) => {
                const resolved = resolveEmoteToken(part, emotesData);

                if (resolved) {
                    const { baseName, emoteData, emote, effectKeys } = resolved;
                    const isAnimated = 'animationDuration' in emote;

                    const effectClasses = effectKeys.map(key => effectClassMap[key]).filter(Boolean).join(' ');
                    const animationFromEffect = effectKeys.map(key => effectAnimationMap[key]).filter(Boolean).join(', ');
                    const wrapperClasses = effectKeys.map(key => wrapperClassMap[key]).filter(Boolean).join(' ');

                    const fileURL = isAnimated
                        ? emoteData.filePaths.animated.fileURL
                        : emoteData.filePaths.static.fileURL;

                    if (textBuffer) {
                        result.push(textBuffer);
                        textBuffer = '';
                    }

                    const spriteWidth = isAnimated ? emote.frameWidth : emote.width;
                    const displayWidth = displaySize;
                    const displayHeight = displaySize;

                    const scaleFactor = displayWidth / spriteWidth;

                    if (isAnimated) {
                        createKeyframes(baseName, emote, emoteData.filePaths.animated.gridSize, scaleFactor, displaySize);
                    }



                    const gridSize = isAnimated
                        ? emoteData.filePaths.animated.gridSize
                        : emoteData.filePaths.static.gridSize;

                    const scaledSpriteWidth = gridSize * displayWidth;
                    const scaledSpriteHeight = gridSize * displayHeight;

                    const emoteDiv = (
                        <div
                            key={`emote-${index}`}
                            title={part}
                            aria-label={part}
                            className={`inline-block align-text-bottom bg-no-repeat bg-center ${effectClasses}`}
                            style={{
                                width: `${displayWidth}px`,
                                height: `${displayHeight}px`,
                                contentVisibility: "auto",
                                containIntrinsicSize: `${displayWidth}px ${displayHeight}px`,
                                backgroundImage: `url(${fileURL})`,
                                backgroundSize: `${scaledSpriteWidth}px ${scaledSpriteHeight}px`,
                                backgroundPosition: `-${emote.x * scaleFactor}px -${emote.y * scaleFactor}px`,
                                animation: [
                                    isAnimated ? `${baseName}-${displaySize} ${emote.animationDuration}ms steps(1) infinite` : '',
                                    animationFromEffect,
                                ].filter(Boolean).join(', '),
                            }}
                        >
                            <img
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC"
                                width={displayWidth}
                                height={displayHeight}
                                alt={part}
                                aria-label={part}
                                title={part}
                            />
                        </div>
                    );

                    result.push(wrapperClasses
                        ? <span key={`wrap-${index}`} className={cn("inline-block", wrapperClasses)} style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}>{emoteDiv}</span>
                        : emoteDiv);

                } else {
                    textBuffer += part;
                }
            });

            if (textBuffer) {
                result.push(textBuffer);
            }

            return result;
        }

        if (Array.isArray(node)) {
            return node.map((child, i) => (
                <React.Fragment key={i}>{transform(child)}</React.Fragment>
            ));
        }

        if (React.isValidElement(node)) {
            const element = node as ReactElement<any>;
            const props = element.props as Record<string, any>;

            return React.cloneElement(element, {
                ...props,
                children: transform(props.children),
            });
        }

        return node;
    }



    return <>{transform(children)}</>;
}

export default React.memo(EmoteDecorator);
