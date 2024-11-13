'use client'
import {
    GoogleMap,
    MarkerF,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import * as d3 from 'd3';
import LineChart from "./LineChart"

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
    const [bigNumber1, setBigNumber1] = useState(0)
    const [bigNumber2, setBigNumber2] = useState(0)
    const [bigNumber3, setBigNumber3] = useState(0)
    const [isLoading, setLoading] = useState(true)
    const [active, setActive] = useState(-1)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    });
    const [lineChartData, setLineChartData] = useState([])

    const containerRef = useRef();
    const [metrics, setMetrics] = useState({
        metrics: [
            { label: 'PAST MONTH', value: bigNumber3 },
            { label: 'PAST WEEK', value: bigNumber2 },
            { label: 'TODAY', value: bigNumber1 }
        ]
    });

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
        // Clear existing content
        d3.select(containerRef.current).selectAll('*').remove();

        // Create container
        const container = d3.select(containerRef.current)
            .style('display', 'flex')
            .style('flex-direction', 'column') // Display items in a row
            .style('gap', '10px')
            .style('justify-content', 'space-between')
            .style('background', 'white')
            .style('padding', '20px')
            .style('width', '100%')
            .style('max-width', '300px')
            .style('height', '100%')
            .style('max-height', '600px');

        // Create sections for each metric and make them look like cards
        const sections = container.selectAll('.metric-section')
            .data(metrics.metrics)
            .join('div')
            .style('flex', '1')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('align-items', 'center')
            .style('justify-content', 'center')
            .style('background', '#f8f9fa')
            .style('border', '1px solid #ddd')
            .style('border-radius', '8px')
            .style('padding', '20px')
            .style('box-shadow', '0 1px 1px rgba(0, 0, 0, 0.1)')
            .style('height', '100%');

        // Add label
        sections.append('div')
            .style('color', '#666')
            .style('font-size', '14px')
            .text(d => d.label);

        // Add value without animation
        sections.append('div')
            .style('font-size', '36px')
            .style('font-weight', 'bold')
            .style('margin', '5px 0')
            .text(d => d3.format(',')(d.value)); // Format number with commas

    }, [metrics]);

    useEffect(() => {
        if (allData.length < 1) {
            return
        }
        console.log(allData)
        const parsed = parseData(allData.listview)
        setParsedData(parsed)
        console.log(parsed)
    }, [allData])

    function generateDateData(reduced) {
        const today = new Date();
        const data = []; // Array to store the 2D array

        // Iterate through the last 30 days
        for (let i = 30; i >= 0; i--) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() - i); // Set to the date i days ago
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


            // Format the date as dd/mm/yyyy
            const day = String(currentDate.getDate())
            const month = monthNames[currentDate.getMonth()]
            const year = currentDate.getFullYear();
            const dateString = `${day} ${month} ${year}`;

            // Check if the key exists in the 'reduced' map
            const value = reduced[dateString] || 0; // Default to 0 if not found

            // Append to the data array
            // for (const [key, value] of Object.entries(reduced)) {
            //     lineChartData.push([new Date(key), value])
            // }
            data.push([new Date(currentDate), value]);
        }

        return data;
    }


    useEffect(() => {

        if (parsedData.length < 1) {
            return
        }

        const newsDayCount = findValuesToday(parsedData).length
        const newsWeekCount = findValuesOneWeekAgo(parsedData).length
        const newsMonthCount = parsedData.length
        console.log([newsDayCount, newsWeekCount, newsMonthCount])

        setBigNumber1(newsDayCount)
        setBigNumber2(newsWeekCount)
        setBigNumber3(newsMonthCount)


        const reduced = parsedData
            .reduce((occurrences, element) => {
                occurrences[element[1]] =
                    (occurrences[element[1]] || 0) + 1;
                return occurrences;
            }, {});
        console.log(reduced)

        // const lineChartData = []
        // lineChartData.push(["Datetime", "News Count"])
        const lineChartData = generateDateData(reduced)
        lineChartData.unshift(["Datetime", "News Count"])

        setLineChartData(lineChartData)


    }, [parsedData])

    useEffect(() => {
        setMetrics({
            metrics: [
                { label: 'PAST MONTH', value: bigNumber3 },
                { label: 'PAST WEEK', value: bigNumber2 },
                { label: 'TODAY', value: bigNumber1 }
            ]
        });
    }, [bigNumber1, bigNumber2, bigNumber3])

    let onMarkerClick = (e, i) => {
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
            <div className="grid grid-cols-5 gap-2 p-2 justify-items-stretch">
                <div className="col-span-1 h-full">
                    <h1 className="font-bold">
                        {"Number of recent Measles news"}
                    </h1>
                    <div ref={containerRef} style={{ height: '100vh', width: '100%' }} >
                    </div>
                </div>

                <div className="col-span-4 h-full">
                    <h1 className="font-bold">
                        {"Trend of News related to Measles in past Month"}
                    </h1>
                    <LineChart data={lineChartData}></LineChart>

                </div>
            </div>


        </div >
    )
}

