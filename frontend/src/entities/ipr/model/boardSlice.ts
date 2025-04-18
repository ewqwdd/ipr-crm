import { KanbanBoard } from '@caldwell619/react-kanban';
import { CustomCard, Ipr } from './types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface initialStateSchema {
  board?: KanbanBoard<CustomCard>;
  plan?: Ipr;
}

const initialState: initialStateSchema = {};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardCallback(
      state,
      action: PayloadAction<
        (payload: KanbanBoard<CustomCard>) => KanbanBoard<CustomCard>
      >,
    ) {
      state.board = action.payload(state.board ?? { columns: [] });
    },
    setBoard(state, action: PayloadAction<KanbanBoard<CustomCard>>) {
      state.board = action.payload;
    },
    removeCard(
      state,
      action: PayloadAction<{ columnId: string; cardId: string }>,
    ) {
      if (!state.board) return;
      state.board = {
        ...state.board,
        columns: state.board.columns.map((column) => {
          if (column.id === action.payload.columnId) {
            return {
              ...column,
              cards: column.cards.filter(
                (card) => card.id !== action.payload.cardId,
              ),
            };
          }
          return column;
        }),
      };
    },
    setPlan(state, action: PayloadAction<Ipr>) {
      state.plan = action.payload;
    },
    updateCard(
      state,
      action: PayloadAction<{ card: CustomCard; column: string }>,
    ) {
      const column = state.board?.columns.find(
        (column) => column.id === action.payload.column,
      );
      if (!column) return;
      const cardIndex = column.cards.findIndex(
        (card) => card.id === action.payload.card.id,
      );
      if (cardIndex === -1) return;
      const prev = column.cards[cardIndex];
      column.cards[cardIndex] = { ...prev, ...action.payload.card };
    },
  },
});

export const boardActions = boardSlice.actions;
export const boardReducer = boardSlice.reducer;
