import {useStore} from "../store";
import NotFoundClassic from "./NotFoundClassic";
import NotFoundVibrant from "./NotFoundVibrant";
import NotFoundVibrantDark from "./NotFoundVibrantDark";
import NotFoundNeon from "./NotFoundNeon";
import NotFoundNeonDark from "./NotFoundNeonDark";
import NotFoundBento from "./NotFoundBento";
import NotFoundBentoDark from "./NotFoundBentoDark";
export default function NotFound(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <NotFoundVibrant/>;case "vibrant-dark": return <NotFoundVibrantDark/>; case "neon": return <NotFoundNeon/>; case "neon-dark": return <NotFoundNeonDark/>;case "bento":return <NotFoundBento/>;case "bento-dark":return <NotFoundBentoDark/>;default:return <NotFoundClassic/>;}}