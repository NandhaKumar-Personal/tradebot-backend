// app/models

module.exports = (sequelize, DataTypes) => {
    const Roles = sequelize.define('roles', {
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
        name: {
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
                'createdAt',
                'updatedAt',
                'deletedAt'
            ] }
        },
        sequelize,
        modelName: 'Roles',
        // paranoid: true
    });

    Roles.associate = function(models) {
        Roles.hasMany(models.Users, { foreignKey: 'uuid_role', as: 'users' });
    };

    return Roles;
};
