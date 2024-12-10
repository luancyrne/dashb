const express = require('express');
const cors = require('cors');
require('dotenv').config();

const serviceCallRoutes = require('./routes/serviceCallRoutes');
const contractRoutes = require('./routes/contractRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());
app.use('/server', serviceCallRoutes);
app.use('/server', contractRoutes);
app.use('/server', inventoryRoutes);

module.exports = app;