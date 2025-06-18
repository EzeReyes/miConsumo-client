import { gql, useQuery} from '@apollo/client';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';

const GET_TOKEN = gql `
query {
  getToken {
    success
    message
    user {
      id
      name
      surname
      email
      password
    }
  }
}
`

const Toolbar = () => {

  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = window.location.pathname;

  const tokenCookieName = "_token";

    const { data, loading, error } = useQuery(GET_TOKEN);

  if (loading) return 'Cargando ....';
  if (error) return `Error no hay token che: ${error.message}`;
  console.log(data)

const usuario = data?.getToken.user;
if(!usuario) {
  window.location.href = '/login'; // fuerza una recarga completa del sitio
}
const nombre = usuario.name;
const apellido = usuario.surname;
const inicialNombre = nombre.slice(0,1) + apellido.slice(0,1)

const eliminarToken = () => {
  Cookies.remove(tokenCookieName);
  window.location.href = '/login'; // fuerza una recarga completa del sitio
}

const handleMenu = () => {
  setMenuAbierto(!menuAbierto)
}

    return (
      <>
        <div className="sm:hidden p-4 flex justify-end">
          <button onClick={handleMenu}>
            <img
              width="32"
              height="32"
              src={menuAbierto
                ? "https://img.icons8.com/ios/50/delete-sign--v1.png"
                : "https://img.icons8.com/ios/50/menu--v6.png"}
              alt="Toggle menu"
            />
          </button>
        </div>
        <div id='menu' className={ `${menuAbierto ? "block" : "hidden" } bg-gray-500 text-white rounded h-max p-5 sm:flex items-start justify-center m-10 w-max shadow-lg shadow-amber-500/50`}>
            <ul>
                <li title={nombre} className='text-white bg-amber-500 rounded-full w-10 h-10 flex items-center justify-center'>{inicialNombre.toUpperCase()}</li>
                <li className={pathname === "/personaldata" ? "hidden" : "block"}><Link to="../personaldata" state={{ usuario }}>Datos Personales</Link></li>
                <li className={pathname === "/expense/detail" ? "hidden" : "block"}><Link to="../expense/detail">Consumos</Link></li>
                <li className={pathname === "/" ? "hidden" : "block"}><Link to="../">Volver a Home</Link></li>
                <button onClick={eliminarToken}>Cerrar sesión</button>
            </ul>
        </div>
      </>
    )
}

export default Toolbar;