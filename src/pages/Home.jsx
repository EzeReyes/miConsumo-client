import Expenses from "../components/Expenses";
import Tasks from "../components/Tasks";
import Toolbar from "../components/Toolbar";
import { gql, useQuery} from '@apollo/client';

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

const Home = () => {    
    const { data, loading, error } = useQuery(GET_TOKEN);
    if (loading) return 'Cargando ....';
    if (error) return `Error no hay token che: ${error.message}`;
    console.log(data)
    const usuario = data?.getToken.user;



    return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(900px,_1fr)_100px]">
        <Toolbar user={usuario} />
    <div>
        <Expenses user={usuario} />
        <hr></hr>
        <Tasks user={usuario} />
    </div>
    </div>
    </>
    )
}

export default Home;