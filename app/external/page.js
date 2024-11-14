'use client'
import TableauEmbed from '../components/TableauEmbed';

const HomePage = () => {
    const tableauUrl = 'https://public.tableau.com/views/measles_external-factors/FINAL?:language=en-US&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link&:device=desktop';

    return (
        <div>
            <TableauEmbed url={tableauUrl} />
        </div>
    );
};

export default HomePage;
