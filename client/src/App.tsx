import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import ProductPage from './pages/ProductPage'
import HomePage from './pages/HomePage'
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'orders' | 'products'>('home')

  const pageElement = () => {
    if (currentPage === 'home') return <HomePage onNavigate={setCurrentPage} />
    if (currentPage === 'orders') return <OrderPage />
    if (currentPage === 'products') return <ProductPage />
    return <p>Error</p>
  }

  return (
    <>
      <div className="app-shell">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">Maison</div>
            <div className="sidebar-logo-sub">Commerce Suite</div>
          </div>

          <div className="nav-label">Navigation</div>

          {(['home', 'orders', 'products'] as const).map((page) => {
            const meta = {
              home: { icon: '◈', label: 'Dashboard' },
              orders: { icon: '◎', label: 'Orders' },
              products: { icon: '◇', label: 'Products' },
            }[page]
            return (
              <div
                key={page}
                className={`nav-item ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                <span className="nav-icon">{meta.icon}</span>
                {meta.label}
              </div>
            )
          })}
        </nav>

        {/* Content */}
        <main className="main-content">
          {pageElement()}
        </main>
      </div>
    </>
  )
}

export default App
