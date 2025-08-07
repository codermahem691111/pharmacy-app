import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function Sells() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleAddToBill = () => {
    if (!selectedMedicineId || quantity < 1) return;
    const med = medicines.find(m => m._id === selectedMedicineId);
    if (!med) return;
    if (quantity > med.unitsAvailable) {
      setError(`Only ${med.unitsAvailable} units available for ${med.name}`);
      return;
    }
    setBillItems(prev => {
      const existing = prev.find(item => item._id === med._id);
      if (existing) {
        return prev.map(item =>
          item._id === med._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...med, quantity }];
      }
    });
    setError('');
  };

  const handleRemoveFromBill = (id) => {
    setBillItems(prev => prev.filter(item => item._id !== id));
  };

  const getTotal = () => {
    return billItems.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    doc.text('Smart Pharma Bill', 10, 10);
    let y = 20;
    billItems.forEach((item, idx) => {
      doc.text(
        `${idx + 1}. ${item.name} (${item.preparation}) x ${item.quantity} = BDT ${item.pricePerUnit * item.quantity}`,
        10,
        y
      );
      y += 10;
    });
    doc.text(`Total: BDT ${getTotal()}`, 10, y + 10);
    doc.save('bill.pdf');

    // Update stock in backend
    try {
      await Promise.all(
        billItems.map(item =>
          axios.patch(`http://localhost:5000/api/medicines/${item._id}`, {
            unitsAvailable: item.unitsAvailable - item.quantity
          })
        )
      );
      setError('');
      alert('Stock updated successfully!');
      // Optionally, refresh medicines
      fetchMedicines();
      setBillItems([]);
    } catch (err) {
      setError('Failed to update stock after sale.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-center font-[500] text-blue-400 text-2xl mb-6">Medicine Billing</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {/* Search box for filtering medicines */}
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        placeholder="Search by name or preparation..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          className="border p-2 rounded w-full md:w-1/2"
          value={selectedMedicineId}
          onChange={e => setSelectedMedicineId(e.target.value)}
        >
          <option value="">Select Medicine</option>
          {medicines
            .filter(med =>
              med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              med.preparation.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(med => (
              <option key={med._id} value={med._id}>
                {med.name} ({med.preparation}) - BDT {med.pricePerUnit} (Stock: {med.unitsAvailable})
              </option>
            ))}
        </select>
        <input
          type="number"
          min="1"
          className="border p-2 rounded w-full md:w-1/4"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          placeholder="Quantity"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddToBill}
        >
          Add
        </button>
      </div>
      {billItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Bill Items</h2>
          <table className="w-full border-collapse mb-2">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Preparation</th>
                <th className="p-2">Price</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Total</th>
                <th className="p-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map(item => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.preparation}</td>
                  <td className="p-2">BDT {item.pricePerUnit}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">BDT {item.pricePerUnit * item.quantity}</td>
                  <td className="p-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleRemoveFromBill(item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg mb-2">Total: BDT {getTotal()}</div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleExportPDF}
          >
            Export Bill as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Sells;
