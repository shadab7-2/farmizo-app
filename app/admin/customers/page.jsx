"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  UserX,
} from "lucide-react";
import api from "@/services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const limit = 10;

  useEffect(() => {
    loadCustomers();
  }, [page]);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/admin/customers?page=${page}&limit=${limit}&search=${search}`
      );

      setCustomers(res.data.data);

      setStats({
        totalCustomers: res.data.totalCustomers,
        totalOrders: res.data.totalOrders,
        totalRevenue: res.data.totalRevenue,
      });
    } catch (err) {
      console.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await api.patch(`/admin/customers/${id}/toggle`);

      loadCustomers();
    } catch (err) {
      console.error("Failed to update user");
    }
  };

  return (
    <main className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Customers
        </h1>
        <p className="text-gray-500">
          Manage all store customers
        </p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl border flex gap-4 items-center">
          <Users className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-xl font-semibold">
              {stats.totalCustomers}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border flex gap-4 items-center">
          <ShoppingCart className="text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <p className="text-xl font-semibold">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border flex gap-4 items-center">
          <DollarSign className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-xl font-semibold">
              ₹{stats.totalRevenue}
            </p>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 border rounded-xl flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          placeholder="Search customers..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={loadCustomers}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading customers...
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Spent</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {customer.name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {customer.email}
                  </td>

                  <td className="p-4">
                    {customer.ordersCount}
                  </td>

                  <td className="p-4">
                    ₹{customer.totalSpent}
                  </td>

                  <td className="p-4">
                    {new Date(
                      customer.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-3">

                    {/* VIEW PROFILE */}
                    <button
                      onClick={() =>
                        setSelectedCustomer(customer)
                      }
                      className="text-blue-600 hover:opacity-80"
                    >
                      <Eye size={18} />
                    </button>

                    {/* DISABLE USER */}
                    <button
                      onClick={() =>
                        toggleUserStatus(customer._id)
                      }
                      className="text-red-500"
                    >
                      <UserX size={18} />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-lg"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-lg"
        >
          Next
        </button>

      </div>

      {/* CUSTOMER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-xl w-[400px]">

            <h2 className="text-xl font-semibold mb-4">
              Customer Details
            </h2>

            <p>
              <b>Name:</b> {selectedCustomer.name}
            </p>

            <p>
              <b>Email:</b> {selectedCustomer.email}
            </p>

            <p>
              <b>Orders:</b>{" "}
              {selectedCustomer.ordersCount}
            </p>

            <p>
              <b>Total Spent:</b> ₹
              {selectedCustomer.totalSpent}
            </p>

            <button
              onClick={() =>
                setSelectedCustomer(null)
              }
              className="mt-6 bg-black text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </main>
  );
}