import {useStore} from "../store";
import SavedEventsClassic from "./SavedEventsClassic";
import SavedEventsVibrant from "./SavedEventsVibrant";
import SavedEventsVibrantDark from "./SavedEventsVibrantDark";
import SavedEventsNeon from "./SavedEventsNeon";
import SavedEventsNeonDark from "./SavedEventsNeonDark";
import SavedEventsBento from "./SavedEventsBento";
import SavedEventsBentoDark from "./SavedEventsBentoDark";
export default function SavedEvents(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <SavedEventsVibrant/>;case "vibrant-dark": return <SavedEventsVibrantDark/>; case "neon": return <SavedEventsNeon/>; case "neon-dark": return <SavedEventsNeonDark/>;case "bento":return <SavedEventsBento/>;case "bento-dark":return <SavedEventsBentoDark/>;default:return <SavedEventsClassic/>;}}