import {useStore} from "../store";
import ProfileClassic from "./ProfileClassic";
import ProfileVibrant from "./ProfileVibrant";
import ProfileVibrantDark from "./ProfileVibrantDark";
import ProfileNeon from "./ProfileNeon";
import ProfileNeonDark from "./ProfileNeonDark";
import ProfileBento from "./ProfileBento";
import ProfileBentoDark from "./ProfileBentoDark";
export default function Profile(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <ProfileVibrant/>;case "vibrant-dark": return <ProfileVibrantDark/>; case "neon": return <ProfileNeon/>; case "neon-dark": return <ProfileNeonDark/>;case "bento":return <ProfileBento/>;case "bento-dark":return <ProfileBentoDark/>;default:return <ProfileClassic/>;}}