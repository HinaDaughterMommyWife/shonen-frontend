'use client';
import { getEmotesData } from '@/common';
import { EmoteData } from '@/common/emotes';
import { effectAnimationMap, effectClassMap, wrapperClassMap } from '@/common/emotesEffects';
import { cn } from '@/lib/utils';
import React, { ReactElement } from 'react';

interface EmoteDecoratorProps {
    children: React.ReactNode;
}

function EmoteDecorator({ children }: EmoteDecoratorProps) {
    const emotesData: Record<string, EmoteData> = getEmotesData();

    function createKeyframes(name: string, emote: any, gridSize: number) {
        const { frameCount, frameWidth, frameHeight, x, y } = emote;
        const totalWidth = gridSize * frameWidth;

        const styleSheet = document.styleSheets[0];
        const exists = Array.from(styleSheet.cssRules).some(
            rule => rule instanceof CSSKeyframesRule && rule.name === name
        );
        if (exists) return;

        let keyframes = `@keyframes ${name} {`;
        for (let i = 0; i < frameCount; i++) {
            const col = i % gridSize;
            const row = Math.floor(i / gridSize);

            let posX = x + col * frameWidth;
            let posY = y + row * frameHeight;

            if (posX >= totalWidth) {
                posX -= totalWidth;
                posY += frameHeight;
            }

            const percentage = (i / frameCount) * 100;
            keyframes += `${percentage}% { background-position: -${posX}px -${posY}px; }`;
        }
        keyframes += `}`;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }

    function transform(node: React.ReactNode): React.ReactNode {
        if (typeof node === 'string') {
            const parts = node.split(/(\s+)/g).filter(Boolean);

            const result: React.ReactNode[] = [];
            let textBuffer = '';

            parts.forEach((part, index) => {
                const [baseName, ...effectKeysRaw] = part.split('_');

                const effectKeysSet = new Set<string>();
                effectKeysRaw.forEach(key => {
                    const upperKey = key.toUpperCase();
                    if (effectClassMap[upperKey] || effectAnimationMap[upperKey] || wrapperClassMap[upperKey]) {
                        effectKeysSet.add(upperKey);
                    }
                });

                const effectClasses = Array.from(effectKeysSet)
                    .map(key => effectClassMap[key])
                    .filter(Boolean)
                    .join(' ');

                const animationFromEffect = Array.from(effectKeysSet)
                    .map(key => effectAnimationMap[key])
                    .filter(Boolean)
                    .join(', ');

                const wrapperClasses = Array.from(effectKeysSet)
                    .map(key => wrapperClassMap[key])
                    .filter(Boolean)
                    .join(' ');

                const emoteKey = baseName.match(/^[a-z0-9]+/)?.[0] ?? null;
                const emoteData = emotesData[emoteKey ?? ''];
                const emote = emoteData?.emotes[baseName];
                const isAnimated = emote && 'animationDuration' in emote;
                const fileURL = isAnimated
                    ? emoteData?.filePaths.animated.fileURL
                    : emoteData?.filePaths.static.fileURL;

                if (emote) {
                    if (textBuffer) {
                        result.push(textBuffer);
                        textBuffer = '';
                    }

                    if (isAnimated) {
                        createKeyframes(baseName, emote, emoteData.filePaths.animated.gridSize);
                    }

                    const emoteWidth = isAnimated ? emote.frameWidth : emote.width;
                    const emoteHeight = isAnimated ? emote.frameHeight : emote.height;

                    const emoteImage = (
                        <img
                            key={`emote-${index}`}
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC"
                            alt={part}
                            aria-label={part}
                            title={part}
                            className={`inline align-text-bottom bg-no-repeat bg-center ${effectClasses}`}
                            style={{
                                width: `${emoteWidth}px`,
                                height: `${emoteHeight}px`,
                                backgroundImage: `url(${fileURL})`,
                                backgroundPosition: `-${emote.x}px -${emote.y}px`,
                                imageRendering: 'pixelated',
                                animation: [
                                    isAnimated ? `${baseName} ${emote.animationDuration}ms steps(1) infinite` : '',
                                    animationFromEffect,
                                ].filter(Boolean).join(', '),
                            }}
                        />
                    );

                    result.push(wrapperClasses
                        ? <span key={`wrap-${index}`} className={cn("inline-block", wrapperClasses)} style={{ width: `${emoteWidth}px`, height: `${emoteHeight}px` }}>{emoteImage}</span>
                        : emoteImage);

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
