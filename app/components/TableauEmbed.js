import { useEffect, useRef } from 'react';

const TableauEmbed = ({ url }) => {
    const vizRef = useRef(null);

    useEffect(() => {
        const { tableau } = window;

        if (tableau) {
            const vizOptions = {
                width: '100%',
                height: '100vh',
            };

            new tableau.Viz(vizRef.current, url);
        }
    }, [url]);

    return (
        <div ref={vizRef} />
    );
};

export default TableauEmbed;
