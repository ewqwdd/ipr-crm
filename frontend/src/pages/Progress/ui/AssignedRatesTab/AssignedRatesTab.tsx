import { rate360Api } from "@/shared/api/rate360Api"
import { cva } from "@/shared/lib/cva"
import { Heading } from "@/shared/ui/Heading"
import RateItem from "../RateItem/RateItem"

export default function AssignedRatesTab() {
    const {data, isLoading} = rate360Api.useAssignedRatesQuery()
  return (
    <div className={cva("flex flex-col gap-4 p-4", {
        "animate-pulse": isLoading
    })}>
        <Heading title="Самооценка 360"/>
        <div className="flex flex-col bg-gray-50 py-2">
            {data?.map(rate => (<RateItem key={rate.id} rate={rate} />))}
            </div>
    </div>
  )
}
