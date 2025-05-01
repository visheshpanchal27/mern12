import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import Message from "../../components/Massage";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/Cart/CartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: Number(cart.itemsPrice),
        shippingPrice: Number(cart.shippingPrice),
        taxPrice: Number(cart.taxPrice),
        totalPrice: Number(cart.totalPrice),
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-1 py-2 text-left align-top">Image</th>
                  <th className="px-1 py-2 text-left">Product</th>
                  <th className="px-1 py-2 text-left">Quantity</th>
                  <th className="px-1 py-2 text-left">Price</th>
                  <th className="px-1 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${import.meta.env.VITE_API_URL}${item.image}`
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-pink-400 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">${Number(item.price).toFixed(2)}</td>
                    <td className="p-2">
                      ${(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-8 bg-[#181818] rounded-lg">
            <ul className="text-lg space-y-2">
              <li className="flex justify-between">
                <span className="font-semibold">Items:</span>
                <span>${Number(cart.itemsPrice || 0).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-semibold">Shipping:</span>
                <span>${Number(cart.shippingPrice || 0).toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span className="font-semibold">Tax:</span>
                <span>${Number(cart.taxPrice || 0).toFixed(2)}</span>
              </li>
              <li className="flex justify-between text-xl font-bold mt-2">
                <span>Total:</span>
                <span>${Number(cart.totalPrice || 0).toFixed(2)}</span>
              </li>
            </ul>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Shipping</h2>
                <p className="text-gray-300">
                  <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2">Payment Method</h2>
                <div className="flex items-center space-x-2 text-lg">
                  {cart.paymentMethod === "PayPal" ? (
                    <>
                      <FaPaypal className="text-blue-500" />
                      <span>PayPal</span>
                    </>
                  ) : (
                    <>
                      <FaMoneyBillWave className="text-green-500" />
                      <span>Cash on Delivery</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="w-full mt-4">
                <Message variant="danger">
                  {error.data?.message || "An error occurred"}
                </Message>
              </div>
            )}

            <button
              type="button"
              className={`bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4 hover:bg-pink-600 transition ${
                cart.cartItems.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>

            {isLoading && <Loader className="mt-4" />}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
