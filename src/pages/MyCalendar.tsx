import {useStore} from "../store";
import MyCalendarClassic from "./MyCalendarClassic";
import MyCalendarVibrant from "./MyCalendarVibrant";
import MyCalendarVibrantDark from "./MyCalendarVibrantDark";
import MyCalendarNeon from "./MyCalendarNeon";
import MyCalendarNeonDark from "./MyCalendarNeonDark";
import MyCalendarBento from "./MyCalendarBento";
import MyCalendarBentoDark from "./MyCalendarBentoDark";
export default function MyCalendar(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <MyCalendarVibrant/>;case "vibrant-dark": return <MyCalendarVibrantDark/>; case "neon": return <MyCalendarNeon/>; case "neon-dark": return <MyCalendarNeonDark/>;case "bento":return <MyCalendarBento/>;case "bento-dark":return <MyCalendarBentoDark/>;default:return <MyCalendarClassic/>;}}