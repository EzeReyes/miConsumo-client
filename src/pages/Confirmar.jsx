import { useParams, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const CONFIRM_USER = gql`
    query confirmUser($token: String) {
        confirmUser(token: $token){
            name
        }
    }
`

const Confirmar = () => {
        const {token} = useParams();

    const { data, loading, error } = useQuery(CONFIRM_USER, {
        variables: { token }
    });

    if (loading) return 'Cargando ....';
    if (error) return `Error: ${error.message}`;

  const user = data?.confirmUser;
    
    console.log(user)
    // verificar si el token es válido


    return (
        <div>
            {user ? (
                <>
                <div className="flex flex-row items-center justify-center gap-2">
                    <p>¡Hola {user.name}, tu cuenta fue confirmada exitosamente!</p>
                    <Link to="/login" className="p-2 bg-amber-700 text-white rounded">Inicia sesión</Link>
                </div>
                </>
            ) : (
                <p>El token no es válido o ya fue utilizado.</p>
            )}
        </div>
        )
}

export default Confirmar;