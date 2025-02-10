
interface DetailItemProps {
    label: string;
    value: string;
}

export default function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="flex gap-2 text-gray-500">
                    <span>{label}:</span>
                    <span className="text-gray-800">{value}</span>
                </div>
  )
}
