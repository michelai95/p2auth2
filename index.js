// required NPM libraries
// configure dotenv
require('dotenv').config()
// require express and setup express app instance 
const Express = require('express')
// require and set view engine using ejs
const ejsLayouts = require('express-ejs-layouts')
// require all middleware for app/authentication 
// helmet, morgan, passport, and custom middleware for people being logged in long term
const helmet = require('helmet')
// express sessions/sequelize sessions 
const session = require('express-session')
const flash = require('flash')
const passport = require('./config/ppConfig')
const db = require('./models')
const isLoggedIn = require('./middleware/isLoggedIn')

// want to add link to custom middleware 
// check to see if the user has logged in or not 
// use session library to allow us to store session data 
const SequelizeStore = require('connect-session-sequelize')(session.Store)

// app setup
const app = Express()
// set app to use false URL encoding 
app.use(Express.urlencoded({ extended: false}))
// set app public directory for use 
app.use(Express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
// set app ejs layouts for render 
app.use(ejsLayouts)
app.use(require('morgan')('dev'))
app.use(helmet())


// create new instance of class Sequelize Store 
const sessionStore = new SequelizeStore({
    db: db.sequelize,
    expiration: 1000 * 60 * 30
    // make it per minute * 30 is for 30 minutes 
})

// declare attributes our session is going to have 
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}))

sessionStore.sync()
// has to be invoked to run the above function 

// initialize and link flash messages, passport, and session
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function(req, res, next) {
    // next takes us to the next related route 
    res.locals.alert = req.flash()
    res.locals.currentUser = req.user
    
    // runs this function every time the route is hit 
    // since it's middleware it'll stop before running again
    // next prompts it to move onto the next task/function
    next()
    // sends it to the next route - hook up flash and hook up our user 
})

// ROUTES

app.get('/', function(req, res) {
    // check to see if user has logged in
    // renders the index page 
    res.render('index')
})

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {test: "another test"})
})

// include auth controller
app.use('/auth', require('./controllers/auth'))

// initialize app on port
app.listen(process.env.PORT || 3000, () => {
    console.log(`port ${process.env.PORT}`)
})