import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AddRateDto,
  EvaluateUser,
  EvaulatorType,
  Rate,
  RateStoreSchema,
} from '../types/types';
import { TeamItemIds } from '../ui/AddRate/EvaluatorsTab/EvaluatorsTab';

const initialState: RateStoreSchema = {
  selectedSpecs: [],
  confirmCurator: false,
  confirmUser: false,
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
        teamId?: number;
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
      state.confirmCurator = false;
      state.confirmUser = false;
    },
    setConfirmCurator: (state, action: PayloadAction<boolean>) => {
      state.confirmCurator = action.payload;
    },
    setConfirmUser: (state, action: PayloadAction<boolean>) => {
      state.confirmUser = action.payload;
    },
    setEditEvaluatorsFromRate: (
      state,
      action: PayloadAction<Rate | undefined>,
    ) => {
      if (!action.payload) {
        state.editEvaluators = undefined;
        return;
      }
      const rate = action.payload;
      state.editEvaluators = {
        specId: rate.specId,
        teamId: rate.teamId,
        userId: rate.userId,
        evaluateCurators: rate.evaluators
          .filter((e) => e.type === 'CURATOR')
          .map((e) => ({ ...e, username: e.user.username })),
        evaluateTeam: rate.evaluators
          .filter((e) => e.type === 'TEAM_MEMBER')
          .map((e) => ({ ...e, username: e.user.username })),
        evaluateSubbordinate: rate.evaluators
          .filter((e) => e.type === 'SUBORDINATE')
          .map((e) => ({ ...e, username: e.user.username })),
      };
    },
    setEditEvaluators: (
      state,
      action: PayloadAction<TeamItemIds | undefined>,
    ) => {
      if (!action.payload) {
        state.editEvaluators = undefined;
        return;
      }
      state.editEvaluators = action.payload;
    },
    setSelectedSpecs: (state, action: PayloadAction<AddRateDto[]>) => {
      state.selectedSpecs = action.payload;
    },
  },
});

export const ratesActions = rateSlice.actions;
export const ratesReducer = rateSlice.reducer;
