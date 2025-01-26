import { teamsApi } from "@/shared/api/teamsApi";
// import { usersApi } from "@/shared/api/usersApi";
import { cva } from "@/shared/lib/cva";
import { Heading } from "@/shared/ui/Heading";
import { PrimaryButton } from "@/shared/ui/PrimaryButton";
import { useParams } from "react-router";
import UserItem from "./UserItem";

export default function TeamPage() {

    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = teamsApi.useGetTeamQuery(Number(id));
    // const {data: users} = usersApi.useGetUsersQuery({});
    console.log(data)


  return (
    <div className={cva("px-8 py-10 flex flex-col", {
        'animate-pulse pointer-events-none': isLoading
    })}>
          <div className="flex justify-between items-center">
            <Heading title="" description="Состав команды" />
            <PrimaryButton className="self-start">Добавить</PrimaryButton>
          </div>
          <div className="flex flex-col gap-1 max-w-5xl mt-8">
            {data?.curator?.id && <UserItem userId={data?.curator?.id} />}
            {data?.users?.map((user) => (
                <UserItem userId={user?.userId} key={user?.id} />
            ))}
          </div>
        </div>
  )
}
