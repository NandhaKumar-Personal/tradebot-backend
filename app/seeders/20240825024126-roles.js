// app/seeders

'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('roles', [
            {
                uuid: uuidv4(),
                name: 'Admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                uuid: uuidv4(),
                name: 'User',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ]);
    },

    async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Roles', null, {});
    }
};
