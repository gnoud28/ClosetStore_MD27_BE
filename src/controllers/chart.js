const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const { Op, fn, col, literal } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { succesCode, errorCode } = require("../reponse/reponse");

const models = initModels(sequelize);

const getOrderCountAndTotalWithinMonth = async (req, res) => {
  let { year, month } = req.params;
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const ordersWithinMonth = await models.Order.findAll({
      attributes: [
        [fn("COUNT", literal("*")), "orderCount"],
        [fn("COALESCE", fn("SUM", col("total_amount")), 0), "totalAmount"],
      ],
      where: {
        order_date: {
          [Op.between]: [startDate, endDate],
        },
        status: 'Giao Hàng Thành Công', // Thêm điều kiện cho trạng thái ở đây
      },
      raw: true,
    });

    ordersWithinMonth.forEach((order) => {
      order.totalAmount = Number(order.totalAmount);
    });

    return succesCode(
      res,
      ordersWithinMonth,
      "Lấy tổng order trong tháng thành công"
    );
  } catch (error) {
    console.error("Error:", error);
    return errorCode(res, "Lỗi Backend");
  }
};


const getSuccessfulOrdersWithinDateRange = async (req, res) => {
  let { startDate, endDate } = req.query; // Ngày bắt đầu và ngày kết thúc từ query params
  try {
    const successfulOrders = await models.Order.findAll({
      attributes: [
        [fn("COUNT", literal("*")), "orderCount"],
        [fn("COALESCE", fn("SUM", col("total_amount")), 0), "totalAmount"],
      ],
      where: {
        order_date: {
          [Op.between]: [startDate, endDate],
        },
        status: 'Giao Hàng Thành Công', // Lọc theo trạng thái đã giao hàng thành công
      },
      raw: true,
    });

    successfulOrders.forEach((order) => {
      order.totalAmount = Number(order.totalAmount);
    });

    return succesCode(
      res,
      successfulOrders,
      "Lấy tổng order trong khoảng ngày thành công"
    );
  } catch (error) {
    console.error("Error:", error);
    return errorCode(res, "Lỗi Backend");
  }
};

module.exports = { getSuccessfulOrdersWithinDateRange,getOrderCountAndTotalWithinMonth };

