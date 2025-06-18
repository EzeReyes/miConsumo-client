
import { gql } from "@apollo/client";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

const UPDATED_USER = gql`
mutation updatedUser($id: ID!, $input: InputUser) {
  updatedUser(id: $id, input: $input) {
    name
  }
}
`;

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



export default function DataPersonalForm({datos}) {

const navigate = useNavigate();

const passwordRef = useRef();


  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
  });

  const [pass, setPass] = useState({
    password: ""
  })
  
  console.log(datos.id)


const [updatedUser] = useMutation(UPDATED_USER, {
    onCompleted: () => {
    },
    onError: (error) => {
    console.log(error)
    },
})


useEffect(() => {
    if (datos) {
      setForm(datos);
      setPass(datos)
    }
  }, [datos]);



 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
    const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPass({
      [name]: value
    });
  };

  const ChangePassword = (e) => {
      e.preventDefault();
      if(passwordRef.current) {
        passwordRef.current.disabled = false
        passwordRef.current.focus()
      }
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

swal({
          title: "Deseas editar el perfil de Usuario?",
          text: "Una vez editado, no podrás volver a su estado anterior!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then(async(update) => {
            if (update) {
              try {
                await  updatedUser({
                    variables: {
                      id: datos.id,
                      input: {
                        name: form.name,
                        surname: form.surname,
                        email: form.email,
                        ...(pass.password && { password: pass.password })
                      }
                    },
                    refetchQueries: [{ query: GET_TOKEN }],
                  })
        
                swal("Usuario Editado", {
                  icon: "success",
                });
                  setTimeout(() => {
                    navigate('/');
                  }, 2000);
              } catch (err) {
                swal("Error al editar el Usuario!", {
                  text: err.message,
                  icon: "error"
                });
              }

          } else {
            swal("Cancelaste la edición del Usuario!");
          }
        });
  }



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
                className="mt-2 block w-max p-3 bg-gray-50"
                placeholder="Ingrese su Nombre"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-800" htmlFor="surname">
                Apellido:
              </label>
              <input
                id="surname"
                type="text"
                className="mt-2 block w-max p-3 bg-gray-50"
                placeholder="Ingrese el costo"
                name="surname"
                value={form.surname}
                onChange={handleChange}
              />
            </div>

              <div className="mb-4">
              <label className="text-gray-800" htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                type="email"
                className="mt-2 block w-max p-3 bg-gray-50"
                placeholder="Ingrese su email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-800" htmlFor="password">
                Password:
              </label>
              <input
                id="password"
                type="text"
                className="mt-2 block w-max sm:w-lg p-3 bg-gray-50"
                placeholder="Ingrese su password"
                name="password"
                value={pass.password}
                onChange={handleChangePassword}
                ref={passwordRef}
                disabled
              />
                <button onClick={ChangePassword}>
              Modificar Password
            </button>
            </div> 

            <input
              type="submit"
              className="mt-5 w-max bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
              value="Editar Usuario"
            />
          </form>
        </div>
        </>
    )
}