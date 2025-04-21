import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const tabClasses = (num) =>
    `transition-all duration-300 px-6 py-2 rounded-full text-sm font-medium ${
      activeTab === num
        ? "bg-gradient-to-r from-pink-700 to-pink-600 text-white shadow-lg scale-105"
        : "bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
    }`;

  return (
    <div className="w-full px-6 mt-10 flex flex-col items-start">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 backdrop-blur-sm bg-[#111111]/30 p-2 rounded-full shadow-inner">
        <button onClick={() => handleTabClick(1)} className={tabClasses(1)}>
          Write a Review
        </button>
        <button onClick={() => handleTabClick(2)} className={tabClasses(2)}>
          All Reviews
        </button>
        <button onClick={() => handleTabClick(3)} className={tabClasses(3)}>
          Related Products
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-5xl">
        {activeTab === 1 && (
          <div>
            {userInfo ? (
              <form
                onSubmit={submitHandler}
                className="flex flex-col gap-6 bg-[#1a1a1a]/50 p-6 rounded-2xl shadow-lg"
              >
                <div>
                  <label className="text-gray-300 mb-2 block text-base">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-[#0f0f0f] text-white focus:ring-2 ring-pink-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-300 mb-2 block text-base">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    required
                    className="w-full p-3 rounded-md bg-[#0f0f0f] text-white resize-none focus:ring-2 ring-purple-500 outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="self-start px-6 py-2 rounded-md bg-gradient-to-r from-pink-700 to-pink-600 text-white hover:opacity-90 transition"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-gray-400">
                Please{" "}
                <Link to="/login" className="text-pink-500 underline">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="grid gap-6 mt-4">
            {product.reviews.length === 0 ? (
              <p className="text-gray-400">No Reviews</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gradient-to-br from-[#161616] to-[#1f1f1f] rounded-xl p-6 shadow-lg"
                >
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span className="font-semibold text-white">{review.name}</span>
                    <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
            {isLoading || !data ? (
              <Loader />
            ) : (
              data.map((relatedProduct) => (
                <SmallProduct key={relatedProduct._id} product={relatedProduct} />
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductTabs;
