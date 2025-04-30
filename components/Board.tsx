"use client";

import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Column from "./Column";
import AddColumnForm from "./AddColumnForm";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKanban } from "@/app/contexts/KanbanContext";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function Board() {
  const isMobile = useIsMobile();
  const backend = isMobile ? TouchBackend : HTML5Backend;
  const {
    columns,
    addColumn,
    updateColumn,
    deleteColumn,
    moveTask,
    addTask,
    updateTask,
  } = useKanban();
  const [showAddColumn, setShowAddColumn] = useState(false);

  return (
    <DndProvider backend={backend}>
      <div className="p-4 space-y-4 dark:bg-zinc-800 bg-zinc-200 rounded-lg">
        {/* Botão acima das colunas */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {showAddColumn ? (
            <AddColumnForm
              onCancel={() => setShowAddColumn(false)}
              onAdd={(title) => {
                addColumn(title);
                setShowAddColumn(false);
              }}
            />
          ) : (
            <Button variant="outline" onClick={() => setShowAddColumn(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar coluna
            </Button>
          )}
        </div>

        {/* Área com colunas roláveis */}
        <div
          className="flex overflow-x-auto gap-4 scroll-snap-x"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {columns.map((column) => (
            <div
              key={column.id}
              className="min-w-[250px] max-w-[90vw] flex-shrink-0 scroll-snap-start"
            >
              <Column
                column={column}
                onUpdate={updateColumn}
                onDelete={deleteColumn}
                onMoveTask={moveTask}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={() => {}}
              />
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
