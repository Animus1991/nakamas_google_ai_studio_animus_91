import {useStore} from "../store";
import NearbyGroupsClassic from "./NearbyGroupsClassic";
import NearbyGroupsVibrant from "./NearbyGroupsVibrant";
import NearbyGroupsVibrantDark from "./NearbyGroupsVibrantDark";
import NearbyGroupsNeon from "./NearbyGroupsNeon";
import NearbyGroupsNeonDark from "./NearbyGroupsNeonDark";
import NearbyGroupsBento from "./NearbyGroupsBento";
import NearbyGroupsBentoDark from "./NearbyGroupsBentoDark";
export default function NearbyGroups(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <NearbyGroupsVibrant/>;case "vibrant-dark": return <NearbyGroupsVibrantDark/>; case "neon": return <NearbyGroupsNeon/>; case "neon-dark": return <NearbyGroupsNeonDark/>;case "bento":return <NearbyGroupsBento/>;case "bento-dark":return <NearbyGroupsBentoDark/>;default:return <NearbyGroupsClassic/>;}}