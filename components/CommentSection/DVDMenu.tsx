'use client'

import { cn } from "@/lib/utils"
import { Slider } from "../ui/slider"
import { useDvd } from "@/providers/DvdSettings"
import { useEffect, useState } from "react";

export default function DVDMenu() {

    const { speed, opacity, setSpeed, setOpacity, enabled } = useDvd();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isAfterTimeout, setIsAfterTimeout] = useState(false);

    const afterTimeout = () => {
        setTimeout(() => {
            setIsAfterTimeout(true);
        }, 3000);
    };

    useEffect(() => {

        let timeoutId: NodeJS.Timeout;
        if (enabled) {
            timeoutId = setTimeout(() => {
                setIsEnabled(true);
                afterTimeout();
            }, 6000);
        }
        return () => clearTimeout(timeoutId);
    }, [enabled]);


    return (
        <div className={cn("fixed top-medium left-medium opacity-0 w-[250px] p-medium border transition-opacity duration-1000 ease-in-out border-gray-300 z-50 bg-black rounded-2xl flex flex-col gap-medium", {
            'opacity-100': isEnabled,
            '!opacity-10 hover:!opacity-100 !duration-300': isAfterTimeout
        })}
        >
            <div className="flex flex-row gap-medium">
                <label className="text-white" htmlFor="speed">Velocidad</label>
                <Slider
                    id="speed"
                    defaultValue={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    min={1}
                    max={15}
                    step={0.2}
                    className={cn("w-[100%]")}
                />
            </div>
            <div className="flex flex-row gap-medium">
                <label className="text-white" htmlFor="opacity">Opacidad</label>
                <Slider
                    id="opacity"
                    onValueChange={(value) => {
                        setOpacity(value[0] / 100)
                    }}
                    defaultValue={[opacity * 100]}
                    min={10}
                    max={100}
                    step={1}
                    className={cn("w-[100%]")}
                />
            </div>
        </div>
    )
}