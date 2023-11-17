const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

const getListCart = async (req, res) => {
  try {
    let { id } = req.params;

    let user = await models.Users.findOne({ where: { user_id: id } });

    if (!user) {
      return failCode(res, "Người dùng không tồn tại.");
    }

    let cart = await models.ShoppingCart.findAll({
      where: { user_id: id },
      include: [
        {
          model: models.Product,
          as: "product",
        },
      ],
    });

    if (!cart || cart.length === 0) {
      return failCode(res, "Không tìm thấy giỏ hàng cho người dùng này.");
    }

    let total = 0;

    // Tính toán tổng giá trị của giỏ hàng
    cart.forEach(item => {
      const productPrice = item.product.price; // Giá của sản phẩm
      const quantity = item.quantity; // Số lượng sản phẩm trong giỏ hàng
      const productTotal = productPrice * quantity; // Tổng giá trị của sản phẩm (số lượng * giá)
      total += productTotal; // Cộng dồn tổng giá trị của từng sản phẩm vào tổng giá trị của giỏ hàng
    });

    succesCode(res, { total ,cart}, "Tính giá trị của giỏ hàng thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};


const addToShoppingCart = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    // Find the user based on user_id
    const user = await models.Users.findOne({ where: { user_id: userId } });

    if (!user) {
      return failCode(res, "User not found.");
    }

    // Use the provided targetUserId or fallback to the authenticated userId
    const finalUserId = userId;

    // Check if the product exists
    const product = await models.Product.findByPk(productId);

    if (!product) {
      return failCode(res, "Không tìm thấy sản phẩm với ID đã cung cấp.");
    }

    // Check if the user already has the product in the shopping cart
    let shoppingCartItem = await models.ShoppingCart.findOne({
      where: { user_id: finalUserId, product_id: productId },
    });

    if (shoppingCartItem) {
      // If the product is already in the cart, update the quantity
      shoppingCartItem.quantity += parseInt(quantity);
      await shoppingCartItem.save();
    } else {
      // If the product is not in the cart, create a new cart item
      shoppingCartItem = await models.ShoppingCart.create({
        cart_id: uuidv4(),
        user_id: finalUserId,
        product_id: productId,
        quantity: parseInt(quantity),
        status: "order",
      });
    }
    const order = shoppingCartItem;
    succesCode(res, order, "Sản phẩm đã được thêm vào giỏ hàng thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const updateQuantityCart = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    const update = await models.ShoppingCart.update(
      { quantity },
      { where: { cart_id: id } }
    );
    const item = await models.ShoppingCart.findOne({
      where: { cart_id: id },
    });
    succesCode(res, item, "Cập nhật số lượng thành công!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const deleteItemCart = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await models.ShoppingCart.destroy({
      where: { cart_id: id },
    });
    succesCode(res, item, "Xóa sản phẩm thành công!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

module.exports = {
  addToShoppingCart,
  getListCart,
  updateQuantityCart,
  deleteItemCart,
};
