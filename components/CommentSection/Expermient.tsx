"use client";

import { CloudInterface } from "@/store/survey";
import { useMemo, useRef, useState, useEffect } from "react";
import WordCloud from "react-d3-cloud";
import { cn } from "@/lib/utils";

interface Props {
    data: CloudInterface[];
}

export default function Experiment({ data = [] }: Readonly<Props>) {
    const listRef = useRef<HTMLDivElement>(null);
    const cloudRef = useRef<HTMLDivElement>(null);

    const sortedData = useMemo(() => {
        return [...data]
            .sort((a, b) => b.value - a.value)
            .map((item) => ({
                text: item.text,
                value: item.value,
            }));
    }, [data]);

    const fontSize = useMemo(() => {
        if (data.length === 0) return () => 12;
        const values = data.map((item) => item.value);
        const min = Math.min(...values);
        const max = Math.max(...values);

        const minFont = 10;
        const maxFont = 60;

        return (word: { value: number }) => {
            const normalized =
                (Math.sqrt(word.value) - Math.sqrt(min)) /
                (Math.sqrt(max) - Math.sqrt(min) || 1);
            return minFont + normalized * (maxFont - minFont);
        };
    }, [data]);

    const scrollbarStyles =
        '[scrollbar-gutter:stable] [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:my-3 [&::-webkit-scrollbar]:absolute [&::-webkit-scrollbar]:w-[6px]';


    return (
        <div className="w-full px-8 py-12 flex flex-col gap-8 mt-[580px]">
            <div>
                <h2 className="text-3xl font-bold text-center">Experimento - Palabras mas usadas en el chat durante el Shonen Semanal</h2>
                <span className="block text-center text-gray-500 text-sm mt-2">Se ha filtrado algunas palabras muy comunes como algunos conectores y articulos</span>
                <span className="block text-center text-gray-500 text-xs mt-2">Esto solo es un experimento, la siguiente semana ya no estara. Si al SapoPerro le gusta la idea puedo hacer que sean 2 nubes, uno de solo la parte roja y otra del azul</span>
            </div>
            <div className="flex-1 relative cursor-default">
                <div ref={cloudRef}>
                    <WordCloud
                        width={500}
                        height={450}
                        data={sortedData}
                        fontSize={fontSize}
                        rotate={0}
                        padding={1.5}
                        random={() => 0.5}
                        spiral="archimedean"
                        font="sans-serif"
                    />
                </div>
            </div>

            <div
                ref={listRef}
                className={cn(
                    "w-72 h-[520px] overflow-y-auto border-l border-gray-300 pl-4 pr-2 self-center",
                    scrollbarStyles
                )}
            >
                <ul className="space-y-2">
                    {sortedData.map((word, index) => (
                        <li
                            key={word.text}
                        >
                            {index + 1}. {word.text} ({word.value})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}