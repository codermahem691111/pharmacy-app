import React from 'react'
import { Link } from 'react-router-dom'
import { MdInventory } from 'react-icons/md'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { RiMedicineBottleFill } from 'react-icons/ri'
import { FaStore } from 'react-icons/fa';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Inventory Card */}
          <Link to="/inventory" className="bg-amber-400 rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center space-y-4">
            <div className="bg-blue-100 p-6 rounded-full">
              <MdInventory className="text-blue-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Inventory</h2>
          </Link>

          {/* Sells Card */}
          <Link to="/sells" className="bg-rose-500 rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center space-y-4">
            <div className="bg-yellow-100 p-6 rounded-full">
              <FaShoppingCart className="text-yellow-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Sells</h2>
          </Link>

          {/* Customer Card */}
          <Link to="/customer" className="bg-sky-400 rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center space-y-4">
            <div className="bg-green-100 p-6 rounded-full">
              <FaUser className="text-green-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Customer</h2>
          </Link>

          {/* Medicine Card */}
          <Link to="/medicine" className="bg-cyan-700 rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center space-y-4">
            <div className="bg-red-100 p-6 rounded-full">
              <RiMedicineBottleFill className="text-red-600 text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Medicine</h2>
          </Link>

          {/* E-commerce Card */}
          <Link to="/commerce" className="bg-purple-500 rounded-lg shadow-lg aspect-square flex flex-col items-center justify-center space-y-4">
            <div className="bg-purple-100 p-6 rounded-full">
              <FaStore className="text-purple-700 text-5xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">E-commerce</h2>
          </Link>

        </div>
      </div>
    </div>
  )
}

export default Home
