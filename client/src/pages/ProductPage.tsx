import { useEffect, useState } from 'react'

interface Product {
  id: string
  sku: string
  product_name: string
  unit_price_excl_tax: string
  tax_rate: string
}

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/product')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => console.error("Could not fetch products:", err))
  }, [])

  if (loading) return <p>Fetching products...</p>

  return (
    <div>
      <h1>Products</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th>SKU</th>
            <th>Name</th>
            <th>Unit price excl. tax</th>
            <th>Tax</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{product.sku}</td>
              <td>{product.product_name}</td>
              <td>{parseFloat(product.unit_price_excl_tax).toFixed(2)}</td>
              <td>{(parseFloat(product.tax_rate) * parseFloat(product.unit_price_excl_tax)).toFixed(2)}</td>
              <td style={{ fontSize: '0.8rem', color: '#666' }}>{product.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductPage