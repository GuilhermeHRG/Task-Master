
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "alta" | "média" | "baixa";
  dueDate: string;
  boardId: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface ThemeSettings {
  colorScheme: string;
  cardStyle: "default" | "flat" | "bordered";
  columnGap: number;
  borderRadius: number;
  columnWidth: "narrow" | "medium" | "wide";
}

interface KanbanContextType {
  boardName: string;
  columns: Column[];
  theme: ThemeSettings;
  updateBoardName: (name: string) => void;
  addColumn: (title: string) => void;
  updateColumn: (columnId: string, data: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  addTask: (columnId: string, taskData: Omit<Task, "id" | "boardId">) => void;
  updateTask: (columnId: string, taskId: string, taskData: Partial<Task>) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
  updateTheme: (newTheme: ThemeSettings) => void;
  isInitialized: boolean;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [boardName, setBoardName] = useState("Meu Quadro Kanban");
  const [columns, setColumns] = useState<Column[]>([]);
  const [theme, setTheme] = useState<ThemeSettings>({
    colorScheme: "Padrão",
    cardStyle: "default",
    columnGap: 16,
    borderRadius: 8,
    columnWidth: "medium",
  });

  useEffect(() => {
    const localBoard = localStorage.getItem("kanban-board-name");
    const localColumns = localStorage.getItem("kanban-columns");
    const localTheme = localStorage.getItem("kanban-theme");

    if (localBoard) setBoardName(localBoard);
    if (localColumns) setColumns(JSON.parse(localColumns));
    if (localTheme) setTheme(JSON.parse(localTheme));

    setIsInitialized(true);
  }, []);

  const persist = useCallback((newBoard: string, newCols: Column[], newTheme: ThemeSettings) => {
    localStorage.setItem("kanban-board-name", newBoard);
    localStorage.setItem("kanban-columns", JSON.stringify(newCols));
    localStorage.setItem("kanban-theme", JSON.stringify(newTheme));
  }, []);

  const updateBoardName = (name: string) => {
    setBoardName(name);
    persist(name, columns, theme);
  };

  const addColumn = (title: string) => {
    const newColumn: Column = { id: uuidv4(), title, tasks: [] };
    const updated = [...columns, newColumn];
    setColumns(updated);
    persist(boardName, updated, theme);
  };

  const updateColumn = (columnId: string, data: Partial<Column>) => {
    const updated = columns.map((col) =>
      col.id === columnId ? { ...col, ...data } : col
    );
    setColumns(updated);
    persist(boardName, updated, theme);
  };

  const deleteColumn = (columnId: string) => {
    const updated = columns.filter((col) => col.id !== columnId);
    setColumns(updated);
    persist(boardName, updated, theme);
  };

  const addTask = (columnId: string, taskData: Omit<Task, "id" | "boardId">) => {
    const newTask: Task = { ...taskData, id: uuidv4(), boardId: columnId };
    const updated = columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
    );
    setColumns(updated);
    persist(boardName, updated, theme);
  };

  const updateTask = (columnId: string, taskId: string, taskData: Partial<Task>) => {
    const updated = columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map((task) =>
              task.id === taskId ? { ...task, ...taskData } : task
            ),
          }
        : col
    );
    setColumns(updated);
    persist(boardName, updated, theme);
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const updated = columns.map((col) =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
        : col
    );
    setColumns(updated);
    persist(boardName, updated, theme);
  };

  const moveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    let movedTask: Task | null = null;
    const updated = columns.map((col) => {
      if (col.id === sourceColumnId) {
        const remaining = col.tasks.filter((task) => {
          if (task.id === taskId) {
            movedTask = task;
            return false;
          }
          return true;
        });
        return { ...col, tasks: remaining };
      }
      return col;
    }).map((col) => {
      if (col.id === targetColumnId && movedTask) {
        return { ...col, tasks: [...col.tasks, movedTask!] };
      }
      return col;
    });

    setColumns(updated);
    persist(boardName, updated, theme);
  };

  const updateTheme = (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    persist(boardName, columns, newTheme);
  };

  return (
    <KanbanContext.Provider
      value={{
        boardName,
        columns,
        theme,
        updateBoardName,
        addColumn,
        updateColumn,
        deleteColumn,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        updateTheme,
        isInitialized,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) throw new Error("useKanban deve ser usado dentro de um KanbanProvider");
  return context;
};
