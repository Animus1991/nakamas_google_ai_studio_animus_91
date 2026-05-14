import {useStore} from "../store";
import EventDetailClassic from "./EventDetailClassic";
import EventDetailVibrant from "./EventDetailVibrant";
import EventDetailVibrantDark from "./EventDetailVibrantDark";
import EventDetailNeon from "./EventDetailNeon";
import EventDetailNeonDark from "./EventDetailNeonDark";
import EventDetailBento from "./EventDetailBento";
import EventDetailBentoDark from "./EventDetailBentoDark";
export default function EventDetail(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <EventDetailVibrant/>;case "vibrant-dark": return <EventDetailVibrantDark/>; case "neon": return <EventDetailNeon/>; case "neon-dark": return <EventDetailNeonDark/>;case "bento":return <EventDetailBento/>;case "bento-dark":return <EventDetailBentoDark/>;default:return <EventDetailClassic/>;}}