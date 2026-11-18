import * as React from 'react';

export interface ReorderListProps<T> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T, isDragging: boolean, index: number) => React.ReactNode;
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ReorderList<T>({
  items,
  onReorder,
  keyExtractor,
  renderItem,
  gap = 12,
  className,
  style,
}: ReorderListProps<T>) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [targetIndex, setTargetIndex] = React.useState<number | null>(null);
  const [dragOffsetY, setDragOffsetY] = React.useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const startPointerYRef = React.useRef(0);
  const itemHeightsRef = React.useRef<number[]>([]);
  const isPointerDownRef = React.useRef(false);

  const handlePointerDown = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button
    if (e.button !== 0) return;

    isPointerDownRef.current = true;
    startPointerYRef.current = e.clientY;
    setDraggedIndex(index);
    setTargetIndex(index);
    setDragOffsetY(0);

    // Measure heights of each item
    const heights: number[] = [];
    items.forEach((_, i) => {
      const el = itemRefs.current.get(i);
      heights.push(el ? el.offsetHeight : 50);
    });
    itemHeightsRef.current = heights;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || draggedIndex === null) return;

    const deltaY = e.clientY - startPointerYRef.current;
    setDragOffsetY(deltaY);

    const heights = itemHeightsRef.current;
    const avgHeight = (heights[draggedIndex] || 50) + gap;

    // Calculate which slot the dragged row is hovering over
    const slotOffset = Math.round(deltaY / avgHeight);
    const calculatedTarget = Math.max(0, Math.min(items.length - 1, draggedIndex + slotOffset));

    if (calculatedTarget !== targetIndex) {
      setTargetIndex(calculatedTarget);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate?.(6);
        } catch {
          // ignore
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || draggedIndex === null) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isPointerDownRef.current = false;

    if (targetIndex !== null && targetIndex !== draggedIndex) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      onReorder(newItems);
    }

    setDraggedIndex(null);
    setTargetIndex(null);
    setDragOffsetY(0);
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        position: 'relative',
        userSelect: draggedIndex !== null ? 'none' : 'auto',
        ...style,
      }}
    >
      {items.map((item, index) => {
        const isThisItemDragged = draggedIndex === index;
        const heights = itemHeightsRef.current;
        const draggedHeight = (heights[draggedIndex ?? index] || 50) + gap;

        // Calculate displacement for non-dragged sibling items
        let displacementY = 0;
        if (draggedIndex !== null && targetIndex !== null && !isThisItemDragged) {
          if (draggedIndex < targetIndex) {
            // Dragged downwards: items between original and target shift UP
            if (index > draggedIndex && index <= targetIndex) {
              displacementY = -draggedHeight;
            }
          } else if (draggedIndex > targetIndex) {
            // Dragged upwards: items between target and original shift DOWN
            if (index >= targetIndex && index < draggedIndex) {
              displacementY = draggedHeight;
            }
          }
        }

        return (
          <div
            key={keyExtractor(item)}
            ref={(el) => {
              if (el) itemRefs.current.set(index, el);
              else itemRefs.current.delete(index);
            }}
            onPointerDown={(e) => handlePointerDown(index, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              touchAction: 'none',
              position: 'relative',
              zIndex: isThisItemDragged ? 50 : 1,
              // The 5% lift and growth when picked up
              transform: isThisItemDragged
                ? `translate3d(0, ${dragOffsetY}px, 0) scale(1.05)`
                : `translate3d(0, ${displacementY}px, 0) scale(1)`,
              boxShadow: isThisItemDragged
                ? '0 20px 25px -5px rgba(42, 35, 32, 0.2), 0 10px 10px -5px rgba(42, 35, 32, 0.08)'
                : '0 1px 3px rgba(42, 35, 32, 0.05)',
              transition: isThisItemDragged
                ? 'box-shadow 0.2s ease, scale 0.15s ease'
                : 'transform 0.25s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s ease, scale 0.2s ease',
              cursor: isThisItemDragged ? 'grabbing' : 'grab',
              willChange: 'transform, box-shadow',
            }}
          >
            {renderItem(item, isThisItemDragged, index)}
          </div>
        );
      })}
    </div>
  );
}
