import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Luis() {
    const { ref, inView } = useInView<HTMLDivElement>({
        once: true,
        offset: 100
    })

    let timeout: NodeJS.Timeout;
    let timeoutFinished: NodeJS.Timeout;

    const [isEffectRunning, setIsEffectRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const handleFinished = () => {
        setIsFinished(true);
        document.body.style.overflow = 'auto';
    };

    const runTimeoutFinished = () => {
        timeoutFinished = setTimeout(() => {
            handleFinished();
        }, 8000);
    };

    useEffect(() => {
        if (inView && ref.current) {

            const offset = -120;
            const y = ref.current.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            document.body.style.overflow = 'hidden';

            timeout = setTimeout(() => {
                setIsEffectRunning(true);
                runTimeoutFinished();
            }, 7000);
        } else {
            setIsEffectRunning(false);
            setIsFinished(false);
        }

        return () => {
            clearTimeout(timeout);
            clearTimeout(timeoutFinished);
        };
    }, [inView, ref]);

    return (
        <div ref={ref} className="w-full px-8 pt-12 pb-[600px] flex flex-col gap-[100px] mt-[300px]">
            {!isFinished ? <>
                <h2 className={cn("opacity-0 text-3xl font-bold text-center delay-2000 transition-opacity duration-1000", {
                    "opacity-100": inView
                })}>
                    Adivina quien se queda sin Shonen Semanal
                </h2>
                {isEffectRunning && (
                    <div className="noise" />
                )}
                <img src={"https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsnnhdaqBEwi4ZKzYNLpRc1xlWyOGXngAU87Ds"} className="self-center h-auto w-[666px] align-middle z-[600]" />
            </> : <>
                <h2 className={cn("text-3xl mt-[120px] font-bold text-center")}>Bromita</h2>
                <img src={"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1fda4a1b40094c93af334f8b60868a7c/static/dark/3.0"} className="self-center h-auto w-[240px] align-middle" />
            </>}
            {!isFinished && (
                <div>
                    <div className="noise !opacity-0 pointer-events-none" />
                    <img src={"https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1fda4a1b40094c93af334f8b60868a7c/static/dark/3.0"} className="!opacity-0 self-center h-auto w-[10px] align-middle" />
                </div>
            )}
        </div>
    );
}
