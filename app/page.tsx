'use client'
import {
    GoogleMap,
    MarkerF,
    useJsApiLoader,
} from "@react-google-maps/api";

function generateRandomLatLng(numPoints: number) {
  const markers = [];
  
  for (let i = 0; i < numPoints; i++) {
    // Generate random lat/lng within a specific range around a central point (e.g., San Francisco)
      // Generate random latitudes and longitudes that span the globe
    const lat = (Math.random() * 180 - 90).toFixed(6);  // Latitude between -90 and 90
    const lng = (Math.random() * 360 - 180).toFixed(6); // Longitude between -180 and 180

    markers.push({ lat: parseFloat(lat), lng: parseFloat(lng) });}

  return markers;
}


export default function Home() {
    const defaultMapOptions = {
        zoomControl: true,
        tilt: 0,
        gestureHandling: 'auto',
        // mapTypeId: 'satellite',
    };
    const defaultMapZoom = 3
    const defaultMapCenter = {
        lat:28.2495102,
        lng: 8.7116714,
    }
    const defaultMapContainerStyle = {
       width: '100%',
       height: '100vh',
       // borderRadius: '15px 0px 0px 15px',
    };

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    });
    if (!isLoaded) {
        return null;
    }

    const markers = generateRandomLatLng(50)

    return (
    <div>
         <GoogleMap
             mapContainerStyle={defaultMapContainerStyle}
             center={defaultMapCenter}
             zoom={defaultMapZoom}
             options={defaultMapOptions}
         >
             { 
             markers.map((x,i) => <MarkerF
                 position={{ lat: x.lat, lng:x.lng }}
                 key={i}
             ></MarkerF>) }
         </GoogleMap>
    </div>
    )
}
