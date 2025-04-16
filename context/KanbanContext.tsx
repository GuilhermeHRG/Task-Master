"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

const KanbanContext = createContext(null)

export function KanbanProvider({ children }) {
  const [boardName, setBoardName] = useState("Meu Quadro Kanban")
  const [columns, setColumns] = useState([])
  const [theme, setTheme] = useState({
    colorScheme: "Padrão",
    cardStyle: "default",
    columnGap: 16,
    borderRadius: 8,
    columnWidth: "medium",
  })

  // Inicializar com dados de exemplo
  useEffect(() => {
    // Verificar se já existem dados no localStorage
    const savedData = localStorage.getItem("kanbanData")

    if (savedData) {
      const { boardName, columns, theme } = JSON.parse(savedData)
      setBoardName(boardName)
      setColumns(columns)
      setTheme(theme)
    } else {
      // Dados iniciais de exemplo
      const initialColumns = [
        {
          id: uuidv4(),
          title: "A Fazer",
          tasks: [
            {
              id: uuidv4(),
              title: "Criar protótipo",
              description: "Desenvolver o protótipo inicial do aplicativo",
              priority: "alta",
              dueDate: "2023-12-15",
            },
            {
              id: uuidv4(),
              title: "Reunião com cliente",
              description: "Discutir requisitos do projeto",
              priority: "média",
              dueDate: "2023-12-10",
            },
          ],
        },
        {
          id: uuidv4(),
          title: "Em Progresso",
          tasks: [
            {
              id: uuidv4(),
              title: "Implementar autenticação",
              description: "Adicionar login com Google e email",
              priority: "alta",
              dueDate: "2023-12-20",
            },
          ],
        },
        {
          id: uuidv4(),
          title: "Concluído",
          tasks: [
            {
              id: uuidv4(),
              title: "Configurar ambiente",
              description: "Configurar ambiente de desenvolvimento",
              priority: "baixa",
              dueDate: "2023-12-05",
            },
          ],
        },
      ]

      setColumns(initialColumns)
    }
  }, [])

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    if (columns.length > 0) {
      localStorage.setItem("kanbanData", JSON.stringify({ boardName, columns, theme }))
    }
  }, [boardName, columns, theme])

  const updateBoardName = (name) => {
    setBoardName(name)
  }

  const addColumn = (title) => {
    const newColumn = {
      id: uuidv4(),
      title,
      tasks: [],
    }
    setColumns([...columns, newColumn])
  }

  const updateColumn = (columnId, data) => {
    setColumns(columns.map((column) => (column.id === columnId ? { ...column, ...data } : column)))
  }

  const deleteColumn = (columnId) => {
    setColumns(columns.filter((column) => column.id !== columnId))
  }

  const addTask = (columnId, taskData) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: [...column.tasks, { id: uuidv4(), ...taskData }],
          }
        }
        return column
      }),
    )
  }

  const updateTask = (columnId, taskId, taskData) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.map((task) => (task.id === taskId ? { ...task, ...taskData } : task)),
          }
        }
        return column
      }),
    )
  }

  const deleteTask = (columnId, taskId) => {
    setColumns(
      columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task.id !== taskId),
          }
        }
        return column
      }),
    )
  }

  const moveTask = (taskId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return

    const sourceColumn = columns.find((col) => col.id === sourceColumnId)
    const task = sourceColumn.tasks.find((t) => t.id === taskId)

    // Remover a tarefa da coluna de origem
    const updatedColumns = columns.map((column) => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter((t) => t.id !== taskId),
        }
      }
      // Adicionar a tarefa à coluna de destino
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        }
      }
      return column
    })

    setColumns(updatedColumns)
  }

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
  }

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
      }}
    >
      {children}
    </KanbanContext.Provider>
  )
}

export const useKanban = () => useContext(KanbanContext)
