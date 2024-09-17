import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `https://picsum.photos/200/200?random=${k}`, // Lorem Picsum 랜덤 이미지 URL
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
});

const App = () => {
  const [items, setItems] = useState(getItems(6));

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const reorderedItems = reorder(
        items,
        result.source.index,
        result.destination.index,
      );

      setItems(reorderedItems);
    },
    [items],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable' direction='horizontal'>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style,
                    )}>
                    <img
                      src={item.content}
                      alt={`Item ${item.id}`}
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
