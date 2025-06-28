import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export default function CaitThinking() {

    const { ref, inView } = useInView<HTMLDivElement>({
        once: true,
        distance: 15
    })

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsDZ6zME0RboiulkcTLEaP4B03JR1jp8CwYDmh');
        audioRef.current.preload = 'auto';
    }, []);

    useEffect(() => {
        if (inView && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch((err) => {
                console.warn("Playback error:", err);
            });
        }
    }, [inView, ref]);

    return (
        <div ref={ref} className="w-full px-8 pt-12 pb-[600px] flex flex-col gap-[100px] mt-[340px] justify-center items-center">
            <div className={
                cn("fixed inset-0 -z-10 bg-cover bg-center w-full h-full opacity-0 transition-opacity duration-1000 bg-[url('https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ')]",
                    {
                        "opacity-100": inView
                    }
                )}
            />
            <div className="w-full h-auto flex justify-center items-center">
                <img
                    src={'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_50b3304bc0884c6792f13615db072a5c/static/dark/3.0'}
                    alt={'caitThinking'}
                    className={cn("inline size-[80px] align-middle transition-opacity duration-1000", {
                        "opacity-0": inView
                    })}
                    loading="lazy"
                />
            </div>
        </div>
    );
}