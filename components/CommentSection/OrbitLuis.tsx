import { useEffect, useState } from "react";

const LUIS_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsnnhdaqBEwi4ZKzYNLpRc1xlWyOGXngAU87Ds';
const PEPELU_IMAGE = 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ';

export default function OrbitLuis() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)')
        setIsMobile(mediaQuery.matches)

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    const radius = isMobile ? 240 : 100

    return (
        <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center md:mt-[450px] mt-[250px] md:mb-[250px] mb-[150px]">
            <img
                src={LUIS_IMAGE}
                alt="luis"
                className="z-10 h-12 w-12 md:h-32 md:w-32"
                loading="lazy"
            />

            <div
                className={`absolute animate-spin-orbit`}
                style={{
                    width: radius * 2,
                    height: radius * 2,
                }}
            >
                {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (360 / 8) * i
                    const x = radius * Math.cos((angle * Math.PI) / 180)
                    const y = radius * Math.sin((angle * Math.PI) / 180)

                    return (
                        <img
                            key={i}
                            src={PEPELU_IMAGE}
                            alt="pepelu"
                            className={`absolute -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'h-12 w-12' : 'h-8 w-8'
                                }`}
                            style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                            }}
                            loading="lazy"
                        />
                    )
                })}
            </div>
        </div>
    )
};