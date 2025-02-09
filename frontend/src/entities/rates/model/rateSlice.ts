import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EvaluateUser, EvaulatorType, RateStoreSchema } from '../types/types';

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
            specs: [
              {
                specId,
                userId,
                evaluateCurators: [],
                evaluateSubbordinate: [],
                evaluateTeam: [],
              },
            ],
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
            specs: [
              ...team.specs,
              {
                specId,
                userId,
                evaluateCurators: [],
                evaluateSubbordinate: [],
                evaluateTeam: [],
              },
            ],
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
    setSpecs: (
      state,
      action: PayloadAction<RateStoreSchema['selectedSpecs']>,
    ) => {
      state.selectedSpecs = action.payload;
    },
    removeEvaluator: (
      state,
      action: PayloadAction<{
        teamId: number;
        specId: number;
        userId: number;
        evaluatorId: number;
        type: EvaulatorType;
      }>,
    ) => {
      const prev = state.selectedSpecs;
      const { teamId, specId, userId, evaluatorId, type } = action.payload;

      const teamIndex = prev.findIndex((s) => s.teamId === teamId);
      if (teamIndex === -1) {
        return;
      }

      const team = prev[teamIndex];
      const specIndex = team.specs.findIndex(
        (s) => s.specId === specId && s.userId === userId,
      );
      if (specIndex === -1) {
        return;
      }
      const updatedData: any = {};

      if (type === 'CURATOR') {
        let curators = team.specs[specIndex].evaluateCurators;
        curators = curators.filter((c) => c.userId !== evaluatorId);
        updatedData.evaluateCurators = curators;
      } else if (type === 'TEAM_MEMBER') {
        let teamUsers = team.specs[specIndex].evaluateTeam;
        teamUsers = teamUsers.filter((c) => c.userId !== evaluatorId);
        updatedData.evaluateTeam = teamUsers;
      } else if (type === 'SUBORDINATE') {
        let subTeams = team.specs[specIndex].evaluateSubbordinate;
        subTeams = subTeams.filter((c) => c.userId !== evaluatorId);
        updatedData.evaluateSubbordinate = subTeams;
      }

      team.specs[specIndex] = {
        ...team.specs[specIndex],
        ...updatedData,
      };
    },
    setSpecsForUser: (
      state,
      action: PayloadAction<{
        teamId: number;
        specId: number;
        userId: number;
        type: EvaulatorType;
        evaluators: EvaluateUser[];
      }>,
    ) => {
      const prev = state.selectedSpecs;
      const { teamId, specId, userId, type, evaluators } = action.payload;

      const teamIndex = prev.findIndex((s) => s.teamId === teamId);
      if (teamIndex === -1) {
        return;
      }

      const team = prev[teamIndex];
      const specIndex = team.specs.findIndex(
        (s) => s.specId === specId && s.userId === userId,
      );
      if (specIndex === -1) {
        return;
      }

      let key;

      if (type === 'CURATOR') {
        key = 'evaluateCurators';
      } else if (type === 'TEAM_MEMBER') {
        key = 'evaluateTeam';
      } else {
        key = 'evaluateSubbordinate';
      }

      team.specs[specIndex] = {
        ...team.specs[specIndex],
        [key]: evaluators,
      };
    },
    clear: (state) => {
      state.selectedSpecs = [];
    },
  },
});

export const ratesActions = rateSlice.actions;
export const ratesReducer = rateSlice.reducer;
