import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import { useNavigate } from "react-router-dom";
import AdminNav from "./adminNavbar";

function Redeem() {
  const [Redeemlist, setRedeemlist] = useState([]);
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
    <div className="min-h-screen pb-28">
      <header className="mx-auto max-w-5xl px-5 pb-5 pt-10 sm:px-8 sm:pt-14">
        <p className="text-sm font-medium tracking-wide text-emerald-800/60">ตรวจสอบรายการของสมาชิก</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">รายการแลกสินค้า</h1>
      </header>
      <main className="mx-auto grid max-w-5xl gap-4 px-5 pb-8 sm:px-8 md:grid-cols-2">
      {Redeemlist.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-emerald-900/15 bg-white/55 px-6 py-16 text-center text-emerald-950/55">ยังไม่มีรายการแลกสินค้า</div>}
      {Redeemlist.map((item) => (
        <article key={item._id} className="rounded-[1.75rem] border border-emerald-950/5 bg-white/85 p-5 shadow-[0_18px_50px_-42px_rgba(20,60,40,0.5)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-emerald-950">{item.description}</h2>
              <p className="mt-1 text-sm text-emerald-950/55">รหัสแลกสินค้า: <span className="font-semibold tracking-wider text-emerald-900">{item.code}</span></p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${item.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              {item.status === "pending" ? "รอดำเนินการ" : "ดำเนินการแล้ว"}
            </span>
          </div>
          <button
            disabled={item.status === "success"}
            className="mt-5 w-full rounded-xl bg-[#174b37] px-4 py-3 font-medium text-white transition hover:bg-[#226447] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            onClick={() => Clicksuccess(item._id)}
          >
            {item.status === "success" ? "ส่งมอบแล้ว" : "ยืนยันการส่งมอบ"}
          </button>
        </article>
      ))}
      </main>
      <AdminNav />
    </div>
  );
}

export default Redeem;
