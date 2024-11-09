'use client'
import {
    GoogleMap,
    MarkerF,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";



export default function Home() {

    const ignoreCols = ['Source', 'Species', 'Disease']

    // Map stuff
    const defaultMapOptions = {
        zoomControl: true,
        tilt: 0,
        gestureHandling: 'auto',
        // mapTypeId: 'satellite',
    };
    const defaultMapZoom = 3
    const defaultMapCenter = {
        lat: 28.2495102,
        lng: 8.7116714,
    }
    const defaultMapContainerStyle = {
        width: '100%',
        height: '100vh',
        // borderRadius: '15px 0px 0px 15px',
    };

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    });


    useEffect(() => {
        fetch('/api')
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading && !isLoaded) return <p>Loading...</p>
    if (data && data.markers) return (
        <div className="flex flex-row">
            <div className="basis-2/3">
                <GoogleMap
                    mapContainerStyle={defaultMapContainerStyle}
                    center={defaultMapCenter}
                    zoom={defaultMapZoom}
                    options={defaultMapOptions}
                >
                    {
                        data.markers.map((x, i) =>
                            <MarkerF position={{
                                lat: x.lat,
                                lng: x.lon
                            }} key={i} />)
                    }
                </GoogleMap>
            </div>
            <div className="basis-1/3 overflow-y-scroll max-h-lvh">
                <table border={1}>
                    <tbody>
                        <tr>
                            {
                                data.list_view_header.map(
                                    (v, k) =>
                                        ignoreCols.includes(v) ?
                                            null
                                            :
                                            <td
                                                key={k + v}
                                            >
                                                {v}
                                            </td>
                                )
                            }
                        </tr>
                        {
                            // For each news value in the listview
                            data.listview.map((row_v, row_i) =>
                                <tr key={row_i}>
                                    {
                                        // Create all the cells
                                        data.list_view_header.map((cell_v, cell_i) =>
                                            ignoreCols.includes(cell_v) ?
                                                null
                                                :
                                                <td
                                                    key={row_i + "-" + cell_i}
                                                    dangerouslySetInnerHTML={{ __html: row_v[cell_i] }}
                                                />
                                        )
                                    }
                                </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

