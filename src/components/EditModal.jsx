import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const EditModal = ({ seminar, onClose, onSave }) => {
    // Используем react-hook-form для управления формой
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: seminar
    });

    // Сбрасываем значения формы при изменении seminar
    useEffect(() => {
        reset(seminar);
    }, [seminar, reset]);

    // Функция отправки формы (сохранение изменений)
    const onSubmit = async (data) => {
        try {
            await onSave(data);
            onClose();
        } catch (error) {
            console.error("Ошибка при сохранении:", error);
        }
    };

    return (
        <dialog open className='modal-overlay'>
            <h3>Редактировать семинар</h3>

            <form onSubmit={handleSubmit(onSubmit)} className='modal' role="form">
                <label>
                    Название:
                    <input 
                        {...register("title", { required: "Название не может быть пустым" })} 
                    />
                    {errors.title && <span className="error">{errors.title.message}</span>}
                </label>
                <label>
                    Дата:
                    <input 
                        type="date" 
                        {...register("date", { required: "Дата обязательна" })} 
                    />
                    {errors.date && <span className="error">{errors.date.message}</span>}
                </label>
                <label>
                    Описание:
                    <textarea {...register("description", { required: "Описание не может быть пустым" })} />
                </label>
                <label>
                    Ссылка на фото:
                    <input 
                        type="url" 
                        {...register("photo", { required: "Ссылка на фото не может быть пустой" })} 
                    />
                    {errors.photo && <span className="error">{errors.photo.message}</span>}
                </label>

                <div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Сохранение..." : "Сохранить"}
                    </button>
                    <button type="button" onClick={onClose}>Отмена</button>
                </div>
            </form>
        </dialog>
    );
};

export default EditModal;
