// user model decleration 
// define use case
// import any required libraries
'use strict'
const bcrypt = require('bcrypt')
// declare user model format 
module.exports = function(sequelize, DataTypes) {

// define user object 
// authentication details
const user = sequelize.define('user', {
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: {
                // sends a message to the user if they haven't plugged in the wrong email 
                msg: 'Invalid email address'
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        validate: {
            len: {
                // length
                args: [1, 99],
                msg: 'Name must be between 1 and 99 characters'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        validate :{
            len: {
                // arguments
                args: [8, 99],
                msg: 'Password is of incorrect length, double check character number'
            }
        }
    }
}, {
    // hook 
        hooks: {
            // can't use arrow functions
            // take inputed password by user
            // before new record
            beforeCreate: function(createdUser, options) {
                if (createdUser && createdUser.password) {
                    // hash password 
                    // hash new password to add to user table 
                    let hash = bcrypt.hashSync(createdUser.password, 12)
                    createdUser.password = hash
                    // user associations  
                    // industry standard for re-hashing passwords through 'rounds'
                    // destructive hash, no way to deconstruct the hash to original password
                }
            }
            // before creating instance of this record pass it a function
            //before record creation 
            // hash take inputed password
            // return new password as password for new record 
        }
        
    })
    user.associate = function(models) {
        // any user associations you want
    }

user.prototype.validPassword = function(passwordTyped) {
    // prototype - allows you to access the format/concept of an object
    // for example: concept for booleans of themselves
    // array.prototype."call method we want to use to find that object itself"
    return bcrypt.compareSync(passwordTyped, this.password)
    // 
    }

    // remove password before any serialization of user object
    user.prototype.JSON = function() {
        let userData = this.get()
        delete userData.password
        return userData
    }
    return user
}

// take inputed password and compare to hash password in user table
// remove password setup before add
// return user model 