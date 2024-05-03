
const express = require("express");
const router = express.Router();

const Report = require('../../models/Report');

router.post('/report/:reportedUserId', async (req, res) => {
    try {
        const reportedUserId = req.params.reportedUserId;
        const message = req.body.message; // Corrected to retrieve from body

        if (!reportedUserId || !message) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        const report = new Report({
            reportedUserId,
            message
        });

        await report.save();
        res.status(201).send({ message: 'Report has been submitted successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
});
router.get('/get-reports/:userId', async (req, res) => {
    try {
        console.log("i make it here ")
        const userId = req.params.userId;
        console.log(userId)
        const reports = await Report.find({ reportedUserId: userId });  // Fetch reports for a specific userId
        console.log("results are ",reports)
        res.status(200).send(reports);
    } catch (error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
