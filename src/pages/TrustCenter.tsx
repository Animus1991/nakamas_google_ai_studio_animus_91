import {useStore} from "../store";
import TrustCenterClassic from "./TrustCenterClassic";
import TrustCenterVibrant from "./TrustCenterVibrant";
import TrustCenterVibrantDark from "./TrustCenterVibrantDark";
import TrustCenterNeon from "./TrustCenterNeon";
import TrustCenterNeonDark from "./TrustCenterNeonDark";
import TrustCenterBento from "./TrustCenterBento";
import TrustCenterBentoDark from "./TrustCenterBentoDark";
export default function TrustCenter(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <TrustCenterVibrant/>;case "vibrant-dark": return <TrustCenterVibrantDark/>; case "neon": return <TrustCenterNeon/>; case "neon-dark": return <TrustCenterNeonDark/>;case "bento":return <TrustCenterBento/>;case "bento-dark":return <TrustCenterBentoDark/>;default:return <TrustCenterClassic/>;}}