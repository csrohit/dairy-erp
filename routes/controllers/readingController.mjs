import express from 'express'

const router = express.Router();

router.get('/', async (req, res) => {
    return res.json({info: 'Get list of milk reeadings, pass query to get specific readings'});
});



export default router;