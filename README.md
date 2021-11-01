<img align="right" src="https://app.travis-ci.com/andreachirico11/Students_Manager.svg?branch=master"></img>

<h1 align="center">
  <br>
  Student Manager
  <br>
</h1>

<h4 align="center">A Private Teacher <a href="https://angular.io/" target="_blank">Angular</a> Mean Stack application to handle Student's data and their Receipts</h4>

<br>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

<br>

![screenshot](./sample.gif)

## Key Features

- Keep track of Students with their datas
- Add Student's Parent
- Add Student's Receipts
- Responsive Angular Material Design
- Record Totals and Partials
- <a href="https://nodejs.org/en/">Node Js</a> and <a href="https://www.mongodb.com/">Mongo Db</a>
- Dark/Light mode
- Multilingual

## Installation

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
$ git clone https://github.com/andreachirico11/Students_Manager

# Go into the backend repository
$ cd Students_manager/backend

# Install dependencies
$ npm install

# Go into the frontend repository
$ cd Students_manager/frontend

# Install dependencies
$ npm install

```

## Configuration

> To run this application you have to create a Mongo Db empty Database.

Go to backend folder and create a <i>.env</i> file with the following variables

```
MONGO_CONNECTION_STRING=<<mongodb://127.0.0.1:27017/YOUR_DB_NAME>>
SECRET_AUTH_STRING=<the string used to hashing>
TOKEN_EXPIRATION_DATE=<a token expiration date written as 1d, 1h etc>
ALLOWED_ORIGINS=http://localhost:3333
PORT=<the port wich Node Server will use>
TEST_USER=admin@email,admin << compile with your credentials or leave these as default >>
```

Then open <i>frontend/src/environments/environment.ts</i> and modify it as following

```typescript
export const environment = {
  production: false,
  dbUrl: 'http://localhost:<<THE PORT WHERE THE NODE SERVER IS LOCATED>>/api/',
  idleTimeout: 86400000, // logout if the app is not used for this amount of time
};
```

Do the same with <i>frontend/src/environments/environment-pwa-test.ts</i>

## Run app

```bash

# Go into the backend repository
$ cd Students_manager/backend
$ npm start

# Go into the frontend repository
$ cd Students_manager/frontend
## If you only want to run the web app
$ npm start
## If you prefer to test the PWA version of the app
$ npm run pwa





```

## Development

You can use editor like <a href="https://code.visualstudio.com/">Vs Code</a> wich have an integrated Typescript compiler or:

```bash
# Go into the backend repository
$ cd Students_manager/backend
$ npm run nodemon # will watch for changes in the compiled folder and launches the server

```

Then run frontend

```bash
# Go into the frontend repository
$ cd Students_manager/frontend
$ npm start
$ npm test # if you also want tests

```

> Enter with the .env file test user credentials

 <br>
 <br>
 <br>

---

GitHub [@andreachirico11](https://github.com/andreachirico11) &nbsp;&middot;&nbsp;
