import {useStore} from "../store";
import NotificationsClassic from "./NotificationsClassic";
import NotificationsVibrant from "./NotificationsVibrant";
import NotificationsVibrantDark from "./NotificationsVibrantDark";
import NotificationsNeon from "./NotificationsNeon";
import NotificationsNeonDark from "./NotificationsNeonDark";
import NotificationsBento from "./NotificationsBento";
import NotificationsBentoDark from "./NotificationsBentoDark";
export default function Notifications(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <NotificationsVibrant/>;case "vibrant-dark": return <NotificationsVibrantDark/>; case "neon": return <NotificationsNeon/>; case "neon-dark": return <NotificationsNeonDark/>;case "bento":return <NotificationsBento/>;case "bento-dark":return <NotificationsBentoDark/>;default:return <NotificationsClassic/>;}}