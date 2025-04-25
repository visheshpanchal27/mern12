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
    speed: 800, // smoother transition
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // hide default arrows
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out", // smoother curve
    fade: true, // Fading transition instead of sliding
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
    <div key={_id} className="relative">
        <div className="relative w-full h-[22rem] overflow-hidden rounded-xl shadow-md group">
          <img
            src={image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL}${image}`}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-102 transition duration-300"
          />
          <div className="absolute top-3 right-3 z-10">
            <HeartIcon product={{ image, _id, name, price }} />
          </div>
      
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-2 backdrop-blur-sm rounded-b-xl">
            <h2 className="text-base font-semibold hover:text-pink-400 transition">
              <Link to={`/product/${_id}`}>{name}</Link>
            </h2>
            <p className="text-pink-400 font-semibold text-sm">$ {price}</p>
      
            <div className="flex justify-between mt-1 text-xs">
              <p className="flex items-center">
                <FaStore className="mr-1 text-pink-300 text-sm" /> {brand}
              </p>
              <p className="flex items-center">
                <FaClock className="mr-1 text-yellow-300 text-sm" /> {moment(createdAt).fromNow()}
              </p>
            </div>
      
            <div className="flex justify-between mt-1 text-xs">
              <p className="flex items-center">
                <FaStar className="mr-1 text-green-400 text-sm" /> {numReviews} Reviews
              </p>
              <p className="flex items-center">
                <FaStar className="mr-1 text-yellow-400 text-sm" /> {Math.round(rating)} Rating
              </p>
            </div>
      
            <div className="flex justify-between mt-1 text-xs">
              <p className="flex items-center">
                <FaShoppingCart className="mr-1 text-blue-400 text-sm" /> Qty: {quantity}
              </p>
              <p className="flex items-center">
                <FaBox className="mr-1 text-purple-400 text-sm" /> In Stock: {countInStock}
              </p>
            </div>
          </div>
        </div>
      </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
