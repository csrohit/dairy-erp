import express from 'express'

const index = express.Router();


index.get('/', (req, res) => {
    return res.json({success: true})
});


// // const index = ''


export default index

// const router = require('express').Router()
// router.get('/', (req, res) => {
//     return res.json({success:true, msg:"Connected to server"});
// })



// module.exports = router