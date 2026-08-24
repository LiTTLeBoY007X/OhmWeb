import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import pic from "../assets/hero.png";
import AdminNav from "./adminNavbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ShopMGT() {
  const navigate = useNavigate();
  const isCalled = useRef(false); // 👈 1. สร้างตัวแปรเช็กสถานะ
  const [Shoplists, setShoplist] = useState([]);
  const [shopValue, setshopValue] = useState();
  const [shopValueprice, setshopValueprice] = useState();

  async function AutnAdmin() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/check-auth-admin-service`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resshop = await axios
        .get(`${API_URL}/shopPreviews`)
        .then((res) => {
          setShoplist(res.data); // อัปเดต State ทำให้ React Re-render ข้อมูลใหม่
        })
        .catch((err) => console.error(err));
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
    <div className="flex justify-center items-center flex-col">
      <span className="top-[0] fixed bg-green-400 w-[100%] text-center text-2xl">
        จัดการของในคลัง
      </span>
      <div className="flex flex-col gap-[20px] mt-[60px] mb-[80px]  ">
        {Shoplists.map((Shoplist) => (
          <div
            key={Shoplist._id}
            className="grid  items-center grid-cols-[80px_auto] grid-rows-4 grid-  gap-[px] w-[300px]  bg-white  rounded-2xl  "
          >
            <img className="w-[80px] row-span-2 m-[15px]" src={pic} alt="" />
            <div className="flex justify-center items-center flex-col">
              <div className="text-center">{Shoplist.nameShop_text}</div>
              <div className="text-center text-[20px]">
                {Shoplist.price_1} คะแนน
              </div>
            </div>

            <div className="col-start-2 flex justify-evenly items-center ">
              <div>คลัง {Shoplist.amount_1}</div>
            </div>
            <div className="flex justify-center gap-[20px] row-span-2 col-span-2 items-center flex-col m-2 ">
              <div className="flex justify-evenly items-center gap-[10px] h-auto">
                <input
                  type="number"
                  className="border-1 w-[80px] rounded-xl p-[9px] pl-[10px] "
                  placeholder="คลัง"
                  onChange={(e) => {
                    setshopValue(e.target.value);
                  }}
                />
                <input
                  type="number"
                  className="border-1 w-[80px] rounded-xl p-[9px] pl-[10px] "
                  placeholder="ราคา"
                  onChange={(e) => {
                    setshopValueprice(e.target.value);
                  }}
                />
              </div>
              <div>
                <input
                  type="submit"
                  value="ยืนยัน"
                  className="bg-green-500 p-[10px]  rounded-xl"
                  onClick={() => {
                    ChangShop(Shoplist._id, shopValue, shopValueprice);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <AdminNav />
    </div>
  );
}

export default ShopMGT;
