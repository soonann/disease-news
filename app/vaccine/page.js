'use client'
import TableauEmbed from '../components/TableauEmbed';


const HomePage = () => {
    const tableauUrl = 'https://public.tableau.com/views/USA_Vaccine/VaccineDashboard?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link&:device=desktop';

    return (
        <TableauEmbed url={tableauUrl} />
    );
};

export default HomePage;
