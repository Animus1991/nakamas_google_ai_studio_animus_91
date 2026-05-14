import {useStore} from "../store";
import GroupChatClassic from "./GroupChatClassic";
import GroupChatVibrant from "./GroupChatVibrant";
import GroupChatVibrantDark from "./GroupChatVibrantDark";
import GroupChatNeon from "./GroupChatNeon";
import GroupChatNeonDark from "./GroupChatNeonDark";
import GroupChatBento from "./GroupChatBento";
import GroupChatBentoDark from "./GroupChatBentoDark";
export default function GroupChat(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <GroupChatVibrant/>;case "vibrant-dark": return <GroupChatVibrantDark/>; case "neon": return <GroupChatNeon/>; case "neon-dark": return <GroupChatNeonDark/>;case "bento":return <GroupChatBento/>;case "bento-dark":return <GroupChatBentoDark/>;default:return <GroupChatClassic/>;}}