import React, { useRef } from "react";
import { ColumnContainer, ColumnTitle } from "./styles";
import { AddNewItem } from "./AddNewItem";
import { useAppState } from "./AppStateContext";
import { Card } from "./Card";
import { useItemDrag } from "./useItemDrag";
import {useDrop} from 'react-dnd'
import {DragItem} from './DragItem'

interface ColumnProps {
  // ? to say that text prop is optional, TypeScript will conclude that text can be undefined, for example: text?: string
  text: string;
  index: number;
  id: string
}

export const Column = ({ text, index, id }: ColumnProps) => {
  const { state,dispatch } = useAppState();
  const ref = useRef<HTMLDivElement>(null)

  const [,drop] = useDrop({
    accept: "COLUMN",
    hover(item: DragItem) {
      const dragIndex = item.index 
      const hoverIndex = index 
      if (dragIndex === hoverIndex) {
        return
      }
      dispatch({type: "MOVE_LIST", payload: {dragIndex, hoverIndex}})

      item.index = hoverIndex
    }
  })

  const {drag} = useItemDrag({type: "COLUMN", id, index, text})
  drag(drop(ref))
  return (
    <ColumnContainer ref={ref}>
      <ColumnTitle>{text}</ColumnTitle>
      {state.lists[index].tasks.map((task) => (
        <Card text={task.text} key={task.id} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another task"
        onAdd={text => dispatch({type: "ADD_TASK", payload: {text, listId: id}})}
        dark
      />
    </ColumnContainer>
  );
};
