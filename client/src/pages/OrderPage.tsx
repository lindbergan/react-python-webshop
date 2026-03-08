import { useEffect, useState } from 'react'

interface Order {
  id: string
  date: string
  customer_name: string
  currency: string
  items: OrderItem[]
}

interface OrderItem {
  product_id?: string
  product_name?: string
  product_sku?: string
  quantity: number
  unit_price_excl_tax: number
  tax_rate: number
}

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/order')
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => console.error("Could not fetch orders:", err))
  }, [])

  const calculateTotalAmountInclTax = (order: Order): number => {
    return order.items
      .reduce((a, b) => a + ((b.unit_price_excl_tax * b.quantity) * (1 + b.tax_rate)), 0)
  }

  if (loading) return <p>Fetching orders...</p>

  return (
    <div>
      <h1>Order history</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th>Date</th>
            <th>Customer</th>
            <th>Currency</th>
            <th>Total (incl. tax)</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{order.date}</td>
              <td>{order.customer_name}</td>
              <td>{order.currency}</td>
              <td>{calculateTotalAmountInclTax(order).toFixed(2)}</td>
              <td style={{ fontSize: '0.8rem', color: '#666' }}>{order.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderPage