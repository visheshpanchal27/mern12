import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Massage from "../../components/Massage";
import { 
    FaBox,
    FaClock,
    FaShoppingCart,
    FaStar,
    FaStore,
} from 'react-icons/fa';
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/Cart/CartSlice";

const productDetails = () => {

    const { id: productId } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ qty, setQty ] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { data: product, isLoading, refetch, error}= useGetProductDetailsQuery(productId)


    const { userInfo } = useSelector((state) => state.auth)

    const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation()

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            await createReview({
              productId,
              rating,
              comment,
            }).unwrap();
            refetch();
            toast.success("Review created successfully");
          } catch (error) {
            toast.error(error?.data || error.message);
          }
    };

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate("/cart");
      };

  return (
    <>
     <div>
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 ml-[10rem] mb-8 text-gray-300 hover:text-white bg-transparent border border-gray-600 hover:border-pink-500 rounded-full py-2 px-5 transition duration-300"
            >
            <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
        </button>


    </div> 
    {isLoading ? (<Loader/>): error ? (<Massage variant="danger">{error}?.data?.massage||error.</Massage>):(
        <>
            <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">

                <img 
                    src={
                        product.image?.startsWith('http')
                          ? product.image
                          : `${import.meta.env.VITE_API_URL}${product.image}`
                    }                      
                    alt={product.name}
                    className="w-full max-h-[50rem] xl:w-[45rem] lg:w-[40rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
                />

        <HeartIcon product={product} />
                <div className="flex flex-col justify-between">
                    <h2 className="text-2xl  font-semibold">{product.name}</h2>
                    <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem]  text-[#B0B0B0]">
                        {product.description}
                    </p>
                    
                    <p className="text-5xl my-4 font-extrabold">$ {product.price}</p>

                <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                    <h1 className="flex items-center mb-6">
                        <FaStore className="mr-2 text-white" /> Brand:{" "}
                        {product.brand}
                    </h1>
                    <h1 className="flex items-center mb-6 w-[20rem]">
                        <FaClock className="mr-2 text-white" /> Added:{" "}
                        {moment(product.createAt).fromNow()}
                    </h1>
                    <h1 className="flex items-center mb-6">
                        <FaStar className="mr-2 text-white" /> Reviews:{" "}
                        {product.numReviews}
                    </h1>
                    </div>

                    <div className="two">
                        <h1 className="flex items-center mb-6">
                            <FaStar className="mr-2 text-white" /> Ratings: {rating}
                        </h1>
                        <h1 className="flex items-center mb-6">
                            <FaShoppingCart className="mr-2 text-white" /> Quantity:{" "}
                            {product.quantity}
                        </h1>
                        <h1 className="flex items-center mb-6 w-[10rem]">
                            <FaBox className="mr-2 text-white" /> In Stock:{" "}
                            {product.countInStock}
                        </h1>
                        </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap">
                    <Ratings
                        value={product.rating}
                        text={`${product.numReviews} reviews`}
                    />

                    {product.countInStock > 0 && (
                    <div className="relative w-[8rem]">
                        <select
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="w-full appearance-none bg-[#1a1a1a] border border-gray-500/40 text-white py-2 px-4 pr-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                        >
                        {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                            {x + 1}
                            </option>
                        ))}
                        </select>

                        {/* Custom down arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M5.516 7.548a.625.625 0 0 1 .884-.036L10 10.829l3.6-3.317a.625.625 0 0 1 .848.92l-4.042 3.723a.625.625 0 0 1-.848 0L5.552 8.43a.625.625 0 0 1-.036-.882z" />
                        </svg>
                        </div>
                    </div>
                    )}

                    </div>
                    <div className="btn-container">
                        <button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0 hover:bg-pink-800"
                        >
                        Add To Cart
                        </button>
                    </div>
                </div>
                    <div className="mt-[5rem] container flex flex-wrap items-start justify-between ml-[10rem]">
                        <ProductTabs
                            loadingProductReview={loadingProductReview}
                            userInfo={userInfo}
                            submitHandler={submitHandler}
                            rating={rating}
                            setRating={setRating}
                            comment={comment}
                            setComment={setComment}
                            product={product}
                        />
                    </div>
            </div>
        </>
    )}
    </>
  )
}

export default productDetails
