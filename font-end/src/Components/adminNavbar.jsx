const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import {useLocation, Link} from 'react-router-dom';

function AdminNav() {
  const locationCheck = useLocation();
  console.log(locationCheck.pathname);
  return (
    <div className="bg-green-500 w-dvw fixed bottom-0 flex justify-evenly h-[40px] items-center">
      <a className={`${locationCheck.pathname === '/redeem' ? 'text-black' : 'text-white'}`} href="/redeem">
        Redeem
      </a>
      <a className={`${locationCheck.pathname === '/shopmgt' ? 'text-black' : 'text-white'}`} href="/shopmgt">
        Shop
      </a>
      <a className={`${locationCheck.pathname === '/addpoint' ? 'text-black' : 'text-white'}`} href="/addpoint">
        Point
      </a>
    </div>
  );
}

export default AdminNav;
