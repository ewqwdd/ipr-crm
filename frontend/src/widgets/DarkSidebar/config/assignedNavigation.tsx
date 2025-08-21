import {
  BriefcaseIcon,
  ClipboardListIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline';
import { NavType } from './types';
import {
  useCasesCounter,
  useRatesCounter,
  useSurveysCounter,
  useTestsCounter,
} from '@/shared/hooks/useAssignedCounters';
import { Badge } from '@/shared/ui/Badge';

const RatesCounter = () => {
  const sum = useRatesCounter();
  if (sum === 0) {
    return null;
  }
  return (
    <Badge className="rounded-full size-4 justify-center ml-4" color="red">
      {sum}
    </Badge>
  );
};

const TestsCounter = () => {
  const sum = useTestsCounter();
  if (sum === 0) {
    return null;
  }
  return (
    <Badge className="rounded-full size-4 justify-center ml-4" color="red">
      {sum}
    </Badge>
  );
};

const SurveysCounter = () => {
  const sum = useSurveysCounter();
  if (sum === 0) {
    return null;
  }
  return (
    <Badge className="rounded-full size-4 justify-center ml-4" color="red">
      {sum}
    </Badge>
  );
};

const GeneralCounter = () => {
  const rates = useRatesCounter();
  const tests = useTestsCounter();
  const surveys = useSurveysCounter();
  const cases = useCasesCounter();

  const sum = rates + tests + surveys + cases;
  if (sum === 0) {
    return null;
  }
  return (
    <Badge className="rounded-full size-4 justify-center ml-4" color="red">
      {sum}
    </Badge>
  );
};

const CasesCounter = () => {
  const cases = useCasesCounter();
  if (cases === 0) {
    return null;
  }
  return (
    <Badge className="rounded-full size-4 justify-center ml-4" color="red">
      {cases}
    </Badge>
  );
};

export const assignedNavigation: NavType[] = [
  {
    name: 'Мне назначено',
    icon: InboxIcon,
    count: <GeneralCounter />,
    children: [
      {
        name: 'Оценка 360',
        href: '/progress',
        count: <RatesCounter />,
      },
      {
        name: 'Тесты',
        href: '/assigned-tests',
        icon: QuestionMarkCircleIcon,
        count: <TestsCounter />,
      },
      {
        name: 'Опросы',
        href: '/assigned-surveys',
        icon: ClipboardListIcon,
        count: <SurveysCounter />,
      },
      {
        name: 'Кейсы',
        href: '/assigned-cases',
        icon: BriefcaseIcon,
        count: <CasesCounter />,
      },
    ],
  },
];
