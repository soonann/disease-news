'use client'
import {
    GoogleMap,
    MarkerF,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import LineChart from "./LineChart"
import BigNumbersDashboard from "./Numbers"




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
        height: '96%',
        // borderRadius: '15px 0px 0px 15px',
    };

    const [allData, setAllData] = useState([])
    const [parsedData, setParsedData] = useState([])
    const [bigNumber, setBigNumber] = useState([0, 0, 0])
    const [isLoading, setLoading] = useState(true)
    const [active, setActive] = useState(-1)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    });
    const [lineChartData, setLineChartData] = useState([])

    let parseData = (dataArray) => {
        return dataArray.map(data => {
            // Remove nulls and parse HTML in each element
            return data
                .filter(item => item && typeof item === 'string') // Remove null and non-string values
                .map(item => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = item;
                    return tempDiv.textContent || tempDiv.innerText || ""; // Remove HTML tags
                });
        });
    }

    // Helper function to parse date from the string format "6 Nov 2024" or similar
    let parseDate = (dateString) => {
        return new Date(Date.parse(dateString));
    }

    // First function to find values from 1 week ago
    let findValuesOneWeekAgo = (data) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return data.filter(item => {
            const date = parseDate(item[1]);
            return date >= oneWeekAgo && date < new Date(); // Between 1 week ago and today
        });
    }

    // Second function to find values for today
    let findValuesToday = (data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day

        return data.filter(item => {
            const date = parseDate(item[1]);
            return (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            ); // Match year, month, and day
        });
    }



    useEffect(() => {
        fetch('/api')
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setAllData(data)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if (allData.length < 1) {
            return
        }
        console.log(allData)
        const parsed = parseData(allData.listview)
        setParsedData(parsed)
        console.log(parsed)
    }, [allData])


    useEffect(() => {

        if (parsedData.length < 1) {
            return
        }

        const newsDayCount = findValuesToday(parsedData).length
        const newsWeekCount = findValuesOneWeekAgo(parsedData).length
        const newsMonthCount = parsedData.length
        console.log([newsDayCount, newsWeekCount, newsMonthCount])
        setBigNumber([newsDayCount, newsWeekCount, newsMonthCount])

        // console.log(newsDayCount.length)
        // console.log(newsWeekCount.length)
        // console.log(newsMonthCount.length)

        const lineChartData = [
            { date: new Date('2024-01-01'), value: 10 },
            { date: new Date('2024-02-01'), value: 15 },
            { date: new Date('2024-03-01'), value: 25 },
            { date: new Date('2024-04-01'), value: 20 },
            { date: new Date('2024-05-01'), value: 30 }
        ];
        setLineChartData(lineChartData)


    }, [parsedData])

    let onMarkerClick = (e, i) => {
        // console.log(e)
        // console.log(i)
        setActive(i)
    }

    if (isLoading && !isLoaded) return <p>Loading...</p>
    if (allData && allData.markers) return (
        <div className="grid grid-rows-2 auto-rows-fr h-full gap-4">
            <div className="grid grid-cols-3 gap-2 p-2 ">
                <div className="col-span-2">
                    <h1 className="font-bold">Map for Measles news in past month</h1>
                    <GoogleMap
                        mapContainerStyle={defaultMapContainerStyle}
                        center={defaultMapCenter}
                        zoom={defaultMapZoom}
                        options={defaultMapOptions}
                    >
                        {
                            allData.markers.map((x, i) =>
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
                <div className="col-span-1 overflow-y-scroll">
                    <h1 className="font-bold">News Feed for Measles in past month</h1>
                    <table className="border h-full w-full">
                        <tbody >
                            <tr className="text-xs"
                            >
                                {
                                    allData.list_view_header.map(
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
                                allData.listview.map((row_v, row_i) =>
                                    <tr
                                        key={row_i}
                                        className={"text-xs" + (row_i == active ? " bg-purple-300" : "")}
                                    >
                                        {
                                            // Create all the cells
                                            allData.list_view_header.map((cell_v, cell_i) =>
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
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 justify-items-stretch">
                <div className="col-span-1 h-full">
                    <h1 className="font-bold">
                        {"Number of recent Measles news"}
                    </h1>
                    <BigNumbersDashboard
                        bigNumber={bigNumber}
                    />
                </div>

                <div className="col-span-2 h-full">
                    <h1 className="font-bold">
                        {"News related to Measles in the past month"}
                    </h1>
                    <LineChart
                        data={lineChartData}
                    />
                </div>
            </div>


        </div >
    )
}

