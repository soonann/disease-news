'use client'
import {
    GoogleMap,
    MarkerF,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";



export default function Home() {

    const ignoreCols = ["Source", "Species", "Disease", "Deaths", "Cases"]

    // Map stuff
    const defaultMapOptions = {
        zoomControl: true,
        tilt: 0,
        gestureHandling: 'auto',
        // mapTypeId: 'hybrid',
    };
    const defaultMapZoom = 3
    const defaultMapCenter = {
        lat: 28.2495102,
        lng: 8.7116714,
    }
    const defaultMapContainerStyle = {
        width: '100%',
        height: '100%',
        // borderRadius: '15px 0px 0px 15px',
    };

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [active, setActive] = useState(-1)
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

    let onMarkerClick = (e, i) => {
        // console.log(e)
        // console.log(i)
        setActive(i)
    }

    if (isLoading && !isLoaded) return <p>Loading...</p>
    if (data && data.markers) return (
        <div className="grid grid-cols-3 gap-2 p-2 h-full justify-items-stretch">
            <div className="col-span-2 h-full">
                <GoogleMap
                    mapContainerStyle={defaultMapContainerStyle}
                    center={defaultMapCenter}
                    zoom={defaultMapZoom}
                    options={defaultMapOptions}
                >
                    {
                        data.markers.map((x, i) =>
                            <MarkerF

                                position={{
                                    lat: x.lat,
                                    lng: x.lon
                                }}
                                icon={{
                                    path: google.maps.SymbolPath.CIRCLE,
                                    scale: 8.5,
                                    fillColor: "purple",
                                    fillOpacity: 0.5,
                                    strokeWeight: 0.2,
                                }}
                                key={i}
                                onClick={(e) => { onMarkerClick(e, i) }}
                            />)
                    }
                </GoogleMap>
            </div>
            <div className="col-span-1 overflow-y-scroll h-full">
                <table className="border h-full w-full">
                    <tbody >
                        <tr className="text-xs"
                        >
                            {
                                data.list_view_header.map(
                                    (v, k) =>
                                        ignoreCols.includes(v) ?
                                            null
                                            :
                                            <td
                                                key={k + v}
                                                className="border"
                                            >
                                                {v}
                                            </td>
                                )
                            }
                        </tr>
                        {
                            // For each news value in the listview
                            data.listview.map((row_v, row_i) =>
                                <tr
                                    key={row_i}
                                    className={"text-xs" + (row_i == active ? " bg-purple-300" : "")}
                                >
                                    {
                                        // Create all the cells
                                        data.list_view_header.map((cell_v, cell_i) =>
                                            ignoreCols.includes(cell_v) ?
                                                null
                                                :
                                                <td
                                                    key={row_i + "-" + cell_i}
                                                    className="border"
                                                    dangerouslySetInnerHTML={{ __html: row_v[cell_i] ?? 0 }}
                                                />
                                        )
                                    }
                                </tr>)
                        }
                    </tbody>
                </table>
            </div>

            <div>

            </div>
        </div>
    )
}

