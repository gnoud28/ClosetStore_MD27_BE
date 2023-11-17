const sequelize = require("../models/index");
const initModel = require("../models/init-models");
const { succesCode, errorCode, failCode } = require("../reponse/reponse");
const models = initModel(sequelize);
const { Op, where } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const checkEmailLogin = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra xem email có tồn tại trong bảng Users không
    const user = await models.Users.findOne({ where: { email } });

    if (!user) {
      // Nếu không tìm thấy email, thực hiện cập nhật status = 2
      const update = await models.Users.update(
        { status: 2 },
        { where: { email } }
      );
      const login = await models.Users.create({
        user_id: uuidv4(),
        email,
        status: 2,
      });
      return succesCode(
        res,
        login,
        "Đăng nhập lần đầu.Tạo tài khoản thành công"
      );
    }

    // Nếu tìm thấy email, thực hiện cập nhật status = 1
    const update = await models.Users.update(
      { status: 1 },
      { where: { email } }
    );

    return succesCode(res, user, "Đăng nhập thành công.");
  } catch (error) {
    return errorCode(res, "Lỗi Backend");
  }
};

const createUser = async (req, res) => {
  try {
    const { full_name, password, phone_number, email } = req.body;

    // Kiểm tra xem email hoặc số điện thoại đã tồn tại trong cơ sở dữ liệu chưa
    const existingEmailUser = await models.Users.findOne({ where: { email } });
    const existingPhoneUser = await models.Users.findOne({
      where: { phone_number },
    });

    if (existingEmailUser) {
      return failCode(res, "Email đã tồn tại trong hệ thống.");
    } else if (existingPhoneUser) {
      return failCode(res, "Số điện thoại đã tồn tại trong hệ thống.");
    } else {
      // Sử dụng bcrypt để băm mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10); // 10 là số vòng lặp để tạo salt

      // Tạo người dùng mới với mật khẩu đã băm
      const OTP = Math.floor(100000 + Math.random() * 900000); // Tạo mã 6 chữ số ngẫu nhiên
      const newUser = await models.Users.create({
        user_id: uuidv4(),
        full_name,
        password: hashedPassword,
        phone_number,
        email,
        status: 2, // Nếu status là 2, có thể là chưa xác minh OTP
        otp: OTP,
      });
      // Gửi OTP qua SMS sử dụng Twilio
      const accountSid = process.env.ACCOUNT_SID;
      const authToken = process.env.AUTH_TOKEN;
      const client = require("twilio")(accountSid, authToken);

      const message = await client.messages.create({
        body: `Mã OTP của bạn là: ${OTP}`,
        from: "+19382532160", // Thay YOUR_TWILIO_PHONE_NUMBER bằng số điện thoại Twilio của bạn
        to: phone_number, // Gửi OTP đến số điện thoại của người dùng mới đăng ký
      });

      console.log(
        `OTP sent to ${phone_number} successfully. SID: ${message.sid}`
      );

      res
        .status(201)
        .json({ user: newUser, message: "Người dùng đã được tạo thành công." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi Backend" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone_number, otp } = req.body;

    // Tìm người dùng dựa trên số điện thoại và mã OTP
    const user = await models.Users.findOne({
      where: { phone_number, otp: otp },
    });

    if (user) {
      // Nếu tìm thấy người dùng với số điện thoại và mã OTP đúng
      // Có thể cập nhật trạng thái của người dùng hoặc xác minh thành công ở đây
      // Ví dụ: user.update({ status: 1 }); // Cập nhật trạng thái thành đã xác minh
      // Hoặc trả về true nếu xác minh thành công
      return succesCode(res, user, "Mã OTP hợp lệ.");
    } else {
      // Nếu không tìm thấy hoặc mã OTP không khớp
      return failCode(res, "Mã OTP không hợp lệ.");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi Backend" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { phone_number } = req.body;

    // Tìm người dùng dựa trên số điện thoại
    const user = await models.Users.findOne({ where: { phone_number } });

    if (!user) {
      return failCode(res, "Số điện thoại không tồn tại trong hệ thống.");
    }

    // Tạo mã OTP ngẫu nhiên
    const OTP = Math.floor(100000 + Math.random() * 900000); // Tạo mã 6 chữ số ngẫu nhiên

    // Lưu trữ mã OTP trong cơ sở dữ liệu cho người dùng tương ứng
    await user.update({ otp: OTP });

    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    const message = await client.messages.create({
      body: `Mã OTP của bạn là: ${OTP}`,
      from: "+19382532160", // Thay YOUR_TWILIO_PHONE_NUMBER bằng số điện thoại Twilio của bạn
      to: phone_number, // Gửi OTP đến số điện thoại của người dùng mới đăng ký
    });

    return succesCode(res, {
      message: "Mã OTP đã được gửi đến số điện thoại của bạn.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Lỗi Backend" });
  }
};

const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { phone_number, otp, newPassword } = req.body;

    // Tìm người dùng dựa trên số điện thoại và mã OTP
    const user = await models.Users.findOne({
      where: { phone_number, otp: otp },
    });

    if (!user) {
      return failCode(res, "Mã OTP không hợp lệ hoặc đã hết hạn.");
    }

    // Xác minh thành công, cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword, otp: null }); // Xóa mã OTP sau khi xác minh thành công

    return succesCode(res, { message: "Mật khẩu của bạn đã được cập nhật." });
  } catch (error) {
    console.error("Error:", error);
    return errorCode(res, "Lỗi Backend");
  }
};




const loginUserEmailPasword = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Tìm người dùng dựa trên email
      const user = await models.Users.findOne({ where: { email } });
  
      if (!user) {
        return failCode(res, "Email không tồn tại trong hệ thống.");
      }
  
      // So sánh mật khẩu được nhập với mật khẩu đã lưu trong cơ sở dữ liệu
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return failCode(res, "Mật khẩu không chính xác.");
      }
  
      // Thực hiện việc đăng nhập thành công
      return succesCode(res, { message: "Đăng nhập thành công.", user });
    } catch (error) {
      console.error("Error:", error);
      return errorCode(res, "Lỗi Backend");
    }
  };
module.exports = {
  checkEmailLogin,
  createUser,
  verifyOTP,
  forgotPassword,
  verifyOTPAndResetPassword,
  loginUserEmailPasword
};
