import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import ProductPage from './pages/ProductPage'
import HomePage from './pages/HomePage'

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0d0c0b;
          color: #f0ebe2;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          min-height: 100vh;
        }

        :root {
          --gold: #c9a84c;
          --gold-dim: #9a7d38;
          --bg: #0d0c0b;
          --bg-card: #171614;
          --bg-hover: #1f1d1b;
          --border: rgba(201,168,76,0.18);
          --text: #f0ebe2;
          --text-muted: #8a8278;
          --cream: #f0ebe2;
        }

        .app-shell {
          display: flex;
          min-height: 100vh;
        }

        /* ── Sidebar Nav ── */
        .sidebar {
          width: 220px;
          min-height: 100vh;
          background: #0a0908;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 2.5rem 0;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
        }

        .sidebar-logo {
          padding: 0 2rem 2.5rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 2rem;
        }

        .sidebar-logo-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 300;
          color: var(--gold);
          letter-spacing: 0.04em;
          line-height: 1.1;
        }

        .sidebar-logo-sub {
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .nav-label {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 0 2rem;
          margin-bottom: 0.75rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 2rem;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 0.82rem;
          letter-spacing: 0.06em;
          transition: color 0.2s, background 0.2s;
          border-left: 2px solid transparent;
          user-select: none;
        }

        .nav-item:hover {
          color: var(--text);
          background: var(--bg-hover);
        }

        .nav-item.active {
          color: var(--gold);
          border-left-color: var(--gold);
          background: rgba(201,168,76,0.06);
        }

        .nav-icon {
          font-size: 1rem;
          opacity: 0.7;
        }

        /* ── Main Content ── */
        .main-content {
          flex: 1;
          padding: 3rem 3.5rem;
          overflow-y: auto;
        }

        /* ── Page Header ── */
        .page-header {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .page-eyebrow {
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.5rem;
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem;
          font-weight: 300;
          color: var(--cream);
          letter-spacing: 0.01em;
          line-height: 1.1;
        }

        /* ── Cards ── */
        .card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 4px;
        }

        /* ── Stat Cards ── */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: var(--bg-card);
          padding: 1.8rem 2rem;
        }

        .stat-label {
          font-size: 0.6rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.6rem;
        }

        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: var(--cream);
        }

        .stat-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        /* ── Table ── */
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 0.9rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
          font-weight: 400;
        }

        .data-table td {
          padding: 1rem 1rem;
          border-bottom: 1px solid rgba(201,168,76,0.07);
          font-size: 0.84rem;
          color: var(--text);
          vertical-align: middle;
        }

        .data-table tr:last-child td { border-bottom: none; }

        .data-table tbody tr {
          transition: background 0.15s;
        }

        .data-table tbody tr:hover {
          background: var(--bg-hover);
        }

        .muted-id {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-family: 'Courier New', monospace;
          letter-spacing: 0.02em;
        }

        .badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 2px;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .badge-gold {
          background: rgba(201,168,76,0.12);
          color: var(--gold);
          border: 1px solid rgba(201,168,76,0.3);
        }

        /* ── Loading ── */
        .loading-state {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
          font-size: 0.82rem;
          letter-spacing: 0.06em;
          padding: 4rem 0;
        }

        .loading-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--gold);
          animation: pulse 1.2s infinite;
        }

        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        /* ── Product image placeholder ── */
        .product-thumb {
          width: 40px;
          height: 40px;
          border-radius: 3px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        /* ── Homepage hero ── */
        .hero-section {
          position: relative;
          margin-bottom: 3rem;
          border-radius: 4px;
          overflow: hidden;
          min-height: 240px;
          background: linear-gradient(135deg, #171614 0%, #1f1a10 50%, #0a0908 100%);
          border: 1px solid var(--border);
          display: flex;
          align-items: flex-end;
          padding: 2.5rem;
        }

        .hero-bg-text {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 11rem;
          font-weight: 300;
          color: rgba(201,168,76,0.045);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          white-space: nowrap;
        }

        .hero-content { position: relative; z-index: 1; }

        .hero-greeting {
          font-size: 0.62rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.75rem;
        }

        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3rem;
          font-weight: 300;
          line-height: 1.05;
          color: var(--cream);
        }

        .hero-headline em {
          font-style: italic;
          color: var(--gold);
        }

        /* ── Quick actions ── */
        .action-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        .action-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 1.5rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .action-card:hover {
          border-color: var(--gold-dim);
          background: var(--bg-hover);
        }

        .action-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 300;
          margin-bottom: 0.25rem;
        }

        .action-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .action-arrow {
          font-size: 1.4rem;
          color: var(--gold);
          opacity: 0.6;
        }

        /* ── Section divider ── */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 2.5rem 0 1.5rem;
        }

        .section-divider-label {
          font-size: 0.58rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .section-divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
      `}</style>

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
              home:     { icon: '◈', label: 'Dashboard' },
              orders:   { icon: '◎', label: 'Orders' },
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
