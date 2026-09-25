import EmoteDecorator from "@/components/EmoteDecorator";
import { EMOTES_TUTORIAL_IMAGE_URL, EmoteData } from "@/common/emotes";
import { unpack } from "msgpackr";
import Image from "next/image";

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
        <div className="flex mx-[10%] flex-col gap-medium">
            <div className="w-full flex justify-center py-xlarge">
                <EmoteDecorator emotesDataSSR={emoteData} displaySize={48}>
                    <span className="text-3xl font-bold text-center">ilarjClap Finalmente tenemos emotes en los comentarios ilarjClap_MIRROR</span>
                </EmoteDecorator>
            </div>
            <div className="w-full flex flex-col gap-medium justify-center py-large mt-medium text-base font-semibold">
                <EmoteDecorator emotesDataSSR={emoteData} displaySize={24}>
                    <span className="text-gray-200">
                        Luego de casi 5 semanas de trabajo (en mis tiempos libres). He logrado agregar los emotes de diferentes canales de Twitch a los comentarios. No voy a detallar todo el proceso ya que es bastante largo y técnico ilarjScared
                    </span>
                    <span>
                        Solo puedo comentar que 4 años de estudios sirvieron de algo oberon14Noko
                    </span>
                    <br />
                    <span>
                        Bien, como funciona esto? Es muy sencillo. Es increiblemente simple ilarjYes
                    </span>
                    <span>
                        En las encuestas de Google Forms de Robraas ( erickdbzPepelu ), despues de votar por los mangas de la semana, hay un campo para dejar algun comentario con referente a los mangas, o pedir amablemente que Darkrai ( darkraiSapoweon ) cierre el stream
                    </span>
                    <div className="flex justify-center w-full my-xlarge">
                        <Image
                            src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsDK8HNBRboiulkcTLEaP4B03JR1jp8CwYDmhH"
                            alt="Encuesta de Robraas"
                            width={800}
                            height={800}
                        />
                    </div>
                    <br />
                    <span>
                        En este campo de texto, solo tienes que escribir el nombre del emote que quieras agregar, por ejemplo "darkraiSapoweon" (sin comillas)
                    </span>
                    <span>
                        Luego de escribir el nombre del emote y enviar la encuesta, si tu comentario es aprobado y seleccionado por Robraas( erickdbzPepelu ), el emote se podra ver el la pagina del Shonen Semanal (En la seccion de comentarios)
                    </span>
                    <span>
                        Todos los emotes de Darkrai ( darkraiSapoweon ), Oberon, algunos streamers amigos de Darkrai ( darkraiSapoweon ), emotes de canales que se usaran frecuentemente en el chat y los emotes Globales de Twitch se agregaron a la lista de emotes. Esto incluye tambien a los emotes animados <span className="text-gray-500 italic text-xs">(dios como me dolio hacerlo funcionar xd)</span>
                    </span>
                </EmoteDecorator>
                <div className="flex justify-center py-xlarge">
                    <EmoteDecorator emotesDataSSR={emoteData} displaySize={48}>
                        <span className="text-gray-200">
                            darkraiMiquella darkraiMierdon darkraiWeondance oberon14Kukiwis erickdbzFelih WhySoSerious DinoDance dashan4Balatro
                        </span>
                    </EmoteDecorator>
                </div>
                <span>
                    Tambien, puedes agregar efectos a los emotes. Se pueden ver todos los efectos en la pagina de emotes
                </span>
                <div className="flex justify-center py-xlarge">
                    <EmoteDecorator emotesDataSSR={emoteData} displaySize={48}>
                        <span className="text-gray-200">
                            darkraiMiquella_SPIN  darkraiMierdon_TADA darkraiWeondance_BOUNCE oberon14Kukiwis_BW erickdbzFelih_SPINR WhySoSerious_MIRROR DinoDance_ROTATE dashan4Balatro_WOBBLE

                        </span>
                    </EmoteDecorator>
                </div>
                <span>
                    Los efectos se agregan al final del nombre del emote, por ejemplo "darkraiMiquella_SPIN", lo que ven arriba seria:
                </span>
                <span className="text-gray-400 text-xs text-center">
                    darkraiMiquella_SPIN darkraiMierdon_TADA darkraiWeondance_BOUNCE .... y asi con los demas
                </span>

                <span>
                    Un ejemplo mas visual, seria algo asi en el Google Forms:
                </span>
                <div className="bg-white p-medium text-black font-normal">
                    <span className="text-2xl whitespace-pre-line break-word">
                        El capitulo de Medalist de esta semana ha sido bastante lindo y divertido darkraiErenrage_MIRROR Increible como siempre. Lo mejor del Shonen Semanal chaval darkraiCine darkraiCine_ROTATE darkraiNyun_BOUNCE
                    </span>
                </div>
                <span>
                    Y el resultado en la pagina del Shonen Semanal seria algo asi:
                </span>
                <div className="bg-white p-medium text-black font-normal">
                    <EmoteDecorator emotesDataSSR={emoteData} displaySize={32}>
                        <span className="text-2xl whitespace-pre-line break-word">
                            El capitulo de Medalist de esta semana ha sido bastante lindo y divertido darkraiErenrage Increible como siempre. Lo mejor del Shonen Semanal chaval darkraiCine darkraiCine_ROTATE darkraiNyun_BOUNCE
                        </span>
                    </EmoteDecorator>
                </div>
                <br />
                <span>
                    Espero que estas implementaciones ayuden con la cantidade de votaciones que recibe el Shonen Semanal. Por mi parte se me hizo divertido hacer todo esto.
                </span>
                <EmoteDecorator emotesDataSSR={emoteData} displaySize={24}>
                    <span>
                        Y ahora, si haces click a este link de youtube, lo tomare como un pago por el trabajo ilarjYes: {" "}
                        <a href="https://www.youtube.com/watch?v=uX3rRAFkpUo" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            (link)
                        </a>
                    </span>
                </EmoteDecorator>

                <br />
                <span className="text-center">
                    <a href="/emotes" className="text-blue-500 hover:underline">
                        LISTADO DE EMOTES
                    </a>
                </span>

            </div>
        </div>
    );
}
