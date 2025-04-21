import { Link } from "react-router-dom";
import HeartIcon from "../Products/HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative transition duration-300 hover:scale-[1.015]">
      <div className="relative overflow-hidden rounded-2xl shadow-md bg-[#1a1a1a] hover:shadow-xl transition-all duration-300">
        
        {/* Image Section */}
        <div className="relative w-full h-[20rem] overflow-hidden rounded-2xl">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
          />

          {/* Heart Icon */}
          <div className="absolute top-4 right-4 z-10">
            <HeartIcon product={product} />
          </div>

          {/* Info inside image bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 backdrop-blur-sm rounded-b-2xl">
            <Link to={`/product/${product._id}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold hover:text-pink-400 transition truncate max-w-[16rem]">
                  {product.name}
                </h2>
                <p className="text-pink-400 font-semibold text-lg ml-4 whitespace-nowrap">
                  ${product.price}
                </p>
              </div>
            </Link>

            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
              {product.description?.substring(0, 50)}...
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Product;
