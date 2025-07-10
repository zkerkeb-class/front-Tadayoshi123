"use client"

const demo = [
  { id: 1, customer: "Acme Inc", total: "$4,560.00" },
  { id: 2, customer: "Globex Corp", total: "$1,240.00" },
  { id: 3, customer: "Soylent Co", total: "$789.00" },
]

export function RecentSales() {
  return (
    <ul className="space-y-2">
      {demo.map((sale) => (
        <li key={sale.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
          <span>{sale.customer}</span>
          <span className="font-medium">{sale.total}</span>
        </li>
      ))}
    </ul>
  )
}

export default RecentSales
