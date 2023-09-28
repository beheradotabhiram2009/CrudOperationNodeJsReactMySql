# Demo Example provides crud operation using Graphql, React, Apollo, Express 
# Download and install mysql 8.1
# create a database userapp and a table users by using following sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `job_title` varchar(45) DEFAULT NULL,
  `content` mediumblob,
  `joining_date` date DEFAULT NULL,
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
const { GraphQLScalarType, Kind, buildSchema } = require('graphql');
const mysql = require('mysql2');
const cors = require('cors');

let con = {};
const app = express();
app.use(cors());

  const resolverDate = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return ast.value // ast value is always in string format
      }
      return null;
    },
  }),
};

const resolverBlob = {
  Date: new GraphQLScalarType({
    name: 'Blob',
    description: 'Blob custom scalar type',
    parseValue(value) {
      return value; 
    },
    serialize(value) {
      return value; //value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return ast.value
      }
      return null;
    },
  }),
}; 
 
const schema = buildSchema(`
  scalar Date
  scalar Blob
  type User {
    id: Int
    name: String
    email: String
    job_title: String
    joining_date:Date
    content:Blob
  }
  type Query {
    getUsers: [User],
    getUser(id: Int):User
    }
  type Mutation {
    updateUser(id: Int, name: String, email: String, job_title: String, 
      joining_date:Date, content:Blob): Boolean,
    createUser(name: String, email: String, job_title: String, joining_date:Date, 
      content:Blob): Boolean,
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
# Write the command: 
npx create-react-app client
# (ignore 6 errors)
# Change the directory to client
# Write the following commands in sequence : 
# npm start (now you can see react logo on the screen)
# npm install react-router-dom@6
# npm install react-bootstrap
# npm install apollo-boost
# npm install @apollo/client
# npm install bootstrap
# npm install react-dom
# npm install graphql-request
# npm install react-datepicker
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
      email,
      joining_date,
      content
    }
  }
`;

export const VIEW_USER = gql`
  query ($id: Int){
    getUser(id: $id) {
      id,
      name,
      job_title,
      email,
      joining_date,
      content
    }
  }
`;

export const ADD_USER = gql`
  mutation($name: String, $email: String, $job_title: String, $joining_date:Date, $content:Blob) {
    createUser (name: $name, email: $email, job_title: $job_title, joining_date:$joining_date, content:$content)
  }
`;

export const EDIT_USER = gql`
  mutation($id: Int, $name: String, $email: String, $job_title: String, $joining_date:Date, $content:Blob) {
    updateUser(id: $id, name: $name, email: $email, job_title: $job_title, joining_date:$joining_date, content:$content)
  }
`;

export const DELETE_USER = gql`
  mutation($id: Int) {
    deleteUser(id: $id)
  }
`;

# Write following code in Home.js under Components folder

import React from "react";
import { useMutation, useQuery } from '@apollo/client';
import { GET_USERS, DELETE_USER } from '../Queries';
import { Table, Button} from 'react-bootstrap';
import { useNavigate , Link} from 'react-router-dom';
import { blobToBase64 } from "../Base64";

import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
	const navigate = useNavigate();

	const users = useQuery(GET_USERS);
	const [ deleteUser ] = useMutation(DELETE_USER,);

	users.refetch();//refetch the query when redirecting
	
	const handleDelete = async (userid) => {
		const resp = window.confirm("Are you sure to delete this User?");
		if (!resp) return;
		try{
			await deleteUser({variables:{id:userid}});
			navigate('/');
		}catch(error){alert(error)}
	}
	function setUserId(uid){
		localStorage.setItem('id', uid);//string value is stored
	}
	
	return (
		<div style={{marginLeft:'5rem', marginRight:'5em'}}>
			 {/* <p>{JSON.stringify(users.data, null, 2)}</p> */}
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>JobTitle</th>
						<th>EMail</th>
						<th>Joining Date</th>
						<th>Photo</th>
						<th>Change</th>
						<th>Remove</th>
					</tr>
				</thead>
				<tbody>
					{users.error ? alert(users.error) : null}
					{users.data?.getUsers.map((user, index) => (
						<tr key={index}>
							<td>{user.id}</td>
							<td>{user.name}</td>
							<td>{user.job_title}</td>
							<td>{user.email}</td>
							<td>{new Date(user.joining_date).toDateString()}</td>
					    	<td><img src= {'data:image/jpeg;base64,'+blobToBase64(user.content)} width={50} height={50} alt='' /></td>
							<td>
								<Link to={`/edit`}>
									<Button onClick={(e) =>{
									//alert(user.id)
									setUserId(user.id)
									}}variant="info" size="sm">Update</Button>
								</Link>
							</td>
							<td>
					  			<Button onClick={async (e) => 
								await handleDelete(user.id)
								}variant="danger" size="sm">Delete</Button>
							</td>
						</tr>
					))}
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
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toDateStr } from '../Base64';

import 'bootstrap/dist/css/bootstrap.min.css';

function Create() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [content, setContent] = useState('');
    const [joiningDate, setJoiningDate] = useState();

    let history = useNavigate();
    const [ addUser ] = useMutation(ADD_USER,);

    const changeContent = (e) => {
        if (e.target.files[0]) {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);//1st file
                reader.onloadend = () => {
                    console.log(reader.result);
                    setContent(reader.result.split(',')[1]);
                    //content = byte64 string after ,
                }
            } catch(error) {alert(error);}
        }
    }
    const handelSubmit = async (e) => {
        e.preventDefault();  // Prevent reload
        let b=name, c=email, d=jobTitle, f=joiningDate, 
        g = btoa(content);//sent to server
        try{
            await addUser({variables:{name:b, email:c, job_title:d, joining_date:f,
                 content:g}})
            history('/')//redirect to home
        }catch(error){alert(error)}
    }
    return (
        <div >
            <Form className="d-grid gap-2" 
                style={{marginLeft:'25rem', marginRight:'25em'}}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Control onChange={e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" required />
                </Form.Group>
                 <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control onChange={e => setEmail(e.target.value)}
                        type="text" placeholder="Enter Email" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicJobTitle">
                    <Form.Control onChange={e => setJobTitle(e.target.value)}
                        type="text" placeholder="Enter Job Title" required />
                </Form.Group>
                <Form.Group className="mb-3"  controlId="formBasicJoiningDate">
                <div className="mb-3"> 
                    <label for="joiningDate">Joining Date :</label>
                        <DatePicker value={joiningDate} 
                        onChange={e => setJoiningDate(toDateStr(e))} />
                </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPhoto">
                    <Form.Control onChange={(e)=>
                        {if(e.target && e.target.files) changeContent(e)}}
                        type="file" />
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
                    <img src={'data:image/jpeg;base64,'+content} 
                        width={75} height={75} alt='' />
                </div>
            </Form>
        </div>
    )
}
  
