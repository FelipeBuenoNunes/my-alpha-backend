const express = require('express');
const jwt = require('jsonwebtoken');
const port = 3000;

require('dotenv').config();
const app = express();

const User = require('./src/modules/user-model.js');
const user = new User({
    name:'Felipe Bueno',
    password:'senha123',
    email:'bueno_felipe@gmail.com',
    phone:'321321321',
    birthDate:'10-10-2010',
    cpf:'12345278901',
    gender:'female'
});
user.checkPassword().then(res=>console.log(res));

// const token_ = jwt.sign({password:'senha123'}, 'passphrase');
// console.log(token_);
// const bol_ = jwt.verify(token_,'passphrase');
// console.log(bol_);

app.listen(port, ()=>{
    console.log('Server open in:', port);
});

