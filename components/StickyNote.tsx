import { useDrag, useDrop } from 'react-dnd';
import { useState } from 'react';

interface StickyNoteProps {
  id: string;
  content: string;
  left: number;
  top: number;
  onMove: (id: string, left: number, top: number) => void;
  onUpdateContent: (id: string, content: string) => void;
}

export function StickyNote({ id, content, left, top, onMove, onUpdateContent }: StickyNoteProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'sticky-note',
    item: { id, left, top },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'sticky-note',
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()!;
      const newLeft = Math.round(item.left + delta.x);
      const newTop = Math.round(item.top + delta.y);
      onMove(id, newLeft, newTop);
    },
  }));

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(content);

  const handleBlur = () => {
    onUpdateContent(id, text);
    setEditing(false);
  };

  return (
    <div
    //@ts-ignore
      ref={(node) => drag(drop(node))}
      className="absolute bg-yellow-200 p-4 rounded-lg shadow-md cursor-move w-48"
      style={{ left, top, opacity: isDragging ? 0.5 : 1 }}
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <textarea
          className="w-full bg-transparent outline-none resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
}
