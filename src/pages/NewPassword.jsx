import { useParams, Link, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

const CONFIRM_USER = gql`
    query confirmUser($token: String) {
        confirmUser(token: $token){
            email
        }
    }
`;

const NEW_PASS = gql`
    mutation newPass($email: String, $password: String) {
        newPass(email: $email, password: $password) 
    }
`;

const NewPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState([]);
    const [form, setForm] = useState({ password: "" });

    const { data, loading, error } = useQuery(CONFIRM_USER, {
        variables: { token }
    });

    const [newPass] = useMutation(NEW_PASS);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];

        if (form.password.length < 6) {
            errors.push("La contraseña debe tener al menos 6 caracteres");
        }

        if (errors.length > 0) {
            setMessage(errors);
            return;
        }

        try {
            const result = await newPass({
                variables: {
                    email: data.confirmUser.email,
                    password: form.password
                }
            });
            setMessage(["Contraseña actualizada con éxito. Seras redirigido a iniciar sesión"]);
            setForm({ password: "" });
            setTimeout(() => {
                setMessage([])
                navigate('/login')
            } , 3000);
        } catch (error) {
            setMessage(["Ocurrió un error al actualizar la contraseña."]);
            console.error(error);
        }
    };

    if (loading) return 'Cargando...';
    if (error) return `Error: ${error.message}`;

    const user = data?.confirmUser?.email;

    return (
        <div className="max-w-md mx-auto mt-10">
            {message.length > 0 && message.map((mess, i) => (
                <div key={i} className="bg-pink-700 text-white p-2 m-2 rounded text-center">{mess}</div>
            ))}

            {user ? (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-center">Restablezca su contraseña</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input 
                            type="password" 
                            name="password" 
                            value={form.password}
                            onChange={handleChange}                    
                            className="p-3 bg-gray-50 border rounded"
                            placeholder="Ingrese su nuevo password" 
                        />
                        <button 
                            type="submit"
                            className="bg-indigo-600 p-2 text-white font-bold text-lg rounded hover:bg-indigo-700 transition"
                        >
                            Restablecer contraseña
                        </button>
                    </form>
                </>
            ) : (
                <p className="text-center text-red-600">El token no es válido o ya fue utilizado.</p>
            )}
        </div>
    );
};

export default NewPassword;
