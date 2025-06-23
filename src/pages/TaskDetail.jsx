import { Link, useLocation } from "react-router-dom"
import { gql, useQuery, useMutation } from "@apollo/client";
import swal from 'sweetalert';
import Toolbar from '../components/Toolbar';
import { useState } from "react";
import { obtenerFechaDesdeObjectId } from '../components/diaDeLaSemana';

const GET_TASK = gql`
  query getTask($user: ID!) {
    getTask(user: $user) {
      id
      name
      realizado
      user
    }
  }
`;

const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const ACTUALIZAR_ESTADO = gql`
  mutation actualizarEstado($id: ID, $realizado: Boolean) {
    actualizarEstado(id: $id, realizado: $realizado) {
      id
      realizado
    }
  }
`;

export default function TaskDetail() {
  const { state } = useLocation();
  const userId = state?.user?.id;  
  const usuario = state?.user;
  const { data, loading, error } = useQuery(GET_TASK, {
      variables: { user: userId }, // ✅ Esto está bien
      skip: !userId                // ✅ Previene que la query corra sin ID
    });

  const [deleteTask] = useMutation(DELETE_TASK);
  const [actualizarEstado] = useMutation(ACTUALIZAR_ESTADO);

  const [fechaInferior, setFechaInferior] = useState('');
  const [fechaSuperior, setFechaSuperior] = useState('');


  if (loading) return 'Cargando ....';
  if (error) return `Error: ${error.message}`;

  const tareas = data?.getTask || [];



function soloFecha(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const tareasFiltradas = tareas.filter((tarea) => {
  const fecha = soloFecha(obtenerFechaDesdeObjectId(tarea.id));
  const desde = fechaInferior ? soloFecha(new Date(fechaInferior)) : null;
  const hasta = fechaSuperior ? soloFecha(new Date(fechaSuperior)) : null;


  if (desde && fecha < desde) return false;
  if (hasta && fecha > hasta) return false;


  return true;
  
});





  const handleDeleteTask = async (id) => {
    const confirm = await swal({
      title: "¿Deseás eliminar la tarea?",
      text: "Una vez eliminado, no lo podrás recuperar.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirm) {
      try {
        await deleteTask({
          variables: { id },
          refetchQueries: [{ query: GET_TASK, variables: { user: userId } }]
        });

        swal("Tarea eliminada!", { icon: "success" });
      } catch (error) {
        swal("Error al eliminar la tarea", { icon: "error" });
        console.error(error);
      }
    } else {
      swal("Cancelaste la eliminación de la tarea");
    }
  };

  const setearEstado = async (ID, nuevoEstado) => {
    try {
      await actualizarEstado({
        variables: {
          id: ID,
          realizado: nuevoEstado
        },
        refetchQueries: [{ query: GET_TASK, variables: { user: userId } }]
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(900px,_1fr)_100px]">
    <Toolbar user={usuario} />
      <div className="p-4 md:p-20">
        {/* Título */}
        <div className="flex justify-between">
          <h2 className="text-4xl font-black text-slate-500">Historial de tareas</h2>
          
          <Link 
            to="../task/new"
            className="rounded-md bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
          >
            Agregar Tarea
          </Link>
        </div>

        <div className="my-10 flex flex-col items-center justify-center gap-6">
          <div>
              <label for="fechaInferior">Desde:</label>
              <input type="date" name="fechaInferior" id="fechaInferior" onChange={(e) => setFechaInferior(e.target.value)} />
          </div>

          <div>
              <label for="fechaSuperior">Hasta:</label>
              <input type="date" name="fechaSuperior" id="fechaSuperior" onChange={(e) => setFechaSuperior(e.target.value)} />
          </div>
        </div>

        {/* Vista de escritorio */}
        <div className="sm:block hidden p-2 overflow-x-auto">
          {tareasFiltradas.length > 0 ? (
            <table className="mt-5 table-auto md:table-fixed min-w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-left">Tarea</th>
                  <th className="p-2 text-left">Realizada?</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareasFiltradas.map((tarea) => {
                  const fecha = obtenerFechaDesdeObjectId(tarea.id);
                  return (
                    <tr key={tarea.id} className="border-b">
                      <td className="p-2">{fecha.toLocaleDateString()}</td>
                      <td className="p-2">{tarea.name}</td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={tarea.realizado}
                          onChange={(e) => setearEstado(tarea.id, e.target.checked)}
                        />
                      </td>
                      <td className="p-2 flex gap-4 justify-center">
                        <Link to={`/task/${tarea.id}/edit`} state={{userId}} title="Editar">📝</Link>
                        <button onClick={() => handleDeleteTask(tarea.id)}>🗑️</button>
                      </td>
                    </tr>
                  );
                })}
                <div className="mt-2 p-2">
                    <p className="w-max">Cantidad de tareas encontradas {tareasFiltradas.length}</p>
                </div>

                </tbody>
            </table>
          ) : (
            <p className="mt-4">No existen tareas en el día</p>
          )}
        </div>

        {/* Vista móvil */}
        <div className="sm:hidden p-2">
          <div className="mt-5 flex flex-wrap justify-center gap-6">
            {tareasFiltradas.length > 0 ? tareasFiltradas.map((tarea) => (
              <div key={tarea.id} className="bg-amber-100 rounded-2xl shadow p-4 w-full max-w-md">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center justify-between w-20">
                    <strong>{tarea.name}</strong>
                    <input
                          title="Indique estado de su tarea"
                          type="checkbox"
                          checked={tarea.realizado}
                          onChange={(e) => setearEstado(tarea.id, e.target.checked)}
                    />
                  </div>
                  <button onClick={() => handleDeleteTask(tarea.id)}>🗑️</button>
                </div>
                <p>Fecha: {obtenerFechaDesdeObjectId(tarea.id).toLocaleDateString()}</p>
                <Link to={`/task/${tarea.id}/edit`} state={{userId}} className="text-indigo-600 font-bold mt-2 block">Editar</Link>
              </div>
            )) : (
              <p>No existen tareas en el día</p>
            )}
          </div>
        </div>

        {/* Botón agregar tarea */}
        <div
          style={{ marginLeft: "90%", marginTop: "40px" }}
          className="rounded-full flex items-center justify-end bg-indigo-600 w-max text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
        >
          <Link
            to="task/new"
            title="Agregar tarea"
            state={{ userId }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 24 24">
                <path fill="#fff" width="100px" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
