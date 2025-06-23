import { Link } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import swal from 'sweetalert';
import { obtenerFechaDesdeObjectId } from "../components/diaDeLaSemana";

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

export default function Tasks({ user }) {
  const userId = user?.id;

  const { data, loading, error } = useQuery(GET_TASK, {
    variables: { user: userId },
    skip: !userId
  });

  const [deleteTask] = useMutation(DELETE_TASK);
  const [actualizarEstado] = useMutation(ACTUALIZAR_ESTADO);

  if (!userId) return <p>Cargando usuario...</p>;
  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error al cargar las tareas: {error.message}</p>;

  const tareas = data?.getTask ?? [];
  const hoy = new Date().toDateString();

  const isMatch = tareas.filter((tarea) => {
    const fecha = obtenerFechaDesdeObjectId(tarea.id).toDateString();
    return fecha === hoy;
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
      <div className="p-4 md:p-20">
        {/* Título */}
        <div className="flex flex-col gap-4 sm:flex-row w-full items-center justify-between">
          <h2 className="text-4xl font-black text-slate-500">Tareas</h2>
        </div>

        {/* Vista de escritorio */}
        <div className="sm:block hidden p-2 overflow-x-auto">
          {isMatch.length > 0 ? (
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
                {isMatch.map((tarea) => {
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
                        <Link to={`/task/${tarea.id}/edit`} title="Editar">📝</Link>
                        <button onClick={() => handleDeleteTask(tarea.id)}>🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="mt-4">No existen tareas en el día</p>
          )}
        </div>

        {/* Vista móvil */}
        <div className="sm:hidden p-2">
          <div className="mt-5 flex flex-wrap justify-center gap-6">
            {isMatch.length > 0 ? isMatch.map((tarea) => (
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
                <Link to={`/task/${tarea.id}/edit`} className="text-indigo-600 font-bold mt-2 block">Editar</Link>
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
            state={{ user }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 24 24">
                <path fill="#fff" width="100px" d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 11 L 7 11 L 7 13 L 11 13 L 11 17 L 13 17 L 13 13 L 17 13 L 17 11 L 13 11 L 13 7 L 11 7 z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
