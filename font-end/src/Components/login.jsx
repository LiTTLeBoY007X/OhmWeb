import { useState } from "react";
import axios from "axios";
import callChatIcon from "../assets/call-chat-svgrepo-com.svg";
import keySquareIcon from "../assets/key-square-svgrepo-com.svg";
import logoWeb from "../assets/77DB8929-B1F3-4A50-AC08-1A763457A2B2.png";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import Swal from "sweetalert2";

function UserLogin() {
  const [TelLogin, setTelLogin] = useState("");
  const [Password, setPassword] = useState("");

  const SubmitButton = async (e) => {
    e.preventDefault();
    if (TelLogin.length !== 10) {
      alert("กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก");
      return;
    }
    try {
      // 1. ยิง API Login โดยไม่ต้องใส่ withCredentials แล้ว
      const response = await axios.post(`${API_URL}/user/login`, {
        TelLogin: TelLogin,
        PasswordLogin: Password,
      });

      // 2. ถ้ามี Token ส่งกลับมา ให้บันทึกลง localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.href = response.data.redirectUrl || "/";
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        const err = error.response?.data?.message;

        Swal.fire({
          icon: "error",
          title: "แจ้งเตือน",
          text: err,
          confirmButtonText: "ตกลง",
        });
      } else {
        console.error("ไม่สามารถเชื่อมต่อ Server ได้");
      }
    }
  };


  return (
    <div className="Register-Container flex min-h-screen flex-col items-center justify-center gap-4 px-5 py-8">
      <img className="max-h-[25vh] max-w-[260px] object-contain" src={logoWeb} alt="Logo" />
      <div className="w-full max-w-[420px] rounded-[2rem] border border-white/80 bg-white/85 p-7 text-center shadow-[0_24px_80px_-45px_rgba(18,70,47,0.45)] backdrop-blur-xl sm:p-9">
        <p className="mb-1 text-sm font-medium text-emerald-800/60">ยินดีต้อนรับกลับ</p>
        <h1 className="mb-7 text-3xl font-semibold tracking-tight text-[#174b37]">เข้าสู่ระบบ</h1>
        <form
          className="Register-form border-b-[0.5px] flex-initial flex-col items-center w-full"
          onSubmit={SubmitButton}>
          <div className="PhoneNumber-Form-Input-Container shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start">
            <img src={callChatIcon} className="w-11 rounded-xl bg-[#e4f4e8] p-2" alt="Phone Icon" />
            <input
              className="w-full bg-transparent p-3 outline-none"
              type="tel"
              placeholder="เบอร์โทร"
              value={TelLogin}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
                setTelLogin(onlyNums);
              }}
              maxLength={10}
              inputMode="numeric"
            />
          </div>
          <div className="PassWord-Form-Input-Container shadow-[0px_0px_20px_-14px_#000000] mb-3 rounded-xl flex justify-start">
            <img src={keySquareIcon} className="w-11 rounded-xl bg-[#e4f4e8] p-2" alt="Key Icon" />
            <input
              className="w-full bg-transparent p-3 outline-none"
              type="password"
              value={Password}
              placeholder="รหัสผ่าน"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="Button-Form-Input-Container mb-3 flex justify-start rounded-xl bg-[#174b37] shadow-sm transition hover:bg-[#226447]">
            <input
              className="w-full cursor-pointer p-3 text-center font-medium text-white outline-none"
              type="submit"
              value="เข้าสู่ระบบ"
            />
          </div>
        </form>
        <div className="login-link">
          <a href="/register" className="font-medium text-emerald-800 hover:text-emerald-600">
            สมัครบัญชี
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
