import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Massage from "../components/Massage";
import ProductAll from "./Products/ProductAll.jsx";
import { useState, useEffect } from "react";
import { PRODUCTS_URL } from "../redux/constants.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const { data } = await axios.get(`${PRODUCTS_URL}/random`);
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    fetchRandomProducts();
  }, []);

  return (
    <>
      <Header />

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Massage variant="danger">Something went wrong!</Massage>
      ) : (
        <>
          {/* Title and Shop Button */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-[4rem] px-[2rem] sm:px-[4rem] lg:px-[8rem]">
            <h1 className="text-[2rem] sm:text-[2.5rem] font-bold text-center sm:text-left text-white mb-[1.5rem] sm:mb-0">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-[0.5rem] px-[2.5rem] text-[0.9rem] hover:bg-pink-700 transition"
            >
              Shop All
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2rem] mt-[3rem] px-[2rem] sm:px-[4rem] lg:px-[8rem]">
            {products.map((product) => (
              <ProductAll key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
