import { useState } from "react";
import EmoteDecorator from "../EmoteDecorator/EmoteDecorator";
import { effectAnimationMap, effectClassMap, effectTextMap, wrapperClassMap } from "@/common/emotesEffects";
import { EmoteData } from "@/common/emotes";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface EmoteEditorProps {
    emoteName: string;
    emotesData: Record<string, EmoteData>;
    handleAddHistoryEmote: (emoteName: string) => void;
}

export default function EmoteEditor({ emoteName, emotesData, handleAddHistoryEmote }: EmoteEditorProps) {
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
        handleAddHistoryEmote(emoteNameWithEffects);
    };


    const rawEmoteClasses = selectedEffects.join('_');
    const emoteNameWithEffects = `${emoteName}${rawEmoteClasses ? `_${rawEmoteClasses}` : ''}`;

    return (
        <div className="flex flex-col items-center gap-large py-6 px-4 w-full max-w-screen-md mx-auto">
            <div className="relative w-full min-h-[220px] flex items-end justify-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full px-4">
                    <h1 className="text-xl font-bold text-center break-words w-full max-w-full">
                        {emoteNameWithEffects}
                    </h1>
                </div>

                <EmoteDecorator emotesDataSSR={emotesData} displaySize={160}>
                    <span onClick={handleClickEmote} className="cursor-pointer">{emoteNameWithEffects}</span>
                </EmoteDecorator>
            </div>

            <div className="w-full flex flex-col gap-small items-center">
                <h2 className="text-lg font-bold">Efectos</h2>
                <div className="w-full flex flex-wrap justify-center gap-small">
                    {Object.entries({ ...effectClassMap, ...wrapperClassMap }).map(([key]) => (
                        <Button
                            key={key}
                            type="button"
                            size="sm"
                            variant={selectedEffects.includes(key) ? 'default' : 'outline'}
                            onClick={() => handleEffectClick(key)}
                        >
                            {effectTextMap[key]}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="w-full flex flex-col gap-small items-center">
                <h2 className="text-lg font-bold">Efectos Especiales</h2>
                <span className="text-sm text-gray-500">Solo se puede seleccionar uno (excepto el rainbow)</span>
                <div className="w-full flex flex-wrap justify-center gap-small">
                    {Object.entries(effectAnimationMap).map(([key]) => (
                        <Button
                            key={key}
                            type="button"
                            size="sm"
                            variant={isSelected(key) ? 'default' : 'outline'}
                            onClick={() => handleAnimationClick(key)}
                        >
                            {effectTextMap[key]}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}
