import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Medicine() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      setMedicines(res.data);
    } catch (err) {
      setError('Error fetching medicines');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.preparation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-center text-blue-500 text-[29px] font-[600] mb-6">Medicine Stock & Expiry</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        placeholder="Search by name or preparation..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <table className="w-full border-collapse mb-2">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Preparation</th>
            <th className="p-2">Units Available</th>
            <th className="p-2">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicines.length === 0 ? (
            <tr><td colSpan="4" className="text-center text-gray-500">No medicines found.</td></tr>
          ) : (
            filteredMedicines.map(med => (
              <tr key={med._id} className="border-b">
                <td className="p-2">{med.name}</td>
                <td className="p-2">{med.preparation}</td>
                <td className="p-2">{med.unitsAvailable}</td>
                <td className="p-2">{new Date(med.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Medicine;
