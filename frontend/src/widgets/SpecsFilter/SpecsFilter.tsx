import { universalApi } from '@/shared/api/universalApi'
import { cva } from '@/shared/lib/cva'
import { SelectLight } from '@/shared/ui/SelectLight'

interface SpecsFilterProps {
  spec?: number
  setSpec: (spec: number) => void
}

export default function SpecsFilter({ spec, setSpec }: SpecsFilterProps) {
  const { data, isFetching } = universalApi.useGetSpecsQuery()

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpec(Number(e.target.value))
  }

  return (
    <SelectLight name="spec" value={spec} onChange={onChange} className={cva({ 'animate-pulse': isFetching })}>
      <option>Специализация</option>
      {data &&
        data.map((spec) => (
          <option key={spec.id} value={spec.id}>
            {spec.name}
          </option>
        ))}
    </SelectLight>
  )
}
