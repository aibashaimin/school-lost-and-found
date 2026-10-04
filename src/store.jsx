import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { SEED } from './data.js';

const Ctx = createContext(null);
const KEY = 'bn_items_v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* повреждённые данные — используем тестовые */
  }
  return SEED;
}

export function StoreProvider({ children }) {
  const [items, setItems] = useState(load);
  const [toast, setToast] = useState(null);

  const notify = useCallback((text, type = 'success') => setToast({ text, type, id: Date.now() }), []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      notify('Не удалось сохранить: память браузера переполнена. Попробуйте фото поменьше.', 'error');
    }
  }, [items, notify]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(t);
  }, [toast]);

  const addItem = (item) => setItems((prev) => [{ ...item, id: Date.now().toString(36) }, ...prev]);
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const resetDemo = () => setItems(SEED);

  return (
    <Ctx.Provider value={{ items, addItem, removeItem, resetDemo, notify }}>
      {children}
      {toast && (
        <div className={`toast ${toast.type}`} role="status" key={toast.id}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.text}</span>
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useStore = () => useContext(Ctx);
