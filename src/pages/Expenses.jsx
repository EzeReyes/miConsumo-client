import { Link } from "react-router-dom"
import { gql, useQuery, useMutation } from "@apollo/client";
import swal from 'sweetalert';
import Toolbar from '../components/Toolbar'


const GET_EXPENSES = gql`
  query getExpenses {
    getExpenses {
      id
      name
      cost
      category
    }
  }
`;

const DELETE_EXPENSE = gql`
mutation deleteExpense($id: ID!) {
  deleteExpense(id: $id)
}
`



export default function Expenses() {
  
  const { data, loading, error } = useQuery(GET_EXPENSES);

  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onCompleted: () => {},
    onError: (error) => {
      console.log(error)}
  })

  if (loading) return 'Cargando ....';
  if (error) return `Error: ${error.message}`;

  const consumos = data?.getExpenses || [];


  const handleDeleteExpense = (id) => {

      swal({
        title: "Deseas eliminar el consumo?",
        text: "Una vez eliminado, no lo podrás recuperar!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
              deleteExpense({
            variables:  {id},
            refetchQueries: [{ query: GET_EXPENSES }],
        })

      swal("Consumo Eliminado", {
        icon: "success",
      });
    } else {
      swal("Cancelaste la eliminación del consumo!");
    }
  });

  };

  return (
  <>      
<div className="grid grid-cols-1 md:grid-cols-[200px_minmax(900px,_1fr)_100px]">
  <Toolbar />

  <div className="p-4 md:p-20">
    {/* Título y botón */}
    <div className="flex flex-col gap-4 sm:flex-row w-full items-center justify-between">
      <h2 className="text-4xl font-black text-slate-500">Consumos</h2>
      <Link 
        to="expense/new"
        className="rounded-md bg-indigo-600 p-3 w-max text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
      >
        Agregar Consumo
      </Link>
    </div>

    {/* Tabla con scroll horizontal */}
    <div className="sm:block hidden p-2 overflow-x-auto">
      <table className="mt-5 table-auto md:table-fixed min-w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-2 text-left">Consumo</th>
            <th className="p-2 text-left">Costo</th>
            <th className="p-2 text-left">Categoría</th>
            <th className="p-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {consumos.map((consumo) => (
            <tr key={consumo.id} className="text-center border-b">
              <td className="p-2 whitespace-nowrap text-left">{consumo.name}</td>
              <td className="p-2 whitespace-nowrap text-left">${consumo.cost}</td>
              <td className="p-2 whitespace-nowrap text-left">{consumo.category}</td>
              <td className="p-2 flex flex-row items-center justify-center gap-4">
                <Link
                  to={`/expense/${consumo.id}/edit`}
                  title="editar"
                  className="cursor-pointer"
                >
                  {/* Icono de editar */}
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 40 40">
                        <path fill="#f5ce85" d="M5.982 29.309L8.571 26.719 13.618 31.115 10.715 34.019 2.453 37.547z"></path><path fill="#967a44" d="M8.595,27.403l4.291,3.737l-2.457,2.457l-7.026,3.001l3.001-7.003L8.595,27.403 M8.548,26.036 l-2.988,2.988l-4.059,9.474L11,34.44l3.351-3.351L8.548,26.036L8.548,26.036z"></path><path fill="#36404d" d="M3.805 33.13L1.504 38.5 6.888 36.201z"></path><path fill="#f78f8f" d="M30.062,5.215L32.3,2.978C32.931,2.347,33.769,2,34.66,2s1.729,0.347,2.36,0.978 c1.302,1.302,1.302,3.419,0,4.721l-2.237,2.237L30.062,5.215z"></path><path fill="#c74343" d="M34.66,2.5c0.758,0,1.471,0.295,2.007,0.831c1.107,1.107,1.107,2.907,0,4.014l-1.884,1.884 L30.77,5.215l1.884-1.884C33.189,2.795,33.902,2.5,34.66,2.5 M34.66,1.5c-0.982,0-1.965,0.375-2.714,1.124l-2.591,2.591 l5.428,5.428l2.591-2.591c1.499-1.499,1.499-3.929,0-5.428v0C36.625,1.875,35.643,1.5,34.66,1.5L34.66,1.5z"></path><g><path fill="#ffeea3" d="M11.346,33.388c-0.066-0.153-0.157-0.308-0.282-0.454c-0.31-0.363-0.749-0.584-1.31-0.661 c-0.2-1.267-1.206-1.803-1.989-1.964c-0.132-0.864-0.649-1.342-1.201-1.582l21.49-21.503l4.721,4.721L11.346,33.388z"></path><path fill="#ba9b48" d="M28.054,7.931l4.014,4.014L11.431,32.594c-0.242-0.278-0.638-0.59-1.261-0.748 c-0.306-1.078-1.155-1.685-1.983-1.943c-0.151-0.546-0.447-0.968-0.821-1.272L28.054,7.931 M28.053,6.517L5.56,29.023 c0,0,0.007,0,0.021,0c0.197,0,1.715,0.054,1.715,1.731c0,0,1.993,0.062,1.993,1.99c1.982,0,1.71,1.697,1.71,1.697l22.482-22.495 L28.053,6.517L28.053,6.517z"></path></g><g><path fill="#d9e7f5" d="M29.107 4.764H34.685V11.440999999999999H29.107z" transform="rotate(-45.009 31.895 8.103)"></path><path fill="#788b9c" d="M31.507,4.477l4.014,4.014l-3.237,3.237L28.27,7.714L31.507,4.477 M31.507,3.063l-4.651,4.651 l5.428,5.428l4.651-4.651L31.507,3.063L31.507,3.063z"></path></g>
                  </svg>
                </Link>
                <button
                  title="eliminar"
                  className="cursor-pointer"
                  onClick={() => handleDeleteExpense(consumo.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 128 128">
                        <path fill="#b8abc9" d="M102.2,30.8V109c0,5.5-4.5,10-10,10H35.8c-5.5,0-10-4.5-10-10V30.8H102.2"></path><path fill="#a69bb6" d="M102.2,30.8h-15V109c0,5.5-4.5,10-10,10h15c5.5,0,10-4.5,10-10V30.8"></path><path fill="#454b54" d="M50.8 49.6c-1.7 0-3 1.3-3 3v44.5c0 1.7 1.3 3 3 3s3-1.3 3-3V52.6C53.8 51 52.5 49.6 50.8 49.6zM77.2 49.6c-1.7 0-3 1.3-3 3v44.5c0 1.7 1.3 3 3 3s3-1.3 3-3V52.6C80.2 51 78.8 49.6 77.2 49.6z"></path><path fill="#454b54" d="M14.9,33.8h7.9V109c0,7.2,5.8,13,13,13h56.4c7.2,0,13-5.8,13-13V33.8h7.9c1.7,0,3-1.3,3-3s-1.3-3-3-3 H81.2v-4.6C81.2,13.7,73.5,6,64,6c-4.6,0-8.9,1.8-12.1,5c-3.2,3.2-5,7.6-5,12.2v4.6h-32c-1.7,0-3,1.3-3,3 C11.9,32.5,13.3,33.8,14.9,33.8z M92.2,116H35.8c-3.9,0-7-3.1-7-7V33.8h70.4V109C99.2,112.9,96,116,92.2,116z M64,12 c6.2,0,11.2,5,11.2,11.2v4.6H52.8v-4.6c0-3,1.2-5.8,3.3-7.9S61,12,64,12z"></path>
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* componente flex box */}

      <div className="sm:hidden p-2">
        <div className="mt-5 flex flex-wrap justify-center gap-6">
          {consumos.map((consumo) => (
            <div
              key={consumo.id}
              className=" max-w-[90%] sm:max-w-[45%] bg-amber-100 rounded-2xl shadow-xs shadow-amber-500 p-4 transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
            <div className="flex items-end justify-end mb-2">
              <button
                title="eliminar"
                className="cursor-pointer"
                onClick={() => handleDeleteExpense(consumo.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                  </svg>
                </button>
            </div>
            <p className="whitespace-nowrap text-left font-semibold text-gray-800">{consumo.name}</p>
            <p className="whitespace-nowrap text-left text-gray-700">Costo: ${consumo.cost}</p>
            <p className="whitespace-nowrap text-left text-gray-700">Categoría: {consumo.category}</p>
            <p className="p-2 my-3 flex flex-row items-center justify-between">
                <Link
                  to={`/expense/${consumo.id}/edit`}
                  title="editar"
                  className="cursor-pointer"
                >
                  {/* Icono de editar */}
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 40 40">
                        <path fill="#f5ce85" d="M5.982 29.309L8.571 26.719 13.618 31.115 10.715 34.019 2.453 37.547z"></path><path fill="#967a44" d="M8.595,27.403l4.291,3.737l-2.457,2.457l-7.026,3.001l3.001-7.003L8.595,27.403 M8.548,26.036 l-2.988,2.988l-4.059,9.474L11,34.44l3.351-3.351L8.548,26.036L8.548,26.036z"></path><path fill="#36404d" d="M3.805 33.13L1.504 38.5 6.888 36.201z"></path><path fill="#f78f8f" d="M30.062,5.215L32.3,2.978C32.931,2.347,33.769,2,34.66,2s1.729,0.347,2.36,0.978 c1.302,1.302,1.302,3.419,0,4.721l-2.237,2.237L30.062,5.215z"></path><path fill="#c74343" d="M34.66,2.5c0.758,0,1.471,0.295,2.007,0.831c1.107,1.107,1.107,2.907,0,4.014l-1.884,1.884 L30.77,5.215l1.884-1.884C33.189,2.795,33.902,2.5,34.66,2.5 M34.66,1.5c-0.982,0-1.965,0.375-2.714,1.124l-2.591,2.591 l5.428,5.428l2.591-2.591c1.499-1.499,1.499-3.929,0-5.428v0C36.625,1.875,35.643,1.5,34.66,1.5L34.66,1.5z"></path><g><path fill="#ffeea3" d="M11.346,33.388c-0.066-0.153-0.157-0.308-0.282-0.454c-0.31-0.363-0.749-0.584-1.31-0.661 c-0.2-1.267-1.206-1.803-1.989-1.964c-0.132-0.864-0.649-1.342-1.201-1.582l21.49-21.503l4.721,4.721L11.346,33.388z"></path><path fill="#ba9b48" d="M28.054,7.931l4.014,4.014L11.431,32.594c-0.242-0.278-0.638-0.59-1.261-0.748 c-0.306-1.078-1.155-1.685-1.983-1.943c-0.151-0.546-0.447-0.968-0.821-1.272L28.054,7.931 M28.053,6.517L5.56,29.023 c0,0,0.007,0,0.021,0c0.197,0,1.715,0.054,1.715,1.731c0,0,1.993,0.062,1.993,1.99c1.982,0,1.71,1.697,1.71,1.697l22.482-22.495 L28.053,6.517L28.053,6.517z"></path></g><g><path fill="#d9e7f5" d="M29.107 4.764H34.685V11.440999999999999H29.107z" transform="rotate(-45.009 31.895 8.103)"></path><path fill="#788b9c" d="M31.507,4.477l4.014,4.014l-3.237,3.237L28.27,7.714L31.507,4.477 M31.507,3.063l-4.651,4.651 l5.428,5.428l4.651-4.651L31.507,3.063L31.507,3.063z"></path></g>
                  </svg>
                </Link>
              </p>
          </div>
        ))}
      </div>
    </div>


  </div>
</div>


  </>
  );
}
