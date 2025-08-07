import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Inv() {
  const [medicine, setMedicine] = useState({
    name: '',
    preparation: '',
    pricePerUnit: '',
    unitsAvailable: '',
    expiryDate: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setMedicine(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/medicines', medicine)
      alert('Medicine added successfully!')
      setMedicine({ name: '', preparation: '', pricePerUnit: '', unitsAvailable: '', expiryDate: '' })
    } catch (error) {
      console.error('Error adding medicine:', error)
      alert('Error adding medicine')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Medicine</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
          <input 
            name="name" 
            value={medicine.name} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Preparation</label>
          <input 
            name="preparation" 
            value={medicine.preparation} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Price Per Unit (BDT)</label>
          <input 
            type="number" 
            name="pricePerUnit" 
            value={medicine.pricePerUnit} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Units Available</label>
          <input 
            type="number" 
            name="unitsAvailable" 
            value={medicine.unitsAvailable} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input 
            type="date" 
            name="expiryDate" 
            value={medicine.expiryDate} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Medicine
        </button>
      </form>
      <div className="mt-4">
        <Link 
          to="/stock" 
          className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600 transition duration-200"
        >
          View Stock
        </Link>
      </div>
    </div>
  )
}

export default Inv
