'use client';
import { useState } from "react";
import DvdBounce from "../DvdBounce";
import { cn } from "@/lib/utils";

const LIST_OF_IMAGES = [
    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ',
    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs1m3mV54P0UjKIpmOYNRwzeElc3r4AkdBnMDa',
    'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_dff3bdf4815447a5941dd0ca7e003076/static/light/3.0',
    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsNA6gP5b9iFu0sXtSWf4lm5V3RAT8HPd1ChoI',
    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsyRTXAdWE2RrHWPuACU6tblTSchKogFveVfMY',
    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs2Owc1Rolsg76JvNkImERSopZqFPdQXbjhiCW',
    'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_e02650251d204198923de93a0c62f5f5/default/dark/3.0',
    'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs92YjYv31XHJRWw2l1Gy5B7eZAIsbioPcNDSa',
    'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_10fbf371421b4126abb0a04a55f7e216/animated/light/3.0',
    'https://www.cladera.org/biografias/pics/cientificos/freud.jpg',
    'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_50b3304bc0884c6792f13615db072a5c/static/dark/3.0',
    'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'
]


export default function DVDPepelu() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDVDClicked, setIsDVDClicked] = useState(false);

    const handleSideBounce = () => {
        setCurrentImageIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % LIST_OF_IMAGES.length;
            return nextIndex;
        });
    };

    const currentImage = LIST_OF_IMAGES[currentImageIndex];

    return (
        <>
            <div className="absolute flex top-10 left-10 opacity-0 ">
                {LIST_OF_IMAGES.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`image-${index}`}
                        className="w-4 h-4 object-cover"
                        loading="lazy"
                    />
                ))}
            </div>
            <div className="w-full h-[400px] md:h-[600px] flex items-center justify-center md:mt-[450px] mt-[250px] md:mb-[250px] mb-[150px] overflow-visible flex-col gap-5xlarge">
                <span className={cn("text-4xl font-bold aura text-red-500 opacity-100 transition-opacity duration-1000 ease-in-out delay-500 text-center", {
                    'opacity-0': isDVDClicked,
                })}>NO HAGAS CLICK AL PEPELU</span>
                <DvdBounce imgSrc={currentImage} onSideBounce={handleSideBounce} onDVDClick={() => setIsDVDClicked(true)} />
            </div>
        </>
    )
}