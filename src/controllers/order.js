const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");



const getListOrder = async (req,res) =>{
    try {
      let result = await models.Order.findAll({
        include: [
          {
            model: models.Users,
            as: "user",
          },
          {
            model: models.OrderDetails,
            as: "OrderDetails",
            include: [
              {
                model: models.Product,
                as: "product",
              },
            ],
          },
        ],
        order: [['order_date', 'DESC']], 
      });
      return succesCode(res,result,"Lấy thành công danh sách lịch sử thanh toán")
    } catch (error) {
      errorCode(res, "Lỗi Backend");
    }
  }

  const updateOrder = async (req, res) => {
    try {
      const { order_id, status } = req.body; // Lấy order_id từ request body
      const updatedOrder = await models.Order.update({ status }, { where: { order_id } });
      if (updatedOrder[0] === 0) {
        return failCode(res, "Không tìm thấy đơn hàng"); // Kiểm tra xem có đơn hàng nào được cập nhật không
      }
      succesCode(res, updatedOrder, "Cập nhật thành công");
    } catch (error) {
      errorCode(res, "Lỗi Backend");
    }
  };
  

  module.exports = {getListOrder, updateOrder}