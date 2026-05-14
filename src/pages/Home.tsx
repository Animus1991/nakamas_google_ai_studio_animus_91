import {useStore} from "../store";
import HomeClassic from "./HomeClassic";
import HomeVibrant from "./HomeVibrant";
import HomeVibrantDark from "./HomeVibrantDark";
import HomeNeon from "./HomeNeon";
import HomeNeonDark from "./HomeNeonDark";
import HomeBento from "./HomeBento";
import HomeBentoDark from "./HomeBentoDark";
export default function Home(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <HomeVibrant/>;case "vibrant-dark": return <HomeVibrantDark/>; case "neon": return <HomeNeon/>; case "neon-dark": return <HomeNeonDark/>;case "bento":return <HomeBento/>;case "bento-dark":return <HomeBentoDark/>;default:return <HomeClassic/>;}}