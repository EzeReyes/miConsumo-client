import { Link } from "react-router-dom";
import EditForm from "../components/EditForm";


export default function EditExpense() {

return (
    <>
        <div className="p-4 md:p-20">
            <div className="flex justify-between">
                <h2 className="text-4xl font-black text-slate-500">Editar Consumo</h2>
                <Link
                to="/"
                className="rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
                >
                Volver a Home
                </Link>
            </div>
        </div>
        <EditForm />


    </>
);
}
