import React from "react";
import { useCountdownRAF } from "@/hooks/useCountdownRAF";

export const CountdownDisplay = ({
    toUnix,
}: {
    toUnix: number;
}) => {
    const { formatted } = useCountdownRAF(toUnix);

    return (
        <>
            {formatted}
        </>
    );
};
