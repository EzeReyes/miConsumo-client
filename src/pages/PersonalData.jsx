import { useLocation, Link } from 'react-router-dom';
import DataPersonalForm from '../components/DataPersonalForm';

const PersonalData = () => {
  const { state } = useLocation();
  const datos = state?.user;

  if (!datos) return <p>No hay datos para mostrar</p>;

  return (
    <>
        <div className="flex flex-col sm:flex-row justify-between gap-4 p-10">
            <h2 className="text-4xl font-black text-slate-500">Editar Perfil</h2>
            <Link
            to="/"
            className="rounded-md w-max bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
            >
            Volver a Home
            </Link>
        </div>

        <DataPersonalForm datos={datos} />
    </>
  );
};

export default PersonalData;
