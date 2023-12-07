const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op, where } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const getAllBanners = async (req, res) => {
  try {
    const banners =  await models.Banner.findAll()
    succesCode(res, banners, "Lấy danh sách banner thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const createBanner = async (req, res) => {
  try {
    const {  image_url } = req.body;
    const banner = await models.Banner.create({
      banner_id: uuidv4(),
      image_url,
    });
    succesCode(res, banner, "Tạo mới banner thành công");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const updateBanner = async (req, res) => {
  try {
    const { banner_id, image_url} = req.body;
    const updatedBanner = await models.Banner.update(
      {
        image_url,
      },
      { where: { banner_id } }
    );
   
    succesCode(res, updatedBanner, "Cập nhật banner thành công");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};



const deleteBanner = async (req, res) => {
    try {
      const { banner_id } = req.params;
      const deletedRows = await models.Banner.destroy({
        where: { banner_id }
      });
      if (deletedRows > 0) {
        succesCode(res, { banner_id }, "Xóa banner thành công");
      } else {
        failCode(res, "Không tìm thấy hoặc xóa banner thất bại");
      }
    } catch (error) {
      console.error("Sequelize error:", error);
      errorCode(res, "Lỗi Backend");
    }
  };

module.exports = { getAllBanners, createBanner, updateBanner, deleteBanner };
