// Create a new router
const bcrypt = require('bcrypt')
const express = require("express")
const router = express.Router()

router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
}) 

router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT ID, UserName, LastName, FirstName, Email FROM users" 
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.send(result)
     })                                                    
})   


router.get('/login', function (req, res, next) {
    res.render('login.ejs')                                                               
}) 

router.post('/loggedin', function (req, res, next) {
    let sqlquery = "SELECT Password FROM users WHERE UserName = ?" 
    // execute sql query
    db.query(sqlquery, [req.body.username], (error, results, fields) => {
        if (error) throw error;
      
        if (results.length > 0) {
          const password = results[0].Password.toString('utf-8');
          bcrypt.compare(req.body.password, password, (err, result) => {
            if (error) throw error;
            
            else if (result == true) {
                res.send("Logged In Sucessfully")
            }else {
                res.send("Failed to Log In")
            }
          })
        } else {
            res.send("Failed to Log In")
        }
    });
}) 


router.post('/registered', function (req, res, next) {
    // saving data in database
    const saltRounds = 10
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // saving data in database
        let sqlquery = "INSERT INTO users (UserName, LastName, FirstName, Email, Password) VALUES (?,?,?,?,?)"
        // execute sql query
        let newrecord = [req.body.user, req.body.last, req.body.first, req.body.email, hashedPassword]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email + '.'
                result += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
        })
    })
})

// Export the router object so index.js can access it
module.exports = router