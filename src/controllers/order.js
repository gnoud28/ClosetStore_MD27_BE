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
      });
      return succesCode(res,result,"Lấy thành công danh sách lịch sử thanh toán")
    } catch (error) {
      errorCode(res, "Lỗi Backend");
    }
  }

  module.exports = {getListOrder}