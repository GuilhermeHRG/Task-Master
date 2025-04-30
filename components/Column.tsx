"use client";

import { useState } from "react";
import { useDrop } from "react-dnd";
import Card, { Task } from "./Card";
import TaskForm from "./TaskForm";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ColumnProps {
  column: ColumnType;
  onUpdate: (id: string, data: Partial<ColumnType>) => void;
  onDelete: (id: string) => void;
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onAddTask: (columnId: string, task: Omit<Task, "id" | "boardId">) => void;
  onUpdateTask: (columnId: string, taskId: string, data: Partial<Task>) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

interface ColumnType {
  id: string;
  title: string;
  tasks: Task[];
}


interface ColumnProps {
  column: ColumnType;
  onUpdate: (id: string, data: Partial<ColumnType>) => void;
  onDelete: (id: string) => void;
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
  onAddTask: (columnId: string, task: Omit<Task, "id" | "boardId">) => void;
  onUpdateTask: (columnId: string, taskId: string, data: Partial<Task>) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
}

export default function Column({
  column,
  onUpdate,
  onDelete,
  onMoveTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: ColumnProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string; columnId: string }) => {
      if (item && item.id && item.columnId && item.columnId !== column.id) {
        onMoveTask(item.id, item.columnId, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [column.id]);

  const handleTitleSave = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdate(column.id, { title: trimmed });
    } else {
      setTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  return (
    <div
    //@ts-ignore 
      ref={dropRef}
      className={cn(
        "flex-shrink-0 flex flex-col rounded-lg bg-background transition-shadow w-72",
        isOver ? "ring-2 ring-primary" : ""
      )}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b">
        {isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") {
                setTitle(column.title);
                setIsEditingTitle(false);
              }
            }}
            className="h-7 py-1 text-sm"
          />
        ) : (
          <div
            onClick={() => setIsEditingTitle(true)}
            className="font-medium flex items-center gap-2 cursor-pointer"
            title="Clique para editar"
          >
            {column.title}
            <Badge variant="outline" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>Renomear</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(column.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Coluna
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {column.tasks.map((task) => (
          <Card
            key={task.id}
            task={task}
            columnId={column.id}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            theme={{ cardStyle: "default", borderRadius: 8 }}
          />
        ))}
      </div>

      {/* Adicionar tarefa */}
      <div className="p-2">
        {showAddTask ? (
          <TaskForm
            onSubmit={(taskData) => {
              //@ts-ignore
              onAddTask(column.id, taskData);
              setShowAddTask(false);
            }}
            onCancel={() => setShowAddTask(false)}
          />
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setShowAddTask(true)}
          >
            <Plus size={16} className="mr-2" />
            Adicionar Tarefa
          </Button>
        )}
      </div>
    </div>
  );
}

