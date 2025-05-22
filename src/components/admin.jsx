import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import db from './firebase'

export default function Admin() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookings'))
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBookings(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching bookings:', err)
      }
    }

    fetchBookings()
  }, [])

  if (loading) return <div className="p-6 text-center text-gray-600">Loading bookings...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📋 All Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bookings.map(b => (
          <div key={b.id} className="border p-4 rounded shadow bg-white">
            <p><strong>Name:</strong> {b.name}</p>
            <p><strong>Phone:</strong> {b.phone}</p>
            <p><strong>Email:</strong> {b.email}</p>
            <p><strong>Service:</strong> {b.servicePackage}</p>
            <p><strong>Vehicle:</strong> {b.vehicleType}</p>
            <p><strong>Date:</strong> {b.date}</p>
            <p><strong>Time:</strong> {b.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}