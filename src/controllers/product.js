const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const getListAllProducts = async (req, res) => {
  try {
    const products = await models.Product.findAll({
      include: ["category","Product_Sizes"],
    });

    succesCode(res, products, `Lấy danh sách products thành công!!!`);
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};

const getListBannerProducts = async (req, res) => {
  try {
    const banner = await models.Product.findAll({
      order: [["creation_date", "DESC"]], // Order by creation_date in descending order
      limit: 3, // Limit the result to 3 records
      include: ["category"],
    });

    succesCode(res, banner, `Lấy danh sách 3 sản phẩm mới nhất thành công!!!`);
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
const searchProducts = async (req, res) => {
  try {
    const { startDate, endDate, minPrice, maxPrice } = req.query;

    // Build the dynamic conditions for the query
    const conditions = {};

    if (startDate && endDate) {
      conditions.creation_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    if (minPrice && maxPrice) {
      conditions.price = {
        [Op.between]: [parseInt(minPrice), parseInt(maxPrice)],
      };
    }

    const products = await models.Product.findAll({
      where: conditions,
      include: ["category"],
    });

    succesCode(res, products, "Tìm kiếm sản phẩm thành công!!!");
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};

const searchProductsByName = async (req, res) => {
  try {
    const { name } = req.params;

    // Decode the URL-encoded parameter
    const decodedName = decodeURIComponent(name);

    // Build the dynamic conditions for the query
    const conditions = {};

    if (decodedName) {
      conditions.product_name = {
        [Op.like]: `%${decodedName}%`, // Case-insensitive search for product name
      };
    }

    const products = await models.Product.findAll({
      where: conditions,
      include: ["category"],
    });

    succesCode(res, products, "Tìm kiếm sản phẩm theo tên thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await models.Product.findOne({
      where: { product_id: productId }, // Adjust this line based on your actual column name
      include: ["category"],
    });

    if (product) {
      succesCode(res, product, "Lấy thông tin sản phẩm theo ID thành công!!!");
    } else {
      failCode(res, "Không tìm thấy sản phẩm với ID đã cung cấp.");
    }
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const createProduct = async (req, res) => {
  try {
    let {
      product_name,
      price,
      category_id,
      description,
      image_url,
      creation_date,
      sizes, // Thêm thông tin về kích thước từ request body
      quantity,
    } = req.body;

    let product = await models.Product.create({
      product_id: uuidv4(),
      product_name,
      price,
      category_id,
      description,
      image_url,
      creation_date,
      quantity,
    });
console.log(sizes)
    // Kiểm tra nếu có thông tin về kích thước (sizes) trong request body
    if (sizes && sizes.length > 0) {
      // Tạo các bản ghi về kích thước trong Product_Sizes
      const productSizes = sizes.map((size) => ({
        product_id: product.product_id,
        size_name: size.size_name,
      }));

      // Thêm thông tin về kích thước vào bảng Product_Sizes
      await models.Product_Sizes.bulkCreate(productSizes);
    }

    succesCode(res, product, "Tạo mới sản phẩm và kích thước thành công");
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
const updateProduct = async (req, res) => {
  try {
    let {
      product_id,
      product_name,
      price,
      category_id,
      description,
      image_url,
      creation_date,
      quantity
    } = req.body;
    let product = await models.Product.update(
      {
        product_name,
        price,
        category_id,
        description,
        image_url,
        creation_date,
        quantity
      },
      { where: { product_id } }
    );

    succesCode(res, product, "Cập nhật sản phẩm thành công");
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
const deleteProduct = async (req, res) => {
  try {
    let { id } = req.params;

    // Delete from the 'size' table
    await models.Product_Sizes.destroy({ where: { product_id: id } });

    // Delete from the 'product' table
    let deletedProduct = await models.Product.destroy({ where: { product_id: id } });

    if (deletedProduct) {
      succesCode(res, deletedProduct, "Xóa sản phẩm thành công");
    } else {
      errorCode(res, "Không tìm thấy sản phẩm để xóa");
    }
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
module.exports = {
  getListAllProducts,
  getListBannerProducts,
  searchProducts,
  searchProductsByName,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
