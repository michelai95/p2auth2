// write a function to use as middleware 
module.exports = function(req, res, next) {
    // if we don't we will let user know they don't have access
    if (!req.user) {
        req.flash('error', 'You must be logged in to view this page')
        res.redirect('/auth/login')
    } else {
        // if we do we will allow our app to carry on
        next()
    }
} 
// check and see if we have a user variable set
// redirect user to auth/login

