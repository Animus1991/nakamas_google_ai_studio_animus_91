import {useStore} from "../store";
import PlansClassic from "./PlansClassic";
import PlansVibrant from "./PlansVibrant";
import PlansVibrantDark from "./PlansVibrantDark";
import PlansNeon from "./PlansNeon";
import PlansNeonDark from "./PlansNeonDark";
import PlansBento from "./PlansBento";
import PlansBentoDark from "./PlansBentoDark";
export default function Plans(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <PlansVibrant/>;case "vibrant-dark": return <PlansVibrantDark/>; case "neon": return <PlansNeon/>; case "neon-dark": return <PlansNeonDark/>;case "bento":return <PlansBento/>;case "bento-dark":return <PlansBentoDark/>;default:return <PlansClassic/>;}}