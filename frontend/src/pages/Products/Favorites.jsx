import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product.jsx";
import { FaHeart } from "react-icons/fa";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[10rem] text-white">
      {/* Section Title */}
      <div className="ml-[3rem] mt-[3rem] flex items-center gap-2">
        <FaHeart className="text-pink-500 text-xl" />
        <h1 className="text-lg font-bold tracking-wide">
          FAVORITE PRODUCTS
        </h1>
      </div>
      <div className="ml-[3rem] mt-1 h-[0.2rem] w-[10rem] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />

      {/* Product Grid */}
      {favorites.length > 0 ? (
        <div className="flex flex-wrap gap-6 mt-[2rem] ml-[3rem]">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="ml-[3rem] mt-[5rem] text-gray-400 text-base">
          You haven't added any favorite products yet.
        </div>
      )}
    </div>
  );
};

export default Favorites;
