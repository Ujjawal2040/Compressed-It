"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical } from "lucide-react";

interface SortableThumbnailGridProps {
  files: File[];
  onReorder: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export function SortableThumbnailGrid({ files, onReorder, onRemove }: SortableThumbnailGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fileIds = files.map((f, i) => `${f.name}-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = fileIds.indexOf(active.id as string);
      const newIndex = fileIds.indexOf(over.id as string);
      onReorder(arrayMove(files, oldIndex, newIndex));
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <SortableContext 
          items={fileIds}
          strategy={rectSortingStrategy}
        >
          {files.map((file, index) => (
             <SortableThumbnail 
               key={fileIds[index]}
               id={fileIds[index]}
               file={file}
               onRemove={() => onRemove(index)}
             />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}

function SortableThumbnail({ id, file, onRemove }: { id: string, file: File, onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const previewUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative aspect-square rounded-xl overflow-hidden glass-card transition-all ${
        isDragging ? 'shadow-2xl scale-105 border-primary/50' : ''
      }`}
    >
      <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <div 
          {...attributes} 
          {...listeners}
          className="p-2 cursor-grab active:cursor-grabbing bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <GripVertical className="w-5 h-5 text-white" />
        </div>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
      >
        <X className="w-3 h-3" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-[10px] text-white truncate text-center">{file.name}</p>
      </div>
    </div>
  );
}
