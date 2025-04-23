import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/Shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

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
    ...new Set(filteredProductsQuery.data?.map((product) => product.brand).filter(Boolean)),
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar */}
        <aside className="bg-[#151515] p-6 rounded-2xl w-full lg:w-[250px] shrink-0 shadow-lg">
          
          {/* Categories */}
          <h2 className="text-center bg-gradient-to-r from-pink-600 to-pink-500 py-2 rounded-full mb-6 text-white font-bold shadow-lg">
            Filter by Categories
          </h2>

          <div className="space-y-3">
            {(showAllCategories ? categories : categories.slice(0, 4))?.map((c) => (
              <label
                key={c._id}
                className="flex items-center gap-3 cursor-pointer text-white"
              >
                <input
                  type="checkbox"
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  checked={checked.includes(c._id)}
                  className={`w-5 h-5 rounded-md border-2 border-pink-500 bg-transparent checked:bg-pink-500 checked:border-pink-500 transition-all duration-300 ease-in-out hover:scale-110 focus:ring-2 focus:ring-pink-500`}
                  style={{
                    WebkitAppearance: "none",
                    appearance: "none",
                    display: "grid",
                    placeContent: "center",
                    backgroundColor: checked.includes(c._id) ? "#ec4899" : "transparent",
                    borderColor: "#ec4899",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderRadius: "0.375rem",
                    transition: "all 0.3s ease",
                    backgroundImage: checked.includes(c._id)
                      ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E")`
                      : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "70%",
                  }}
                />
                <span className="text-sm">{c.name}</span>
              </label>
            ))}
          </div>

          {categories.length > 5 && (
            <button
              className="text-pink-400 text-xs mt-2 hover:underline transition"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? "Show Less" : "Show More"}
            </button>
          )}

          {/* Brands */}
          <h2 className="text-center bg-gradient-to-r from-pink-600 to-pink-500 py-2 rounded-full mt-8 mb-6 text-white font-bold shadow-lg">
            Filter by Brands
          </h2>

          <div className="space-y-3">
            {(showAllBrands ? uniqueBrands : uniqueBrands.slice(0, 4))?.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer text-white"
              >
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
                className="appearance-none w-5 h-5 rounded-full border-2 border-pink-500 checked:bg-pink-500 checked:border-transparent transition-all duration-300 ease-in-out transform hover:scale-110 focus:ring-2 focus:ring-pink-500"
              />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>

          {uniqueBrands.length > 5 && (
            <button
              className="text-pink-400 text-xs mt-2 hover:underline transition"
              onClick={() => setShowAllBrands(!showAllBrands)}
            >
              {showAllBrands ? "Show Less" : "Show More"}
            </button>
          )}

          {/* Price Filter */}
          <h2 className="text-center bg-gradient-to-r from-pink-600 to-pink-500 py-2 rounded-full mt-8 mb-6 text-white font-bold shadow-lg">
            Filter by Price
          </h2>

          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full bg-[#1f1f1f] border border-pink-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Sort Products */}
          <h2 className="text-center bg-gradient-to-r from-pink-600 to-pink-500 py-2 rounded-full mt-8 mb-6 text-white font-bold shadow-lg">
            Sort Products
          </h2>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full bg-[#1f1f1f] border border-pink-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>

          {/* Clear Filters */}
          <button
            className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-3 rounded-lg hover:brightness-110 mt-6 font-semibold transition"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>

        </aside>

        {/* Products Section */}
        <main className="flex-1">
          <h2 className="text-white text-lg font-semibold mb-6">{products?.length} Products</h2>

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
