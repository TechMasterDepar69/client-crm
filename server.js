const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Client = require('./models/Client');
const authRoutes = require('./routes/auth');
const protect = require('./middleware/auth');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static('public'));

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// --- ROUTES ---

app.use('/api/auth', authRoutes);

// 1. GET all Clients
app.get('/api/clients', protect, async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json({ success: true, count: clients.length, data: clients });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// 2. CREATE new Client
app.post('/api/clients', protect, async (req, res) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json({ success: true, data: client });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// 3. DELETE Client
app.delete('/api/clients/:id', protect, async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// 4. UPDATE Client
app.put('/api/clients/:id', protect, async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!client) return res.status(404).json({ success: false, error: 'Not found' });
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});