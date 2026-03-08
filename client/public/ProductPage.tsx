import { useEffect, useState } from 'react'

interface Product {
  id: string
  sku: string
  product_name: string
  unit_price_excl_tax: string
  tax_rate: string
}

// Simple emoji-based product icon based on name keywords
const productIcon = (name: string): string => {
  const n = name.toLowerCase()
  if (n.includes('shoe') || n.includes('boot') || n.includes('sneaker')) return '👟'
  if (n.includes('shirt') || n.includes('tee') || n.includes('top')) return '👕'
  if (n.includes('bag') || n.includes('purse') || n.includes('tote')) return '👜'
  if (n.includes('watch') || n.includes('clock')) return '⌚'
  if (n.includes('hat') || n.includes('cap')) return '🧢'
  if (n.includes('glass') || n.includes('sunglass')) return '🕶️'
  if (n.includes('ring') || n.includes('bracelet') || n.includes('necklace')) return '💍'
  if (n.includes('jacket') || n.includes('coat')) return '🧥'
  if (n.includes('dress') || n.includes('skirt')) return '👗'
  if (n.includes('book')) return '📖'
  if (n.includes('phone') || n.includes('mobile')) return '📱'
  return '◇'
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/product')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(err => console.error('Could not fetch products:', err))
  }, [])

  const filtered = products.filter(p =>
    p.product_name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="loading-state">
      <div className="loading-dot" />
      <div className="loading-dot" />
      <div className="loading-dot" />
      <span style={{ marginLeft: '0.5rem' }}>Loading catalogue</span>
    </div>
  )

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="page-eyebrow">Inventory</div>
          <h1 className="page-title">Product Catalogue</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              padding: '0.55rem 1rem',
              color: 'var(--text)',
              fontSize: '0.8rem',
              outline: 'none',
              width: '220px',
              letterSpacing: '0.03em',
            }}
          />
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Unit Price</th>
              <th>Tax</th>
              <th>Price incl. tax</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => {
              const price = parseFloat(product.unit_price_excl_tax)
              const tax   = parseFloat(product.tax_rate)
              const taxAmount = price * tax
              const priceInclTax = price + taxAmount
              return (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb">{productIcon(product.product_name)}</div>
                      <span>{product.product_name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-gold">{product.sku}</span></td>
                  <td>{price.toFixed(2)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>+{taxAmount.toFixed(2)} ({(tax * 100).toFixed(0)}%)</td>
                  <td style={{ fontWeight: 500 }}>{priceInclTax.toFixed(2)}</td>
                  <td><span className="muted-id">{product.id}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', letterSpacing: '0.06em' }}>
            No products match your search.
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
        {filtered.length} of {products.length} products
      </div>
    </div>
  )
}

export default ProductPage
