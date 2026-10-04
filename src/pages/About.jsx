import { Link } from 'react-router-dom';
import { PackageCheck, PlusCircle, Eye, MessageCircle, Handshake } from 'lucide-react';

const STEPS = [
  [PackageCheck, 'Нашёл вещь', 'Заберите находку и не оставляйте её без присмотра.'],
  [PlusCircle, 'Добавь информацию на сайт', 'Заполните короткую форму и по возможности приложите фото.'],
  [Eye, 'Владелец увидит находку', 'Ученики и сотрудники смогут найти вещь в списке.'],
  [MessageCircle, 'Свяжитесь с ответственным', 'Владелец оставляет заявку и называет приметы вещи.'],
  [Handshake, 'Вещь возвращается владельцу', 'Ответственный проверяет данные и передаёт вещь.'],
];

export default function About() {
  return (
    <>
      <h1 className="title">О проекте</h1>
      <section className="box prose">
        <h2>Что такое бюро находок?</h2>
        <p>Это сервис, который помогает ученикам и сотрудникам школы находить потерянные вещи и возвращать их владельцам. Все найденные вещи собраны в одном месте: их можно искать по названию и категории, а не ходить по кабинетам.</p>
      </section>
      <h2 className="section-title">Как это работает?</h2>
      <ol className="steps">
        {STEPS.map(([Icon, t, d], i) => (
          <li key={t}><span className="step-ico"><Icon size={22} /></span><div><h3>{i + 1}. {t}</h3><p>{d}</p></div></li>
        ))}
      </ol>
      <Link to="/items" className="btn btn-primary">Посмотреть находки</Link>
    </>
  );
}
