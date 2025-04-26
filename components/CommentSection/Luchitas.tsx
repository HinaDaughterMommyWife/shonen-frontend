import { LUCHITAS_DATA } from "@/common/tempData";


interface StatBoxItemProps {
    country: string;
    value: number;
    label: string;
}

function StatBoxItem({ country, value, label }: StatBoxItemProps) {
    return <div className="flex gap-medium items-center border border-gray-300 rounded-md p-medium w-[120px]">
        <img src={`https://flagcdn.com/w40/${country}.png`} alt={country} className="inline w-8" loading="lazy" title={label} />
        <span>{value}</span>
    </div>;
}



export default function Luchitas() {
    return <div className="flex gap-2xlarge justify-center items-center my-[280px] flex-col">
        < div className="flex gap-medium flex-col justify-center items-center" >
            <h2 className="text-center font-bold text-3xl max-md:text-2xl">Estadisticas del Stream de Luchitas (solo domingo)</h2>
            <h3 className="text-center font-bold text-md max-md:text-xl text-gray-500">Te dejo esta info si tienes interes de cuanta gente ha visto el stream desde la pagina de luchitas</h3>
            <h3 className="text-center font-bold text-md max-md:text-xl text-gray-500">Pasa el mouse sobre la bandera para ver el nombre del Pais</h3>
            <h3 className="text-center font-bold text-md text-gray-500">Peru es clave ⭐</h3>
        </div >
        <div className="my-[40px] flex flex-col gap-medium">
            <h3 className="text-center font-bold text-md max-md:text-xl">Visitas totales a la pagina: 4,218</h3>
            <h3 className="text-center font-bold text-md max-md:text-xl">Visitantes Unicos Totales: 1,463</h3>
        </div>
        <div className="flex gap-2xlarge">
            <div className="flex gap-medium flex-col justify-center items-center">
                {LUCHITAS_DATA.map((item) => (
                    <StatBoxItem key={item.country} country={item.country} value={item.value} label={item.label} />
                ))}
            </div>
            <div className="flex gap-medium flex-col justify-start items-center">
                <div className="flex gap-medium items-center border border-gray-300 rounded-md p-medium w-[120px]">
                    <span className="text-2xlarge" title="smartphone">📱</span>
                    <span>835</span>
                </div>
                <div className="flex gap-medium items-center border border-gray-300 rounded-md p-medium w-[120px]">
                    <span className="text-2xlarge" title="computer">💻</span>
                    <span>617</span>
                </div>
                <div className="flex gap-medium items-center border border-gray-300 rounded-md p-medium w-[120px]">
                    <span className="text-2xlarge" title="television">📺</span>
                    <span>7</span>
                </div>
                <div className="flex gap-medium items-center border border-gray-300 rounded-md p-medium w-[120px]">
                    <img src="https://cdn2.iconfinder.com/data/icons/smartphones-2-1/512/xxx013-512.png" alt="pepelu" className="inline h-6 w-6 tablet-icon" loading="lazy" title="tablet" />
                    <span>4</span>
                </div>
            </div>
        </div>
    </div >;
}