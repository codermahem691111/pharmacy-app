const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb+srv://maheemshahreear2:7VK0LM6JxFpbxzCW@cluster0.urzuizl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection failed:', err));

// Schema & Model
const medicineSchema = new mongoose.Schema({
  name: String,
  preparation: String,
  pricePerUnit: Number,
  unitsAvailable: Number,
  expiryDate: Date
});
const Medicine = mongoose.model('Medicine', medicineSchema);

// Customer Schema & Model
const customerSchema = new mongoose.Schema({
  name: String,
  product: String,
  billPaid: Number,
  createdAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model('Customer', customerSchema);

// Get all medicines
app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new medicine
app.post('/api/medicines', async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    const saved = await medicine.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete medicine by ID
app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid medicine ID' });
    }

    const deletedMedicine = await Medicine.findByIdAndDelete(id);

    if (!deletedMedicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json({ 
      message: 'Medicine deleted successfully', 
      deletedMedicine 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH medicine unitsAvailable by ID
app.patch('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { unitsAvailable } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid medicine ID' });
    }
    if (typeof unitsAvailable !== 'number' || unitsAvailable < 0) {
      return res.status(400).json({ message: 'Invalid unitsAvailable value' });
    }
    const updated = await Medicine.findByIdAndUpdate(
      id,
      { unitsAvailable },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new customer
app.post('/api/customers', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
