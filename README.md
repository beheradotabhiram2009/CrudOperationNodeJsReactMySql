# Demo Example provides crud operation using Graphql, React, Apollo, Express 
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
# type package.json
# You can see all the packages installed 
# Write follwing in index.js under server directory
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
# Change the directory to client
# Write the following commands in sequence : 
# npm install react-router-dom@6
# npm install react-bootstrap
# npm install apollo-boost
# npm install bootstrap
# npm install graphql
