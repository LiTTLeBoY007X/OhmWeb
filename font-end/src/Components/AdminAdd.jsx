import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { useNavigate } from "react-router-dom";
import AdminNav from "./adminNavbar";

function AddPoint() {
  const [TelAdd, setTelAdd] = useState();
  const [Point, setPoing] = useState();

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

  async function Addpointuser() {
    try {
      const res = await axios.post(`${API_URL}/useraddpointpost`, {
        tel: TelAdd,
        point: Point,
      });
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
    } catch (error) {
      const err = error.response?.data?.message;

      Swal.fire({
        icon: "error",
        title: "แจ้งเตือน",
        text: err,
        confirmButtonText: "ตกลง",
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-dvh ">
      <div className="bg-white flex items-center flex-col justify-center w-[300px] rounded-2xl p-[20px]">
        <div className="flex items-center flex-col justify-center gap-[20px]">
          <h1 className="">เบอร์ที่จะให้แต้ม</h1>
          <input
            className="w-[90%] h-[30px] border-[0.1px] rounded-xl focus:outline-none pl-[10px]"
            type="tel"
            placeholder="เบอร์โทร"
            onChange={(e) => {
              setTelAdd(e.target.value);
            }}
          />
          <h1 className="">แต้มที่จะให้</h1>
          <input
            className="w-[90%] h-[30px] border-[0.1px] rounded-xl focus:outline-none pl-[10px]"
            type="number"
            placeholder="แต้มที่จะให้"
            onChange={(e) => {
              setPoing(e.target.value);
            }}
          />
          <input
            className=" bg-green-400 w-[100px] h-[40px] rounded-2xl"
            type="submit"
            value="ให้พอย"
            onClick={() => {
              Addpointuser();
            }}
          />
        </div>
      </div>
      <AdminNav />
    </div>
  );
}

export default AddPoint;
