var express = require("express");
var router = express.Router();
var path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptoRandomString = require("crypto-random-string").default;
require("dotenv").config();

// 🔑 Middleware สำหรับตรวจสอบ JWT Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ดึง Token หลังคำว่า Bearer

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "ไม่มี Token แนบมา" });
  }

  jwt.verify(token, process.env.USER_ID_KEYJWT, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        isAuthenticated: false,
        message: "Token ไม่ถูกต้องหรือหมดอายุ",
      });
    }
    req.user = decoded; // เก็บข้อมูลผู้ใช้ที่Decodeแล้วไว้ใน req.user
    next();
  });
};

router.get("/check-auth-admin-service", verifyToken, async (req, res, next) => {
  try {
    const UserID = req.app.get("UserID");
    const UserIdAuth = await UserID.findOne({ _id: req.user.userId }).select(
      "role",
    );

    if (!UserIdAuth || UserIdAuth.role !== process.env.USER_ID_KEYADMIN) {
      return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึง" });
    }
    return res.status(200).json({ status: true, message: "เป็น Admin สำเร็จ" });
  } catch (err) {}
});

// 1. ตรวจสอบสิทธิ์ (Check Auth) ผ่าน JWT Token
router.get("/check-auth", verifyToken, async (req, res, next) => {
  try {
    const UserID = req.app.get("UserID");

    // ดึง userId จาก req.user ที่แกะได้จาก Middleware
    const user = await UserID.findById(req.user.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ isAuthenticated: false, message: "ไม่พบผู้ใช้งาน" });
    }

    return res.status(200).json({
      isAuthenticated: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
      error: error.message,
    });
  }
});

// 2. สมัครสมาชิก (Register) แล้วสร้าง Token ส่งกลับทันที (Auto-Login)
router.post("/user", async (req, res, next) => {
  const { usernameRegister, telRegister, passwordRegister } = req.body;
  const UserID = req.app.get("UserID");

  if (!usernameRegister || !telRegister || !passwordRegister) {
    return res.status(400).json({ message: "ยังใส่ข้อมูลไม่ครบ" });
  }

  const mobileRegex = /^0[689]\d{8}$/;
  if (!mobileRegex.test(telRegister)) {
    return res.status(400).json({ message: "เบอร์โทรศัพท์ไม่ถูกต้อง" });
  }

  try {
    const userNumber = await UserID.findOne(
      { tel: Number(telRegister) },
      "tel",
    );
    if (userNumber) {
      return res
        .status(409)
        .json({ message: "เบอร์โทรศัพท์นี้ถูกใช้งานไปแล้ว ลองเข้าสู่ระบบแทน" });
    }

    const hashedPassword = await bcrypt.hash(passwordRegister, 10);

    const newUser = new UserID({
      username: usernameRegister,
      password: hashedPassword,
      tel: telRegister,
    });
    await newUser.save();

    // สร้าง JWT Token
    const token = jwt.sign(
      { userId: newUser._id, tel: newUser.tel, role: newUser.role },
      process.env.USER_ID_KEYJWT,
      { expiresIn: "1d" }, // กำหนดหมดอายุใน 7 วัน
    );

    return res.status(200).json({
      success: true,
      token: token,
      redirectUrl: "/",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน", error: error.message });
  }
});

// 3. เข้าสู่ระบบ (Login)
router.post("/user/login", async (req, res, next) => {
  const { TelLogin, PasswordLogin } = req.body;
  const UserID = req.app.get("UserID");

  try {
    const user = await UserID.findOne({ tel: Number(TelLogin) });
    if (!user) {
      return res.status(404).json({ message: "ไม่พบเบอร์โทรศัพท์นี้ในระบบ" });
    }

    const isMatch = await bcrypt.compare(PasswordLogin, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { userId: user._id, tel: user.tel, role: user.role },
      process.env.USER_ID_KEYJWT,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      success: true,
      token: token,
      redirectUrl: "/",
    });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
      error: error.message,
    });
  }
});

