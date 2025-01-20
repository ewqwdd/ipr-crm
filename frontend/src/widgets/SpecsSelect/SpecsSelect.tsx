import { universalApi } from '@/shared/api/universalApi'
import { cva } from '@/shared/lib/cva'
import { styles } from '@/shared/lib/styles'
import { Modal } from '@/shared/ui/Modal'
import { SelectLight } from '@/shared/ui/SelectLight'
import { useEffect, useState } from 'react'

interface SpecsSelectProps {
  spec?: number
  setSpec: (spec: number) => void
}

export default function SpecsSelect({ spec, setSpec }: SpecsSelectProps) {
  const { data, isFetching } = universalApi.useGetSpecsQuery()
  const [mutate, { isLoading: mutateLoading, isSuccess }] = universalApi.useCreateSpecMutation()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpec(Number(e.target.value))
  }

  const onSubmit = () => {
    if (!value) {
      setError('Specialization name is required')
      return
    } else if (data?.find((spec) => spec.name === value)) {
      setError('Specialization already exists')
      return
    }

    mutate(value)
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false)
      setValue('')
      setError('')
    }
  }, [isSuccess])

  return (
    <>
      <SelectLight
        label="Specialization"
        name="spec"
        value={spec}
        onChange={onChange}
        className={cva({ 'animate-pulse': isFetching })}
        right={
          <button onClick={() => setOpen(true)} type="button" className="text-xs text-indigo-600 font-medium">
            + Add new
          </button>
        }
      >
        {data &&
          data.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.name}
            </option>
          ))}
      </SelectLight>
      <Modal loading={mutateLoading} open={open} setOpen={setOpen} footer={false} title="Add specialization">
        <label htmlFor={'spec'} className="block text-sm font-medium text-gray-700 mt-4">
          Specialization name
        </label>
        <div className="flex rounded-md shadow-sm justify-center mt-1 mb-3">
          <input
            value={value}
            name="spec"
            onChange={(e) => {
              setValue(e.target.value)
              setError('')
            }}
            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
          />
          <button
            onClick={onSubmit}
            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-500 sm:text-sm"
          >
            Add
          </button>
        </div>
        {error && <p className={styles.errorStyles}>{error}</p>}
      </Modal>
    </>
  )
}
