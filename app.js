const express = require("express");
const path = require("path");
const mongoose = require('mongoose');

const app = express();
const port = 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/contactDance', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define mongoose schema
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    concern: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
 // For parsing application/x-www-form-urlencoded
app.use('/static', express.static('static')); // For serving static files

// Pug setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.status(200).render('home.pug');
});

app.get('/contact', (req, res) => {
    res.status(200).render('contact.pug');
});

app.post('/contact', (req, res) => {
    console.log("POST /contact route hit"); // For debugging
    const myData = new Contact(req.body);
    myData.save()
        .then(() => {
            res.send("This item has been saved to the database");
        })
        .catch(err => {
            console.error("Error saving to database:", err); // Log any errors that occur during save
            res.status(400).send("Item was not saved to the database");
        });
});

// Start the server
app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
