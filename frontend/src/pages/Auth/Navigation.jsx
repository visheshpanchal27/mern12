import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logOut } from "../../redux/features/auth/authSlice";
import "./Navigation.css";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const favoriteItems = useSelector((state) => state.favorites || []);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logOut());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between p-3 bg-[#000]/90 backdrop-blur-md text-white z-50 transition-all duration-300 ${
        showSidebar ? "hidden" : "w-[4%] md:w-[4%] hover:w-[16%]"
      } rounded-r-xl shadow-lg border-r border-gray-900`}
      id="navigation-container"
    >
      <div className="flex flex-col space-y-6 pt-10">
        <NavItem to="/" icon={<AiOutlineHome size={24} />} label="Home" />
        <NavItem to="/shop" icon={<AiOutlineShopping size={24} />} label="Shop" />
        <NavItem
          to="/cart"
          icon={<AiOutlineShoppingCart size={24} />}
          label="Cart"
          badge={cartItems.reduce((a, c) => a + c.qty, 0)}
        />
        <NavItem
          to="/favorite"
          icon={<FaHeart size={20} />}
          label="Favorites"
          badge={favoriteItems.length}
        />
      </div>

      <div className="relative pb-4">
        {userInfo ? (
          <div className="group relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-sm font-semibold hover:text-pink-400 transition"
            >
              <span>{userInfo.username}</span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="absolute bottom-14 left-0 bg-[#01010d] text-white rounded-lg shadow-xl w-52 py-2 space-y-1 z-50 border border-gray-700">
                {userInfo.isAdmin && (
                  <>
                    <DropdownItem to="/admin/dashboard" label="Dashboard" />
                    <DropdownItem to="/admin/productlist" label="Products" />
                    <DropdownItem to="/admin/allproductslist" label="All Products List" />
                    <DropdownItem to="/admin/categorylist" label="Category" />
                    <DropdownItem to="/admin/orderlist" label="Orders" />
                    <DropdownItem to="/admin/userlist" label="Users" />
                  </>
                )}
                <DropdownItem to="/profile" label="Profile" />
                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600 transition rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <NavItem to="/login" icon={<AiOutlineLogin size={24} />} label="Login" />
            <NavItem to="/register" icon={<AiOutlineUserAdd size={24} />} label="Register" />
          </div>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, badge }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 group px-2 py-2 rounded-xl transition-all duration-300 hover:bg-[#272738] hover:shadow-lg hover:text-pink-400"
  >
    <div className="relative flex items-center justify-center">
      {icon}
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
          {badge}
        </span>
      )}
    </div>
    <span className="nav-item-name hidden group-hover:inline text-sm font-medium">
      {label}
    </span>
  </Link>
);

const DropdownItem = ({ to, label }) => (
  <li>
    <Link
      to={to}
      className="block px-4 py-2 hover:bg-gray-600 rounded-md transition text-sm"
    >
      {label}
    </Link>
  </li>
);

export default Navigation;
