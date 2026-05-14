import {useStore} from "../store";
import ReportIssueClassic from "./ReportIssueClassic";
import ReportIssueVibrant from "./ReportIssueVibrant";
import ReportIssueVibrantDark from "./ReportIssueVibrantDark";
import ReportIssueNeon from "./ReportIssueNeon";
import ReportIssueNeonDark from "./ReportIssueNeonDark";
import ReportIssueBento from "./ReportIssueBento";
import ReportIssueBentoDark from "./ReportIssueBentoDark";
export default function ReportIssue(){const theme=useStore(s=>s.theme);switch(theme){case "vibrant":return <ReportIssueVibrant/>;case "vibrant-dark": return <ReportIssueVibrantDark/>; case "neon": return <ReportIssueNeon/>; case "neon-dark": return <ReportIssueNeonDark/>;case "bento":return <ReportIssueBento/>;case "bento-dark":return <ReportIssueBentoDark/>;default:return <ReportIssueClassic/>;}}