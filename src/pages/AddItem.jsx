import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import { useStore } from '../store.jsx';
import { CATEGORIES, WAITING, placeholder } from '../data.js';

const today = () => new Date().toISOString().slice(0, 10);

function readImage(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      const im = new Image();
      im.onerror = reject;
      im.onload = () => {
        const s = Math.min(1, 700 / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

export default function AddItem() {
  const { addItem, notify } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ title: '', category: '', description: '', place: '', date: today(), contact: '' });
  const [photo, setPhoto] = useState('');
  const [err, setErr] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setErr({ ...err, photo: 'Выберите файл-изображение (JPG, PNG, WebP)' });
    if (file.size > 8 * 1024 * 1024) return setErr({ ...err, photo: 'Файл слишком большой (максимум 8 МБ)' });
    try {
      setPhoto(await readImage(file));
      setErr({ ...err, photo: '' });
    } catch {
      setErr({ ...err, photo: 'Не удалось прочитать изображение' });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.title.trim().length < 3) er.title = 'Введите название (минимум 3 символа)';
    if (!f.category) er.category = 'Выберите категорию';
    if (f.description.trim().length < 10) er.description = 'Опишите вещь подробнее (минимум 10 символов)';
    if (f.place.trim().length < 2) er.place = 'Укажите, где нашли вещь';
    if (!f.date) er.date = 'Укажите дату находки';
    else if (f.date > today()) er.date = 'Дата не может быть в будущем';
    if (f.contact.trim().length < 5) er.contact = 'Укажите контакт: почту, телефон или класс (минимум 5 символов)';
    if (err.photo) er.photo = err.photo;
    setErr(er);
    if (Object.keys(er).length) return;
    addItem({
      title: f.title.trim(), category: f.category, description: f.description.trim(),
      place: f.place.trim(), date: f.date, contact: f.contact.trim(), status: WAITING,
      image: photo || placeholder(f.category),
    });
    notify('Находка добавлена и появилась в списке');
    navigate('/items');
  };

  const field = (k) => err[k] && <small className="err">{err[k]}</small>;

  return (
    <>
      <h1 className="title">Добавить находку</h1>
      <form className="form box narrow" onSubmit={submit} noValidate>
        <label>Название вещи
          <input value={f.title} onChange={set('title')} placeholder="Например, синий зонт" />{field('title')}
        </label>
        <label>Категория
          <select value={f.category} onChange={set('category')}>
            <option value="">Выберите категорию</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>{field('category')}
        </label>
        <label>Описание
          <textarea rows="4" value={f.description} onChange={set('description')} placeholder="Цвет, приметы, состояние" />{field('description')}
        </label>
        <div className="two">
          <label>Место находки
            <input value={f.place} onChange={set('place')} placeholder="Например, 2 этаж" />{field('place')}
          </label>
          <label>Дата находки
            <input type="date" max={today()} value={f.date} onChange={set('date')} />{field('date')}
          </label>
        </div>
        <label>Фотография (необязательно)
          <span className="file"><ImagePlus size={20} /> {photo ? 'Фото выбрано' : 'Выбрать файл'}
            <input type="file" accept="image/*" onChange={onFile} hidden />
          </span>
          {photo && <img className="preview" src={photo} alt="Предпросмотр" />}
          {field('photo')}
        </label>
        <label>Контакт для связи
          <input value={f.contact} onChange={set('contact')} placeholder="Почта, телефон или класс" />{field('contact')}
          <small className="hint">Контакт увидит только ответственный за бюро находок.</small>
        </label>
        <button className="btn btn-primary" type="submit">Добавить находку</button>
      </form>
    </>
  );
}
