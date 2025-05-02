import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPaypal, FaMoneyBillWave, FaTruck } from "react-icons/fa";
import Message from "../../components/Massage";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid && !window.paypal) {
        loadPayPalScript();
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => orderID);
  };

  const onError = (err) => {
    toast.error(err.message);
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6 bg-[#121212] min-h-screen text-white">
      {/* Left - Order Items */}
      <div className="md:w-2/3 space-y-6">
        <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">Order Items</h2>
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#2a2a2a] text-gray-300">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Product</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">Price</th>
                    <th className="p-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-3">
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
                      <td className="p-3">
                        <Link
                          to={`/product/${item.product}`}
                          className="hover:underline text-pink-400"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-center">${item.price}</td>
                      <td className="p-3 text-center">
                        ${(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right - Summary */}
      <div className="md:w-1/3 space-y-6">
        <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">Shipping Info</h2>
          <div className="space-y-3 text-gray-300">
            <p><strong>Order:</strong> {order._id}</p>
            <p><strong>Name:</strong> {order.user.username}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p>
              <strong>Address:</strong> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            <p className="flex items-center gap-2">
              <strong>Method:</strong>
              {order.paymentMethod === "PayPal" ? (
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
            </p>
          </div>
          <div className="mt-4">
            {order.isPaid ? (
              <Message variant="success">
                Paid on {new Date(order.paidAt).toLocaleString()}
              </Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">Order Summary</h2>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Items</span>
              <span>${order.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${order.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-white">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>
          </div>

          {/* Payment Section */}
          {!order.isPaid && order.paymentMethod === "PayPal" && (
            <div className="mt-6">
              {loadingPay && <Loader />}
              {isPending ? (
                <Loader />
              ) : (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              )}
            </div>
          )}

          {/* Cash on Delivery Message */}
          {!order.isPaid && order.paymentMethod === "CashOnDelivery" && (
            <div className="bg-gray-800 p-4 rounded-lg mt-6">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <FaMoneyBillWave />
                <span>Cash on Delivery Selected</span>
              </div>
              <p className="text-gray-300 text-sm">
                Payment will be collected when your order is delivered.
              </p>
            </div>
          )}

          {/* Admin Deliver Button */}
          {loadingDeliver && <Loader />}
          {userInfo?.isAdmin && !order?.isDelivered && (
            (order?.isPaid || order?.paymentMethod === "CashOnDelivery") && (
              <button
                type="button"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 mt-6 rounded transition flex items-center justify-center gap-2"
                onClick={deliverHandler}
              >
                <FaTruck />
                Mark As Delivered
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