export default Create

# Write following code in Edit.js under Components folder

import React, { Fragment, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_USER, VIEW_USER } from '../Queries';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { blobToBase64, toDateStr } from '../Base64';

import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function  Edit() {
    let history = useNavigate();

    const [uid, setUId] = useState(0);
    const [name, setName] = useState('');  
    const [email, setEmail] = useState(''); 
    const [jobTitle, setJobTitle] = useState(''); 
    const [joiningDate, setJoiningDate] = useState('');  
    const [content, setContent] = useState(''); 

    useEffect(() => {
        setUId(parseInt(localStorage.getItem('id')))//set the integer value
    },[]);
    const {data, loading, error} = useQuery(VIEW_USER, {variables:{id:uid}});
    useEffect(() => {
        if(data && data.getUser){
            setName(data.getUser.name)
            setEmail(data.getUser.email)
            setJobTitle(data.getUser.job_title)
            setJoiningDate(toDateStr(new Date(data.getUser.joining_date)))
            setContent(blobToBase64(data.getUser.content)) //content = base4 string
        }
    },[data]); 
 
    const [changeUser] = useMutation(EDIT_USER,)
    
    if(loading) return <Fragment>loading...</Fragment>
    if(error) return <Fragment>error...</Fragment>
    //refetch();//refetch the query when redirecting
        
    const changeContent = (e) => {
        if (e.target.files[0]) {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);//1st file
                reader.onloadend = () => {
                    console.log(reader.result);
                    setContent((reader.result.split(',')[1]));
                    //content = byte64 string after ,
                }
            } catch(error) {alert(error);}
        }
    }
    const handelSubmit = async (e) => {
        e.preventDefault();  // Prevent reload
        let b=name, c=email, d=jobTitle, f=joiningDate, 
        g = btoa(content);// sent to server 
        try{
            await changeUser({variables:{id:uid, name:b, email:c, job_title:d, 
                joining_date:f, content:g}})
            history('/')//redirect to home
        }catch(error){alert(error)}
    }
    return (
        <div>
            <Form className="d-grid gap-2" style={{marginLeft:'25rem', 
                        marginRight:'25em'}}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Control  value={name}
                        onChange={e => setName(e.target.value)}
                        type="text" placeholder="Enter Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" placeholder="Enter Email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicJobTitle">
                    <Form.Control value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        type="text" placeholder="Enter Job Title" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicJoiningDate">
                <div className="mb-3"> 
                <label for="joiningDate">Joining Date :</label>
                    <DatePicker value={joiningDate} 
                    onChange={e => setJoiningDate(toDateStr(e))} />
                </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPhoto">
                    <Form.Control onChange={async(e) => 
                    {if(e.target && e.target.files) changeContent(e)}}
                    type="file" />
                </Form.Group>
                <div>
                    <Link  to='/'>
                        <Button variant="primary" size="lg">
                            Home
                        </Button>
                    </Link>
                    <Button
                        onClick={async(e) => await handelSubmit(e)
                        }variant="warning" type="submit" size="lg">
                        Update
                    </Button>
                    <img src={'data:image/jpeg;base64,'+content} 
                        width={75} height={75} alt='' />
                </div>
            </Form>
        </div>
    )
}
export default Edit;

# now execute npm start command and test the application
