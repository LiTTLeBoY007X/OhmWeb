import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import pic from "../assets/hero.png";
import AdminNav from "./adminNavbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const productImages = import.meta.glob("../assets/product-images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

function ShopMGT() {
  const navigate = useNavigate();
  const [Shoplists, setShoplist] = useState([]);
  const [shopValue, setshopValue] = useState();
  const [shopValueprice, setshopValueprice] = useState();

  useEffect(() => {
    async function loadShopManagement() {
      const token = localStorage.getItem("token");
      try {
        await axios.get(`${API_URL}/check-auth-admin-service`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { data } = await axios.get(`${API_URL}/shopPreviews`);
        setShoplist(data);
      } catch (error) {
        const message = error.response?.data?.message || "ไม่มีสิทธิ์เข้าถึง";
        Swal.fire({
          icon: "error",
          title: "แจ้งเตือน",
          text: message,
          confirmButtonText: "ตกลง",
        }).then(() => navigate("/", { replace: true }));
      }
    }
    loadShopManagement();
  }, [navigate]);

  function ChangShop(id, value, price) {
    console.log(value, id, price);
    axios
      .post(`${API_URL}/ChangShop`, {
        _id: id,
        value: value,
        price: price,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "แจ้งเตือน",
          text: res.data.message,
          confirmButtonText: "ตกลง",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // 👈 รีเฟรชหน้าเว็บเมื่อกดตกลง
          } // เปลี่ยนหน้าหลังจากผู้ใช้กดปุ่มตกลงแล้วเท่านั้น
        });
      })
      .catch((err) => {
        const message = err.response?.data?.message || "ไม่มีสิทธิ์เข้าถึง";
        console.log(err.response?.data?.message);
        Swal.fire({
          icon: "error",
          title: "แจ้งเตือน",
          text: message,
          confirmButtonText: "ตกลง",
        }).then(() => {
          navigate("/shopmgt", { replace: true }); // เปลี่ยนหน้าหลังจากผู้ใช้กดปุ่มตกลงแล้วเท่านั้น
        });
      });
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="mx-auto max-w-5xl px-5 pb-5 pt-10 sm:px-8 sm:pt-14">
        <p className="text-sm font-medium tracking-wide text-emerald-800/60">คลังและราคาแลก</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">จัดการสินค้า</h1>
      </header>
      <main className="mx-auto grid max-w-5xl gap-4 px-5 pb-8 sm:px-8 lg:grid-cols-2">
        {Shoplists.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-emerald-900/15 bg-white/55 px-6 py-16 text-center text-emerald-950/55">ยังไม่มีสินค้าในคลัง</div>}
        {Shoplists.map((Shoplist) => (
          <div
            key={Shoplist._id}
            className="grid w-full grid-cols-[100px_1fr] items-center gap-3 rounded-[1.75rem] border border-emerald-950/5 bg-white/85 p-4 shadow-[0_18px_50px_-42px_rgba(20,60,40,0.5)] sm:grid-cols-[120px_1fr]"
          >
            <img className="row-span-2 h-28 w-full rounded-2xl bg-[#edf4eb] object-contain p-2 sm:h-32" src={productImages[`../assets/product-images/${Shoplist.imageName}`] || pic} alt={Shoplist.nameShop_text} />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-emerald-950">{Shoplist.nameShop_text}</h2>
              <p className="mt-1 text-sm text-emerald-950/55">ราคาแลก <span className="font-semibold text-emerald-800">{Shoplist.price_1} แต้ม</span></p>
            </div>

            <div className="text-sm text-emerald-950/60">
              คงเหลือ <span className="font-semibold text-emerald-950">{Shoplist.amount_1} ชิ้น</span>
            </div>
            <div className="col-span-2 flex flex-col gap-3 border-t border-emerald-950/5 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-emerald-950/10 bg-[#f8faf6] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-700"
                  placeholder="จำนวนคงเหลือ"
                  onChange={(e) => {
                    setshopValue(e.target.value);
                  }}
                />
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-emerald-950/10 bg-[#f8faf6] px-3 py-2.5 text-sm outline-none transition focus:border-emerald-700"
                  placeholder="ราคา (แต้ม)"
                  onChange={(e) => {
                    setshopValueprice(e.target.value);
                  }}
                />
              </div>
              <button type="button" className="w-full rounded-xl bg-[#174b37] px-4 py-2.5 font-medium text-white transition hover:bg-[#226447]" onClick={() => ChangShop(Shoplist._id, shopValue, shopValueprice)}>บันทึกการเปลี่ยนแปลง</button>
            </div>
          </div>
        ))}
      </main>
      <AdminNav />
    </div>
  );
}

export default ShopMGT;
