import {useStore} from "../store";
import PostEventFeedbackClassic from "./PostEventFeedbackClassic";
import PostEventFeedbackVibrant from "./PostEventFeedbackVibrant";
import PostEventFeedbackVibrantDark from "./PostEventFeedbackVibrantDark";
import PostEventFeedbackNeon from "./PostEventFeedbackNeon";
import PostEventFeedbackNeonDark from "./PostEventFeedbackNeonDark";
import PostEventFeedbackBento from "./PostEventFeedbackBento";
import PostEventFeedbackBentoDark from "./PostEventFeedbackBentoDark";
export default function PostEventFeedback(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <PostEventFeedbackVibrant/>;case "vibrant-dark": return <PostEventFeedbackVibrantDark/>; case "neon": return <PostEventFeedbackNeon/>; case "neon-dark": return <PostEventFeedbackNeonDark/>;case "bento":return <PostEventFeedbackBento/>;case "bento-dark":return <PostEventFeedbackBentoDark/>;default:return <PostEventFeedbackClassic/>;}}