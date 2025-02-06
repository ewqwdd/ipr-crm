import { skillsApi } from "@/shared/api/skillsApi";
import { Heading } from "@/shared/ui/Heading";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";

export default function Skills() {
    const {data} = skillsApi.useGetSkillsQuery()
  return (
    <>
    <div className="px-8 py-10 flex flex-col">
              <Heading title="Конструктор профилей" description="Реестр компетенций" />


            </div>
    </>
  )
}
