const sequelize = require("../models/index");
const crypto = require("crypto");
const dayjs = require("dayjs");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

const getListNoti = async (req, res) => {
  try {
    // Retrieve the latest notification based on creation time
    let latestNoti = await models.Notification.findOne({
      order: [["create_time", "DESC"]], // Order by creation time in descending order
      include: ["user"], // Assuming the association is named User
    });

    if (!latestNoti) {
      return failCode(res, "Không có thông báo nào.");
    }

    succesCode(res, latestNoti, "Lấy thông báo mới nhất thành công!!!");

    // Schedule deletion of the latest notification after 5 seconds
    setTimeout(async () => {
      try {
        await latestNoti.destroy();
        console.log("Latest notification deleted after 5 seconds.");

      } catch (deleteError) {
        console.error("Error deleting notification:", deleteError);
      }
    }, 5000); // 5000 milliseconds = 5 seconds
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};


const createNotification = async (req, res) => {
  try {
    let { userId, message } = req.body;
    const newNotification = await models.Notification.create({
      notification_id: uuidv4(),
      user_id: userId,
      message: message,
      create_time: new Date(), // Assuming the current timestamp for creation
    });
    succesCode(res, newNotification, "Tạo thông báo thành công!!!");
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

module.exports = { getListNoti ,createNotification};
