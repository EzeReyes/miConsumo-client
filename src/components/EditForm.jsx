
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from 'sweetalert';

const GET_CATEGORIES = gql`
  query GetEnumValues {
    __type(name: "Category") {
      enumValues {
        name
      }
    }
  }
`;

const GET_EXPENSES_BY_ID = gql`
query getExpensesByID($id: ID!) {
   getExpensesByID(id: $id) {
       name
       cost
       category
  }
}
`

const GET_EXPENSES = gql`
  query getExpenses {
    getExpenses {
      id
      name
      cost
      category
    }
  }
`;

const UPDATED_EXPENSE = gql`
mutation updatedExpense($id: ID!, $input: InputExpense) {
    updatedExpense(id: $id, input: $input) {
        name
    }
    }
`

export default function EditForm() {

const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cost: "",
    category: ""
  });

  const {id} = useParams();

  const { data, loading, error } = useQuery(GET_CATEGORIES);
const { data: expenseData, loading: loadingid, error: errorid } = useQuery(GET_EXPENSES_BY_ID, {
  variables: { id },
});



useEffect(() => {
    if (expenseData?.getExpensesByID) {
      setForm(expenseData.getExpensesByID);
    }
  }, [expenseData]);



  const [updatedExpense] = useMutation(UPDATED_EXPENSE, {
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
          title: "Deseas editar el consumo?",
          text: "Una vez editado, no podrás volver a su estado anterior!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((update) => {
          if (update) {
                updatedExpense({
      variables: {
        id: id,
        input: {
          name: form.name,
          cost: parseFloat(form.cost),
          category: form.category
        }
      },
      refetchQueries: [{ query: GET_EXPENSES }],
    })
      
        swal("Consumo Editado", {
          icon: "success",
        });
          setTimeout(() => {
            navigate('/');
          }, 2000);

      } else {
        swal("Cancelaste la edición del consumo!");
      }
    });

  }

    if (loadingid) return <p>Cargando consumo...</p>;
    if (errorid) return <p>Error cargando consumo</p>;


    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>Error cargando categorías</p>;

    const categories = data?.__type?.enumValues ?? [];



    return (
        <>
          <div className="sm:px-20 flex items-center justify-center">
            <form className="my-10" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="name">
                  Nombre del Consumo:
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-2 block w-full p-3 bg-gray-50"
                  placeholder="Nombre del Consumo"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="text-gray-800" htmlFor="cost">
                  Costo:
                </label>
                <input
                  id="cost"
                  type="number"
                  className="mt-2 block w-full p-3 bg-gray-50"
                  placeholder="Ingrese el costo"
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                />
              </div>

              <select
                id="category"
                name="category"
                className="mt-2 block w-full p-3 bg-gray-50"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">-- Selecciona una categoría --</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name.charAt(0) + cat.name.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>

              <input
                type="submit"
                className="mt-5 w-full bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                value="Editar Consumo"
              />
            </form>
          </div>
        </>
    )
}