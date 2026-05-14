import {useStore} from "../store";
import HistoryClassic from "./HistoryClassic";
import HistoryVibrant from "./HistoryVibrant";
import HistoryVibrantDark from "./HistoryVibrantDark";
import HistoryNeon from "./HistoryNeon";
import HistoryNeonDark from "./HistoryNeonDark";
import HistoryBento from "./HistoryBento";
import HistoryBentoDark from "./HistoryBentoDark";
export default function History(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <HistoryVibrant/>;case "vibrant-dark": return <HistoryVibrantDark/>; case "neon": return <HistoryNeon/>; case "neon-dark": return <HistoryNeonDark/>;case "bento":return <HistoryBento/>;case "bento-dark":return <HistoryBentoDark/>;default:return <HistoryClassic/>;}}