"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingCart, DollarSign, Eye, UserX } from "lucide-react";
import toast from "react-hot-toast";
import { getAdminCustomers, toggleAdminCustomerStatus, deleteAdminUser } from "@/services/admin.service";
import useDebounce from "@/hooks/useDebounce";
import SearchInput from "@/components/common/SearchInput";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const debouncedSearch = useDebounce(search, 500);

  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    loadCustomers();
  }, [page, debouncedSearch]);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const { customers, stats, pagination } = await getAdminCustomers({
        page,
        limit,
        search: debouncedSearch,
      });

      setCustomers(customers);
      setStats({
        totalCustomers: stats.totalCustomers,
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
      });
      setPagination(pagination);
    } catch (err) {
      console.error("Failed to load customers");
      toast.error(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      await toggleAdminCustomerStatus(id);

      loadCustomers();
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteAdminUser(deleteTarget._id);
      toast.success("User deleted");
      setDeleteTarget(null);
      loadCustomers();
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
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
              Rs. {stats.totalRevenue}
            </p>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 border rounded-xl flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search customers..."
          className="flex-1"
        />
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
                    Rs. {customer.totalSpent}
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
                      onClick={() => toggleUserStatus(customer._id)}
                      className="text-red-500"
                    >
                      <UserX size={18} />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(customer)}
                      className="text-red-600 font-semibold text-xs border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                    >
                      Delete
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
          disabled={!pagination.hasPrevPage}
          onClick={() => setPage(Math.max(1, page - 1))}
          className="px-4 py-2 border rounded-lg disabled:opacity-60"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <button
          disabled={!pagination.hasNextPage}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-60"
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
              <b>Total Spent:</b> Rs. 
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

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[360px]">
            <h2 className="text-lg font-semibold text-text-heading mb-2">Delete User?</h2>
            <p className="text-sm text-text-muted mb-6">
              This action will permanently remove {deleteTarget.name || "this user"}.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-border-default text-text-heading hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-status-error text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
