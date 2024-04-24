const ApiError = require("../api-error");
const StaffsService = require("../services/staffs.service");
const MongoDB = require("../utils/mongodb.util");

const signUp = async (req, res, next) => {
    const userData = req.body;
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const newUser = await staffsService.signUp(userData);
        res.json({newUser,message: ""});
    } catch (error) {
        next(error);
    }
};

const signIn = async (req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const token = await staffsService.signIn(username, password);
        res.json({ token, message: "" });
    } catch (error) {
        next(error);
    }
};

const findALL = async (req, res, next) => {
    let document = [];
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await staffsService.findByName(name);
            res.json({
                data: document,
                message: "Tìm theo tên thành công",
            })
        } else {
            document = await staffsService.find({});
            res.json({
                data: document,
                message: "Tìm thành công",
            })
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the staffs")
        );
    }
};

const findOne = async (req, res, next) => {
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const document = await staffsService.findById(req.params.id);
        if (!document) {
            return new (new ApiError(404, "Không tìm thấy nhân viên"));
        }
        return res.json({
            data: document,
            message: "Thành công"
        })
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
        );
    }
};

const update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(
            new ApiError(400, "Dữ liệu cập nhật không được bỏ trống")
        );
    }
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const document = await staffsService.update(req.params.id, req.body);
        if (!document) {
            return next(
                new ApiError(404, "Không tìm thấy nhân viên")
            );
        }
        else return res.json({ message: "Cập nhật thông tin nhân viên thành công", isSuccess:true})
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
        );
    }
};

const deleteOne = async (req, res, next) => {
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const document = await staffsService.delete(req.params.id);
        if (!document) {
            return next(
                new ApiError(404, "Không tìm thấy nhân viên")
            );
        }
        else return res.json({ message: "Xóa nhân viên thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving staff with id=${req.params.id}`)
        );
    }
};

const deleteAll = async (req, res, next) => {
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const deletedCount = await staffsService.deleteAll();
        return res.json({
            message: `${deletedCount} nhân viên đã được xóa thành công!`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite staffs")
        );
    }
};

const findAllFavorite = async (req, res, next) => {
    try {
        const staffsService = new StaffsService(MongoDB.client);
        const document = await staffsService.findFavorite();
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

module.exports = { signUp, signIn, findALL, findOne, update, deleteOne, deleteAll, findAllFavorite };