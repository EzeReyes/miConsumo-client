import { Link } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import swal from 'sweetalert';
import { obtenerFechaDesdeObjectId } from "../components/diaDeLaSemana";

const GET_EXPENSES = gql`
  query getExpenses($user: ID!) {
    getExpenses(user: $user) {
      id
      name
      cost
      category
      user
    }
  }
`;

const DELETE_EXPENSE = gql`
  mutation deleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`;

const Expenses = ({ user }) => {
  const userId = user?.id;

  const { data, loading, error } = useQuery(GET_EXPENSES, {
    variables: { user: userId }, // ✅ Esto está bien
    skip: !userId                // ✅ Previene que la query corra sin ID
  });

  const [deleteExpense] = useMutation(DELETE_EXPENSE);

  if (!userId) return <p>Cargando usuario...</p>;
  if (loading) return <p>Cargando consumos...</p>;
  if (error) return <p>Error al cargar los consumos: {error.message}</p>;

  const consumos = data?.getExpenses || [];
  const hoy = new Date();

  const isMatch = consumos.filter((consumo) => {
    const fecha = obtenerFechaDesdeObjectId(consumo.id);
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  });

  const handleDeleteExpense = async (id) => {
    const confirm = await swal({
      title: "¿Deseás eliminar el consumo?",
      text: "Una vez eliminado, no lo podrás recuperar.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (confirm) {
      try {
        await deleteExpense({
          variables: { id },
          refetchQueries: [{ query: GET_EXPENSES, variables: { user: userId } }]
        });

        swal("¡Consumo eliminado!", { icon: "success" });
      } catch (error) {
        swal("Error al eliminar el consumo", { icon: "error" });
        console.error(error);
      }
    } else {
      swal("Cancelaste la eliminación del consumo.");
    }
  };

  return (
    <>
      <div className="p-4 md:p-20">
        <div className="flex flex-col gap-4 sm:flex-row w-full items-center justify-between">
          <h2 className="text-4xl font-black text-slate-500">Consumos</h2>
        </div>

        {/* Tabla */}
        <div className="sm:block hidden p-2 overflow-x-auto">
          {isMatch.length > 0 ? (
            <table className="mt-5 table-auto md:table-fixed min-w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-2 text-left">Consumo</th>
                  <th className="p-2 text-left">Costo</th>
                  <th className="p-2 text-left">Categoría</th>
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {isMatch.map((consumo) => {
                  const fecha = obtenerFechaDesdeObjectId(consumo.id);
                  return (
                    <tr key={consumo.id} className="border-b">
                      <td className="p-2">{consumo.name}</td>
                      <td className="p-2">${consumo.cost}</td>
                      <td className="p-2">{consumo.category}</td>
                      <td className="p-2">{fecha.toLocaleDateString()}</td>
                      <td className="p-2 flex gap-4 justify-center">
                        <Link to={`/expense/${consumo.id}/edit`} state={{userId}} title="Editar">📝</Link>
                        <button onClick={() => handleDeleteExpense(consumo.id)} title="Eliminar">🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="mt-4">No existen consumos en el día</p>
          )}
        </div>

        {/* Vista responsive */}
        <div className="sm:hidden p-2">
          <div className="mt-5 flex flex-wrap justify-center gap-6">
            {isMatch.length > 0 ? isMatch.map((consumo) => (
              <div key={consumo.id} className="bg-amber-100 rounded-2xl shadow p-4 w-full max-w-md">
                <div className="flex justify-between mb-2">
                  <strong>{consumo.name}</strong>
                  <button onClick={() => handleDeleteExpense(consumo.id)}>🗑️</button>
                </div>
                <p>Costo: ${consumo.cost}</p>
                <p>Categoría: {consumo.category}</p>
                <p>Fecha: {obtenerFechaDesdeObjectId(consumo.id).toLocaleDateString()}</p>
                <Link to={`/expense/${consumo.id}/edit`} state={{userId}} className="text-indigo-600 font-bold mt-2 block">Editar</Link>
              </div>
            )) : (
              <p>No existen consumos en el día</p>
            )}
          </div>
        </div>

        {/* Botón agregar */}
            <div 
              style={{marginLeft: "90%",
                      marginTop: "40px"
              }} 
              className="rounded-full flex items-center justify-end bg-indigo-600 w-max text-sm font-bold text-white shadow-sm hover:bg-indigo-500">
              <Link 
                to="expense/new"
                title="Agregar Consumo"
                state={{user}}
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

export default Expenses;