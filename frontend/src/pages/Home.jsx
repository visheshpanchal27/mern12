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
          <div className="flex flex-col sm:flex-row sm:justify-between items-center px-6 sm:px-12 lg:px-32 mt-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left text-white mb-4 sm:mb-0">
              Special Products
            </h1>
            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 px-6 text-sm sm:text-base hover:bg-pink-700 transition"
            >
              Shop All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 sm:px-12 lg:px-32 mt-8">
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
