import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import auth from './auth';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import db from './firebase';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate('/login');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(collection(db, 'bookings'), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📋 Admin Booking Dashboard</h1>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-md"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
            />
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Service</th>
                <th className="border p-2">Vehicle</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter((b) =>
                  (!searchTerm ||
                    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.email?.toLowerCase().includes(searchTerm.toLowerCase()))
                  &&
                  (!selectedDateFilter || b.date === selectedDateFilter)
                )
                .map(b => (
                  <tr key={b.id}>
                    <td className="border p-2">{b.date}</td>
                    <td className="border p-2">{b.time}</td>
                    <td className="border p-2">{b.name}</td>
                    <td className="border p-2">{b.servicePackage}</td>
                    <td className="border p-2">{b.vehicleType}</td>
                    <td className="border p-2">{b.serviceLocation}</td>
                    <td className="border p-2">
                      <select
                        className="px-2 py-1 border rounded"
                        value={b.status || 'new'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          const ref = doc(db, 'bookings', b.id);
                          await updateDoc(ref, { status: newStatus });
                          setBookings((prev) =>
                            prev.map((bk) => (bk.id === b.id ? { ...bk, status: newStatus } : bk))
                          );
                        }}
                      >
                        <option value="new">New</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;