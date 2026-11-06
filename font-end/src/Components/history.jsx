import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import NavBar from "./navbar";

function HistoryNot() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="min-h-screen pb-28">
      <header className="mx-auto max-w-3xl px-5 pb-5 pt-10 sm:px-8 sm:pt-14">
        <p className="text-sm font-medium tracking-wide text-emerald-800/60">ติดตามการเคลื่อนไหวของแต้ม</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">ประวัติการใช้งาน</h1>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-3 px-5 pb-8 sm:px-8">
        {items?.length === 0 && (
          <div className="rounded-3xl border border-dashed border-emerald-900/15 bg-white/55 px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4f4e8] text-2xl text-emerald-800">◷</span>
            <p className="mt-4 font-medium text-emerald-950">ยังไม่มีประวัติการใช้งาน</p>
            <p className="mt-1 text-sm text-emerald-950/50">รายการรับแต้มและแลกสินค้าจะแสดงที่นี่</p>
          </div>
        )}
        {items?.map((item) => {
          const isRedeem = item.type === "redeem";
          return (
            <article key={item._id} className="flex items-center gap-4 rounded-3xl border border-emerald-950/5 bg-white/85 p-4 shadow-[0_12px_35px_-30px_rgba(20,60,40,0.45)] sm:p-5">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold ${isRedeem ? "bg-amber-50 text-amber-700" : "bg-[#e4f4e8] text-emerald-800"}`} aria-hidden="true">
                {isRedeem ? "−" : "+"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-emerald-950">{item.description}</h2>
                  {isRedeem && <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{item.status === "pending" ? "รอดำเนินการ" : "ดำเนินการแล้ว"}</span>}
                </div>
                {isRedeem && <p className="mt-1 text-sm text-emerald-950/50">รหัสแลกสินค้า: {item.code}</p>}
              </div>
              <p className={`shrink-0 text-lg font-semibold ${isRedeem ? "text-amber-700" : "text-emerald-700"}`}>
                {isRedeem ? "−" : "+"}{Math.abs(Number(item.amount)).toLocaleString()} <span className="text-xs font-medium">แต้ม</span>
              </p>
            </article>
          );
        })}
      </main>
      <NavBar />
    </div>
  );
}
export default HistoryNot;
