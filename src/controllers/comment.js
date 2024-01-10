// Import các module và model cần thiết
const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");


// Định nghĩa API để lấy danh sách comment dựa trên ID sản phẩm
const getListCommentByProductId = async (req, res) => {
    try {
        // Lấy ID của sản phẩm từ request hoặc từ query params, tùy thuộc vào cách bạn truyền tham số
        const { productId } = req.params; // hoặc req.query.productId

        // Sử dụng Sequelize model để truy vấn các comment theo productId
        const comments = await models.Comments.findAll({
            where: {
                product_id: productId, // Điều kiện lấy comment theo product_id
            },
            // Các thuộc tính bạn muốn lấy từ bảng Comments, có thể chỉ định bằng thuộc tính attributes
            attributes: ['comment_id', 'user_id', 'comment_text', 'comment_date'],
        });

        // Trả về danh sách comment nếu có
        res.status(200).json({ status: succesCode, data: comments });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error fetching comments:", error);
        res.status(500).json({ status: errorCode, message: "Error fetching comments" });
    }
};


const getAllComments = async (req, res) => {
    try {
        // Sử dụng Sequelize model để truy vấn tất cả các comment
        const comments = await models.Comments.findAll({
            // Các thuộc tính bạn muốn lấy từ bảng Comments, có thể chỉ định bằng thuộc tính attributes
            attributes: ['comment_id', 'user_id', 'product_id', 'comment_text', 'comment_date'],
        });

        // Trả về danh sách comment nếu có
        res.status(200).json({ status: succesCode, data: comments });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error fetching comments:", error);
        res.status(500).json({ status: errorCode, message: "Error fetching comments" });
    }
};




const createComment = async (req, res) => {
    try {
        const { productId, userId, commentText } = req.body; // Lấy thông tin từ body request

        const newCommentId = uuidv4(); // Tạo một comment_id mới
        const newComment = await models.Comments.create({
          comment_id: newCommentId, // Sử dụng comment_id mới
          product_id: productId,
          user_id: userId,
          comment_text: commentText,
          comment_date: new Date(),
        });

        // Trả về thông tin của comment mới được tạo
        res.status(201).json({ status: succesCode, data: newComment });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error creating comment:", error);
        res.status(500).json({ status: errorCode, message: "Error creating comment" });
    }
};


// Export hàm API để sử dụng ở nơi khác trong ứng dụng của bạn
module.exports = { getListCommentByProductId, getAllComments, createComment };
