import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from "../../components/Massage";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import axios from "axios";
import HeartIcon from "./HeartIcon";

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
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

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
    <div className="mb-4">
      {isLoading ? null : isError ? (
        <Message variant="danger">Something went wrong!</Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:w-[50rem] md:w-[56rem] sm:w-[40rem] mx-auto"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="relative">
                {/* Image Section with Info Inside */}
                <div className="relative w-full h-[32rem] overflow-hidden rounded-2xl shadow-lg group">
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={name}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                  />

                  {/* Heart Icon */}
                  <div className="absolute top-4 right-4 z-10">
                    <HeartIcon product={{ image, _id, name, price }} />
                  </div>

                  {/* Bottom Info Inside Image */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 backdrop-blur-sm rounded-b-2xl">
                    <Link to={`/product/${_id}`}>
                      <h2 className="text-xl font-bold hover:text-pink-400 transition">
                        {name}
                      </h2>
                    </Link>
                    <p className="text-pink-400 font-semibold mt-1 text-lg">$ {price}</p>

                    <div className="flex flex-wrap justify-between mt-2 text-sm">
                      <div className="space-y-1">
                        <p className="flex items-center">
                          <FaStore className="mr-1 text-pink-300" /> {brand}
                        </p>
                        <p className="flex items-center">
                          <FaClock className="mr-1 text-yellow-300" /> {moment(createdAt).fromNow()}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="flex items-center">
                          <FaStar className="mr-1 text-green-400" /> {numReviews} Reviews
                        </p>
                        <p className="flex items-center">
                          <FaStar className="mr-1 text-yellow-400" /> {Math.round(rating)} Rating
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between mt-2 text-sm">
                      <p className="flex items-center">
                        <FaShoppingCart className="mr-1 text-blue-400" /> Quantity: {quantity}
                      </p>
                      <p className="flex items-center">
                        <FaBox className="mr-1 text-purple-400" /> In Stock: {countInStock}
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
