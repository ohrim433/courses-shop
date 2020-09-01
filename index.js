const express = require('express');
const path = require('path');
const csrf = require('csurf');
const _handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongodb-session')(session);
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');

const { SESSION_SECRET } = require('./config');
const { MONGODB_URI } = require('./enums/db-enums');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const app = express();
const PORT = process.env.PORT || 3000;

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars),
    helpers: require('./utils/hbs-helpers')
});

const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const coursesRoute = require('./routes/courses');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});

app.engine('hbs', hbs.engine); // handlebars registering
app.set('view engine', 'hbs'); // start to use handlebars
app.set('views', 'views'); // directory with hbs templates

app.use(express.static(path.join(__dirname, 'public'))); // set "public" as static directory to use files from it
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoute);
app.use('/add', addRoute);
app.use('/courses', coursesRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoute);
app.use('/auth', authRoute);

async function startMongo() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        app.listen(PORT, err => {
            if (err) throw err;
            console.log(`server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }

}

startMongo();
