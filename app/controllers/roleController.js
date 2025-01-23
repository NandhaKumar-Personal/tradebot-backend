// app/controllers

const { Roles } = require('../models');

exports.index = async (req, res) => {
    // kalau mau pake limit data
    // const limit = parseInt(req.query.limit, 10) || 100;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    // Kalo mau pake pagination
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: models } = await Roles.scope('defaultScope').findAndCountAll({
            where: { deletedAt: null },
            // attributes: ['uuid', 'name'],
            order: [['name', 'ASC']],

            // kalau mau pake limit data
            limit: limit !== null ? limit : undefined,
            
            // kalau mau pake pagination
            offset: offset
        });

        // const responseData = models.map(({ uuid, name }) => ({ uuid, name }));
        const responseData = models.map((model, index) => ({
            // ID berurutan (Dummy ID) tapi bisa pakai langsung id dari column di database kalo mau (soal disini saya pakai uuid tidak ada pakai id)
            id: offset + index + 1,
            // Data yang diambil dari model database
            uuid: model.uuid,
            name: model.name
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
                // limit_data: limit,
                limit: limit !== null ? limit : undefined,

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
    const { name } = req.body;

    // Validasi Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    try {
        // Carikan data yang akan diupdate
        const models = new Roles();

        models.name = name || models.name;
        await models.save();

        const responseData = { uuid: models.uuid, name: models.name };
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
        const models = await Roles.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        const responseData = { uuid: models.uuid, name: models.name };
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
    const { name } = req.body;

    // Validasi uuid
    if (!uuid) {
        return res.json({
            status: 'error',
            message: 'UUID is required'
        });
    }

    // Validasi Body
    const fields = { name };
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            return res.json({
                status: 'error',
                message: `${key} is required`
            });
        }
    }

    try {
        // Carikan data yang akan diupdate
        const models = await Roles.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

        if (!models) {
            return res.json({
                status: 'error',
                message: 'Data not found or Data is deleted'
            });
        }

        models.name = name || models.name;
        await models.save();

        const responseData = { uuid: models.uuid, name: models.name };
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
        const models = await Roles.scope('defaultScope').findOne({ where: { uuid, deletedAt: null } });

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