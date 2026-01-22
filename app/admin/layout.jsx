export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Farmizo Admin</h2>
        <nav className="space-y-3">
          <a href="/admin/dashboard">Dashboard</a><br />
          <a href="/admin/products">Products</a><br />
          <a href="/admin/orders">Orders</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
