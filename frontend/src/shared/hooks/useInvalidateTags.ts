import { useDispatch } from 'react-redux';
import { usersApi } from '../api/usersApi/usersApi';
import { iprApi } from '../api/iprApi';
import { foldersApi } from '../api/foldersApi';
import { rate360Api } from '../api/rate360Api';
import { skillsApi } from '../api/skillsApi';
import { supportApi } from '../api/supportApi';
import { surveyApi } from '../api/surveyApi';
import { teamsApi } from '../api/teamsApi';
import { testsApi } from '../api/testsApi';
import { universalApi } from '../api/universalApi';

const apis = [
  usersApi,
  iprApi,
  foldersApi,
  rate360Api,
  skillsApi,
  supportApi,
  surveyApi,
  teamsApi,
  testsApi,
  universalApi,
] as const;

type ApiType = (typeof apis)[number];

type ArrayToObject<T extends readonly ApiType[]> = {
  [K in T[number]['reducerPath']]: Parameters<
    Extract<T[number], { reducerPath: K }>['util']['invalidateTags']
  >[0];
};

type TabMapType = ArrayToObject<typeof apis>;

const tagsMap: TabMapType = {
  [usersApi.reducerPath]: ['User'],
  [iprApi.reducerPath]: [
    'IprBoard',
    'CompetencyBlocksByIprId',
    'Ipr',
    'UserIpr',
  ],
  [foldersApi.reducerPath]: ['ProductFolders', 'SpecFolders', 'TeamFolders'],
  [rate360Api.reducerPath]: [
    'Rate360',
    'AssignedRate',
    'ConfirmRateCurator',
    'ConfirmRateUser',
    'RateReport',
    'SelfRate',
    'UserRates',
  ],
  [skillsApi.reducerPath]: ['Skills', 'Version', 'VersionsHistory'],
  [supportApi.reducerPath]: ['Support', 'SupportAdmin'],
  [surveyApi.reducerPath]: [
    'Survey',
    'SurveyResult',
    'SurveyFinished',
    'SurveyAssigned',
  ],
  [teamsApi.reducerPath]: ['Team'],
  [testsApi.reducerPath]: ['Test', 'TestFinished', 'TestAssigned'],
  [universalApi.reducerPath]: ['Role', 'Spec'],
};
type AllTags = TabMapType[keyof TabMapType][number];
type Tags = (AllTags | { type: AllTags; id: number })[];

export function useInvalidateTags() {
  const dispatch = useDispatch();

  return (tags: Tags) =>
    tags.forEach((tag) => {
      if (typeof tag === 'string') {
        const foundReducer = Object.entries(tagsMap).find(([, reducerTags]) =>
          reducerTags.find((t) => t === tag),
        )?.[0] as keyof TabMapType;
        const foundApi = apis.find((api) => api.reducerPath === foundReducer);
        if (!foundApi) return;
        // @ts-expect-error impossible to type this correctly
        dispatch(foundApi.util.invalidateTags([tag]));
      } else {
        const foundReducer = Object.entries(tagsMap).find(([, reducerTags]) =>
          reducerTags.find((t) => t === tag?.type),
        )?.[0] as keyof TabMapType;
        const foundApi = apis.find((api) => api.reducerPath === foundReducer);
        if (!foundApi) return;
        // @ts-expect-error impossible to type this correctly
        dispatch(foundApi.util.invalidateTags([tag]));
      }
    });
}
