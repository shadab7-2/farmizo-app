"use client";

const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

export default function TopSellingProducts({ products = [] }) {
  return (
    <div className="rounded-2xl border border-border-default bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-heading">Top Selling Products</h3>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border-default text-left text-text-muted">
            <tr>
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Sales Count</th>
              <th className="pb-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {products.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-text-muted">
                  No sales data available
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId || product.name}>
                  <td className="py-3 font-medium text-text-heading">{product.name}</td>
                  <td className="py-3">{product.salesCount}</td>
                  <td className="py-3">{formatMoney(product.revenue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
