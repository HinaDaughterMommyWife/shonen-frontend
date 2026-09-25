'use client';

export default function EmotesInstruccions() {
    return (
        <div className="w-full flex justify-center flex-col gap-medium py-large items-center text-center">
            <span className="text-2xl font-bold text-yellow-500 coarse:block hidden">
                Soporte para dispositivos táctiles.
            </span>
            <div className="flex flex-col gap-small items-center">
                <span className="text-sm font-medium text-gray-500">
                    <span className="hidden coarse:inline">Para seleccionar un emote, presiona el emote y se copiará al portapapeles.</span>
                    <span className="coarse:hidden inline">Para seleccionar un emote, haz click en el emote y se copiará al portapapeles.</span>
                </span>
                <span className="text-sm font-medium text-gray-500">
                    Para editar un emote, mantén presionado (click o toque) el emote por unos segundos.
                </span>
            </div>
        </div>
    );
}
