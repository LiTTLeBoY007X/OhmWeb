import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./navbar";
import pic from "../assets/hero.png";
const productImages = import.meta.glob("../assets/product-images/*", {
  eager: true,
  query: "?url",
  import: "default",
});
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import Swal from "sweetalert2";

function Shop() {
  const [items, setItems] = useState([]);

  // โหลดข้อมูลสินค้าเมื่อเปิดหน้าเว็บ
  const fetchShopItems = () => {
    axios
      .get(`${API_URL}/shopPreviews`)
      .then((res) => {
        setItems(res.data); // อัปเดต State ทำให้ React Re-render ข้อมูลใหม่
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchShopItems();
  }, []);

  async function PointBuy(IDShop) {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}/shopbuyID`,
        {
          idshoplist: IDShop,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Swal.fire({
        icon: "success",
        title: "แจ้งเตือน",
        text: res.data.message,
        confirmButtonText: "ตกลง",
      }).then((result) => {
        if (result.isConfirmed) {
          fetchShopItems();// 👈 รีเฟรชหน้าเว็บเมื่อกดตกลง
        } // เปลี่ยนหน้าหลังจากผู้ใช้กดปุ่มตกลงแล้วเท่านั้น
      });
      fetchShopItems();
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
      <header className="mx-auto flex max-w-6xl items-end justify-between px-5 pb-5 pt-10 sm:px-8 sm:pt-14">
        <div>
          <p className="text-sm font-medium tracking-wide text-emerald-800/60">ของที่เลือกมาเพื่อคุณ</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">แลกสินค้า</h1>
        </div>
        <div className="hidden rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-sm text-emerald-900/70 sm:block">ใช้แต้มสะสมแลกได้เลย</div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 pb-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-emerald-900/15 bg-white/55 px-6 py-16 text-center text-emerald-950/55">ตอนนี้ยังไม่มีสินค้าให้แลก</div>
        ) : items.map((item) => (
          <article key={item._id} className="group overflow-hidden rounded-[1.75rem] border border-emerald-950/5 bg-white/85 p-3 shadow-[0_18px_50px_-42px_rgba(20,60,40,0.5)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_25px_55px_-38px_rgba(20,60,40,0.32)]">
            <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-[1.3rem] bg-[#edf4eb] sm:h-56">
              <img className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.04]" src={productImages[`../assets/product-images/${item.imageName}`] || pic} alt={item.nameShop_text} />
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${item.amount_1 === 0 ? "bg-white/85 text-slate-500" : "bg-white/90 text-emerald-800"}`}>
                {item.amount_1 === 0 ? "สินค้าหมด" : `เหลือ ${item.amount_1} ชิ้น`}
              </span>
            </div>
            <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-emerald-950">{item.nameShop_text}</h2>
                <p className="mt-1 text-sm text-emerald-950/50">ราคาแลก</p>
              </div>
              <p className="shrink-0 text-xl font-semibold text-emerald-800">{Number(item.price_1).toLocaleString()} <span className="text-sm font-medium">แต้ม</span></p>
            </div>
            <button
              className="mt-4 w-full rounded-2xl bg-[#174b37] px-4 py-3 font-medium text-white transition hover:bg-[#226447] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              onClick={() => PointBuy(item._id)}
              disabled={item.amount_1 === 0}
            >
              {item.amount_1 === 0 ? "สินค้าหมด" : "แลกสินค้านี้"}
            </button>
          </article>
        ))}
      </main>
      <NavBar />
    </div>
  );
}

export default Shop;
