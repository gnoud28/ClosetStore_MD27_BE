const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op, where } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const getListProductByCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Find the category by name
    const category = await models.ProductCategory.findAll({
      where: { category_name: categoryName },
      include: {
        model: models.Product,
        as: "Products", // Assuming you have defined the association as 'products'
      },
    });

    if (!category) {
      return failCode(res, "Không tìm thấy danh mục với tên đã cung cấp.");
    }

    succesCode(res, category, "Lấy sản phẩm theo danh mục thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const getListProductByCategoryID = async (req, res) => {
  try {
    const { category_id } = req.params;

    // Find the category by name
    const category = await models.Product.findAll({
      where: { category_id },
      // include: {
      //   model: models.Product,
      //   as: "Products", // Assuming you have defined the association as 'products'
      // },
    });

    if (!category) {
      return failCode(res, "Không tìm thấy danh mục với tên đã cung cấp.");
    }

    succesCode(res, category, "Lấy sản phẩm theo danh mục thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};


const getListCategory = async (req, res) => {
  try {
    // Find the category by name
    const category = await models.ProductCategory.findAll({});

    if (!category) {
      return failCode(res, "Không tìm thấy danh mục với tên đã cung cấp.");
    }

    succesCode(res, category, "Lấy danh mục thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const createCategory = async (req, res) => {
  try {
    let { category_name, image_url, description } = req.body;
    let category = await models.ProductCategory.create({
      category_id:uuidv4(),
      category_name,
      image_url,
      description,
    });
    succesCode(res,category, "Tạo mới loại sản phẩm thành công")
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
const updateCategory = async (req, res) => {
  try {
    let {category_id ,category_name, image_url, description } = req.body;
    let category = await models.ProductCategory.update({
      category_name,
      image_url,
      description,
    },{where:{category_id}});
    succesCode(res,category, "Cập nhật loại sản phẩm thành công")
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
module.exports = { getListProductByCategory, getListCategory,createCategory ,updateCategory , getListProductByCategoryID};
