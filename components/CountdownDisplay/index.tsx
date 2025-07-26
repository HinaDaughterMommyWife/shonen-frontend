import React from "react";
import { useCountdownRAF } from "@/hooks/useCountdownRAF";

export const CountdownDisplay = ({
    toUnix,
}: {
    toUnix: number;
}) => {
    const { formatted, isFinished } = useCountdownRAF(toUnix);

    if (toUnix === 0) return <></>

    if (isFinished) return <>pepelu</>

    return (
        <>
            {formatted}
        </>
    );
};
