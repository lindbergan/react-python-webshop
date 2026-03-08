import { useEffect, useState } from 'react'

interface Product { id: string; sku: string; product_name: string; unit_price_excl_tax: string; tax_rate: string }
interface Order { id: string; date: string; customer_name: string; currency: string; items: { unit_price_excl_tax: number; quantity: number; tax_rate: number }[] }

interface Props {
  onNavigate: (page: 'home' | 'orders' | 'products') => void
}

const HomePage = ({ onNavigate }: Props) => {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders]     = useState<Order[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/product').then(r => r.json()),
      fetch('http://localhost:8000/order').then(r => r.json()),
    ]).then(([p, o]) => {
      setProducts(p)
      setOrders(o)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const totalRevenue = orders.reduce((sum, o) =>
    sum + o.items.reduce((s, i) => s + i.unit_price_excl_tax * i.quantity * (1 + i.tax_rate), 0), 0)

  const currency = orders[0]?.currency ?? 'EUR'

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div>
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-bg-text">Maison</div>
        <div className="hero-content">
          <div className="hero-greeting">Commerce Dashboard</div>
          <h1 className="hero-headline">
            Your shop,<br /><em>at a glance.</em>
          </h1>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Revenue (incl. tax)</div>
            <div className="stat-value">{totalRevenue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-sub">{currency}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Products</div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-sub">In catalogue</div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="action-row">
        <div className="action-card" onClick={() => onNavigate('orders')}>
          <div>
            <div className="action-title">Order History</div>
            <div className="action-sub">Browse all customer orders</div>
          </div>
          <div className="action-arrow">→</div>
        </div>
        <div className="action-card" onClick={() => onNavigate('products')}>
          <div>
            <div className="action-title">Product Catalogue</div>
            <div className="action-sub">View and manage products</div>
          </div>
          <div className="action-arrow">→</div>
        </div>
      </div>

      {/* Recent orders */}
      {!loading && recentOrders.length > 0 && (
        <>
          <div className="section-divider">
            <span className="section-divider-label">Recent orders</span>
            <div className="section-divider-line" />
          </div>

          <div className="card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Currency</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => {
                  const total = o.items.reduce((s, i) => s + i.unit_price_excl_tax * i.quantity * (1 + i.tax_rate), 0)
                  return (
                    <tr key={o.id}>
                      <td>{new Date(o.date).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td>{o.customer_name}</td>
                      <td><span className="badge badge-gold">{o.currency}</span></td>
                      <td>{total.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage
