import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CalendarDays, Tag, Trash2, Hand, Send } from 'lucide-react';
import { useStore } from '../store.jsx';
import { StatusBadge, fmtDate } from '../components/ItemCard.jsx';
import NotFound from './NotFound.jsx';

export default function ItemDetail() {
  const { id } = useParams();
  const { items, removeItem, notify } = useStore();
  const navigate = useNavigate();
  const item = items.find((i) => i.id === id);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: '', contact: '', message: '' });
  const [err, setErr] = useState({});

  if (!item) return <NotFound text="Такой находки нет — возможно, её удалили." />;

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Укажите имя (минимум 2 символа)';
    if (f.contact.trim().length < 3) er.contact = 'Укажите класс, почту или телефон для связи';
    if (f.message.trim().length < 10) er.message = 'Опишите вещь подробнее (минимум 10 символов): цвет, приметы, что внутри';
    setErr(er);
    if (Object.keys(er).length) return;
    setSent(true);
    notify('Заявка отправлена ответственному за бюро находок');
  };

  const del = () => {
    if (window.confirm('Удалить эту находку?')) {
      removeItem(item.id);
      notify('Находка удалена');
      navigate('/items');
    }
  };

  return (
    <>
      <Link to="/items" className="link back"><ArrowLeft size={18} /> Ко всем вещам</Link>
      <div className="detail">
        <img src={item.image} alt={item.title} />
        <div>
          <StatusBadge status={item.status} />
          <h1>{item.title}</h1>
          <p className="desc">{item.description}</p>
          <p className="meta big"><Tag size={18} /> Категория: {item.category}</p>
          <p className="meta big"><MapPin size={18} /> Место находки: {item.place}</p>
          <p className="meta big"><CalendarDays size={18} /> Дата: {fmtDate(item.date)}</p>
          <div className="row">
            {!open && !sent && (
              <button className="btn btn-primary" onClick={() => setOpen(true)}><Hand size={20} /> Это моя вещь</button>
            )}
            <button className="btn btn-ghost danger" onClick={del}><Trash2 size={18} /> Удалить</button>
          </div>

          {sent && <div className="note ok">Заявка отправлена. Ответственный свяжется с вами и попросит назвать приметы вещи.</div>}
          {open && !sent && (
            <form className="form box" onSubmit={submit} noValidate>
              <h3>Связаться с ответственным</h3>
              <p className="hint">Контакты нашедшего не показываются. Ответственный проверит, что вещь ваша, и передаст её.</p>
              <label>Ваше имя
                <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                {err.name && <small className="err">{err.name}</small>}
              </label>
              <label>Как с вами связаться
                <input value={f.contact} placeholder="Класс, почта или телефон" onChange={(e) => setF({ ...f, contact: e.target.value })} />
                {err.contact && <small className="err">{err.contact}</small>}
              </label>
              <label>Как докажете, что вещь ваша
                <textarea rows="3" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
                {err.message && <small className="err">{err.message}</small>}
              </label>
              <button className="btn btn-primary" type="submit"><Send size={18} /> Отправить заявку</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
