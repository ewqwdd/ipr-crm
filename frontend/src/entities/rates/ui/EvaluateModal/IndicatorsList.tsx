import { Link } from "react-router";
import { Rate } from "../../types/types";
import { CompetencyBlock } from "@/entities/skill";

interface IndicatorsListProps {
    rate: Rate;
    skills: CompetencyBlock[];
}

export default function IndicatorsList({rate, skills}: IndicatorsListProps) {
  
    const indicators = skills.flatMap(skill => skill.competencies.flatMap(competency => competency.indicators))
  
    console.log(indicators)
    return <div className="flex flex-col">
        {indicators.map(indicator => (
        <div className="flex border-b border-gray-300 py-2.5 last:border-transparent px-2" key={indicator.id}>
            <div className="flex-1 whitespace-nowrap text-ellipsis max-w-64 w-full overflow-clip pr-2">
                {indicator.name}
            </div>
            <div className="min-w-28 font-medium text-gray-500 pl-4">
                Оценка: <span className="text-gray-800">-</span>
            </div>
            <div className="flex-1 flex justify-end">
            <Link to={`/progress/${rate.id}`} className="text-violet-500 font-semibold">Оценить</Link>
            </div>
        </div>
    ))}
    </div>
}
