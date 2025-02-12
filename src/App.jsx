import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SeminarList from './components/SeminarList.jsx';
import EditModal from './components/EditModal.jsx';
import './App.css';

/*
  Большинство стандартных практик, по типу использования тайпскрипт, редакс, 
  вынесение в .env и пр. не использованы в целях создания быстрого, легковесного проекта исключительно по тех. заданию,
  прошу отнестись с пониманием, я по 3 таких задания за день делаю (на разные вакансии), уже глаз дёргается стек подбирать
*/

function App() {
  // Состояния для хранения списка семинаров, загрузки, ошибок и выбранного семинара
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeminar, setSelectedSeminar] = useState(null);

  // Загружаем список семинаров при монтировании компонента
  useEffect(() => {
    fetchSeminars();
  }, []);

  // Функция для загрузки семинаров с сервера
  const fetchSeminars = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/seminars');
      setSeminars(response.data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Функция для удаления семинара
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Удалить семинар?')) {
      try {
        await axios.delete(`http://localhost:3001/seminars/${id}`);
        setSeminars((prevSeminars) => prevSeminars.filter(seminar => seminar.id !== id));
      } catch (err) {
        setError('Ошибка при удалении');
        setError(null);
        console.error(err);
      }
    }
  }, []);

  // Функция для открытия модального окна редактирования
  const handleEdit = useCallback((seminar) => {
    setSelectedSeminar(seminar);
  }, []);

  // Функция для обновления данных о семинаре
  const handleUpdate = async (updatedSeminar) => {
    try {
      await axios.put(`http://localhost:3001/seminars/${updatedSeminar.id}`, updatedSeminar);
      setSeminars((prevSeminars) => 
        prevSeminars.map((seminar) => (seminar.id === updatedSeminar.id ? updatedSeminar : seminar))
      );
      setError(null);
      setSelectedSeminar(null);
    } catch (err) {
      setError('Ошибка при обновлении');
      console.error(err);
    }
  };

  // Функция для закрытия модального окна
  const closeModal = useCallback(() => setSelectedSeminar(null), []);

  return (
    <div className="app">
      <div className="background-image" />
      <header>
        <h1>Kosmoteros</h1>
      </header>

      {/* Отображение состояния загрузки и ошибок*/}
      {loading && <div className='loading'>Загрузка...</div>}
      {error && <div className='loading-error'>{error}</div>}

      {/* Основной контент: список семинаров и модальное окно редактирования */}
      <section>
        <SeminarList seminars={seminars} onDelete={handleDelete} onEdit={handleEdit} />
        {selectedSeminar && (
          <EditModal
            seminar={selectedSeminar}
            onClose={closeModal}
            onSave={handleUpdate}
          />
        )}
      </section>
    </div>
  );
}

export default App;
