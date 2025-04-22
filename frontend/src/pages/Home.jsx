import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Massage from "../components/Massage";
<<<<<<< HEAD
import ProductAll from "./Products/ProductAll.jsx";
=======
import ProductAll from "./Products/ProductAll"; 
>>>>>>> 9cb9db2 (fix: updated Home.jsx to import ProductAll correctly)
import { useState, useEffect } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const { data } = await axios.get("/api/products/random");
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
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[4rem] text-[3rem]">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[4rem]"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center flex-wrap mt-[3rem]">
            {products.map((product) => (
              <div key={product._id}>
                <ProductAll product={product} /> {/* ✅ fixed usage */}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
