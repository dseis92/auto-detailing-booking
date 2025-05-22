import { LoadScript } from '@react-google-maps/api'

const libraries = ['places']

export const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "labels.text",
      stylers: [{ color: "#878787" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [{ color: "#f9f5ed" }]
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [{ color: "#f5f5f5" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#c9c9c9" }]
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [{ color: "#aee0f4" }]
    }
  ],
  disableDefaultUI: true,
  zoomControl: true,
}

export default function GoogleMapsWrapper({ children }) {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCO-JJp18BNUfm17L9_GeOdM2TVm4ZdpXk"
      libraries={libraries}
      loadingElement={<div>Loading Map...</div>}
    >
      {children}
    </LoadScript>
  )
}