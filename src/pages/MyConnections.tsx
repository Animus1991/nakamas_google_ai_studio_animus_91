import {useStore} from "../store";
import MyConnectionsClassic from "./MyConnectionsClassic";
import MyConnectionsVibrant from "./MyConnectionsVibrant";
import MyConnectionsVibrantDark from "./MyConnectionsVibrantDark";
import MyConnectionsNeon from "./MyConnectionsNeon";
import MyConnectionsNeonDark from "./MyConnectionsNeonDark";
import MyConnectionsBento from "./MyConnectionsBento";
import MyConnectionsBentoDark from "./MyConnectionsBentoDark";
export default function MyConnections(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <MyConnectionsVibrant/>;case "vibrant-dark": return <MyConnectionsVibrantDark/>; case "neon": return <MyConnectionsNeon/>; case "neon-dark": return <MyConnectionsNeonDark/>;case "bento":return <MyConnectionsBento/>;case "bento-dark":return <MyConnectionsBentoDark/>;default:return <MyConnectionsClassic/>;}}