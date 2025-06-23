import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import TaskForm from "../components/TaskForm";
import ErrorMessage from "../components/ErrorMessage";


export default function NewTask({user}) {
  const [message, setMessage] = useState(null);
  const {state} = useLocation();
  const userId = state?.user?.id
  console.log(user)

  return (
    <>
      <div className="p-4 md:p-20">
        <div className="flex justify-between">
          <h2 className="text-4xl font-black text-slate-500">Registrar Tarea</h2>
          <Link
            to="/"
            className="rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
          >
            Volver a Home
          </Link>
        </div>
      </div>

      {message && <ErrorMessage>{message}</ErrorMessage>}


      <TaskForm setMessage={setMessage} userId={userId} />


    </>
  );
}
