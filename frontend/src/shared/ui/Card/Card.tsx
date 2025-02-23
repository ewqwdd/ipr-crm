
interface CardProps {
    children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  )
}
