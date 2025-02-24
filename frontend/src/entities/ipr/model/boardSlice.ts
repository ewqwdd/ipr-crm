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
    setPlan(state, action: PayloadAction<Ipr>) {
      state.plan = action.payload;
    },
  },
});

export const boardActions = boardSlice.actions;
export const boardReducer = boardSlice.reducer;
