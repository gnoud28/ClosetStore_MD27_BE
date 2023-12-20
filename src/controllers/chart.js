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
      },
      raw: true, // Đảm bảo kết quả trả về là dạng object thô từ database, không được parse thành các instance model Sequelize
    });

    // Chuyển đổi chuỗi số thành số
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


// Import các thư viện và model cần thiết

// const getTotalSalesAndRevenue = async (req, res) => {
//   const { startDate, endDate } = req.body; // Nhận ngày bắt đầu và ngày kết thúc từ người dùng

//   try {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setDate(end.getDate() + 1); // Để bao gồm cả ngày kết thúc

//     const ordersWithinRange = await models.Order.findAll({
//       attributes: [
//         [fn("SUM", col("total_amount")), "totalRevenue"],
//         [fn("SUM", col("OrderProducts.quantity")), "totalQuantitySold"],
//       ],
//       include: [
//         {
//           model: models.OrderProduct,
//           attributes: [],
//         },
//       ],
//       where: {
//         order_date: {
//           [Op.between]: [start, end],
//         },
//       },
//       raw: true,
//     });
//     const totalRevenue = ordersWithinRange.length > 0 ? ordersWithinRange[0].totalRevenue : 0;
//     const totalQuantitySold = ordersWithinRange.length > 0 ? ordersWithinRange[0].totalQuantitySold : 0;

//     return succesCode(
//       res,
//       { totalRevenue, totalQuantitySold },
//       `Tổng doanh thu và tổng số lượng sản phẩm đã bán từ ${startDate} đến ${endDate}`
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return errorCode(res, "Lỗi Backend");
//   }
// };

module.exports = { getOrderCountAndTotalWithinMonth};

