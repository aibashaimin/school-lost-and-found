import { useEffect, useState } from 'react';
import { NavLink, Link, Route, Routes, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import Home from './pages/Home.jsx';
import Items from './pages/Items.jsx';
import ItemDetail from './pages/ItemDetail.jsx';
import AddItem from './pages/AddItem.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

const LINKS = [
  ['/', 'Главная'],
  ['/items', 'Найденные вещи'],
  ['/add', 'Добавить находку'],
  ['/about', 'О проекте'],
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo"><span className="logo-mark"><Search size={18} /></span>Бюро находок</Link>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className={`links ${open ? 'open' : ''}`}>
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">Бюро находок · школьный проект</footer>
    </>
  );
}
