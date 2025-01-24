const express = require('express');
const path = require('path');
const Sequelize = require('sequelize');
const session = require('express-session')
const {users, contas} = require('./Models/Models');
const {database, user, password} = require('./Configs');
const {CreateUser, ReadUser, UpdateUser, DeleteUser} = require('./Models/QuerysUser');
const {CreateConta, ReadConta, UpdateConta, DeleteConta} = require('./Models/QuerysContas');


const app = express();
const sequelize = new Sequelize(database, user, password, {
    host: '127.0.0.1',
    dialect: 'mysql'
})

app.use(session({secret: 'Sla', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname + '/Views')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

function CheckAuth(req, res, next){
    if(req.session.user){
        return next();
    } else {
        res.redirect('/Login');
    }
}

function Connection(){
    sequelize.authenticate().then(() => {
        app.listen(3000, () => {
            console.log('127.0.0.1:3000');
        })
    }).catch(err => {
        console.error('Erro: '+ err);
    })
}

app.get('/Login', (req, res) => {
    res.sendFile(__dirname + '/Views/Forms.html');
});

app.post('/Processar', async (req, res) => {
    const {Name, Password, Validador} = req.body;
    if(!Validador){
        if(await ReadUser(Name)){
            const user = await users.findOne({where: {Username: Name}});
            if(Password == user.Password){
                req.session.user = user.toJSON();
                return res.json({redirect: '/Main'});
            } else {
                res.json({message: 'Senha incorreta!'});
            }
        } else {
            res.json({message: 'Nenhum usuário encontrado!'});
        }
    } else {
        if(await ReadUser(Name) == false){
            await CreateUser(Name, Password);
            console.log('Usuário criado!');
            res.json({message: 'Usuário criado!'});
        } else {
            res.json({message: 'Usuário já existente!'});
        }
    }
   
});

app.get('/Main', CheckAuth, (req, res) => {
    const User = req.session.user;
    console.log(User);
    res.render('Main', {User});
    
});

app.post('/ProcessarDados', async (req, res) => {
    const User = req.session.user;
    const {Descricao, Valor, Validador} = req.body;
    console.log(Validador);
    if(Validador == 1){
        await CreateConta(parseFloat(Valor), Descricao, User.Id);
        const ContasAtualizado = await users.findOne({where: {Id: User.Id}});
        res.json({ValorAtualizado: ContasAtualizado.Contas});
    } else if(Validador == 2){
        let Contas = await contas.findAll({where: {User_Id: User.Id}});
        let ListHTML = '';
        Contas = Contas.map(Conta => Conta.dataValues);
        for(let Conta of Contas){
            console.log(Conta);
            ListHTML += `<li>Id: ${Conta.Id} Valor: ${Conta.Valor} Descrição: ${Conta.Descricao}</li>`;
        }
        res.json({Contas: ListHTML});
    } else {
        if(await DeleteConta(User.Id, Descricao)){
            const ContasAtualizado = await users.findOne({where: {Id: User.Id}});
            res.json({Message: 'Conta Excluida!', ValorAtualizado: ContasAtualizado.Contas});
        } else {
            res.json({Message: 'Nenhuma Conta encontrada!'});
        }
    }

});

Connection();