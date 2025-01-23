// app/models

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
        // id: {
        //     type: DataTypes.INTEGER,
        //     autoIncrement: true,
        //     allowNull: false,
        //     // primaryKey: true
        // },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        uuid_role: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        defaultScope: {
            attributes: { exclude: [
                // 'id',
                // 'uuid',
                // 'uuid_role',
                // 'password',
                'createdAt',
                'updatedAt',
                'deletedAt'
            ] }
        },
        scopes: {
            withPassword: {
                attributes: {}
            }
        },
        sequelize,
        modelName: 'Users',
        // paranoid: true
    });

    Users.associate = function(models) {
        Users.belongsTo(models.Roles, { foreignKey: 'uuid_role', as: 'roles' });
    };

    return Users;
};
