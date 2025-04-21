
import { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    title: 'Todo List',
    addTodo: 'Add a new todo',
    addButton: 'Add',
    delete: 'Delete',
    category: 'Category',
    priority: 'Priority',
    dueDate: 'Due Date'
  },
  ja: {
    title: 'やることリスト',
    addTodo: '新しいタスクを追加',
    addButton: '追加',
    delete: '削除'
  },
  es: {
    title: 'Lista de Tareas',
    addTodo: 'Agregar nueva tarea',
    addButton: 'Agregar',
    delete: 'Eliminar'
  },
  fr: {
    title: 'Liste de Tâches',
    addTodo: 'Ajouter une tâche',
    addButton: 'Ajouter',
    delete: 'Supprimer'
  },
  hi: {
    title: 'कार्य सूची',
    addTodo: 'नया कार्य जोड़ें',
    addButton: 'जोड़ें',
    delete: 'हटाएं'
  },
  de: {
    title: 'Aufgabenliste',
    addTodo: 'Neue Aufgabe hinzufügen',
    addButton: 'Hinzufügen',
    delete: 'Löschen'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const t = (key) => translations[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
