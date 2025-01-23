const {database, user, password} = require('../Configs');
const {users, contas} = require('./Models');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
    host: '127.0.0.1'
});


async function CreateUser(name, password){
    await users.create({
        Id: null,
        Username: name,
        Password: password,
        Contas: 0
    }).then(() => {
        console.log('Usuário criado!');
    }).catch(err => {
        console.error('Erro: '+ err);
    });
}

async function ReadUser(name) {
    if(await users.findOne({where: {Username: name}})){
        const User = await users.findOne({where: {Username: name}});
        console.log(User);
        return true;
    } else {
        console.log('Usuário não encontrado!');
        return false;
    }
}

async function UpdateUser(name, NameUpdate, PasswordUpdate) {
    if(ReadUser(name)){
        if(NameUpdate){
            const User = await users.findOne({where: {Username: name}});
            await User.update({Username: NameUpdate});
            console.log('Usuário Atualizado!');
        } else if (PasswordUpdate){
            const User = await users.findOne({where: {Username: name}});
            await User.update({Password: PasswordUpdate});
            console.log('Usuário Atualizado!');
        }
    } else {
        console.log('Nenhum usuário encontrado!');
    }
}

async function DeleteUser(name) {
    if(ReadUser(name)){
        const User = await users.findOne({where: {Username: name}});
        await User.destroy();
        console.log('Usuário excluído!');
    } else {
        console.log('Nenhum usuário encontrado!');
    }
}

module.exports = {CreateUser, ReadUser, UpdateUser, DeleteUser};