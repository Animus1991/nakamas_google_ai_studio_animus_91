import {useStore} from "../store";
import InboxClassic from "./InboxClassic";
import InboxVibrant from "./InboxVibrant";
import InboxVibrantDark from "./InboxVibrantDark";
import InboxNeon from "./InboxNeon";
import InboxNeonDark from "./InboxNeonDark";
import InboxBento from "./InboxBento";
import InboxBentoDark from "./InboxBentoDark";
export default function Inbox(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <InboxVibrant/>;case "vibrant-dark": return <InboxVibrantDark/>; case "neon": return <InboxNeon/>; case "neon-dark": return <InboxNeonDark/>;case "bento":return <InboxBento/>;case "bento-dark":return <InboxBentoDark/>;default:return <InboxClassic/>;}}