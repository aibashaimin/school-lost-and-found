import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PackageSearch } from 'lucide-react';
import { useStore } from '../store.jsx';
import { CATEGORIES } from '../data.js';
import ItemCard from '../components/ItemCard.jsx';

export default function Items() {
  const { items } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Все');
  const [order, setOrder] = useState('new');

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items
      .filter((i) => (cat === 'Все' || i.category === cat) && i.title.toLowerCase().includes(query))
      .sort((a, b) => (order === 'new' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [items, q, cat, order]);

  return (
    <>
      <h1 className="title">Найденные вещи</h1>
      <div className="toolbar">
        <label className="search">
          <Search size={18} />
          <input type="search" placeholder="Поиск по названию" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select value={order} onChange={(e) => setOrder(e.target.value)} aria-label="Сортировка по дате">
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
        </select>
      </div>
      <div className="chips">
        {['Все', ...CATEGORIES].map((c) => (
          <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {list.length ? (
        <div className="grid">{list.map((i) => <ItemCard key={i.id} item={i} />)}</div>
      ) : (
        <div className="empty">
          <PackageSearch size={48} />
          <h3>Ничего не найдено</h3>
          <p>Попробуйте другое название или категорию. Если вы нашли вещь, добавьте её на сайт.</p>
          <Link to="/add" className="btn btn-primary">Добавить находку</Link>
        </div>
      )}
    </>
  );
}
