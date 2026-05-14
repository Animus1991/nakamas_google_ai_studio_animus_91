import {useStore} from "../store";
import WalletClassic from "./WalletClassic";
import WalletVibrant from "./WalletVibrant";
import WalletVibrantDark from "./WalletVibrantDark";
import WalletNeon from "./WalletNeon";
import WalletNeonDark from "./WalletNeonDark";
import WalletBento from "./WalletBento";
import WalletBentoDark from "./WalletBentoDark";
export default function Wallet(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <WalletVibrant/>;case "vibrant-dark": return <WalletVibrantDark/>; case "neon": return <WalletNeon/>; case "neon-dark": return <WalletNeonDark/>;case "bento":return <WalletBento/>;case "bento-dark":return <WalletBentoDark/>;default:return <WalletClassic/>;}}