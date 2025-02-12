import React from 'react';

const SeminarList = ({ seminars, onDelete, onEdit }) => {
    return (
        <>
            {/* Отображаем список семинаров или сообщение, если данных нет */}
            {seminars.length === 0 ? (
                <p>...</p>
            ) : (
                <ul>
                    {seminars.map((seminar) => (
                        <li key={seminar.id}>
                            <h3>{seminar.title}</h3>
                            <p>{seminar.description}</p>
                            <span>{seminar.date}</span>
                            <img src={seminar.photo} alt={seminar.title} />           
                            <span>
                                <button onClick={() => onEdit(seminar)}>Редактировать</button>
                                <button onClick={() => onDelete(seminar.id)}>Удалить</button>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default SeminarList;

