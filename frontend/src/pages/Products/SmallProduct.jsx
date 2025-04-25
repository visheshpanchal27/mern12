import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full p-3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      <div className="relative bg-[#1a1a1a] rounded-xl shadow-md overflow-hidden h-full flex flex-col">

        <div className="aspect-w-1 aspect-h-1 w-full">
          <img
            src={
              product.image?.startsWith('http')
                ? product.image
                : `${import.meta.env.VITE_API_URL}${product.image}`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>

        <div className="p-3 flex-1 flex flex-col justify-between">
          <Link to={`/product/${product._id}`}>
            <h2 className="flex justify-between items-center text-white font-semibold text-sm hover:text-pink-400">
              <span className="truncate max-w-[9rem]">{product.name}</span>
              <span className="bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-xl whitespace-nowrap">
                ${product.price}
              </span>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
