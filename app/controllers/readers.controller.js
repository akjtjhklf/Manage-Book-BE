const ApiError = require("../api-error");
const ReadersService = require("../services/readers.service");
const MongoDB = require("../utils/mongodb.util");

const signUp = async (req, res, next) => {
    const userData = req.body;
    try {
        const readersService = new ReadersService(MongoDB.client);
        const newUser = await readersService.signUp(userData);
        console.log(newUser)
        res.json(newUser);
    } catch (error) {
        next(error);
    }
};

const signIn = async (req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const readersService = new ReadersService(MongoDB.client);
        const token  = await readersService.signIn(username, password);
        res.json({ token,message:"" });
    } catch (error) {
      next(error);
    }
  };

const findALL = async (req, res, next) => {
    let document = [];
    try {
        const readersService = new ReadersService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await readersService.findByName(name);
            res.json({
                data: document,
                message: "Tìm theo tên thành công",
            })
        } else {
            document = await readersService.find({});
            res.json({
                data: document,
                message: "Tìm thành công",
            })
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the reader")
        );
    }
};

const findOne = async (req, res, next) => {
    try {
        const readersService = new ReadersService(MongoDB.client);
        const document = await readersService.findById(req.params.id);
        if (!document) {
            return new (new ApiError(404, "Không tìm thấy đọc giả"));
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
            new ApiError(400, "Dữ liệu cập nhật không thể bỏ trống")
        );
    }
    try {
        const readersService = new ReadersService(MongoDB.client);
        const document = await readersService.update(req.params.id, req.body);
        if (!document) {
            return next(
                new ApiError(404, "Không tìm thấy đọc giả")
            );
        }
        else return res.json({ message: "Cập nhật đọc giả thành công" },)
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const deleteOne = async (req, res, next) => {
    try {
        const readersService = new ReadersService(MongoDB.client);
        const document = await readersService.delete(req.params.id);
        if (!document) {
            return next(
                new ApiError(404, "Không tìm thấy đọc giả")
            );
        }
        else return res.json({ message: "Xóa đọc giả thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
        );
    }
};

const deleteAll = async (req, res, next) => {
    try {
        const readersService = new ReadersService(MongoDB.client);
        const deletedCount = await readersService.deleteAll();
        return res.json({
            message: `${deletedCount} đọc giả được xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
};

const findAllFavorite = async (req, res, next) => {
    try {
        const readersService = new ReadersService(MongoDB.client);
        const document = await readersService.findFavorite();
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