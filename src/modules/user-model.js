const {hash, compare} = require('bcrypt');
const {sign} = require('jsonwebtoken');
const controllers = require('../controllers/db-controllers.js');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//criar um campo para o refresh token no database.
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

class User{
    constructor(objectData){
        this.object = objectData;
    };

    putInformation(){

    };
    async createUser(){
        try{
            this.object.password = await hash(this.object.password, 10);
            controllers.queryDb(this.object, controllers.q.insertOneUser)
                .catch((erro)=>{
                    throw erro;
                });
            console.log('Sucess!');

        }catch(erro){
            console.log(erro);
        };
    };
    async checkPassword(){
        try{
            const {password} = this.object;
            const {password:hashedPassword} = (await controllers.queryDb({item:this.object.email}, controllers.q.selectOneUser)).rows[0];
            
            const authPassword = compare(password, hashedPassword);
            if(!authPassword){
                return false;
            }else{
                return true
            }

        }catch(erro){
            console.log(erro);
        }
    };
    acessToken(){
        const {username} = this.object;
        return sign(
            username,
            process.env.ACCESS_TOKEN_PHRASE,
            {
                expiresIn: '5m'
            }
        );
    };
    refreshToken(){
        const {username} = this.object;
        return sign(
            username,
            process.env.REFRESH_TOKEN_PHRASE,
            {
                expiresIn: '1d'
            }
        );
    }
    postImage(){

    };
};

module.exports = User;