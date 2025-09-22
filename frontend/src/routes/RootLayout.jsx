import { Outlet, Link, NavLink } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '12px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>SentiLearn</h1>
        </Link>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#1e88e5' : '#333', textDecoration: 'none' })}>
            Home
          </NavLink>
        </nav>
      </header>
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
      <footer style={{ padding: 16, borderTop: '1px solid #eee', fontSize: 12, color: '#666' }}>
        © {new Date().getFullYear()} SentiLearn
      </footer>
    </div>
  )
}


