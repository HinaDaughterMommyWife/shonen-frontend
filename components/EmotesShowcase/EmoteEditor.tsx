import { useState } from "react";
import EmoteDecorator from "../EmoteDecorator/EmoteDecorator";
import { effectAnimationMap, effectClassMap, effectTextMap, wrapperClassMap } from "@/common/emotesEffects";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { addToLocalStorageLimited } from "@/lib/localStorage";

interface EmoteEditorProps {
    emoteName: string;
    handleAddHistoryEmote: (emoteName: string) => void;
}

export default function EmoteEditor({ emoteName, handleAddHistoryEmote }: EmoteEditorProps) {
    const [selectedEffects, setSelectedEffects] = useState<string[]>([]);

    const multiSelectableEffects = ['RAINBOW'];

    const handleEffectClick = (effect: string) => {
        if ((window as any).stonks) {
            (window as any).stonks.event(`emote-effect-${emoteName}-${effect}`)
        }
        setSelectedEffects(prev =>
            prev.includes(effect)
                ? prev.filter(e => e !== effect)
                : [...prev, effect]
        );
    };

    const isSelected = (key: string) => selectedEffects.includes(key);

    const handleAnimationClick = (effect: string) => {
        if ((window as any).stonks) {
            (window as any).stonks.event(`emote-effect-${emoteName}-${effect}`)
        }
        const isMulti = multiSelectableEffects.includes(effect);

        setSelectedEffects(prev => {
            const isAlreadySelected = prev.includes(effect);

            const currentAnimations = prev.filter(e => Object.keys(effectAnimationMap).includes(e));
            const currentNonAnimations = prev.filter(e => !Object.keys(effectAnimationMap).includes(e));

            if (isMulti) {
                return isAlreadySelected
                    ? [...currentNonAnimations, ...currentAnimations.filter(e => e !== effect)]
                    : [...prev, effect];
            } else {
                const preservedMulti = currentAnimations.filter(e => multiSelectableEffects.includes(e));
                return isAlreadySelected
                    ? [...currentNonAnimations, ...preservedMulti]
                    : [...currentNonAnimations, ...preservedMulti, effect];
            }
        });
    };

    const handleClickEmote = () => {
        toast(`${emoteNameWithEffects} copiado al portapapeles.`, {
            duration: 2000,
            style: {
                background: "#333",
                color: "#fff",
            },
        })
        navigator.clipboard.writeText(emoteNameWithEffects);
        addToLocalStorageLimited('emoteHistory', emoteNameWithEffects);
        handleAddHistoryEmote(emoteNameWithEffects);
    };


    const rawEmoteClasses = selectedEffects.join('_');
    const emoteNameWithEffects = `${emoteName}${rawEmoteClasses ? `_${rawEmoteClasses}` : ''}`;

    return (
        <div className="flex flex-col items-center gap-medium py-6 px-4 w-full max-w-screen-md mx-auto">
            <div className="relative w-full min-h-[220px]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full px-4">
                    <h1 className="text-xl font-bold text-center break-words w-full max-w-full">
                        {emoteNameWithEffects}
                    </h1>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <EmoteDecorator displaySize={128}>
                        <span onClick={handleClickEmote} className="cursor-pointer">{emoteNameWithEffects}</span>
                    </EmoteDecorator>
                </div>
            </div>

            <div className="w-full flex flex-wrap justify-center gap-small">
                {Object.entries({ ...effectClassMap, ...wrapperClassMap }).map(([key]) => (
                    <button
                        key={key}
                        onClick={() => handleEffectClick(key)}
                        className={cn("p-2 rounded-md border border-gray-300 transition-colors text-sm", {
                            'bg-red-500 text-white': selectedEffects.includes(key),
                        })}
                    >
                        {effectTextMap[key]}
                    </button>
                ))}
            </div>


            <div className="w-full flex flex-col gap-small mt-medium items-center">
                <h2 className="text-xl font-bold">Efectos Especiales</h2>
                <span className="text-sm text-gray-500">Solo se pueden seleccionar uno (excepto el rainbow)</span>
                <div className="w-full flex flex-wrap justify-center gap-small">

                    {Object.entries(effectAnimationMap).map(([key]) => (
                        <button
                            key={key}
                            onClick={() => handleAnimationClick(key)}
                            className={cn(
                                "p-2 rounded-md border border-gray-300 transition-colors text-sm",
                                {
                                    'bg-red-500 text-white': isSelected(key),
                                }
                            )}
                        >
                            {effectTextMap[key]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
