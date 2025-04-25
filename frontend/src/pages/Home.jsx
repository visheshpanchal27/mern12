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
      <div className="flex justify-between items-center px-[5rem] mt-[4rem]">
        <h1 className="text-[3rem] text-white font-bold">Special Products</h1>
        <Link
          to="/shop"
          className="bg-pink-600 font-bold rounded-full py-[0.5rem] px-[2.5rem] text-white"
        >
          Shop All
        </Link>
      </div>

      {/* === FEATURED PRODUCT === */}
      <div className="flex justify-center mt-[3rem]">
        <div className="w-full max-w-6xl">
          <ProductAll product={products[0]} />
        </div>
      </div>

      {/* === SMALL PRODUCTS GRID === */}
      <div className="flex flex-wrap justify-center gap-6 mt-[4rem] px-[2rem]">
        {products.slice(1).map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>
    </>
  )}
</>

  );
};

export default Home;
