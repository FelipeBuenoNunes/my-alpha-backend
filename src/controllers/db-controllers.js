const { Client } = require('pg');
require('dotenv/config');


dbAccess = {
    host: process.env.HOST, //|| 'db.ayubeoinitscdmhrtsrr.supabase.co',
    database: process.env.DATABASE, //|| 'postgres',
    password: process.env.PASSWORD, //|| 'vpTDpLTx!vM8@8z',
    port: process.env.PORT, //|| 5432,
    user: process.env.USERDB //|| 'postgres'
};

async function queryDb(user, _query) {
    const client = new Client(dbAccess);
    try {
        await client.connect()

        const query = {
            text: _query,
            values: Object.values(user)
        };

        const insert = await client.query(query);

        return insert;
    } finally {
        await client.end();
    }
};

module.exports = {
    queryDb,
    q: {
        insertOneUser: 'INSERT INTO users("name", "password", "email", "birthDate", "refreshToken") VALUES($1, $2, $3, $4, $5)',
        selectOneUser: 'SELECT * FROM users WHERE name = $1',
        insertRefreshToken: 'UPDATE users SET \"refreshToken\"=$1 WHERE \"name\"=$2',
        insertImage: 'INSERT INTO images("user_id", "description", "local_image") VALUES($1, $2, $3)',
        getImages: `SELECT "images"."id", "users"."name", "images"."description", "images"."local_image"
            FROM "images" JOIN "users" ON "users"."id" = "images"."user_id"`,
        alterUser: `UPDATE users SET \"name\"=$1, \"email\"=$2, \"password\"=$3, \"birthDate\"=$4 WHERE \"name\"=$1`
    }
};

//insertOneUser:'INSERT INTO users("name", "password", "email", "phone", "birthDate", "cpf", "gender", "refreshToken") VALUES($1, $2, $3, $4, $5, $6, $7, $8)',