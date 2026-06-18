require('dotenv').config();
const express = require('express');
const cors = require('cors');

const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
});

// ============================================
// Routes
// ============================================
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/location', locationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Location Tracker API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║       📍 Location Tracker API Server          ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║  Running on:  http://0.0.0.0:${PORT}            ║`);
    console.log(`║  Started at:  ${new Date().toLocaleString().padEnd(31)}║`);
    console.log('╠════════════════════════════════════════════════╣');
    console.log('║  Endpoints:                                   ║');
    console.log('║  POST  /api/client/register                   ║');
    console.log('║  POST  /api/client/login                      ║');
    console.log('║  POST  /api/client/logout                     ║');
    console.log('║  POST  /api/admin/login                       ║');
    console.log('║  GET   /api/admin/clients                     ║');
    console.log('║  GET   /api/admin/client/:id                  ║');
    console.log('║  POST  /api/location/update                   ║');
    console.log('║  POST  /api/location/batch                    ║');
    console.log('║  GET   /api/health                            ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
});
