// import { useState, useEffect } from 'react';

// // Хук для сохранения состояния формы между маршрутами
// export const useDocumentFormState = (initialState = {}) => {
//     const [formState, setFormState] = useState(() => {
//         // Пытаемся восстановить состояние из localStorage
//         const savedState = localStorage.getItem('documentFormState');
//         return savedState ? JSON.parse(savedState) : initialState;
//     });

//     // Сохраняем состояние в localStorage при изменении
//     useEffect(() => {
//         localStorage.setItem('documentFormState', JSON.stringify(formState));
//     }, [formState]);

//     // Метод для обновления состояния
//     const updateFormState = (newState) => {
//         setFormState(prevState => ({
//             ...prevState,
//             ...newState
//         }));
//     };

//     // Метод для очистки состояния
//     const clearFormState = () => {
//         localStorage.removeItem('documentFormState');
//         setFormState({});
//     };

//     return [formState, updateFormState, clearFormState];
// };