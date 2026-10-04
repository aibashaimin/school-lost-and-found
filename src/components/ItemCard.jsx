import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Tag } from 'lucide-react';
import { RETURNED } from '../data.js';

export const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d) ? iso : d.toLocaleDateString('ru-RU');
};

export function StatusBadge({ status }) {
  return <span className={`badge ${status === RETURNED ? 'ok' : ''}`}>{status}</span>;
}

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="card">
      <img src={item.image} alt={item.title} loading="lazy" />
      <div className="card-body">
        <StatusBadge status={item.status} />
        <h3>{item.title}</h3>
        <p className="meta"><Tag size={15} /> {item.category}</p>
        <p className="meta"><MapPin size={15} /> {item.place}</p>
        <p className="meta"><CalendarDays size={15} /> {fmtDate(item.date)}</p>
      </div>
    </Link>
  );
}
