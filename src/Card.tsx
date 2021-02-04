import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { useAppState } from "./AppStateContext";
import { CardDragItem } from "./DragItem";
import { CardContainer } from "./styles";
import { useItemDrag } from "./useItemDrag";
import { isHidden } from "./utils/isHidden";

interface CardProps {
  text: string;
  columnId: string;
  isPreview?: boolean;
  id: string;
  index: number
}

export const Card = ({ text, id, columnId, isPreview, index }: CardProps) => {
  const {state, dispatch} = useAppState()
  const ref = useRef<HTMLDivElement>(null)
  const [,drop] = useDrop({
    accept: "CARD",
    hover(item: CardDragItem) {
      if(item.id === id) {
        return
      }
      
      const dragIndex = item.index
      const hoverIndex = index
      const sourceColumn = item.columnId 
      const targetColumn = columnId 

      dispatch({
        type: "MOVE_TASK",
        payload: {dragIndex, hoverIndex, sourceColumn, targetColumn}
      })
      item.index = hoverIndex 
      item.columnId = targetColumn
    }
  })

  const {drag} = useItemDrag({type: "CARD", id, text, columnId, index})
  drag(drop(ref))
  
  return <CardContainer ref={ref} isPreview={isPreview} isHidden={isHidden(isPreview, state.draggedItem, "CARD", id)}>{text}</CardContainer>;
};
