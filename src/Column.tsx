import React, { useRef } from "react";
import { ColumnContainer, ColumnTitle } from "./styles";
import { AddNewItem } from "./AddNewItem";
import { useAppState } from "./AppStateContext";
import { Card } from "./Card";
import { useItemDrag } from "./useItemDrag";
import {useDrop} from 'react-dnd'
import {DragItem} from './DragItem'
import { isHidden } from "./utils/isHidden";

interface ColumnProps {
  // ? to say that text prop is optional, TypeScript will conclude that text can be undefined, for example: text?: string
  text: string;
  index: number;
  id: string
  isPreview?: boolean
}

export const Column = ({ text, index, id , isPreview}: ColumnProps) => {
  const { state,dispatch } = useAppState();
  const ref = useRef<HTMLDivElement>(null)

  const [,drop] = useDrop({
    accept: ["COLUMN", "CARD"],
    hover(item: DragItem) {
      if (item.type === 'COLUMN') {

        const dragIndex = item.index 
        const hoverIndex = index 
        if (dragIndex === hoverIndex) {
          return
        }
        dispatch({type: "MOVE_LIST", payload: {dragIndex, hoverIndex}})
  
        item.index = hoverIndex
      }
      else {
        const dragIndex = item.index
        const hoverIndex = 0
        const sourceColumn = item.columnId 
        const targetColumn = id 
        if (sourceColumn === targetColumn) {
          return
        }
        dispatch({
          type: "MOVE_TASK",
          payload: {dragIndex, hoverIndex, sourceColumn, targetColumn}
        })
        item.index = hoverIndex 
        item.columnId = targetColumn
      }
    }
  })

  const {drag} = useItemDrag({type: "COLUMN", id, index, text})
  drag(drop(ref))
  return (
    <ColumnContainer ref={ref} isPreview={isPreview} isHidden={isHidden(isPreview, state.draggedItem, "COLUMN", id)}>
      <ColumnTitle>{text}</ColumnTitle>
      {state.lists[index].tasks.map((task, i) => (
        <Card text={task.text} key={task.id} columnId={id} index={i} id={task.id} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another task"
        onAdd={text => dispatch({type: "ADD_TASK", payload: {text, listId: id}})}
        dark
      />
    </ColumnContainer>
  );
};
