import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./navbar";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function MenuScore() {
  const [Userdata, setUserdata] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. ดึง Token จาก localStorage
      const token = localStorage.getItem("token");

      // ถ้าไม่มี Token ในเครื่อง ให้เด้งไปหน้าสมัครสมาชิกทันที
      if (!token) {
        window.location.href = "/register";
        return;
      }

      try {
        // 2. ส่ง Request โดยแนบ JWT Token ไปทาง Header 'Authorization'
        const response = await axios.get(`${API_URL}/check-auth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.isAuthenticated) {
          setUserdata(response.data.user); // เก็บข้อมูลผู้ใช้ไว้แสดงผล
        }
      } catch {
        // ถ้า Token ไม่ถูกต้อง หมดอายุ หรือมี Error ให้ลบ Token ทิ้งแล้วเด้งกลับหน้า register
        localStorage.removeItem("token");
        window.location.href = "/register";
      }
    };

    checkAuth();
  }, []);
  const handleLogout = () => {
    // 1. ลบ Token ออกจากเครื่อง
    localStorage.removeItem("token");

    // 2. ส่งกลับไปหน้า Login
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <div>
          <p className="text-sm font-medium text-emerald-800/65">ยินดีต้อนรับ</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{Userdata?.username || "สมาชิก"}</h1>
        </div>
        <button className="rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-white" onClick={handleLogout}>ออกจากระบบ</button>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-5 px-5 sm:px-8 md:grid-cols-[1.4fr_0.8fr]">
        <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[2rem] bg-[#174b37] p-7 text-white shadow-[0_24px_60px_-30px_rgba(17,72,49,0.7)] sm:min-h-[350px] sm:p-10">
          <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 right-16 h-64 w-64 rounded-full bg-emerald-300/10 blur-2xl" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm text-emerald-50">บัญชีสมาชิก</span>
            <p className="mt-8 text-sm text-emerald-50/75">แต้มสะสมของคุณ</p>
          </div>
          <div className="relative flex items-end gap-3">
            <span className="text-6xl font-semibold leading-none tracking-tight sm:text-8xl">{(Userdata?.point || 0).toLocaleString()}</span>
            <span className="pb-2 text-lg text-emerald-50/75">แต้ม</span>
          </div>
          <div className="relative flex items-center gap-2 text-sm text-emerald-50/70">
            <span className="h-2 w-2 rounded-full bg-lime-300" />
            ใช้แต้มแลกสินค้าในร้านได้เลย
          </div>
        </section>

        <section className="flex flex-col justify-between rounded-[2rem] border border-emerald-900/5 bg-white/75 p-6 shadow-[0_18px_50px_-40px_rgba(20,60,40,0.45)] sm:p-8">
          <div>
            <p className="text-sm font-medium text-emerald-700">เริ่มต้นใช้งาน</p>
            <h2 className="mt-2 text-2xl font-semibold">แต้มพร้อม ของรอแลก</h2>
            <p className="mt-2 leading-7 text-emerald-950/60">เลือกดูสินค้า ใช้แต้มแลก และตรวจสอบรายการย้อนหลังได้จากเมนูด้านล่าง</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <a href="/shop" className="rounded-2xl bg-[#dff4e4] p-4 text-center font-semibold text-[#174b37] transition hover:bg-[#cbedcf]">เลือกสินค้า <span className="ml-1">↗</span></a>
            <a href="/history" className="rounded-2xl bg-[#f2f5ed] p-4 text-center font-semibold text-[#174b37] transition hover:bg-[#e6eddf]">ดูประวัติ <span className="ml-1">↗</span></a>
          </div>
        </section>
      </main>
      <NavBar />
    </div>
  );
}

export default MenuScore;
