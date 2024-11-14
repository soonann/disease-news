'use client'
import TableauEmbed from '../components/TableauEmbed';


const HomePage = () => {
    const tableauUrl2 = 'https://public.tableau.com/views/MacroAnalysis_17315685832090/MacroAnalysisDashboard1?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link&:device=desktop';
    const tableauUrl = 'https://public.tableau.com/views/DashboardNumberofMeaslesCasesReportedGlobally/FinalDashboard?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link&:device=desktop';

    return (

        <div>
            <TableauEmbed url={tableauUrl} />
            <br />
            <TableauEmbed url={tableauUrl2} />
        </div>
    );
};

export default HomePage;
