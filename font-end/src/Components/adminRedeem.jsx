import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { useNavigate } from "react-router-dom";
import AdminNav from "./adminNavbar";

function Redeem() {
  const [Redeemlist, setRedeemlist] = useState([]);
  const [confirmRedeemlist, setconfirmRedeemlist] = useState();
  const navigate = useNavigate();
  const isCalled = useRef(false); // 👈 1. สร้างตัวแปรเช็กสถานะ
  async function AutnAdmin() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/check-auth-admin-service`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.message);
    } catch (error) {
      const message = error.response?.data?.message || "ไม่มีสิทธิ์เข้าถึง";
      console.log(error.response?.data?.message);
      Swal.fire({
        icon: "error",
        title: "แจ้งเตือน",
        text: message,
        confirmButtonText: "ตกลง",
      }).then(() => {
        navigate("/", { replace: true }); // เปลี่ยนหน้าหลังจากผู้ใช้กดปุ่มตกลงแล้วเท่านั้น
      });
    }
  }
  useEffect(() => {
    if (isCalled.current) return; // 👈 2. ถ้าเคยยิงไปแล้ว ให้ข้ามทันที
    isCalled.current = true; // 👈 3. ล็อคว่ายิงไปแล้ว
    AutnAdmin();
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/redeemInfo`)
      .then((res) => {
        setRedeemlist(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  console.log(Redeemlist);

  async function Clicksuccess(Id) {
    axios
      .post(`${API_URL}/redeemInfo/confirm`, {
        id: Id
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "แจ้งเตือน",
          text: res.data.message,
          confirmButtonText: "ตกลง",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          } // เปลี่ยนหน้าหลังจากผู้ใช้กดปุ่มตกลงแล้วเท่านั้น
        });
      })
      .catch((err) => {
        const message = err.response?.data?.message 
        Swal.fire({
          icon: "error",
          title: "แจ้งเตือน",
          text: message,
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload(); // เปลี่ยนหน้าหลังจากผู้ใช้กดปุ่มตกลงแล้วเท่านั้น
        });
      });
    console.log(Redeemlist);
  }

  return (
    <div className="flex justify-center items-center flex-col gap-[10px] w-dvw mt-[20px] mb-[60px]">
      {Redeemlist.map((item) => (
        <div
          key={item._id}
          className="bg-white p-[20px] rounded-xl flex justify-center flex-col items-center gap-[5px]"
        >
          <span className="text-center">{item.description}</span>
          <span>รหัสแลก: {item.code}</span>
          <div>
            <span className="text-center">สถานะ</span>
            <span
              className={`${item.status === "pending" ? "text-red-500" : "text-green-400"} text-center`}
            >
              {" "}
              {item.status === "pending" ? "ยังไม่สำเร็จ" : "สำเร็จ"}
            </span>
          </div>

          <button
            disabled={item.status === "success"}
            className={`${item.status === "pending" ? "bg-green-400" : "bg-gray-300 cursor-not-allowed"} text-center p-[5px] rounded-md`}
            onClick={() => {
              Clicksuccess(item._id);
            }}
          >
            ยืนยัน
          </button>
        </div>
      ))}
      <AdminNav />
    </div>
  );
}

export default Redeem;
