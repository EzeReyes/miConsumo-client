import { Link, useLocation } from "react-router-dom";
import EditFormTask from "../components/EditFormTask";


export default function EditTask() {

    const {state} = useLocation();
    const userId = state?.userId;

  console.log("User ID recibido por state:", userId); // ✅ Debería ya no ser undefined

return (
    <>
        <div className="p-4 md:p-20">
            <div className="flex justify-between">
                <h2 className="text-4xl font-black text-slate-500">Editar Tarea</h2>
                <Link
                to="/"
                className="rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
                >
                Volver a Home
                </Link>
            </div>
        </div>
        <EditFormTask userId={userId} />


    </>
);
}
