import { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";

const GET_USER = gql`
query getUserPass($email: String!) {
  getUserPass(email: $email){
    name
    surname
    email
  }
}
`

const ResetPassword = () => {

    const [getUser, { data, loading, error }] = useLazyQuery(GET_USER);
    

    const [message, setMessage] = useState([]);
    


        const [form, setForm] = useState({
            email: "",
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

    if (errors.length > 0) {
        setMessage(errors);
        return;
    }

        try {
        const result = await getUser({
        variables: {
            email: form.email }
        })

        const userExist = result.data.getUserPass;
        if (userExist === null) {
            setMessage(['Ese usuario no existe, cree uno'])
        } else {
            setMessage(['En breve recibiras un correo para restablecer tu password en miConsumo.com'])
        }

    } catch ( error) {
        console.log(error)
    }
        
}


    return (
        <div className="">

        <div>
            Debe ingresar un email para reesstablecer su contraseña
        </div>

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
                <button 
                    type="submit"
                    className="mt-5 bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                    formNoValidate="formNoValidate"
                >Enviar</button>
            </form>
        </div>
    )
}

export default ResetPassword;