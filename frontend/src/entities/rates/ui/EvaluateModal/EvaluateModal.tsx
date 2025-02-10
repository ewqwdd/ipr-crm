import { Modal } from "@/shared/ui/Modal";
import { Rate } from "../../types/types";
import { usersApi } from "@/shared/api/usersApi";
import { teamsApi } from "@/shared/api/teamsApi";
import { rateTypeNames } from "../../model/rateTypeNames";
import { universalApi } from "@/shared/api/universalApi";
import DetailItem from "./DetailItem";
import { skillsApi } from "@/shared/api/skillsApi";
import IndicatorsList from "./IndicatorsList";

interface EvaluateModalData {
    rate: Rate;
}

interface EvaluateModalProps {
    isOpen: boolean;
    modalData: EvaluateModalData;
    closeModal: () => void;
  }
  
  export default function EvaluateModal({
    closeModal,
    isOpen,
    modalData,
  }: EvaluateModalProps) {
    const { rate } = modalData;
    const {data: users, isFetching: usersFetching} = usersApi.useGetUsersQuery({});
    const {data: teams, isFetching: teamsFetching} = teamsApi.useGetTeamsQuery();
    const {data: specs, isFetching: specsFetching} = universalApi.useGetSpecsQuery();
    const {data: skills, isFetching: skillsFetching} = skillsApi.useGetSkillsQuery();


    const foundUser = users?.users.find(user => user.id === rate.userId);
    const foundTeam = teams?.list.find(team => team.id === rate.teamId);
    const foundSpec = specs?.find(spec => spec.id === rate.specId);
    const foundSkills = foundSpec?.competencyBlocks.map(block => skills?.find(skill => skill.id === block.id)!).filter(Boolean);

    const details = [
        {
            label: "Оцениваемый",
            value: foundUser?.username ?? ''
        },
        {
            label: "Команда",
            value: foundTeam?.name ?? ''
        },
        {
            label: "Специализация",
            value: foundSpec?.name ?? ''
        },
        {
            label: "Навыки",
            value: rateTypeNames[rate.type]
        },
    ]

    return <Modal title="Оценка 360" open={isOpen} setOpen={closeModal} footer={false} loading={usersFetching || teamsFetching || specsFetching || skillsFetching} className="sm:max-w-2xl">
        <div className="flex flex-col gap-4 mt-4 text-sm">
            <div className="flex flex-col gap-2">
                {details.map((detail, index) => (<DetailItem key={index} label={detail.label} value={detail.value} />))}
            </div>
            <p className="text-sm text-gray-800 my-2">
            Выберите блоки для оценки навыков. Тест завершится после того как вы дадите ответы на все вопросы в анкете. По мере прохождения тестирования в каждом блоке будут отражены ваши оценки. Данные вами ответы будут преобразованы в баллы и представлены без привязки к конкретному человеку.
            </p>
            <IndicatorsList rate={rate} skills={foundSkills ?? []} />
        </div>
    </Modal>
  }