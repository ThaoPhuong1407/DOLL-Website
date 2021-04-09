const express   = require('express');
const path      = require('path');

// Add a bunch of functions from module express to the variable `app`
const app = express();

//  Setting up pug templates
app.set('view engine', 'pug'); // Express framework supports pug template
app.set('views', path.join(__dirname, 'views'));

// Serving static files from the public folders
app.use(express.static(path.join(__dirname, 'public/')));

app.get('/', (req, res)=> {
    res.status(200).render('home', {
        test: 'Thao Phuong',
    });
});

app.get('/about', (req, res)=> {
    res.status(200).render('about', {
        test: 'Thao Phuong',
    });
});

app.get('/contact', (req, res)=> {
    res.status(200).render('contact', {
        test: 'Thao Phuong',
    });
});

app.get('/newsandprojects', (req, res)=> {
    res.status(200).render('newsandprojects', {
        test: 'Thao Phuong',
    });
});


app.get('/post', (req, res)=> {
    res.status(200).render('post', {
        test: 'Thao Phuong',
    });
});

app.get('/post/1', (req, res)=> {
    res.status(200).render('post1', {
        test: 'Thao Phuong',
    });
});

app.get('/post/2', (req, res)=> {
    res.status(200).render('post2', {
        test: 'Thao Phuong',
    });
});

app.get('/construction', (req, res)=> {
    res.status(200).render('construction', {
        test: 'Thao Phuong',
    });
});


const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

