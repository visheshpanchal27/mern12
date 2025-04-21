import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import { FaDollarSign, FaUsers, FaClipboardList } from "react-icons/fa";

import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        background: "#1a1a1a",
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: { color: "#ffffff" },
      },
      grid: {
        borderColor: "#333",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: { color: "#ccc" },
        },
        labels: {
          style: {
            colors: "#ccc",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
          style: { color: "#ccc" },
        },
        labels: {
          style: {
            colors: "#ccc",
          },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: false,
        labels: {
          colors: "#ccc",
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  const StatCard = ({ icon, title, value }) => (
    <div className="rounded-xl bg-black/50 backdrop-blur-md p-6 w-[18rem] mt-5 shadow-md border border-gray-700 transition transform hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-pink-500 text-white w-12 h-12 flex items-center justify-center rounded-full text-xl">
        {icon}
      </div>
      <p className="mt-4 text-gray-300">{title}</p>
      <h1 className="text-2xl font-bold text-white mt-1">{value}</h1>
    </div>
  );

  return (
    <>
      <AdminMenu />
      <section className="xl:ml-[4rem] md:ml-0 p-5">
        <div className="flex justify-center flex-wrap gap-8">
          <StatCard
            icon={<FaDollarSign />}
            title="Sales"
            value={
              isLoading ? <Loader /> : `$${sales?.totalSales.toFixed(2) || 0}`
            }
          />
          <StatCard
            icon={<FaUsers />}
            title="Customers"
            value={loading ? <Loader /> : customers?.length || 0}
          />
          <StatCard
            icon={<FaClipboardList />}
            title="All Orders"
            value={loadingTwo ? <Loader /> : orders?.totalOrders || 0}
          />
        </div>

        <div className="mt-12 flex justify-center">
          <div className="bg-black/60 p-6 rounded-xl shadow-md border border-gray-700 w-full max-w-[1000px]">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div>

        <div className="mt-10">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
