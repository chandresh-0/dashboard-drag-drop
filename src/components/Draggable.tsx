import { useDraggable } from '@dnd-kit/core';
import { Button } from './ui/button';

export function Draggable({ items }:any) {
  return (
    <>
      {items.map((item:any, index:any) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
          id: `draggable-${index}`,
        });

        const style = transform
          ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            }
          : undefined;

        return (
          <Button
            key={index}
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
          >
            {item}
          </Button>
        );
      })}
    </>
  );
}
