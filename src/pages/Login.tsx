import {useStore} from "../store";
import LoginClassic from "./LoginClassic";
import LoginVibrant from "./LoginVibrant";
import LoginVibrantDark from "./LoginVibrantDark";
import LoginNeon from "./LoginNeon";
import LoginNeonDark from "./LoginNeonDark";
import LoginBento from "./LoginBento";
import LoginBentoDark from "./LoginBentoDark";
export default function Login(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <LoginVibrant/>;case "vibrant-dark": return <LoginVibrantDark/>; case "neon": return <LoginNeon/>; case "neon-dark": return <LoginNeonDark/>;case "bento":return <LoginBento/>;case "bento-dark":return <LoginBentoDark/>;default:return <LoginClassic/>;}}