const sequelize = require("../models/index");
const crypto = require("crypto");
const dayjs = require("dayjs");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

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
    cart.forEach((item) => {
      const productPrice = item.product.price; // Giá của sản phẩm
      const quantity = item.quantity; // Số lượng sản phẩm trong giỏ hàng
      const productTotal = productPrice * quantity; // Tổng giá trị của sản phẩm (số lượng * giá)
      total += productTotal; // Cộng dồn tổng giá trị của từng sản phẩm vào tổng giá trị của giỏ hàng
    });

    succesCode(res, { total, cart }, "Tính giá trị của giỏ hàng thành công!!!");
  } catch (error) {
    console.error("Sequelize error:", error);
    errorCode(res, "Lỗi Backend");
  }
};

const addToShoppingCart = async (req, res) => {
  try {
    const { productId, quantity, userId, size } = req.body;

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
        size,
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
    const { id, quantity, size } = req.body;

    const update = await models.ShoppingCart.update(
      { quantity, size },
      { where: { cart_id: id } }
    );
    const item = await models.ShoppingCart.findOne({
      where: { cart_id: id },
    });
    succesCode(res, item, "Cập nhật sản phẩm thành công!");
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

const createPayment = async(req, res) => {
  
  const cart = await models.ShoppingCart.findAll({where:{user_id:req.body.userid}, include: [
    {
      model: models.Product,
      as: "product",
    },
  ],})
  let total = req.body.total;

  // Tính toán tổng giá trị của giỏ hàng
 await cart.forEach((item) => {
    const productPrice = item.product?.price; // Giá của sản phẩm
    const quantity = item.quantity; // Số lượng sản phẩm trong giỏ hàng
    const productTotal = productPrice * quantity; // Tổng giá trị của sản phẩm (số lượng * giá)
 // Cộng dồn tổng giá trị của từng sản phẩm vào tổng giá trị của giỏ hàng
  });
 
const order = await models.Order.create({
  order_id: uuidv4(),
  user_id:req.body.userid,
  total_amount : Math.floor(parseFloat(total)),
  status:'success',
  order_date:moment()
})


const orderDetailsPromises = cart.map(async (cartItem) => {
  const orderDetail = await models.OrderDetails.create({
    order_detail_id:uuidv4(),
    order_id: order.order_id,
    product_id: cartItem.product.product_id, // Sản phẩm từ cartItem
    quantity: cartItem.quantity,
    // Các thuộc tính khác của OrderDetails có thể tùy biến dựa trên dữ liệu trong cartItem
  });
  return orderDetail;
});
await models.ShoppingCart.destroy({
  truncate: true, // Nếu set thành true, sẽ thực hiện TRUNCATE TABLE thay vì DELETE
})
  const  ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = "OETTSQZ7"; // Thay bằng VNP_TMN_CODE của bạn
  const secretKey = "IQUINFOSNJEMWQRIHWGZUJBJSVQNDNBZ"; // Thay bằng VNP_SECRET_KEY của bạn
  const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL của VNPay
  const returnUrl = "http://yourwebsite.com/payment_complete"; // URL trả về sau khi thanh toán

  const date = dayjs();

  const createDate = date.format("YYYYMMDDHHmmss");
  const orderId = date.format("DDHHmmss");
  const amount = Math.floor(parseFloat(total)); // Giả sử số tiền được gửi trong phần body của yêu cầu
  const orderInfo = "Thanh toán sản phẩm"; // Thông tin đơn hàng
  const orderType = "order"; // Loại đơn hàng
  let locale = req.body.language || "vn"; // Ngôn ngữ mặc định là tiếng Việt
  if (locale === null || locale === "") {
    locale = "vn";
  }
  const currCode = "VND"; // Mã tiền tệ

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: amount * 100, // Chuyển số tiền sang đơn vị của VNĐ, ở đây là cents
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // Sắp xếp các tham số theo thứ tự bảng chữ cái
  const orderedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});

  const queryString = new URLSearchParams(orderedParams).toString();

  const hmac = crypto.createHmac("sha512", secretKey);
  hmac.update(queryString, "utf8");
  const signed = hmac.digest("hex");
  const signedQueryString = `${queryString}&vnp_SecureHashType=SHA512&vnp_SecureHash=${signed}`;

  const paymentUrl = `${vnpUrl}?${signedQueryString}`;





  await Promise.all(cart.map(async (item) => {
    const productId = item.product.product_id; 
    const quantityBought = item.quantity; 
    
    
    const product = await models.Product.findByPk(productId);
    
  
    if (product && product.quantity >= quantityBought) {
      const updatedQuantity = product.quantity - quantityBought;
  console.log(updatedQuantity)
  console.log(item.product.product_id)
      await product.update({ quantity: updatedQuantity },{where:{product_id:item.product.product_id}});
    } else {
   
      console.log(`Không đủ số lượng sản phẩm để giảm cho sản phẩm có ID: ${productId}`);
  
    }
  }));
  res.send(paymentUrl); // Trả về URL thanh toán trong phản hồi
};



const historyOrder = async (req,res) =>{
  try {
    let {id} = req.params;
    let result = await models.Order.findAll({where:{user_id:id},include: [
      {
        model: models.OrderDetails,
        as: "OrderDetails",
        include: [
          {
            model: models.Product,
            as: "product",
          },
        ]
      },
    ],})
    return succesCode(res,result,"Lấy thành công danh sách lịch sử thanh toán")
  } catch (error) {
    errorCode(res, "Lỗi Backend");
  }
}
module.exports = {
  addToShoppingCart,
  getListCart,
  updateQuantityCart,
  deleteItemCart,
  createPayment,
  historyOrder
};
