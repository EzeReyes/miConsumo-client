import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from 'sweetalert';

const GET_TASK_BY_ID = gql`
query getTaskByID($id: ID!) {
   getTaskByID(id: $id) {
       name
       cost
       category
  }
}
`

const GET_TASK = gql`
  query getTask($user: ID!) {
    getTask(user: $user) {
      id
      name
      realizado
      user
    }
  }
`;

const UPDATED_TASK = gql`
mutation updatedTask($id: ID!, $name: String) {
    updatedTask(id: $id, name: $name) {
        name
    }
    }
`

export default function EditFormTask({userId}) {

  console.log("User ID recibido:", userId);    
const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
  });

  const {id} = useParams();

const { data: taskData, loading: loadingid, error: errorid } = useQuery(GET_TASK_BY_ID, {
  variables: { id },
});



useEffect(() => {
    if (taskData?.getTaskByID) {
      setForm(taskData.getTaskByID);
    }
  }, [taskData]);



  const [updatedTask] = useMutation(UPDATED_TASK, {
onCompleted: () => {
},
onError: (error) => {
  console.log(error)
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

swal({
          title: "Deseas editar la tarea?",
          text: "Una vez editado, no podrás volver a su estado anterior!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((update) => {
          if (update) {
                updatedTask({
      variables: {
        id: id,
        name: form.name,
      },
      refetchQueries: [{ query: GET_TASK, variables: { user: userId} }],
    })
      
        swal("Tarea Editada", {
          icon: "success",
        });
          setTimeout(() => {
            navigate('/');
          }, 2000);

      } else {
        swal("Cancelaste la edición de la tarea!");
      }
    });

  }

    if (loadingid) return <p>Cargando tarea...</p>;
    if (errorid) return <p>Error cargando la tarea</p>;





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
                className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                value="Editar Tarea"
              />
            </form>
          </div>
        </>
    )
}