
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GET_CATEGORIES = gql`
  query GetEnumValues {
    __type(name: "Category") {
      enumValues {
        name
      }
    }
  }
`;

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

const NEW_EXPENSE = gql`
  mutation newExpense($input: InputExpense) {
    newExpense(input: $input)
  }
`;

export default function ExpenseForm({ setMessage }) {

const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cost: "",
    category: ""
  });

  const { data, loading, error } = useQuery(GET_CATEGORIES);
  

  const [newExpense] = useMutation(NEW_EXPENSE, {
onCompleted: () => {
  setMessage({msg:"Consumo creado con éxito!", class:"bg-green-700 w-max rounded"});
  setTimeout(() => {
    setMessage('');
    navigate('/');
  }, 3000);
},
onError: (error) => {
  setMessage({msg:`Error: ${error.message}`, class:'bg-red-700 w-max rounded'});
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
    const result = await newExpense({
      variables: {
        input: {
          name: form.name,
          cost: parseFloat(form.cost),
          category: form.category
        }
      },
      refetchQueries: [{ query: GET_EXPENSES }],
    })

        console.log("Resultado de la mutación:", result),

    setForm({ name: "", cost: "", category: "" });
  } catch (error) {
    console.log("Error en la mutación", error);
  }
};

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
                className="mt-5 w-max bg-indigo-600 p-2 text-white font-bold text-lg cursor-pointer rounded"
                value="Registrar Consumo"
              />
            </form>
          </div>
        </>
    )
}