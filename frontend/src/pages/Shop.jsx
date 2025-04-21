import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/Shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      let filtered = [...filteredProductsQuery.data];

      if (priceFilter) {
        filtered = filtered.filter(
          (product) =>
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
        );
      }

      if (sortOrder === "low-high") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOrder === "high-low") {
        filtered.sort((a, b) => b.price - a.price);
      }

      dispatch(setProducts(filtered));
    }
  }, [checked, radio, priceFilter, sortOrder, filteredProductsQuery.data, dispatch]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleClearFilters = () => {
    dispatch(setChecked([]));
    setPriceFilter("");
    setSortOrder("");
    dispatch(setProducts(filteredProductsQuery.data));
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="bg-[#151515] p-4 rounded-xl w-full lg:w-[250px] shrink-0">
          <h2 className="text-center bg-black py-2 rounded-full mb-4 text-white font-semibold">
            Filter by Categories
          </h2>
          {categories?.map((c) => (
            <div key={c._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-2"
                checked={checked.includes(c._id)}
              />
              <label className="ml-2 text-sm text-white">{c.name}</label>
            </div>
          ))}

          <h2 className="text-center bg-black py-2 rounded-full mt-6 mb-4 text-white font-semibold">
            Filter by Brands
          </h2>
          {uniqueBrands.map((brand) => (
            <div key={brand} className="flex items-center mb-2">
              <input
                type="radio"
                name="brand"
                onChange={() =>
                  dispatch(
                    setProducts(
                      filteredProductsQuery.data?.filter((p) => p.brand === brand)
                    )
                  )
                }
                className="w-4 h-4 text-pink-600 rounded focus:ring-2"
              />
              <label className="ml-2 text-sm text-white">{brand}</label>
            </div>
          ))}

          <h2 className="text-center bg-black py-2 rounded-full mt-6 mb-4 text-white font-semibold">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full px-3 py-2 mb-4 rounded-lg focus:outline-none"
          />
          <button
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </aside>

        {/* Products Section */}
        <main className="flex-1">
          {/* Sort & Filter Tags */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            {(checked.length > 0 || priceFilter) && (
              <div className="flex flex-wrap gap-2">
                {checked.map((id) => (
                  <span
                    key={id}
                    className="bg-pink-600 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {categories.find((c) => c._id === id)?.name}
                  </span>
                ))}
                {priceFilter && (
                  <span className="bg-pink-600 text-white text-sm px-3 py-1 rounded-full">
                    Price: {priceFilter}
                  </span>
                )}
              </div>
            )}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              <option value="">Sort By</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <h2 className="text-white text-lg mb-3">{products?.length} Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products.map((p) => <ProductCard p={p} key={p._id} />)
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
