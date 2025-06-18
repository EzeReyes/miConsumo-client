import { Link } from "react-router-dom"


const Error = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center text-4xl text-white rounded bg-amber-400 p-4 my-10 mx-80">
                <h1>Pagina No Encontrada</h1>
            </div>
            <div className="flex flex-col items-center justify-center text-xl text-amber-400 p-4 m-10">
                <Link to="/login">Lo invitamos a iniciar sesión aqui</Link>
            </div>
        </>
    )
}

export default Error