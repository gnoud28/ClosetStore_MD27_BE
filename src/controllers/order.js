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

  // const getOrdersByStatus = async (req, res) => {
  //   try {
  //     const { status } = req.params; // Lấy trạng thái từ URL parameter
  
  //     // Gọi hàm xử lý lấy danh sách đơn hàng theo trạng thái từ model
  //     const orders = await models.Order.findAll({
  //       where: { status }, // Lọc theo trạng thái
  //       include: [
  //         // Các phần include tương tự như trước
  //       ],
  //       order: [['order_date', 'DESC']],
  //     });
  
  //     // Trả về danh sách đơn hàng theo trạng thái
  //     return succesCode(res, orders, `Danh sách đơn hàng có trạng thái ${status}`);
  //   } catch (error) {
  //     errorCode(res, 'Lỗi Backend');
  //   }
  // };
  const getOrdersByStatus = async (req, res) => {
    try {
      const { status } = req.params; // Lấy trạng thái từ URL parameter
  
      // Gọi hàm xử lý lấy danh sách đơn hàng theo trạng thái từ model
      const orders = await models.Order.findAll({
        where: { status }, // Lọc theo trạng thái
        include: [
          // Các phần include tương tự như trước
        ],
        order: [['order_date', 'DESC']],
      });
  
      // Kiểm tra xem danh sách có rỗng không
      if (orders.length === 0) {
        // Nếu không có đơn hàng, trả về thông báo không có đơn hàng
        return errorCode(res, `Không có đơn hàng có trạng thái ${status}`);
      }
  
      // Trả về danh sách đơn hàng theo trạng thái
      return succesCode(res, orders, `Danh sách đơn hàng có trạng thái ${status}`);
    } catch (error) {
      // Xử lý lỗi và trả về thông báo lỗi
      errorCode(res, 'Lỗi Backend');
    }
  };
  
  

  module.exports = {getListOrder, updateOrder,getOrdersByStatus}