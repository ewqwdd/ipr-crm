import { useModal } from '@/app/hooks/useModal';
import { Checkbox } from '@/shared/ui/Checkbox';
import { SoftButton } from '@/shared/ui/SoftButton';
import { Column, Table } from '@/shared/ui/Table';
import { MinusCircleIcon, PencilIcon } from '@heroicons/react/outline';
import { FC, useCallback, useState } from 'react';
interface ISpecializationsTableProps {}

interface Specialization {
  id: number;
  name: string;
  materials: number;
}

// const data: User[] = [
//   { id: 1, name: 'John Doe', email: 'john@example.com' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
// ];

// const columns: Column<User>[] = [
//   { key: 'id', title: 'ID' },
//   { key: 'name', title: 'Name' },
//   { key: 'email', title: 'Email' },
// ];

// TODO: replace with real data
const data: Specialization[] = [
  {
    id: 1,
    name: 'Frontend',
    // description: 'Frontend description',
    materials: 8,
    // active: true,
    // pr: true,
    // skills: [
    //   {
    //     id: 1,
    //     name: 'React',
    //     description: 'React description',
    //     level: 'Junior',
    //   },
    //   {
    //     id: 2,
    //     name: 'Vue',
    //     description: 'Vue description',
    //     level: 'Middle',
    //   },
    // ],
  },
  {
    id: 2,
    name: 'Backend',
    // description: 'Backend description',
    materials: 2,
    // active: true,
    // pr: false,
    // skills: [
    //   {
    //     id: 3,
    //     name: 'Node.js',
    //     description: 'Node.js description',
    //     level: 'Middle',
    //   },
    //   {
    //     id: 4,
    //     name: 'Express',
    //     description: 'Express description',
    //     level: 'Senior',
    //   },
    // ],
  },
  {
    id: 3,
    name: 'Backend',
    // description: 'Backend description',
    materials: 0,
    // active: false,
    // pr: false,
    // skills: [
    //   {
    //     id: 3,
    //     name: 'Node.js',
    //     description: 'Node.js description',
    //     level: 'Middle',
    //   },
    //   {
    //     id: 4,
    //     name: 'Express',
    //     description: 'Express description',
    //     level: 'Senior',
    //   },
    // ],
  },
];

const SpecializationsTableAbstraction: FC<ISpecializationsTableProps> = (
  props,
) => {
  const { openModal } = useModal();

  const [checkboxes, setCheckboxes] = useState<Set<number>>(new Set([]));

  const handleCheckboxChange = (id: number) => {
    if (checkboxes.has(id)) {
      setCheckboxes((s) => new Set([...s].filter((i) => i !== id)));
    } else {
      setCheckboxes((s) => new Set([...s, id]));
    }
  };

  const handleRowClick = useCallback(({ ...rowData }) => {
    const { id } = rowData;
    console.log('selected row id:', id);
  }, []);

  // const open

  const columns: Column<Specialization>[] = [
    {
      key: 'name',
      title: 'Название',
      render: (value: string) => <span>{name}</span>,
    },
    {
      key: 'active',
      title: 'Активно',
      render: (id: number) => (
        <Checkbox
          checked={true}
          onChange={() => {
            // console.log('Checkbox');
            handleCheckboxChange(id);
          }}
        />
      ),
    },
    {
      key: 'pr',
      title: 'ПР',
      render: (id: number) => (
        <Checkbox
          checked={true}
          onChange={() => {
            console.log('Checkbox');
          }}
        />
      ),
    },
    {
      key: 'materials',
      title: 'Материалы',
      render: (materials: number) => <span>{materials}</span>,
    },
    {
      key: 'actions',
      title: 'Действия',
      render: (id: number, name: string) => (
        <div>
          <SoftButton
            className="rounded-full p-2"
            size="xs"
            onClick={() => {
              console.log('open Modal Edit');
            }}
          >
            <PencilIcon className="h-5 w-5" />
          </SoftButton>
          <SoftButton
            size="xs"
            className="rounded-full text-red p-2"
            onClick={(e) => {
              console.log('open Modal Delete');
              // e.stopPropagation();
              // let onSubmit = null;
              // switch (listItemType) {
              //   case CompetencyType.COMPETENCY_BLOCK:
              //     onSubmit = () => deleteCompetencyBlock({ id });
              //     break;
              //   case CompetencyType.COMPETENCY:
              //     onSubmit = () => deleteCompetency({ id });
              //     break;
              //   case CompetencyType.INDICATOR:
              //     onSubmit = () => deleteIndicator({ id });
              //     break;
              //   default:
              //     break;
              // }
              // openModal('CONFIRM', { onSubmit });
            }}
          >
            <MinusCircleIcon className="stroke-red-500 h-5 w-5" />
          </SoftButton>
        </div>
        // <ul>
        //   {skills.map((skill) => (
        //     <li key={skill.id}>
        //       {skill.name} - {skill.level}
        //     </li>
        //   ))}
        // </ul>
      ),
    },
    // {
    //   key: 'skills',
    //   title: 'Skills',
    //   render: (skills) => (
    //     <ul>
    //       {skills.map((skill) => (
    //         <li key={skill.id}>
    //           {skill.name} - {skill.level}
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
  ];

  return (
    <div>
      <Table columns={columns} data={data} rowClick={handleRowClick} />
    </div>
  );
};

export default SpecializationsTableAbstraction;
