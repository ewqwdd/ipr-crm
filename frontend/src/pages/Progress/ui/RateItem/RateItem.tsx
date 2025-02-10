import { useModal } from "@/app/hooks/useModal"
import { Rate, rateTypeNames } from "@/entities/rates"
import { SoftButton } from "@/shared/ui/SoftButton"

interface RateItemProps {
    rate: Rate
}

export default function RateItem({ rate }: RateItemProps) {

    const {openModal} = useModal()

  return (
    <div className="flex items-center justify-between p-3  rounded-sm border-t border-gray-300 first:border-transparent">
        <div className="flex items-center gap-4 text-gray-800 text-sm">
            <span className="font-semibold">
                {rateTypeNames[rate.type]}
            </span>
            <span className="text-xs">
                {rate.startDate?.slice(0, 10)}
            </span>
        </div>
        <SoftButton size="xs" onClick={() => openModal('EVALUATE', { rate })}>
            Пройти тест
        </SoftButton>
        </div>
  )
}
