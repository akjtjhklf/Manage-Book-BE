const ApiError = require("../api-error");
const TracksService = require("../services/tracks.service");
const MongoDB = require("../utils/mongodb.util");

const create = async (req, res, next) => {
    if (!req.body?.borroweddate) {
        return new (new ApiError(400, "Tên không được bỏ trống"));
    }

    try {
        const tracksService = new TracksService(MongoDB.client);
        const document = await tracksService.create(req.body);
        return res.json({
            data: document,
            message: "Thuê thành công",
        });
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error occurred while creating the track")
        );
    }
};

const findALL = async (req, res, next) => {
    let document = [];
    try {
        const tracksService = new TracksService(MongoDB.client);
        const { userId } = req.query;
        if (userId) {
            document = await tracksService.findByUser(userId);
            res.json({
                data: document,
                message: "Tìm bằng tên thành công",
            })
        } else {
            document = await tracksService.find({});
            res.json({
                data: document,
                message: "Tìm thành công",
            })
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the track")
        );
    }
};

const findOne = async (req, res, next) => {
    try {
        const tracksService = new TracksService(MongoDB.client);
        const document = await tracksService.findById(req.params.id);
        if (!document) {
            return new (new ApiError(404, "Không tìm thấy trạng thái mượn"));
        }
        return res.json({
            data: document,
            message: "Thành công"
        })
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(
            new ApiError(400, "Dữ liệu cập nhật không thể để trống")
        );
    }
    try {
        const tracksService = new TracksService(MongoDB.client);
        const document = await tracksService.update(req.params.id, req.body);
        if (!document) {
            return next(
                new ApiError(404, "Không tìm thấy trạng thái mượn")
            );
        }
        else return res.json({ message: "Cập nhật trạng thái mượn thành công" },)
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving track with id=${req.params.id}`)
        );
    }
};

const deleteOne = async (req, res, next) => {
    try {
        const tracksService = new TracksService(MongoDB.client);
        const document = await tracksService.delete(req.params.id);
        return res.json({document,message:""});
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving track with id=${req.params.id}`)
        );
    }
};

const deleteAll = async (req, res, next) => {
    try {
        const tracksService = new TracksService(MongoDB.client);
        const deletedCount = await tracksService.deleteAll();
        return res.json({
            message: `${deletedCount} trạng thái mượn đã được xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite tracks")
        );
    }
};

const findAllFavorite = async (req, res, next) => {
    try {
        const tracksService = new TracksService(MongoDB.client);
        const document = await tracksService.findFavorite();
        return res.json({
            message: "Find Favorite successfully",
            data: document
        })
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
};

module.exports = { create, findALL, findOne, update, deleteOne, deleteAll, findAllFavorite };