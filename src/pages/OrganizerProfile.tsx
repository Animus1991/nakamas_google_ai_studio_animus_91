import {useStore} from "../store";
import OrganizerProfileClassic from "./OrganizerProfileClassic";
import OrganizerProfileVibrant from "./OrganizerProfileVibrant";
import OrganizerProfileVibrantDark from "./OrganizerProfileVibrantDark";
import OrganizerProfileNeon from "./OrganizerProfileNeon";
import OrganizerProfileNeonDark from "./OrganizerProfileNeonDark";
import OrganizerProfileBento from "./OrganizerProfileBento";
import OrganizerProfileBentoDark from "./OrganizerProfileBentoDark";
export default function OrganizerProfile(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <OrganizerProfileVibrant/>;case "vibrant-dark": return <OrganizerProfileVibrantDark/>; case "neon": return <OrganizerProfileNeon/>; case "neon-dark": return <OrganizerProfileNeonDark/>;case "bento":return <OrganizerProfileBento/>;case "bento-dark":return <OrganizerProfileBentoDark/>;default:return <OrganizerProfileClassic/>;}}