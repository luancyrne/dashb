const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');

router.get('/inventory-movements', async (req, res) => {
    try {
        const { 
            startDate, 
            endDate,
            productIds,
            page = 1, 
            pageSize = 30 
        } = req.query;

        // Convert productIds to array and ensure all elements are strings
        const productIdsArray = Array.isArray(productIds) 
            ? productIds 
            : productIds.split(',');

        const results = await inventoryService.getInventoryMovements({
            startDate,
            endDate,
            productIds: productIdsArray,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });

        res.json(results);
    } catch (error) {
        console.error('Error getting inventory movements:', error);
        res.status(error.message.includes('required') ||
            error.message.includes('Invalid') ? 400 : 500)
            .json({
                error: error.message || 'Internal server error'
            });
    }
});

module.exports = router;