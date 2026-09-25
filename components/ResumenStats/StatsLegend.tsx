'use client';

import { useState } from 'react';

export default function StatsLegend() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <span className="text-white font-semibold">Guía de Estadísticas</span>
          </div>
          <span className="text-gray-400 text-sm">
            {isOpen ? '▼ Ocultar' : '▶ Ver explicación'}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          data-aos="fade-down"
          data-aos-once="true"
          data-aos-duration="400"
          className="mt-4 bg-gray-800/70 border border-gray-700 rounded-xl p-6 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                <span>💚</span>
                Net Score
              </h4>
              <p className="text-gray-300 text-sm">
                Balance final entre puntos favoritos y puntos recibidos como menos gustado.
                <span className="text-green-400 font-semibold"> Positivo = Puntos Fav </span>,
                <span className="text-red-400 font-semibold"> Negativo = Puntos Menos</span>.
                <br />
                <span className="text-green-400 font-semibold">Positivo</span> -{' '}
                <span className="text-red-400 font-semibold">Negativo</span> = Net Score 🌟
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                <span>💜</span>
                Puntos Fav
              </h4>
              <p className="text-gray-300 text-sm">
                Puntos totales acumulados cuando el manga fue votado como favorito. Mientras más
                alto, más veces fue amado por la comunidad.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                <span>💩</span>
                Puntos Menos
              </h4>
              <p className="text-gray-300 text-sm">
                Puntos totales acumulados cuando el manga fue votado como menos favorito. Mientras
                más alto, más veces fue rechazado por la comunidad.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <span>🥇</span>
                Más Gustado
              </h4>
              <p className="text-gray-300 text-sm">
                Número de veces que el manga fue votado como #1 favorito de la semana. La corona de
                oro del ranking.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                <span>💔</span>
                Menos Gustado
              </h4>
              <p className="text-gray-300 text-sm">
                Número de veces que el manga fue votado como #1 menos favorito de la semana. El lado
                oscuro del ranking.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
