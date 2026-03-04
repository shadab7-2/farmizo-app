"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mt-10">
        <div className="p-6 bg-white rounded shadow">
          <h3>Total Orders</h3>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">--</p>
        </div>

        <div className="p-6 bg-white rounded shadow">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>
    </div>
  );
}