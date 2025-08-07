import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Customer() {
  const [medicines, setMedicines] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showCustomers, setShowCustomers] = useState(false);
  const [form, setForm] = useState({ name: '', product: '', billPaid: '' });
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

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
    } catch (err) {
      setError('Error fetching customers');
    }
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.product || !form.billPaid) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/customers', {
        name: form.name,
        product: form.product,
        billPaid: Number(form.billPaid)
      });
      setError('');
      setForm({ name: '', product: '', billPaid: '' });
      if (showCustomers) fetchCustomers();
      alert('Customer record added!');
    } catch (err) {
      setError('Failed to add customer');
    }
  };

  const handleViewCustomers = () => {
    setShowCustomers(v => !v);
    if (!showCustomers) fetchCustomers();
  };

  const filteredCustomers = customers.filter(cust =>
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-dark text-center font-[600] text-2xl mb-6">Customer Records</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Product</label>
          <input
            name="product"
            value={form.product}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bill Paid (BDT)</label>
          <input
            type="number"
            name="billPaid"
            value={form.billPaid}
            onChange={handleFormChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Customer
        </button>
      </form>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        onClick={handleViewCustomers}
      >
        {showCustomers ? 'Hide Customers' : 'View Customers'}
      </button>
      {showCustomers && (
        <div>
          <input
            type="text"
            className="border p-2 rounded w-full mb-2"
            placeholder="Search by name or product..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <table className="w-full border-collapse mb-2">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Product</th>
                <th className="p-2">Bill Paid</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-gray-500">No records found.</td></tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust._id} className="border-b">
                    <td className="p-2">{cust.name}</td>
                    <td className="p-2">{cust.product}</td>
                    <td className="p-2">BDT {cust.billPaid}</td>
                    <td className="p-2">{new Date(cust.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Customer;
