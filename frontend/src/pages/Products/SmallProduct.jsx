import { Link } from "react-router-dom";
import HeartIcon from "../Products/HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[16rem] p-3">
      <div className="relative">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="h-40 w-full object-cover rounded-xl"
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
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
  );
};

export default SmallProduct;
