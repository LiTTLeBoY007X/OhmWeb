import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./navbar";
import pic from "../assets/hero.png";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import Swal from "sweetalert2";

function Shop() {
  const [items, setItems] = useState([]);

  // โหลดข้อมูลเมื่อเปิดหน้าเว็บฏ
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
    <div className="flex  items-center flex-col gap-[20px]   min-h-screen ">
      <div className="fixed bg-green-500 w-dvw h-[50px] flex justify-center items-center">
        <span className=" text-center text-[20px] ">แลกแต้ม</span>
      </div>
      <div className="flex flex-col gap-[20px] mt-[70px] mb-[80px]">
        {items.map((item) => (
          <div
            key={item._id}
            className="grid  items-center grid-cols-[80px_auto] grid-rows-2  gap-[4px] w-[300px]  bg-white  rounded-2xl h-[130px]"
          >
            <img className="w-[80px] row-span-2 m-[15px]" src={pic} alt="" />
            <div className="flex justify-center items-center flex-col">
              <div className="text-center">{item.nameShop_text}</div>
              <div className="text-center text-[20px]">
                {item.price_1} คะแนน
              </div>
            </div>

            <div className="col-start-2 flex justify-evenly items-center">
              <div>คลัง {item.amount_1}</div>
              <button
                className={` rounded-2xl w-[120px] h-[40px] bg-[#4DFF39] cursor-pointer  ${item.amount_1 === 0 && "bg-gray-300 cursor-not-allowed"}`}
                onClick={() => {
                  PointBuy(item._id);
                }}
                disabled={item.amount_1 === 0}
              >
                {item.amount_1 === 0 ? "ของหมด" : "แลกแต้ม"}
              </button>

              {/* ${isSelected && 'ring-2 ring-green-500 border-transparent'} ถ้าตรงเงื่อนไขให้ทำ 
                  ${item.amount_1 === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`} ถ้าตรงให้ทำอันแรก แต่ถ้าไม่ทำอันสอง
             */}
            </div>
          </div>
        ))}
      </div>

      <NavBar />
    </div>
  );
}

export default Shop;
