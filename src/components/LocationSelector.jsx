import { useRef, useState, useEffect } from 'react'
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api'
import { mapOptions } from './GoogleMapsWrapper'

const containerStyle = {
  width: '100%',
  height: '100%',
}

const defaultCenter = { lat: 44.9591, lng: -89.6301 } // Wausau, WI

export default function LocationSelector({ onConfirm }) {
  const [position, setPosition] = useState(null)
  const [address, setAddress] = useState('')
  const autocompleteRef = useRef(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          })
        },
        () => {
          setPosition(defaultCenter)
        }
      )
    } else {
      setPosition(defaultCenter)
    }
  }, [])

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace()
    if (place.geometry) {
      const loc = place.geometry.location
      setPosition({ lat: loc.lat(), lng: loc.lng() })
      setAddress(place.formatted_address)
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || defaultCenter}
        zoom={position ? 15 : 9}
        options={mapOptions}
      >
        {position && <Marker position={position} />}
      </GoogleMap>

      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-2/3 lg:w-1/2 bg-white bg-opacity-90 p-6 rounded-xl shadow-xl">
        <label className="block font-medium text-lg mb-2">Enter your service location:</label>
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="123 Main St..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </Autocomplete>
      </div>

      {position && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all text-lg shadow-xl"
            onClick={() => onConfirm({ position, address })}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}