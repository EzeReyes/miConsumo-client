import { Outlet } from "react-router-dom";
import diaDeLaSemana from "../components/diaDeLaSemana";

export default function Layout() {

// const [hora, setHora] = useState('');

//   const ahora = new Date();
//   console.log(ahora.getDay())



    return (
        <>
        <div className="flex flex-col min-h-screen">
        <header className="bg-gray-500">
            <div className="mx-auto w-max sm:max-w-6xl sm:py-10">
                <h1 className="text-4xl text-center font-extrabold text-amber-500">
                    MI CONSUMO.COM
                </h1>
            </div>
            <div className="text-end p-2"><p className="text-white">{diaDeLaSemana()}</p></div>
        </header>
        <main className="flex-grow bg-gray-200 shadow">
            <Outlet />
        </main>
        <footer className="flex flex-col items-center text-amber-500 justify-center p-2 bg-gray-500">By Ezequiel Reyes 2025</footer>
        </div>
        </>
    )
}