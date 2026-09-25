'use client';

import { EmoteData } from '@/common/emotes';
import EmoteDecorator from '@/components/EmoteDecorator';

export default function DeveloperNote({ emoteData }: { emoteData: Record<string, EmoteData> }) {
  return (
    <section className="mb-12">
      <div
        data-aos="fade-down"
        data-aos-once="true"
        data-aos-duration="600"
        className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl">
              ✍️
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Nota del Desarrollador</h3>
              <p className="text-gray-400 text-sm">Una reflexión sobre este año</p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
            <EmoteDecorator emotesDataSSR={emoteData} displaySize={24}>
              <span className="text-gray-300 leading-relaxed mb-4">
                Vaya, ha pasado un año jajaja, parece que fue ayer cuando Robraas ( erickdbzPepelu )
                desaparecio epicamente y tome la decision de crear este proyecto para automatizar
                las votaciones/comentarios del Shonen Semanal.
              </span>
              <br />
              <br />
              <span className="text-gray-300 leading-relaxed mb-4">
                Me gusta saber que tanto a Darkrai ( darkraiSapoweon ) y a los demas espectadores
                les ha gustado las visuales y las bromas que he agregado a lo largo del año,
                realmente disfruto hacer esto en mis tiempos libres. Cuento con un trabajo mas
                formal y no puedo hacer estas cosas ilarjSigh
              </span>
              <br />
              <br />
              <span className="text-gray-300 leading-relaxed">
                Voy a ser honesto, no soy un gran consumidor/fan de mangas, me hace mas gracia ver
                el enfrentamiento de Team Rojo/Azul. Pero, si he podido apreciar algunos momentos y
                la emocion que da Darkrai ( darkraiSapoweon ) al narrar los capitulos. Eso dice
                mucho de su pasion por el medio (aunque a veces parece que le tiene 0 fe a la
                mayoria de mangas jaja).
              </span>
              <br />
              <br />
              <span className="text-gray-300 leading-relaxed">
                Espero que el proximo año sea mejor. Aunque Robraas ( erickdbzPepelu ) no este y
                Choso tambien desaparezca, este segmento puede seguir adelante. Ese era mi objetivo
                desde el principio. Que cualquier moderador pueda tomar el relevo y hacer facil una tarea que puede llevar 30 minutos a solo 3 o 2 minutos.
              </span>
              <br />
              <br />
                          <span className="text-gray-300 leading-relaxed">
                              Gracias a todos. Anuncio que para este año se viene una renovacion de la pagina y cosas nuevas. Larga vida a las <b className='font-extrabold'>Shupogakis</b> ( vedalSad vedalSad vedalSad ilarjYes ) y que cancelen Chainsaw Man ilarjClap_MIRROR
              </span>
            </EmoteDecorator>
          </div>

          <div className="mt-6 text-right">
            <p className="text-gray-400 italic">— G******OrgulloPeruano</p>
          </div>
        </div>
      </div>
    </section>
  );
}
