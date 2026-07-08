import { Link, Outlet } from "@tanstack/react-router";

const TABS = [
  { to: "/supplier/suppliers", label: "Suppliers" },
  { to: "/supplier/purchase-orders", label: "Purchase Orders" },
];

export function SupplierLayout() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Supplier</h1>
      <div className="flex gap-1 border-b border-black/10">
        {TABS.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className="px-4 py-2 text-sm text-black/60 data-[status=active]:border-b-2 data-[status=active]:border-primary data-[status=active]:text-primary"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
