// app/seeders

'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        
        const roles = await queryInterface.sequelize.query(
            `SELECT uuid FROM "roles" ORDER BY "createdAt" ASC`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        return queryInterface.bulkInsert('users', [
            {
                uuid: uuidv4(),
                uuid_role: roles[0].uuid,
                name: 'Admin',
                email: 'admin@gmail.com',
                password: await bcrypt.hash('password', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                uuid_role: roles[1].uuid,
                name: 'User',
                email: 'user@gmail.com',
                password: await bcrypt.hash('password', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
