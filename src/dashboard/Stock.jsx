import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Stock() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      setMedicines(res.data);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this medicine?');
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      if (res.status === 200) {
        // Remove from UI
        setMedicines(prev => prev.filter(med => med._id !== id));
        alert('Medicine deleted successfully!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete medicine');
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.preparation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Medicine Stock</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search medicine..."
        className="border p-2 mb-4 w-full rounded"
      />

      {filteredMedicines.length === 0 ? (
        <div className="text-gray-500">No medicines found.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Preparation</th>
              <th className="p-2">Price</th>
              <th className="p-2">Units</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map(med => (
              <tr key={med._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{med.name}</td>
                <td className="p-2">{med.preparation}</td>
                <td className="p-2">BDT {med.pricePerUnit}</td>
                <td className="p-2">{med.unitsAvailable}</td>
                <td className="p-2">{new Date(med.expiryDate).toLocaleDateString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(med._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Stock;
