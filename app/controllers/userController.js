// app/controllers

const bcrypt = require('bcryptjs');
const { Users, Roles } = require('../models');

exports.getCurrent = async (req, res) => {
    const { uuid } = req.user;

    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'User UUID is required'
        });
    }

    try {
        const models = await Users.scope('defaultScope').findOne({
            where: { uuid, deletedAt: null },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ]
        });

        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        res.json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                uuid: models.uuid,
                uuid_role: models.uuid_role,
                name: models.name,
                email: models.email,
                roles: models.roles
            }
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.index = async (req, res) => {
    // kalau mau pake limit data
    // const limit = parseInt(req.query.limit, 10) || 100;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    // Kalo mau pake pagination
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: models } = await Users.scope('defaultScope').findAndCountAll({
            where: { deletedAt: null },
            // attributes: ['uuid', 'uuid_role', 'name', 'email'],
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ],
            order: [['name', 'ASC']],

            // kalau mau pake limit data
            // limit: limit,
            limit: limit !== null ? limit : undefined,

            // kalau mau pake pagination
            offset: offset
        });

        // const responseData = models.map(({ uuid, uuid_role, name, email, roles }) => ({ uuid, uuid_role, name, email, roles }));
        const responseData = models.map((model, index) => ({
            // ID berurutan (Dummy ID) tapi bisa pakai langsung id dari column di database kalo mau (soal disini saya pakai uuid tidak ada pakai id)
            id: offset + index + 1,
            // Data yang diambil dari model database
            uuid: model.uuid,
            uuid_role: model.uuid_role,
            name: model.name,
            email: model.email,
            roles: model.roles ? model.roles.name : null
        }));

        // Kalo mau pake pagination
        const totalPages = Math.ceil(count / limit);

        res.json({
            status: 'success',
            message: 'Data successfully found',
            data: {
                data: responseData,
                total_all_data: count,

                // kalau mau pake limit data
                limit_data: limit,

                // kalau mau pake pagination
                current_page: page,
                total_pages: totalPages
            }
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.create = async (req, res) => {
    const { uuid_role, name, email, password } = req.body;

    // Validasi Body
    const fields = { uuid_role, name, email, password };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    // Validasi email
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (email.length < 5 || !emailRegex.test(email)) {
        return res.json({
            status: 'error',
            message: 'Email must contain only letters, numbers, "@" and ".", and be at least 5 characters long'
        });
    }

    // Validasi password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[a-zA-Z0-9@#]{5,}$/;
    if (!passwordRegex.test(password)) {
        return res.json({
            status: 'error',
            message: 'Password must contain at least one uppercase letter, one number, one special character (@ or #), and be at least 5 characters long'
        });
    }

    try {
        // cek format uuid
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(uuid_role)) {
            return res.json({
                status: 'error',
                message: 'Invalid uuid_role format'
            });
        }
        // Cek apakah role sudah ada di database
        const role = await Roles.findOne({ where: { uuid: uuid_role } });
        if (!role) {
            return res.json({
                status: 'error',
                message: 'Role not found'
            });
        }
        
        // Cek apakah email sudah ada di database
        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.json({
                status: 'error',
                message: 'Email already exists'
            });
        }

        const models = new Users();
        models.uuid_role = uuid_role;
        models.name = name;
        models.email = email;
        models.password = await bcrypt.hash(password, 10);
        await models.save();

        const responseData = {
            uuid: models.uuid,
            uuid_role: models.uuid_role,
            name: models.name,
            email: models.email,
            roles: models.roles
        };

        res.json({
            status: 'success',
            message: 'Data saved successfully',
            data: responseData
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.read = async (req, res) => {
    const { uuid } = req.params;

    // Validasi Parameter
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    try {
        const models = await Users.scope('defaultScope').findOne({
            where: { uuid: uuid, deletedAt: null },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ],
        });

        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        const responseData = { uuid: models.uuid, uuid_role: models.uuid_role, name: models.name, email: models.email, roles: models.roles};
        res.json({
            status: 'success',
            message: 'Data successfully found',
            data: responseData
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.updated = async (req, res) => {
    const { uuid } = req.params;
    const { uuid_role, name, email, password } = req.body;

    // Validasi Parameter
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    // Validasi Body
    const fields = { uuid_role, name, email };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    // Validasi email
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (email.length < 5 || !emailRegex.test(email)) {
        return res.json({
            status: 'error',
            message: 'Email must contain only letters, numbers, "@" and ".", and be at least 5 characters long'
        });
    }

    // Validasi password
    if (password) { // Jika password ada isinya maka jalankan validasi ini
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[a-zA-Z0-9@#]{5,}$/;
        if (!passwordRegex.test(password)) {
            return res.json({
                status: 'error',
                message: 'Password must contain at least one uppercase letter, one number, one special character (@ or #), and be at least 5 characters long'
            });
        }
    }

    try {
        // cek format uuid
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(uuid_role)) {
            return res.json({
                status: 'error',
                message: 'Invalid uuid_role format'
            });
        }
        // Cek apakah role sudah ada di database
        const role = await Roles.findOne({ where: { uuid: uuid_role } });
        if (!role) {
            return res.json({
                status: 'error',
                message: 'Role not found'
            });
        }
        
        // Cek apakah email sudah ada di database
        const emailLama = await Users.findOne({ where: { uuid: uuid } });
        const emailBaru = await Users.findOne({ where: { email: email } });
        if (emailBaru) {
            if (emailLama.email == emailBaru.email) {
            } else {
                return res.json({
                    status: 'error',
                    message: 'Email already exists'
                });
            }
        }

        // Carikan data yang akan diupdate
        const models = await Users.scope('defaultScope').findOne({
            where: { uuid, deletedAt: null },
            include: [
                {
                    model: Roles,
                    as: 'roles',
                    attributes: ['name']
                }
            ]
        });

        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        models.uuid_role = uuid_role || models.uuid_role;
        models.name = name || models.name;
        models.email = email || models.email;
        if (password) {
            models.password = await bcrypt.hash(password, 10);
        }
        await models.save();

        const responseData = { uuid: models.uuid, uuid_role: models.uuid_role, name: models.name, email: models.email, roles: models.roles};
        res.json({
            status: 'success',
            message: 'Data updated successfully',
            data: responseData
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};

exports.deleted = async (req, res) => {
    const { uuid } = req.params;

    try {
        const models = await Users.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        await models.destroy();

        res.json({
            status: 'success',
            message: 'Data deleted successfully'
        });
    } catch (error) {
        res.json({
            status: 'error',
            message: error.message
        });
    }
};