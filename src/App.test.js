import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import SeminarList from './components/SeminarList';
import EditModal from './components/EditModal';
import userEvent from '@testing-library/user-event';

// Тесты работают при конфигурации Babel и Jest с заменой commonJS на ESMAScript

// Тест рендеринга главного приложения
test('renders header in App', () => {
  render(<App />);
  expect(screen.getByText(/Kosmoteros/i)).toBeInTheDocument();
});

// Мокируем данные семинаров
const mockSeminars = [
  { id: 1, title: 'React Seminar', description: 'Learn React Basics', date: '2025-02-15', photo: 'image.jpg' },
  { id: 2, title: 'Advanced React', description: 'Hooks & Context', date: '2025-03-01', photo: 'image2.jpg' },
];

// Тест рендеринга списка семинаров
test('renders SeminarList with seminars', () => {
  render(<SeminarList seminars={mockSeminars} onDelete={jest.fn()} onEdit={jest.fn()} />);
  expect(screen.getByText(/React Seminar/i)).toBeInTheDocument();
  expect(screen.getByText(/Advanced React/i)).toBeInTheDocument();
});

// Тест отображения сообщения, если список семинаров пуст
test('renders empty state message when no seminars', () => {
  render(<SeminarList seminars={[]} onDelete={jest.fn()} onEdit={jest.fn()} />);
  expect(screen.getByText(/.../i)).toBeInTheDocument();
});

// Тест удаления семинара
test('calls onDelete when delete button is clicked', async () => {
  const handleDelete = jest.fn();
  render(<SeminarList seminars={mockSeminars} onDelete={handleDelete} onEdit={jest.fn()} />);
  
  const deleteButtons = screen.getAllByText(/Удалить/i);
  fireEvent.click(deleteButtons[0]);

  expect(handleDelete).toHaveBeenCalledTimes(1);
  expect(handleDelete).toHaveBeenCalledWith(mockSeminars[0].id);
});

// Тест редактирования семинара
test('calls onEdit when edit button is clicked', () => {
  const handleEdit = jest.fn();
  render(<SeminarList seminars={mockSeminars} onDelete={jest.fn()} onEdit={handleEdit} />);

  const editButtons = screen.getAllByText(/Редактировать/i);
  fireEvent.click(editButtons[0]);

  expect(handleEdit).toHaveBeenCalledTimes(1);
  expect(handleEdit).toHaveBeenCalledWith(mockSeminars[0]);
});

// Тест рендеринга модального окна
test('renders EditModal with seminar data', () => {
  render(<EditModal seminar={mockSeminars[0]} onClose={jest.fn()} onSave={jest.fn()} />);

  expect(screen.getByDisplayValue(/React Seminar/i)).toBeInTheDocument();
  expect(screen.getByDisplayValue(/2025-02-15/i)).toBeInTheDocument();
});

// Тест закрытия модального окна
test('calls onClose when cancel button is clicked', () => {
  const handleClose = jest.fn();
  render(<EditModal seminar={mockSeminars[0]} onClose={handleClose} onSave={jest.fn()} />);

  fireEvent.click(screen.getByText(/Отмена/i));
  expect(handleClose).toHaveBeenCalledTimes(1);
});

// Тест сохранения изменений в модальном окне
test('calls onSave with updated seminar data when form is submitted', async () => {
  const handleSave = jest.fn();
  render(<EditModal seminar={mockSeminars[0]} onClose={jest.fn()} onSave={handleSave} />);
  
  const titleInput = screen.getByDisplayValue(/React Seminar/i);
  userEvent.clear(titleInput);
  userEvent.type(titleInput, 'Updated Seminar');

  fireEvent.submit(screen.getByRole('form'));

  await waitFor(() => {
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Seminar' }));
  });
});
