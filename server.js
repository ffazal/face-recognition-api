const express  = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const db = require('knex')({
    client: 'pg',  //Postgres (pg)
    connection: {
      host : '127.0.0.1', //localhost
      port : 5432,
      user : 'ffazal',
      password : '',
      database : 'smart-brain'
    }
  });


const app = express();

app.use(express.json());
app.use(cors()); // Enabled secure comonucation between front end and backend server. 


const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        }, 
        {
            id: '124',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

// Root route
app.get('/', (req, res) => {
    res.send(database.users)
})

// Sign in Route
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('Error logging in');
    }
    res.json('signing in!')
})

// Register Route
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*') //returning all
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
        res.json(user[0]); //Return the last user
    })
    .catch(err => res.status(400).json('Unable to register'))
})

// /profile/:userID --> GET = user
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ //Select everything from user where id=id
        id: id
    })
    .then(user => {
        if (user.length) { //if user is not an empty array
            res.json(user[0]); //return user
        } else {
            res.status(400).json('Not Found!')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
})

//image --> PUT --> User
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json(' No such user'); // Sends a response back with status 404
    }
})

app.listen(3000, ()=> {
    console.log('App is running on port 3000');
})