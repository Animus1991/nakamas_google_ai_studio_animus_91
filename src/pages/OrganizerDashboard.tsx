import {useStore} from "../store";
import OrganizerDashboardClassic from "./OrganizerDashboardClassic";
import OrganizerDashboardVibrant from "./OrganizerDashboardVibrant";
import OrganizerDashboardVibrantDark from "./OrganizerDashboardVibrantDark";
import OrganizerDashboardNeon from "./OrganizerDashboardNeon";
import OrganizerDashboardNeonDark from "./OrganizerDashboardNeonDark";
import OrganizerDashboardBento from "./OrganizerDashboardBento";
import OrganizerDashboardBentoDark from "./OrganizerDashboardBentoDark";
export default function OrganizerDashboard(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <OrganizerDashboardVibrant/>;case "vibrant-dark": return <OrganizerDashboardVibrantDark/>; case "neon": return <OrganizerDashboardNeon/>; case "neon-dark": return <OrganizerDashboardNeonDark/>;case "bento":return <OrganizerDashboardBento/>;case "bento-dark":return <OrganizerDashboardBentoDark/>;default:return <OrganizerDashboardClassic/>;}}