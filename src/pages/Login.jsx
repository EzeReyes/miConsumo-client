import { gql, useLazyQuery } from "@apollo/client"
import { useState } from "react";
import { Link } from "react-router-dom";

const GET_USER = gql`
query getUser($email: String!, $password: String!) {
  getUser(email: $email, password: $password) {
    success
    user {
        name
    }
    message
    }
}
`

const Login = () => {

    const [message, setMessage] = useState([]);
    

    const [getUser, { data, loading, error }] = useLazyQuery(GET_USER);

        const [form, setForm] = useState({
            email: "",
            password: "",
        });

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
            ...form,
            [name]: value
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!form.email.includes('@')) {
        errors.push("El email no es válido");
    }
    if (form.password.length < 4) {
        errors.push("La contraseña debe tener al menos 6 caracteres");
    }

    if (errors.length > 0) {
        setMessage(errors);
        return;
    }

    try {
        const result = await getUser({
        variables: {
            email: form.email,
            password: form.password
            }
        })

        console.log(result)

        
        
                    console.log("Resultado:", result);
if (result.data.getUser.success) {
    const { name } = result.data.getUser.user;
    setMessage([`Bienvenido, ${name}`]);
    setTimeout(() => {
        window.location.assign('/');
//   window.location.href = './'; // fuerza una recarga completa del sitio
    }, 3000);
} else {
    setMessage([result.data.getUser.message || "Credenciales inválidas"]);
}


            setTimeout(() => setMessage([]), 5000);
            setForm({ email: "", password: "" });
        } catch (error) {
            setMessage([error.message]);
            setTimeout(() => setMessage([]), 5000);
        }
    };

    return (
        <div className="">

        {message.length > 0 && message.map((mess, index) => ( <div key={index} className="flex items-center justify-center w-auto p-2 g-5 rounded bg-pink-700 m-2 text-white">{mess}</div>))}

            <form                     
                onSubmit={handleSubmit}  
                className="flex flex-col justify-center items-center gap-4">
                <input 
                    type="email" 
                    name="email" 
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-2 p-3 bg-gray-50"
                    placeholder="Ingrese su usuario"
                    />
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    value={form.password}
                    onChange={handleChange}                    
                    className="mt-2 p-3 bg-gray-50"
                    placeholder="Ingrese su password" />
                <button 
                    type="submit"
                    className="mt-5 bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                    formNoValidate="formNoValidate"
                >Iniciar sesión</button>
            </form>
                        <div className="flex items-center justify-center gap-6 text-xs mt-6">
                            <Link to="/register">Crear una cuenta</Link>
                            <Link to="/reset-password">Olvide password</Link>
                        </div>
        </div>
    )
}

export default Login;