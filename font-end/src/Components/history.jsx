import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import NavBar from "./navbar";

function HistoryNot() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const fetchShopItems = () => {
    axios
      .get(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setItems(res.data);
        console.log(res.data); // อัปเดต State ทำให้ React Re-render ข้อมูลใหม่
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchShopItems();
  }, []);
  return (
    <div className="flex justify-center items-center flex-col  gap-[10px] w-dvw mt-[50px]">
    <div className="text-lg font-medium bg-green-400 w-[100%] text-center  fixed top-0">
        ประวัติการใช้งาน
    </div>
      {items?.length === 0 && <span className="text-red-500 text-lg font-medium">ไม่มีประวัติการใช้งาน</span>}
      {items?.map((item) => (
        <div
          key={item._id}
          className="text-lg font-medium flex justify-center items-center rounded-[10px] bg-green-500 w-[70%] "
        >
          {item.type === "redeem" ? (
            <div className="flex flex-col justify-center items-center">
              <span>
                {item.description} {item.amount} คะแนน
              </span>
              <span>รหัส {item.code}</span>
              <span>สถานะ: {item.status === "pending" ? "รอการตรวจสอบ" : "สำเร็จแล้ว"}</span>
            </div>
          ) : (
            <span className="">
              {item.description} {Number(item.amount).toLocaleString()} คะแนน
            </span>
          )}
        </div>
      ))}
      <NavBar />
    </div>
  );
}
//<span>{Number(item.amount).toLocaleString()} คะแนน</span>
export default HistoryNot;
