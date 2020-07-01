// require express
const express = require('express')
// import router 
const router = express.Router()
// import db
const db = require('../models')
// import middleware 
const flash = require('flash')
// update require below to passport config file path 
const passport = require('../config/ppConfig')


// ROUTES
// register get route 
router.get('/register', function(req, res) {
    res.render('auth/register')
})
// register post route 
router.post('/register', function(req, res) {
    db.user.findOrCreate({
        where: {
            email: req.body.email
        }, defaults: {
            name: req.body.name,
            password: req.body.password
        }
    }).then(function([user, created]) {
        // have to pass user and created as an array 
        // if user was created 
        if (created) {
            // authenticate user and start authorization process
            console.log('user is created')
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Thanks for registering!'
            })(req, res)
            // res.redirect('/')
        } else {
            console.log('User email already exists!')
            req.flash('error', 'Error: email already exists for user. Try again')
            res.redirect('/auth/register')
        }
        // else if user already exists
            // send error to user that email already exists
            // redirect back to registration get route/page
    }).catch(function(err) {
        console.log(`Error found. \nMessage: ${err.message} \nPlease review - ${err}`)
        // \n creates new line 
        req.flash('error', err.message)
        res.redirect('/auth/register')
    })
})

// login get route
router.get('/login', function(req, res) {
    res.render('auth/login');
  })
// login post route 
// add next param to pass to function
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        // takes three paramaters 
        if (!user) {
            req.flash('error', 'Invalid username or password')
            // save to our user session no username
            // redirect our user to try logging in again
            // req.session.save(function() 
                return res.redirect('/auth/login')
        }
        if (error) {
            return next(error)
            // built in function in express
        }
        // built into passport 
        req.login(user, function(error) {
            // if error move to error 
            if (error) next(error)
            // single line function - can also use { } to open up
            // if success flash success message
            req.flash('success', 'You are validated and logged in')
            // if success save session and redirect user
            req.session.save(function() {
                return res.redirect('/')
            })
        })
    })(req, res, next)
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/auth/login',
    successFlash: 'Welcome to our app!',
    failureFlash: 'Invalid username or password'
}))

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
})

// call on a router 
module.exports = router