import {useStore} from "../store";
import HelpCenterClassic from "./HelpCenterClassic";
import HelpCenterVibrant from "./HelpCenterVibrant";
import HelpCenterVibrantDark from "./HelpCenterVibrantDark";
import HelpCenterNeon from "./HelpCenterNeon";
import HelpCenterNeonDark from "./HelpCenterNeonDark";
import HelpCenterBento from "./HelpCenterBento";
import HelpCenterBentoDark from "./HelpCenterBentoDark";
export default function HelpCenter(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <HelpCenterVibrant/>;case "vibrant-dark": return <HelpCenterVibrantDark/>; case "neon": return <HelpCenterNeon/>; case "neon-dark": return <HelpCenterNeonDark/>;case "bento":return <HelpCenterBento/>;case "bento-dark":return <HelpCenterBentoDark/>;default:return <HelpCenterClassic/>;}}