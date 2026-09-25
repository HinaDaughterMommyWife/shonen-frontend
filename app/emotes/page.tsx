import { EMOTES_TUTORIAL_IMAGE_URL, EmoteData } from '@/common/emotes';
import EmoteDecorator from '@/components/EmoteDecorator';
import EmotesInstruccions from '@/components/EmotesInstruccions/EmotesInstruccions';
import EmotesShowcase from '@/components/EmotesShowcase/EmotesShowcase';
import { unpack } from 'msgpackr';
import { preload } from 'react-dom';
import { Toaster } from 'sonner';

export default async function Home() {

    let emoteData: Record<string, EmoteData>;

    try {
        const resEmotedDataBuffer = await fetch(
            EMOTES_TUTORIAL_IMAGE_URL
            , {
                next: { revalidate: 3600, tags: ['emoteData'] }
            })

        const emoteArrayBuffer = await resEmotedDataBuffer.arrayBuffer();

        emoteData = unpack(new Uint8Array(emoteArrayBuffer)) as Record<string, EmoteData>;

    } catch (e) {
        emoteData = {};
    }

    return (
        <div className="flex flex-col gap-medium mx-small sm:mx-large md:mx-xlarge lg:mx-[10%]">
            <div className="w-full flex justify-center py-large">
                <h2 className="text-3xl font-bold">Listado de Emotes</h2>
            </div>
            <EmotesInstruccions />
            <EmotesShowcase emotesData={emoteData} />
            <Toaster />
            <div className="w-full flex flex-col gap-medium justify-center py-large mt-xlarge text-sm">
                <p className="text-gray-500 ">
                    Emotes extraidos con la API Oficial de Twitch respetando los Términos de Uso de Twitch. La utilidad de los emotes no esta siendo utilizado para ningún fin comercial, publicitario o difamatorio.
                </p>
                <p className="text-gray-500 ">
                    El Streamer TheDarkraiMola no tiene ninguna relación con la creación de esta pagina y el listado de los emotes. Esto es el trabajo de un seguidor de su canal. Si tienes alguna sugerencia o problema, por favor contactar a este correo:{" "}<a href="mailto:HinaDaughterMommyWife@proton.me" className="text-blue-500 hover:underline">
                        HinaDaughterMommyWife@proton.me
                    </a>
                </p>
            </div>
        </div>
    );
}
