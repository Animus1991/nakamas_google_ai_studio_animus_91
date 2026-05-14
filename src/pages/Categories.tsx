import {useStore} from "../store";
import CategoriesClassic from "./CategoriesClassic";
import CategoriesVibrant from "./CategoriesVibrant";
import CategoriesVibrantDark from "./CategoriesVibrantDark";
import CategoriesNeon from "./CategoriesNeon";
import CategoriesNeonDark from "./CategoriesNeonDark";
import CategoriesBento from "./CategoriesBento";
import CategoriesBentoDark from "./CategoriesBentoDark";
export default function Categories(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <CategoriesVibrant/>;case "vibrant-dark": return <CategoriesVibrantDark/>; case "neon": return <CategoriesNeon/>; case "neon-dark": return <CategoriesNeonDark/>;case "bento":return <CategoriesBento/>;case "bento-dark":return <CategoriesBentoDark/>;default:return <CategoriesClassic/>;}}