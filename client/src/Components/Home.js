import {React} from "react";
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS, DELETE_USER } from '../Queries';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button} from 'react-bootstrap';
import { useNavigate , Link} from 'react-router-dom';

function Home() {
	const navigate = useNavigate();

	const {data, error:getUsersError, refetch} = useQuery(GET_USERS);
	const [ deleteUser ] = useMutation(DELETE_USER,);

	refetch();//refetch the query when redirecting
	
	const handleDelete = async (userid) => {
		const resp = window.confirm("Are you sure to delete this User?");
		if (!resp) return;
		try{
			await deleteUser({variables:{id:userid}});
			navigate('/');
		}catch(error){alert(error)}
	}
	function setUser(id, name, email, job_title) {
        localStorage.setItem('id', id);//string value is stored
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
		localStorage.setItem('job_title', job_title);
    }
	return (
		<div style={{marginLeft:'10rem', marginRight:'10em'}}>
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>JobTitle</th>
						<th>EMail</th>
						<th>Change</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					{getUsersError ? alert(getUsersError) : null}
					{data ? data.getUsers.map((user, index) => (
						<tr key={index}>
							<td>{user.id}</td>
							<td>{user.name}</td>
							<td>{user.job_title}</td>
							<td>{user.email}</td>
							<td>
								<Link to={`/edit`}>
									<Button onClick={(e) =>
									setUser(user.id, user.name, user.email, user.job_title)
									}variant="info" size="sm">Update</Button>
								</Link>
							</td>
							<td>
					  			<Button onClick={async (e) => 
								await handleDelete(user.id)
								}variant="danger" size="sm">Delete</Button>
							</td>
						</tr>
					)):null}
				</tbody>
			</Table>
			<Link  to='/create'>
                <Button variant="primary" size="md">Create</Button>
            </Link>
		</div>
	);
}	
export default Home;
