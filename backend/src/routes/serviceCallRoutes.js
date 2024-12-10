const express = require('express');
const router = express.Router();
const serviceCallService = require('../services/serviceCallService');

router.post('/service-calls', async (req, res) => {
    try {
        const result = await serviceCallService.getServiceCalls(req.body);
        res.json(result);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(error.message === 'Missing required parameters' ? 400 : 500).json({
            error: error.message === 'Missing required parameters' ?
                'Missing required parameters' : 'Internal server error',
            details: error.message
        });
    }
});

router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports = router;