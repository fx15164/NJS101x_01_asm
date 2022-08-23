const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router');

const app = express();

// vew engine
app.set('view engine', 'ejs');

// request body parser
app.use(bodyParser.urlencoded({ extended: false }));

// router
app.use(router);


app.use((req, res) => {
    res.render('404');
})

app.listen(3000);