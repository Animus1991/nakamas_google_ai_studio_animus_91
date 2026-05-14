import {useStore} from "../store";
import AdminDashboardClassic from "./AdminDashboardClassic";
import AdminDashboardVibrant from "./AdminDashboardVibrant";
import AdminDashboardVibrantDark from "./AdminDashboardVibrantDark";
import AdminDashboardNeon from "./AdminDashboardNeon";
import AdminDashboardNeonDark from "./AdminDashboardNeonDark";
import AdminDashboardBento from "./AdminDashboardBento";
import AdminDashboardBentoDark from "./AdminDashboardBentoDark";
export default function AdminDashboard(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <AdminDashboardVibrant/>;case "vibrant-dark": return <AdminDashboardVibrantDark/>; case "neon": return <AdminDashboardNeon/>; case "neon-dark": return <AdminDashboardNeonDark/>;case "bento":return <AdminDashboardBento/>;case "bento-dark":return <AdminDashboardBentoDark/>;default:return <AdminDashboardClassic/>;}}