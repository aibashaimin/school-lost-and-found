import { Link } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import { useStore } from '../store.jsx';
import { RETURNED } from '../data.js';
import ItemCard from '../components/ItemCard.jsx';

export default function Home() {
  const { items } = useStore();
  const returned = items.filter((i) => i.status === RETURNED).length;
  const latest = [...items].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return (
    <>
      <section className="hero">
        <h1>Бюро находок</h1>
        <p>Поможем вернуть потерянное владельцу</p>
        <div className="hero-actions">
          <Link to="/items" className="btn btn-light"><Search size={20} /> Найти вещь</Link>
          <Link to="/add" className="btn btn-outline"><PlusCircle size={20} /> Сообщить о находке</Link>
        </div>
      </section>
      <section className="stats">
        <div><b>{items.length}</b><span>Найдено вещей</span></div>
        <div><b className="green">{returned}</b><span>Возвращено владельцам</span></div>
        <div><b>{items.length - returned}</b><span>Ожидают владельца</span></div>
      </section>
      <div className="section-head">
        <h2>Последние находки</h2>
        <Link to="/items" className="link">Все вещи</Link>
      </div>
      <div className="grid">{latest.map((i) => <ItemCard key={i.id} item={i} />)}</div>
    </>
  );
}
