import {useStore} from "../store";
import AchievementsClassic from "./AchievementsClassic";
import AchievementsVibrant from "./AchievementsVibrant";
import AchievementsVibrantDark from "./AchievementsVibrantDark";
import AchievementsNeon from "./AchievementsNeon";
import AchievementsNeonDark from "./AchievementsNeonDark";
import AchievementsBento from "./AchievementsBento";
import AchievementsBentoDark from "./AchievementsBentoDark";
export default function Achievements(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <AchievementsVibrant/>;case "vibrant-dark": return <AchievementsVibrantDark/>; case "neon": return <AchievementsNeon/>; case "neon-dark": return <AchievementsNeonDark/>;case "bento":return <AchievementsBento/>;case "bento-dark":return <AchievementsBentoDark/>;default:return <AchievementsClassic/>;}}