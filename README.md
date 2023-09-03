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
# npm install bootstrap
# npm install graphql
# type package.json (You can see all the packages installed)
# Write following code in index.js under public folder
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
