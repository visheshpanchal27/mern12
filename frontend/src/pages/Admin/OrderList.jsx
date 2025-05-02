import React from "react";
import { useGetOrdersQuery, useDeleteOrderMutation } from "../../slices/orderApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react"; // Optional icon
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id).unwrap();
        toast.success("Order deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete order");
      }
    }
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Items</th>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Paid</th>
                <th className="px-4 py-2">Delivered</th>
                <th className="px-4 py-2">Payment Method</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-700">
                  <td className="px-4 py-2 flex items-center gap-3">
                    <img
                      src={
                        order.orderItems[0]?.image.startsWith("http")
                          ? order.orderItems[0]?.image
                          : `${import.meta.env.VITE_API_URL}${order.orderItems[0]?.image}`
                      }
                      alt="order item"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm">{order._id}</td>
                  <td className="px-4 py-2 text-sm">{order.user?.name}</td>
                  <td className="px-4 py-2 text-sm">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-4 py-2 text-sm">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.isPaid ? "bg-green-600" : "bg-red-600"}`}>
                      {order.isPaid ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.isDelivered ? "bg-green-600" : "bg-red-600"}`}>
                      {order.isDelivered ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{order.paymentMethod}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                      title="Delete Order"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
