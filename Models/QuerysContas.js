const {database, user, password} = require('../Configs');
const {users, contas} = require('./Models');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
    host: '127.0.0.1'
});


async function CreateConta(Valor, Descricao, UserId) {
    await contas.create({
        Id: null,
        Valor: Valor,
        Descricao: Descricao,
        User_Id: UserId
    });
    const user = await users.findOne({where: {Id: UserId}});    
    const Atualizado = await users.update(
        {Contas: user.Contas + Valor},
        {where: {Id: UserId}}
    );
    if(Atualizado > 0){
        console.log('Conta criada!');
    } else {
        console.log('Erro!');
    }
    
}

async function ReadConta(UserId, Descricao) {
    if(!Descricao){
        const Contas = await contas.findAll({where: {User_Id: UserId}});
        console.log(Contas);
    } else {
        const Conta = await contas.findOne({where: {Descricao: Descricao, User_Id: UserId}});
        if(Conta){
            console.log(Conta);
        } else {
            console.log('Nenhuma conta encontrada!');
        }
    }
}

async function UpdateConta(UserId, Descricao, ValorNovo, DescricaoNova) {
    const Conta = await contas.findOne({where: {User_Id: UserId, Descricao: Descricao}});
    if(Conta){
        if(ValorNovo){
            await Conta.update({Valor: ValorNovo});
            console.log('Valor Atualizado');
        } else {
            await Conta.update({Descricao: DescricaoNova});
            console.log('Descrição Atualizada');
        }
    } else {
        console.log('Nenhuma conta encontrada!');
    }
}

async function DeleteConta(UserId, Descricao) {
    const Conta = await contas.findOne({where: {User_Id: UserId, Descricao: Descricao}});
    if(Conta){
        const User = await users.findOne({where: {Id: UserId}});
        const Atualizado = await users.update(
            {Contas: User.Contas - Conta.Valor},
            {where: {Id: UserId}}
        );
        if(Atualizado > 0){
            await Conta.destroy();
            console.log('Conta excluída!');
            return true;
        }
    } else {
        console.log('Nenhuma conta encontrada!');
        return false;
    }
}

module.exports = {CreateConta, ReadConta, UpdateConta, DeleteConta};