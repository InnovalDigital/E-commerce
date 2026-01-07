const express = require('express');
const app = express();
const homeRouter = require('./src/routes/index');

app.use('/', homeRouter);

app.listen(3000, () => {
    console.log('Server Is Running');
})