// 4. Shop API (คงเดิม)
router.post("/shop", async (req, res) => {
  try {
    const Shoplist = req.app.get("Shoplist");
    const { nameShop_text, amount_1, price_1 } = req.body;

    const newShop = new Shoplist({
      nameShop_text,
      amount_1,
      price_1,
    });

    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/shopPreviews", async (req, res) => {
  try {
    const Shoplist = req.app.get("Shoplist");
    const items = await Shoplist.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/shopbuyID", verifyToken, async (req, res, next) => {
  try {
    const UserID = req.app.get("UserID");
    const Shoplist = req.app.get("Shoplist");
    const HistoryUser = req.app.get("HistoryUser");
    const UserIdBuy = await UserID.findOne({ _id: req.user.userId }).select(
      "_id point",
    );
    const itemBuyID = await Shoplist.findOne({ _id: req.body.idshoplist });
    if (itemBuyID.amount_1 == 0) {
      return res.status(400).json({ message: "ของหมด" });
    }
    if (UserIdBuy.point < itemBuyID.price_1) {
      return res.status(400).json({ message: "พอยไม่พอแลก" });
    }
    const pointBuy = Number(UserIdBuy.point) - Number(itemBuyID.price_1);

    const result = await UserID.updateOne(
      { _id: UserIdBuy._id }, // 1. เงื่อนไขในการค้นหา (Filter)
      { $set: { point: pointBuy } }, // 2. คำสั่งอัปเดตข้อมูล ($set)
    );
    const resulshop = await Shoplist.updateOne(
      { _id: req.body.idshoplist }, // 1. เงื่อนไขในการค้นหา (Filter)
      { $set: { amount_1: Number(itemBuyID.amount_1) - 1 } },
    );
    const description = itemBuyID.nameShop_text;

    const codeshop = cryptoRandomString({
      length: 6,
      type: "alphanumeric",
    }).toUpperCase();
    const historySave = await HistoryUser.create({
      user_id: UserIdBuy._id, // ObjectId ของ User
      type: "redeem", // "earn" หรือ "redeem"
      amount: -Number(itemBuyID.price_1),
      code: codeshop,
      description: description, // รายละเอียด เช่น "ได้รับแต้มจากการซื้อสินค้า"
    });

    console.log(result);

    console.log(req.body.idshoplist);
    console.log(itemBuyID);
    console.log(UserIdBuy);
    console.log(pointBuy);
    res.status(200).json({ message: "แลกพอยสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/useraddpointpost", async (req, res, next) => {
  const UserID = req.app.get("UserID");
  const HistoryUser = req.app.get("HistoryUser");
  try {
    const teluser = await UserID.findOne({ tel: req.body.tel }).select(
      "_id point",
    );
    if (!teluser) {
      return res.status(404).json({ message: "ไม่พบเบอร์โทรศัพท์นี้ในระบบ" });
    }
    const pointnum = Number(teluser.point) + Number(req.body.point);
    const updatePoint = await UserID.updateOne(
      { _id: teluser._id },
      { $set: { point: pointnum } },
    );
    const historySave = await HistoryUser.create({
      user_id: teluser._id, // ObjectId ของ User
      type: "earn", // "earn" หรือ "redeem"
      amount: Number(req.body.point), // จำนวนแต้ม (เช่น 100)
      description: "ได้รับพอย", // รายละเอียด เช่น "ได้รับแต้มจากการซื้อสินค้า"
    });
    res.status(200).json({ message: "ให้แต้มสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/history", verifyToken, async (req, res, next) => {
  const HistoryUser = req.app.get("HistoryUser");
  try {
    const UserHistory = await HistoryUser.find({
      user_id: req.user.userId,
    }).select("-user_id");
    res.status(200).json(UserHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/ChangShop", async (req, res, next) => {
  const Shoplist = req.app.get("Shoplist");
  const ID = req.body._id;
  const value = req.body.value;
  const price = req.body.price;
  console.log(req.body.value);
  if (!value && !price) {
    return res.status(400).json({ message: "ใส่ข้อมูลไม่ครบ" });
  }
  try {
    if (value) {
      const shop = await Shoplist.findOne({ _id: ID }).select("_id");
      const resulshop = await Shoplist.updateOne(
        { _id: shop._id }, // 1. เงื่อนไขในการค้นหา (Filter)
        { $set: { amount_1: value } },
      );
    }
    if (price) {
      const shop = await Shoplist.findOne({ _id: ID }).select("_id");
      const resulshopprice_1 = await Shoplist.updateOne(
        { _id: shop._id }, // 1. เงื่อนไขในการค้นหา (Filter)
        { $set: { price_1: price } },
      );
    }
    res.status(200).json({ message: "แก้ไขเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/redeemInfo", async (req, res, next) => {
  try {
    const HistoryUser = req.app.get("HistoryUser");
    const redeemList = await HistoryUser.find({ type: "redeem" }).select(
      "-user_id",
    );

    res.status(200).json(redeemList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/redeemInfo/confirm", async (req, res, next) => {
  try {
    const HistoryUser = req.app.get("HistoryUser");
    console.log(req.body.id)
    const confirmUpdate = await HistoryUser.updateOne(
        { _id: req.body.id }, // 1. เงื่อนไขในการค้นหา (Filter)
        { $set: { status:  'success'} },
      );
    res.status(200).json({ message: "ยืนยันสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
