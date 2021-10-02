var express = require('express');
var path = require('path');
var cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// serve angular front end files from root path
app.use(express.static('dist/webapp'));

// rewrite virtual urls to angular app to enable refreshing of internal pages
app.get('*', function (req, res, next) {
    res.sendFile(path.resolve('dist/webapp/index.html'));
});

app.listen(PORT, () => {
    // connect();
    console.log(`server listening on PORT: ${PORT}`);
});


