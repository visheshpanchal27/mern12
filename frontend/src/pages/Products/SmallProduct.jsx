import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3">
      <div className="relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-400 transition-shadow duration-300">

        <img
          src={
            product.image?.startsWith('http')
              ? product.image
              : `${import.meta.env.VITE_API_URL}${product.image}`
          }
          alt={product.name}
          className="h-40 w-full object-cover"
        />

        <div className="absolute top-2 right-2 z-10">
          <HeartIcon product={product} />
        </div>

        <div className="p-3">
          <Link to={`/product/${product._id}`}>
            <h2 className="flex justify-between items-center text-white font-semibold text-sm hover:text-pink-400">
              <div className="truncate max-w-[8rem]">{product.name}</div>
              <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2.5 py-0.5 rounded-xl">
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
