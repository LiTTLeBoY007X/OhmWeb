const mongoose = require("mongoose");
const point_transactionsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    // ประเภทรายการ เช่น "earn" (รับแต้ม) หรือ "redeem" (แลกแต้ม)
    type: {
      type: String,
      enum: ["earn", "redeem"],
      required: true,
    },

    // จำนวนแต้มที่ได้รับหรือถูกหัก (ควรเป็น Number ไม่ใช่ String)
    amount: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      default: ""
    },
    status:{
      type: String,
      default: "pending"
    },
    // รายละเอียดเพิ่มเติม
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // ช่วยสร้าง createdAt และ updatedAt ให้โดยอัตโนมัติ
  },
);

module.exports = point_transactionsSchema;
