import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from "../../components/Massage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import axios from "axios";
import HeartIcon from "./HeartIcon";
import { PRODUCTS_URL } from "../../redux/constants.js";

import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    fade: true,
  };

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
    <div className="w-full max-w-md mx-auto px-2 mb-6">
      {isLoading ? null : isError ? (
        <Message variant="danger">Something went wrong!</Message>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product._id} className="relative">
              <div className="relative w-full h-[26rem] overflow-hidden rounded-xl shadow-lg group">
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `${import.meta.env.VITE_API_URL}${product.image}`
                  }
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute top-3 right-3 z-10">
                  <HeartIcon product={product} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-2 backdrop-blur-sm rounded-b-xl text-sm">
                  <h2 className="text-base font-semibold hover:text-pink-400">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h2>
                  <p className="text-pink-400 font-semibold text-sm">
                    ${product.price}
                  </p>

                  <div className="flex justify-between mt-1 text-xs">
                    <p className="flex items-center">
                      <FaStore className="mr-1 text-pink-300" />
                      {product.brand}
                    </p>
                    <p className="flex items-center">
                      <FaClock className="mr-1 text-yellow-300" />
                      {moment(product.createdAt).fromNow()}
                    </p>
                  </div>

                  <div className="flex justify-between mt-1 text-xs">
                    <p className="flex items-center">
                      <FaStar className="mr-1 text-green-400" />
                      {product.numReviews} Reviews
                    </p>
                    <p className="flex items-center">
                      <FaStar className="mr-1 text-yellow-400" />
                      {Math.round(product.rating)} Rating
                    </p>
                  </div>

                  <div className="flex justify-between mt-1 text-xs">
                    <p className="flex items-center">
                      <FaShoppingCart className="mr-1 text-blue-400" />
                      Qty: {product.quantity}
                    </p>
                    <p className="flex items-center">
                      <FaBox className="mr-1 text-purple-400" />
                      In Stock: {product.countInStock}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
