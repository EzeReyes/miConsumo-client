import { gql, useMutation } from "@apollo/client"
import { useState } from "react";
import { Link } from "react-router-dom";

const NEW_USER = gql`
mutation newUser($input: InputUser) {
  newUser(input: $input) 
} `

export default function Register () {

    const [message, setMessage] = useState(null);
    
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
    });
    
    const [newUser] = useMutation(NEW_USER);

const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
            ...form,
            [name]: value
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando gasto...", form);

    try {
        const result = await newUser({
        variables: {
            input: {
            name: form.name,
            surname: form.surname,
            email: form.email,
            password: form.password
            }
        },
        })
        console.log(result.data.newUser)
        setMessage(result.data.newUser);

        setTimeout(() => {
            setMessage('')
        }, 5000)

        setForm({ name: "", surname: "", email: "", password: "" });
    } catch (error) {
    setMessage(error.message);
    setTimeout(() => {
            setMessage('')
        }, 5000)
    }
};

    return (
        <>
        
        {message && <div className="flex items-center justify-center w-auto p-2 rounded bg-pink-700 text-white">{message}</div>}

        
        <div className="">
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4">
                <label htmlFor="name">Nombre</label>
                <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    className="mt-0.5 p-3 bg-gray-50"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ingrese su nombre" />
                <label htmlFor="surname">Apellido</label>
                <input 
                    type="surname" 
                    name="surname" 
                    id="surname" 
                    className="mt-0.5 p-3 bg-gray-50"
                    value={form.surname}
                    onChange={handleChange}
                    placeholder="Ingrese su apellido" />
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    className="mt-0.5 p-3 bg-gray-50"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Ingrese su usuario" />
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    className="mt-0.5 p-3 bg-gray-50"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Ingrese su password" />
                <button 
                    type="submit"     
                    className="mt-5 bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                >Iniciar sesión</button>
            </form>
            <div className="flex items-center justify-center gap-6 text-xs mt-6">
                <Link to="/login">Ya tengo cuenta, quiero iniciar sesión</Link>
                <Link to="/reset-password">Olvide password</Link>
            </div>
        </div>
        </>
    )
}