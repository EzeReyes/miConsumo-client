
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewTask from "../pages/NewTask";


const GET_TASK = gql`
  query getTask($user: ID!) {
    getTask(user: $user) {
      id
      name
      user
    }
  }
`;

const NEW_TASK = gql`
  mutation newTask($input: InputTask) {
    newTask(input: $input)
  }
`;

export default function ExpenseForm({ setMessage, userId }) {
console.log(userId)
const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
  });

  

  const [newTask] = useMutation(NEW_TASK, {
onCompleted: () => {
  setMessage({msg:"Tarea creada con éxito!", class:"bg-green-700 text-white flex items-center justify-center p-4 w-max rounded"});
  setTimeout(() => {
    setMessage('');
    navigate('/');
  }, 3000);
},
onError: (error) => {
  setMessage({msg:`Error: ${error.message}`, class:'bg-red-700 text-white flex items-center justify-center p-4 w-max rounded'});
  setTimeout(() => {
        setMessage('');
    navigate('/');
  }, 3000);
},
  })

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
    const result = await newTask({
      variables: {
        input: {
          name: form.name,
          user: userId
        }
      },
      refetchQueries: [{ query: GET_TASK, variables: { user: userId} }],
    })

        console.log("Resultado de la mutación:", result),

    setForm({ name: "", cost: "", category: "" });
  } catch (error) {
    console.log("Error en la mutación", error);
  }
};


    return (
        <>
          <div className="sm:px-20 flex items-center justify-center">
            <form className="my-10" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="name">
                  Nombre:
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-2 block w-full p-3 bg-gray-50"
                  placeholder="Nombre de la Tarea"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <input
                type="submit"
                className="mt-5 w-max bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                value="Registrar Tarea"
              />
            </form>
          </div>
        </>
    )
}