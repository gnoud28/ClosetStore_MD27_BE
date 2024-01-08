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


// const getListCategory = async (req, res) => {
//   try {
//     const category = await models.ProductCategory.findAll();


//     succesCode(res, category, "Lấy sản phẩm theo danh mục thành công!!!");
//   } catch (error) {
//     console.error("Sequelize error:", error);
//     errorCode(res, "Lỗi Backend");
//   }
// };
const getListCategory = async (req, res) => {
  try {
    // Find the category by name
    const category = await models.ProductCategory.findAll({
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
const createCategory = async (req, res) => {
  try {
    let { category_name, image_url, description } = req.body;
    let category = await models.ProductCategory.create({
      category_id: uuidv4(),
      category_name,
      image_url,
      description,
    });
    succesCode(res, category, "Tạo mới loại sản phẩm thành công")
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
const updateCategory = async (req, res) => {
  try {
    let { category_id, category_name, image_url, description } = req.body;
    let category = await models.ProductCategory.update({
      category_name,
      image_url,
      description,
    }, { where: { category_id } });
    succesCode(res, category, "Cập nhật loại sản phẩm thành công")
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
};
const deleteCategoryById = async (req, res) => {
  //   try {
  //     const { category_id } = req.params;

  //     // Kiểm tra xem có sản phẩm nào liên quan đến loại sản phẩm này không
  //     const productsCount = await models.Product.count({
  //       where: { category_id },
  //     });

  //     if (productsCount > 0) {
  //       return failCode(res, "Không thể xóa loại sản phẩm này vì có sản phẩm thuộc loại này.");
  //     }

  //     const deletedCategory = await models.ProductCategory.destroy({
  //       where: { category_id },
  //     });

  //     if (!deletedCategory) {
  //       return failCode(res, "Không tìm thấy danh mục để xóa.");
  //     }

  //     succesCode(res, null, "Xóa danh mục sản phẩm thành công");
  //   } catch (error) {
  //     console.error("Lỗi Sequelize:", error);
  //     errorCode(res, "Lỗi Backend");
  //   }
  // };

  try {
    const { category_id } = req.params;

    // Đếm số lượng sản phẩm thuộc loại sản phẩm này
    const productsCount = await models.Product.count({
      where: { category_id },
    });

    if (productsCount > 0) {
      return failCode(res, "Không thể xóa loại sản phẩm này vì có sản phẩm thuộc loại này.");
    }

    // Nếu không có sản phẩm nào, xóa loại sản phẩm
    const deletedCategory = await models.ProductCategory.destroy({
      where: { category_id },
    });



    succesCode(res, 1, "Xóa danh mục sản phẩm thành công");
  } catch (error) {
    console.error("Lỗi Sequelize:", error);
    errorCode(res, "Lỗi Backend");
  }
};




const delteteCate = async (req, res) => {
  try {
    const { category_id } = req.params;
    const productsInCategory = await models.Product.findAll({
      where: {
        category_id,
      },
    });

    if (productsInCategory.length > 0) {
      failCode(res, "Còn sản phẩm! Không thể xóa");
    } else {

      const category = await models.ProductCategory.destroy({
        where: {
          category_id,
        },
      });
      succesCode(res, category, "Xóa loại sản phẩm thành công!!!");
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = { getListProductByCategory, getListCategory, createCategory, updateCategory, getListProductByCategoryID, deleteCategoryById, delteteCate };
