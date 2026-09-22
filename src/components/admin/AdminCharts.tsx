"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdminCharts({
  sales,
  monthly,
}: {
  sales: { name: string; orders: number; revenue: number }[];
  monthly: { name: string; revenue: number }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-5 shadow-soft">
        <h3 className="font-serif text-xl">Sales trends</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sales}>
              <CartesianGrid stroke="#E8D7B7" strokeDasharray="4 4" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area dataKey="orders" stroke="#D4AF37" fill="#E8D7B7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-soft">
        <h3 className="font-serif text-xl">Monthly revenue</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthly}>
              <CartesianGrid stroke="#E8D7B7" strokeDasharray="4 4" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area dataKey="revenue" stroke="#111111" fill="#FAF8F5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
