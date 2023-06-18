const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
//express app
const app = express();

//connect to mongodb 
const dburi = 'mongodb+srv://rjp28:Rjpfeiffer28@cluster0.96l0v2c.mongodb.net/Cluster0?retryWrites=true&w=majority'
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err) => console.log(err));
//register view engine

app.set('view engine', 'ejs');
app.set('views', 'views');

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


//listen for requests
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});
//blog routes
app.get('/blogs', (req, res) => { 
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', { title: 'All Blogs', blogs: result });
    })
    .catch((err) => {
        console.log(err);
    });

});

app.post('/blogs', (req, res) => {
const blog = new Blog(req.body);

blog.save()
    .then(() => {
        res.redirect('/blogs');

    }).catch((err) => {
        console.log(err);
    });

});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
});
//404 page
app.use((req, res) => { 
    res.status(404).render('404', { title: '404' });
});
