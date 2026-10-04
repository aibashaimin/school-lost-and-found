import { Link } from 'react-router-dom';

export default function NotFound({ text = 'Такой страницы нет. Возможно, ссылка устарела.' }) {
  return (
    <div className="empty">
      <div className="code">404</div>
      <h3>Страница не найдена</h3>
      <p>{text}</p>
      <Link to="/" className="btn btn-primary">На главную</Link>
    </div>
  );
}
