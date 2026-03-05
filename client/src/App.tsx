import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import HomePage from './pages/HomePage'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'orders'>('home')

  return (
    <div className="app-container">
      <nav style={{ padding: '1rem', background: '#f4f4f4', marginBottom: '1rem' }}>
        <button onClick={() => setCurrentPage('home')}>Dashboard</button>
        <button onClick={() => setCurrentPage('orders')} style={{ marginLeft: '10px' }}>Orders</button>
      </nav>

      <main style={{ padding: '0 1rem' }}>
        {currentPage === 'home' ? <HomePage /> : <OrderPage />}
      </main>
    </div>
  )
}

export default App