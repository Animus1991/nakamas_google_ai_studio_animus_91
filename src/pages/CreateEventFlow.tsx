import {useStore} from "../store";
import CreateEventFlowClassic from "./CreateEventFlowClassic";
import CreateEventFlowVibrant from "./CreateEventFlowVibrant";
import CreateEventFlowVibrantDark from "./CreateEventFlowVibrantDark";
import CreateEventFlowNeon from "./CreateEventFlowNeon";
import CreateEventFlowNeonDark from "./CreateEventFlowNeonDark";
import CreateEventFlowBento from "./CreateEventFlowBento";
import CreateEventFlowBentoDark from "./CreateEventFlowBentoDark";
export default function CreateEventFlow(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <CreateEventFlowVibrant/>;case "vibrant-dark": return <CreateEventFlowVibrantDark/>; case "neon": return <CreateEventFlowNeon/>; case "neon-dark": return <CreateEventFlowNeonDark/>;case "bento":return <CreateEventFlowBento/>;case "bento-dark":return <CreateEventFlowBentoDark/>;default:return <CreateEventFlowClassic/>;}}