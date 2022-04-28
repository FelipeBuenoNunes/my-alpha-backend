const { Client } = require('pg');


dbAccess = {
    host:process.env.HOST, //|| 'db.ayubeoinitscdmhrtsrr.supabase.co',
    database: process.env.DATABASE, //|| 'postgres',
    password: process.env.PASSWORD, //|| 'vpTDpLTx!vM8@8z',
    port: process.env.PORT, //|| 5432,
    user: process.env.USER //|| 'postgres'
};

async function queryDb(user, _query){

    const client = new Client(dbAccess);
    try{
        await client.connect()

        const query = {
            text:_query,
            values:Object.values(user)
        };
        const insert = await client.query(query);

        return insert;
    }finally{
        await client.end();
    }
};

module.exports = {
    queryDb,
    q:{
        insertOneUser:'INSERT INTO users("name", "password", "email", "phone", "birthDate", "cpf", "gender", "refreshToken") VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        selectOneUser:'SELECT * FROM users WHERE email = $1',
        insertRefreshToken:'UPDATE users SET refreshToken=$1 WHERE username=$2',
    }
};

//insertOneUser:'INSERT INTO users("name", "password", "email", "phone", "birthDate", "cpf", "gender", "refreshToken") VALUES($1, $2, $3, $4, $5, $6, $7, $8)',