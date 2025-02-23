import { Ipr } from "../model/types";
import Dimmer from "@/shared/ui/Dimmer";
import IprHeading from "./partials/IprHeading";
import IprDetails from "./partials/IprDetails";
import IprGoal from "./partials/IprGoal";

interface IprEditProps {
    ipr?: Ipr;
    loading: boolean;
    }

export default function IprEdit({ ipr, loading }: IprEditProps) {
  return (
    <Dimmer active={loading}>
    <div className="px-8 py-10 flex flex-col">
        <IprHeading ipr={ipr} />
        <IprDetails ipr={ipr} />
        <IprGoal ipr={ipr} />
    </div>
    </Dimmer>
  )
}
