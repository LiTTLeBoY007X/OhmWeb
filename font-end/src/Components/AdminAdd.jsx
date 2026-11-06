import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { useNavigate } from "react-router-dom";
import AdminNav from "./adminNavbar";

function AddPoint() {
  const [TelAdd, setTelAdd] = useState();
  const [Point, setPoing] = useState();

  const navigate = useNavigate();
  const AutnAdmin = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    AutnAdmin();
  }, [AutnAdmin]);

  async function Addpointuser() {
    try {
      const res = await axios.post(`${API_URL}/useraddpointpost`, {
        tel: TelAdd,
        point: Point,
      });
      console.log(res.data.message);
      alert(res.data.message);
      window.location.reload();
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
    <div className="min-h-screen pb-28">
      <header className="mx-auto max-w-xl px-5 pb-5 pt-10 sm:px-8 sm:pt-14">
        <p className="text-sm font-medium tracking-wide text-emerald-800/60">สมาชิกคนพิเศษ</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">เพิ่มแต้มให้สมาชิก</h1>
      </header>
      <main className="mx-auto max-w-xl px-5 sm:px-8">
      <div className="rounded-[1.75rem] border border-emerald-950/5 bg-white/85 p-6 shadow-[0_18px_50px_-42px_rgba(20,60,40,0.5)] sm:p-8">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
            เบอร์โทรศัพท์ผู้รับแต้ม
          <input
            className="w-full rounded-xl border border-emerald-950/10 bg-[#f8faf6] px-4 py-3 outline-none transition focus:border-emerald-700"
            type="tel"
            placeholder="เบอร์โทรศัพท์"
            onChange={(e) => {
              setTelAdd(e.target.value);
            }}
          />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
            จำนวนแต้ม
          <input
            className="w-full rounded-xl border border-emerald-950/10 bg-[#f8faf6] px-4 py-3 outline-none transition focus:border-emerald-700"
            type="number"
            min="1"
            placeholder="กรอกจำนวนแต้ม"
            onChange={(e) => {
              setPoing(e.target.value);
            }}
          />
          </label>
          <button
            className="mt-2 w-full rounded-xl bg-[#174b37] px-4 py-3 font-medium text-white transition hover:bg-[#226447]"
            type="button"
            onClick={() => {
              Addpointuser();
            }}
          >เพิ่มแต้ม</button>
        </div>
      </div>
      </main>
      <AdminNav />
    </div>
  );
}

export default AddPoint;
