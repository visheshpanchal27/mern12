import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
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

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { data: paypal, isLoading: loadingPaPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
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
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    }).then((orderID) => orderID);
  };

  const onError = (err) => {
    toast.error(err.message);
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6 bg-[#121212] min-h-screen text-white">
      {/* Left side - Order Items */}
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
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-3">
                        <Link to={`/product/${item.product}`} className="hover:underline text-pink-400">
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-center">${item.price}</td>
                      <td className="p-3 text-center">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Shipping & Summary */}
      <div className="md:w-1/3 space-y-6">
        <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">Shipping Info</h2>
          <div className="space-y-3 text-gray-300">
            <p><strong>Order:</strong> {order._id}</p>
            <p><strong>Name:</strong> {order.user.username}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
          </div>
          <div className="mt-4">
            {order.isPaid ? (
              <Message variant="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </div>
        </div>

        <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-pink-400">Order Summary</h2>
          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Items</span><span>${order.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span><span>${order.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span><span>${order.taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-white">
              <span>Total</span><span>${order.totalPrice}</span>
            </div>
          </div>

          {!order.isPaid && (
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

          {loadingDeliver && <Loader />}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <button
              type="button"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 mt-6 rounded transition"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
