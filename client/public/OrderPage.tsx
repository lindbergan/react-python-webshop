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
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/order')
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a: Order, b: Order) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setOrders(sorted)
        setLoading(false)
      })
      .catch(err => console.error('Could not fetch orders:', err))
  }, [])

  const totalInclTax = (order: Order) =>
    order.items.reduce((a, b) => a + b.unit_price_excl_tax * b.quantity * (1 + b.tax_rate), 0)

  const toggleExpand = (id: string) =>
    setExpanded(prev => prev === id ? null : id)

  if (loading) return (
    <div className="loading-state">
      <div className="loading-dot" />
      <div className="loading-dot" />
      <div className="loading-dot" />
      <span style={{ marginLeft: '0.5rem' }}>Loading orders</span>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div className="page-eyebrow">Commerce</div>
        <h1 className="page-title">Order History</h1>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Currency</th>
              <th>Total (incl. tax)</th>
              <th>ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <>
                <tr
                  key={order.id}
                  onClick={() => toggleExpand(order.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{new Date(order.date).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td style={{ fontWeight: 400 }}>{order.customer_name}</td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                  </td>
                  <td><span className="badge badge-gold">{order.currency}</span></td>
                  <td style={{ fontWeight: 500 }}>{totalInclTax(order).toFixed(2)}</td>
                  <td><span className="muted-id">{order.id}</span></td>
                  <td style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                    {expanded === order.id ? '▲' : '▼'}
                  </td>
                </tr>

                {expanded === order.id && (
                  <tr key={`${order.id}-detail`} style={{ background: 'rgba(201,168,76,0.03)' }}>
                    <td colSpan={7} style={{ padding: '0 1rem 1.2rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                        <thead>
                          <tr>
                            {['Product', 'SKU', 'Qty', 'Unit price', 'Tax rate', 'Line total'].map(h => (
                              <th key={h} style={{
                                fontSize: '0.56rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)',
                                padding: '0.4rem 0.75rem',
                                textAlign: 'left',
                                borderBottom: '1px solid var(--border)',
                                fontWeight: 400,
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, i) => {
                            const lineTotal = item.unit_price_excl_tax * item.quantity * (1 + item.tax_rate)
                            return (
                              <tr key={i}>
                                <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem' }}>{item.product_name ?? '—'}</td>
                                <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.product_sku ?? '—'}</td>
                                <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem' }}>{item.quantity}</td>
                                <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem' }}>{item.unit_price_excl_tax.toFixed(2)}</td>
                                <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{(item.tax_rate * 100).toFixed(0)}%</td>
                                <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.82rem', fontWeight: 500 }}>{lineTotal.toFixed(2)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
        {orders.length} orders · Click a row to expand line items
      </div>
    </div>
  )
}

export default OrderPage
