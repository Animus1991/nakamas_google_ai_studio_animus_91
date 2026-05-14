import {useStore} from "../store";
import SettingsAndPrivacyClassic from "./SettingsAndPrivacyClassic";
import SettingsAndPrivacyVibrant from "./SettingsAndPrivacyVibrant";
import SettingsAndPrivacyVibrantDark from "./SettingsAndPrivacyVibrantDark";
import SettingsAndPrivacyNeon from "./SettingsAndPrivacyNeon";
import SettingsAndPrivacyNeonDark from "./SettingsAndPrivacyNeonDark";
import SettingsAndPrivacyBento from "./SettingsAndPrivacyBento";
import SettingsAndPrivacyBentoDark from "./SettingsAndPrivacyBentoDark";
export default function SettingsAndPrivacy(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <SettingsAndPrivacyVibrant/>;case "vibrant-dark": return <SettingsAndPrivacyVibrantDark/>; case "neon": return <SettingsAndPrivacyNeon/>; case "neon-dark": return <SettingsAndPrivacyNeonDark/>;case "bento":return <SettingsAndPrivacyBento/>;case "bento-dark":return <SettingsAndPrivacyBentoDark/>;default:return <SettingsAndPrivacyClassic/>;}}