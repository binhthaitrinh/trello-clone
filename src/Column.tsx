import React from "react";
import { ColumnContainer, ColumnTitle } from "./styles";

interface ColumnProps {
  // ? to say that text prop is optional, TypeScript will conclude that text can be undefined, for example: text?: string
  text: string;
}

export const Column = ({
  text,
  children,
}: React.PropsWithChildren<ColumnProps>) => {
  return (
    <ColumnContainer>
      <ColumnTitle>{text}</ColumnTitle>
      {children}
    </ColumnContainer>
  );
};
