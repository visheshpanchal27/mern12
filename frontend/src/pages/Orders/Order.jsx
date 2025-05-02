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

  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = 
    useGetPaypalClientIdQuery();

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
      {/* Left side - Order Items */}
      <div className="md:w-2/3 space-y-6">
        {/* ... (keep your existing order items table code) ... */}
      </div>

      {/* Right side - Shipping & Summary */}
      <div className="md:w-1/3 space-y-6">
        {/* ... (keep your existing shipping info code) ... */}

        <div className="bg-[#1e1e1e] rounded-2xl shadow-lg p-6">
          {/* ... (keep your existing order summary code) ... */}

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

          {userInfo?.isAdmin && !order?.isDelivered && (
            (order?.paymentMethod === "PayPal" && order?.isPaid) ||
            (order?.paymentMethod === "CashOnDelivery" && !order?.isPaid)
          ) && (
            <button
              type="button"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 mt-6 rounded transition flex items-center justify-center gap-2"
              onClick={deliverHandler}
            >
              <FaTruck />
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
