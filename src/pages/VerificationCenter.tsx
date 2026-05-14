import {useStore} from "../store";
import VerificationCenterClassic from "./VerificationCenterClassic";
import VerificationCenterVibrant from "./VerificationCenterVibrant";
import VerificationCenterVibrantDark from "./VerificationCenterVibrantDark";
import VerificationCenterNeon from "./VerificationCenterNeon";
import VerificationCenterNeonDark from "./VerificationCenterNeonDark";
import VerificationCenterBento from "./VerificationCenterBento";
import VerificationCenterBentoDark from "./VerificationCenterBentoDark";
export default function VerificationCenter(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <VerificationCenterVibrant/>;case "vibrant-dark": return <VerificationCenterVibrantDark/>; case "neon": return <VerificationCenterNeon/>; case "neon-dark": return <VerificationCenterNeonDark/>;case "bento":return <VerificationCenterBento/>;case "bento-dark":return <VerificationCenterBentoDark/>;default:return <VerificationCenterClassic/>;}}