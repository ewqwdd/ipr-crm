import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RateStoreSchema } from '../types/types';

const initialState: RateStoreSchema = {
  selectedSpecs: [],
};

const rateSlice = createSlice({
  name: 'rates',
  initialState,
  reducers: {
    selectSpec: (
      state,
      action: PayloadAction<{ teamId: number; specId: number; userId: number }>,
    ) => {
      const prev = state.selectedSpecs;
      const { teamId, specId, userId } = action.payload;

      const teamIndex = prev.findIndex((s) => s.teamId === teamId);
      if (teamIndex === -1) {
        state.selectedSpecs = [
          ...prev,
          {
            teamId,
            specs: [{ specId, userId }],
          },
        ];
        return;
      }

      const team = prev[teamIndex];
      const existing = team.specs.findIndex(
        (s) => s.specId === specId && s.userId === userId,
      );
      if (existing === -1) {
        state.selectedSpecs = [
          ...prev.slice(0, teamIndex),
          {
            ...team,
            specs: [...team.specs, { specId, userId }],
          },
          ...prev.slice(teamIndex + 1),
        ];
        return;
      } else {
        state.selectedSpecs = [
          ...prev.slice(0, teamIndex),
          {
            ...team,
            specs: team.specs.filter(
              (s) => s.specId !== specId || s.userId !== userId,
            ),
          },
          ...prev.slice(teamIndex + 1),
        ];
        return;
      }
    },
  },
});

export const ratesActions = rateSlice.actions;
export const ratesReducer = rateSlice.reducer;
