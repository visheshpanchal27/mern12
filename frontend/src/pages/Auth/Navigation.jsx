import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 h-screen flex flex-col justify-between p-4 bg-[#000]/90 backdrop-blur-md text-white z-50 transition-all duration-300 group
        ${showSidebar ? "w-[14rem]" : "w-[4rem] hover:w-[14rem]"}
        rounded-r-xl shadow-lg border-r border-gray-900`}      
      id="navigation-container"
    >
      <div className="flex flex-col space-y-6 pt-8">
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

      <div className="relative pb-3">
        {userInfo ? (
          <div className="group relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 text-sm font-semibold hover:text-pink-400 transition"
            >
              <span>{userInfo.username}</span>
              <motion.svg
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="h-4 w-4"
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
              </motion.svg>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-14 left-0 bg-[#01010d] text-white rounded-lg shadow-xl w-52 py-2 space-y-1 z-50 border border-gray-700"
                >
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
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-3">
            <NavItem to="/login" icon={<AiOutlineLogin size={24} />} label="Login" />
            <NavItem to="/register" icon={<AiOutlineUserAdd size={24} />} label="Register" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const NavItem = ({ to, icon, label, badge }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="group"
  >
    <Link
      to={to}
      className="flex items-center justify-center md:justify-start space-x-4 w-full px-0.8 py-2 rounded-xl transition-all duration-300 hover:bg-[#272738] hover:shadow-lg hover:text-pink-400"
    >
      <div className="relative flex items-center justify-center w-8 h-8">
        {icon}
        {badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm"
          >
            {badge}
          </motion.span>
        )}
      </div>
      <span className="nav-item-name hidden group-hover:inline text-sm font-medium">
        {label}
      </span>
    </Link>
  </motion.div>
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
