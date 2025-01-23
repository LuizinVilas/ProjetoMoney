const {database, user, password} = require('../Configs');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
    host: '127.0.0.1'
});

class users extends Sequelize.Model{}
class contas extends Sequelize.Model{}

users.init({
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    Username: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    Password: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    Contas: {
        type: Sequelize.FLOAT,
        allowNull: false
    }   
}, {
    sequelize,
    timestamps: false,
    modelName: 'Users'
});

contas.init({
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true
    },
    Valor: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    Descricao: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    User_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: users,
            key: 'Id'
        }
        
    }
}, {
    sequelize,
    timestamps: false,
    modelName: 'Contas'
});


module.exports = {users, contas};