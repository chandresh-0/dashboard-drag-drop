import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  // rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  // verticalListSortingStrategy,
  // horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { SortableItem } from "./components/SortableItem";
import { BarComponent } from "./Charts/Bar";
import { PieComponent } from "./Charts/Pie";
import DropDownComponent from "./components/DropDownComponent";
const DragItem = ({ id, children }) => (
  <div className="drag-overlay">{children}</div>
);

function App() {
  const [items, setItems] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [draggingId, setDraggingId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [sizes, setSizes] = useState(() =>
    items.map(() => ({ width: 500, height: 500 })),
  );
  const [isResizing, setIsResizing] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const addChart = () => {
    setItems((prevItems) => [...prevItems, prevItems.length]);
    setSizes((prevSizes) => [...prevSizes, { width: 500, height: 500 }]);
  };

  const onResize = useCallback(
    (index) =>
      (event, { size }) => {
        console.log(resizeRef.current);
        setSizes((prevSizes) => {
          const newSizes = [...prevSizes];
          newSizes[index] = size;
          return newSizes;
        });
        setIsResizing(true);
      },
    [],
  );

  const handleDragStart = useCallback((event) => {
    setDraggingId(event.active.id);
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        console.log(oldIndex, newIndex);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setDraggingId(null);
    setActiveId(null);
  }, []);

  const sortableContextItems = useMemo(() => items, [items]);
  const resizeRef = useRef<any>(null);

  return (
    <>
      <DropDownComponent newChart={addChart} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={sortableContextItems}
          disabled={isResizing}
        >
          <div className="inline-block test-block">
            {items
              .filter((id) => id !== 0)
              .map((id, index) => (
                <SortableItem
                  key={id}
                  id={id}
                >
                  <Resizable
                    width={sizes[id].width}
                    height={sizes[id].height}
                    onResize={onResize(id)}
                    minConstraints={[100, 100]}
                    maxConstraints={[1000, 1000]}
                    ref={resizeRef}
                  >
                    <div
                      className={`border m-2 hover:cursor-move p-5  `}
                      onClick={() => setIsResizing(false)}
                      style={{
                        width: sizes[id].width,
                        height: sizes[id].height,
                      }}
                    >
                      {id}
                      {id % 2 === 0 ? <BarComponent /> : <PieComponent />}
                    </div>
                  </Resizable>
                </SortableItem>
              ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <DragItem id={activeId}>
              <Resizable
                width={sizes[items.indexOf(activeId)].width}
                height={sizes[items.indexOf(activeId)].height}
              >
                <div
                  className={`border m-2 hover:cursor-move p-5 bg-blue-300`}
                  style={{
                    width: sizes[items.indexOf(activeId)].width,
                    height: sizes[items.indexOf(activeId)].height,
                  }}
                >
                  {activeId % 2 === 0 ? <BarComponent /> : <PieComponent />}
                </div>
              </Resizable>
            </DragItem>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}

export default App;
