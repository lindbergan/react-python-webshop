import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import ProductPage from './pages/ProductPage'
import HomePage from './pages/HomePage'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'orders' | 'products'>('home')

  const pageElement = () => {
    if (currentPage === "home") {
      return <HomePage />
    }
    else if (currentPage === "orders") {
      return <OrderPage />
    }
    else if (currentPage === "products") {
      return <ProductPage />
    }

    return `<p>Error</p>`
  }

  return (
    <div className="app-container">
      <nav style={{ padding: '1rem', background: '#f4f4f4', marginBottom: '1rem' }}>
        <button onClick={() => setCurrentPage('home')}>Dashboard</button>
        <button onClick={() => setCurrentPage('orders')} style={{ marginLeft: '10px' }}>Orders</button>
        <button onClick={() => setCurrentPage('products')} style={{ marginLeft: '10px' }}>Products</button>
      </nav>

      <main style={{ padding: '0 1rem' }}>
        {pageElement()}
      </main>
    </div>
  )
}

export default App