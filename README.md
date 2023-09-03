# Demo Example provides crud operation using Graphql, React, Apollo, Express 
# Download and install mysql 8.1
# create a database userapp and a table users by using following sql

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `job_title` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
);
# insert sample rows.

# download and install node.js 

# Create a directory server, change to server directory
# Write the following commands in sequence : 
# npm init
# npm install express
# npm install apollo-server-express
# npm install body-parser
# npm install express-graphql
# npm install cors
# npm install mysql2
# npm install graphql
# type package.json (You can see all the packages installed)
# Write follwing code in index.js under server directory

const express = require('express');
const  { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2');
const cors = require('cors');

let con = {};
const app = express();
app.use(cors());

const schema = buildSchema(`
  type User {
    id: Int
    name: String
    email: String
    job_title: String
  }
  type Query {
    getUsers: [User],
    getUser(id: Int) : User
  }
  type Mutation {
    updateUser(id: Int, name: String, email: String, job_title: String): Boolean
    createUser(name: String, email: String, job_title: String): Boolean
    deleteUser(id: Int): Boolean
  }
`);

con = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'root',
  database : 'userapp'
});

con.connect((err) => {
  if (err) {
    console.log('Error connecting to database:'+err);
    return;
  }
  console.log('Connected to database');
});

app.use((req, res, next) => {
  req.mysqlDb = con;
  next();
});

const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
  req.mysqlDb.query(sql, args, (err, rows) => {
      if (err) return reject(err);
      rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
  });
});  

const root = {
  getUsers: (args, req) => queryDB(req, "select * from users").then(data => data),
  getUser: (args, req) => queryDB(req, "select * from users where id = ?", [args.id]).then(data => data[0]),
  updateUser: (args, req) => queryDB(req, "update users SET ? where id = ?", [args, args.id]).then(data => data),
  createUser: (args, req) => queryDB(req, "insert into users SET ?", args).then(data => data),
  deleteUser: (args, req) => queryDB(req, "delete from users where id = ?", [args.id]).then(data => data),
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

httpServer = require('http').createServer(app);
httpServer.listen('4000');
console.log('Running a GraphQL API server at localhost:4000/graphql');

# write command: node index.js then You should see :
Running a GraphQL API server at localhost:4000/graphql
Connected to database

# Go to parent directory by using cd..
# Write the command: npx create-react-app client
# (ignore 6 errors)
# Change the directory to client
# Write the following commands in sequence : 
# npm start (now you can see react logo on the screen)
# npm install react-router-dom@6
# npm install react-bootstrap
# npm install apollo-boost
# npm install @apollo/client
# npm install bootstrap
# npm install graphql
# type package.json (You can see all the packages installed)
# Write following code in index.html under public folder
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>

# Write following code in index.js under src folder
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);

# Write following code in App.js under src folder
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Create from './Components/Create';
import Edit from './Components/Edit';
import Home from './Components/Home'
  
function App() {
    return (
        <div className='App'>
              <Router>
                <Routes>
                    <Route path='/' 
                        element={<Home />} />
                    <Route path='/create' 
                        element={<Create />} />
                    <Route path='/edit' 
                        element={<Edit />} />
                </Routes>
            </Router>
        </div>
    );
}
  
export default App;

# Create two folders 1. Components, 2. Queries under src folder
# Write following code in index.js under Queries folder

import { gql } from '@apollo/client';

export const GET_USERS = gql`
  {
    getUsers{
      id,
      name,
      job_title,
      email
    }
  }
`;

export const VIEW_USER = gql`
  query ($id: Int){
    getUser(id: $id) {
      id,
      name,
      job_title,
      email
    }
  }
`;

export const ADD_USER = gql`
  mutation($name: String, $email: String, $job_title: String) {
    createUser (name: $name, email: $email, job_title: $job_title)
  }
`;

export const EDIT_USER = gql`
  mutation($id: Int, $name: String, $email: String, $job_title: String) {
    updateUser(id: $id, name: $name, email: $email, job_title: $job_title)
  }
`;

export const DELETE_USER = gql`
  mutation($id: Int) {
    deleteUser(id: $id)
  }
`;

# Write following code in Home.js under Components folder

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

# Write following code in Create.js under Components folder

import React, { useState } from 'react'
import { ADD_USER } from '../Queries';
import { useMutation } from '@apollo/client';
import { Button, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Create() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [job_title, setJob_title] = useState('');
    
    let history = useNavigate();

    const [ addUser ] = useMutation(ADD_USER,);

    const handelSubmit = async (e) => {
        e.preventDefault();  // Prevent reload
        let b=name, c=email, d=job_title;
        try{
            await addUser({variables:{name:b, email:c, job_title:d}})
            history('/')//redirect to home
        }catch(error){alert(error)}
    }
    return (
        <div >
            <Form className="d-grid gap-2" 
                style={{marginLeft:'20rem', marginRight:'20em'}}>
                  
                <Form.Group className="mb-3" 
                    controlId="formBasicName">
                    <Form.Control onChange=
                        {e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" required />
                </Form.Group>
                  
                <Form.Group className="mb-3" 
                    controlId="formBasicEmail">
                    <Form.Control onChange=
                        {e => setEmail(e.target.value)}
                        type="text" placeholder="Enter Email" required />
                </Form.Group>

                <Form.Group className="mb-3" 
                    controlId="formBasicJobTitle">
                    <Form.Control onChange=
                        {e => setJob_title(e.target.value)}
                        type="text" placeholder="Enter Job Title" required />
                </Form.Group>
                <div>
                    <Link to='/'>
                        <Button variant="info" size="md">
                            Home
                        </Button>
                    </Link>
                    <Button
                        onClick={async(e) => await handelSubmit(e)}
                        variant="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    )
}
  
export default Create

# Write following code in Edit.js under Components folder

import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client';
import { EDIT_USER } from '../Queries';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

function Edit() {
    const [job_title, setJob_title] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState(0);
 
    let navigate = useNavigate()

    useEffect(() => {
        setId(parseInt(localStorage.getItem('id')))//set the integer value
        setName(localStorage.getItem('name'))
        setEmail(localStorage.getItem('email'))
        setJob_title(localStorage.getItem('job_title'))
    }, [])

    const [ changeUser ] = useMutation(EDIT_USER,);

    const handelSubmit = async(e) => {
        e.preventDefault();
        let a=id, b=name, c=email, d=job_title;
        try{
            await changeUser({variables:{id:a, name:b, email:c, job_title:d}});
            navigate('/');
        }catch(error){alert(error)}
    }
    return (
        <div>
            <Form className="d-grid gap-2" 
                    style={{marginLeft:'20rem', marginRight:'20em'}}>
                <Form.Group className="mb-3">
                    <Form.Control value={name}
                        onChange={e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="text" placeholder="Enter Email" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control value={job_title}
                        onChange={e => setJob_title(e.target.value)}
                        type="text" placeholder="Enter Job Title" />
                </Form.Group>
                <div>
                    <Link  to='/'>
                        <Button variant="primary" size="md">
                            Home
                        </Button>
                    </Link>
                    <Button
                        onClick={async(e) => await handelSubmit(e)
                        }variant="warning" type="submit" size="md">
                        Update
                    </Button>
                </div>
            </Form>
        </div>
    )
}
export default Edit;

# now execute npm start command and test the application
