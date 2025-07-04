export interface Card {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardData {
  cards: { [key: string]: Card };
  columns: { [key: string]: Column };
  columnOrder: string[];
}