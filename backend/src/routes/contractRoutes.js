const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');

router.get('/seller-contracts', async (req, res) => {
    try {
        const { 
            startDate, 
            endDate, 
            contractType,
            contractStatus,
            page = 1, 
            pageSize = 30 
        } = req.query;

        const results = await contractService.getSellerContracts({
            startDate,
            endDate,
            contractType,
            contractStatus: Array.isArray(contractStatus) ? contractStatus : [contractStatus].filter(Boolean),
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });

        res.json(results);
    } catch (error) {
        console.error('Error getting seller contracts:', error);
        res.status(error.message.includes('required') ||
            error.message.includes('Invalid') ? 400 : 500)
            .json({
                error: error.message || 'Internal server error'
            });
    }
});

router.get('/canceled-contracts', async (req, res) => {
    try {
        const { 
            startDate, 
            endDate, 
            page = 1, 
            pageSize = 30 
        } = req.query;

        const results = await contractService.getCanceledContracts({
            startDate,
            endDate,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });

        res.json(results);
    } catch (error) {
        console.error('Error getting canceled contracts:', error);
        res.status(error.message.includes('required') ||
            error.message.includes('Invalid') ? 400 : 500)
            .json({
                error: error.message || 'Internal server error'
            });
    }
});

router.post('/validate-dates', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        await contractService.validateDates(startDate, endDate);
        res.json({ valid: true });
    } catch (error) {
        res.status(400).json({
            valid: false,
            error: error.message
        });
    }
});

module.exports = router;