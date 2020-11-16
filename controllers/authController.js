const UserModel = require('../models/userModel')
const jwt = require('jsonwebtoken')

//------------------------------------
// ERROR HANDLER
//------------------------------------

const handleErrors = error => {
    console.log(error.message)
    let errors = { email: '', password: '' }

    // duplicate error
    if(error.code === 11000){
        errors.email = 'Email already exists'
    }

    // validation errors
    if(error.message.includes('users validation failed')){
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    // login errors
    if(error.message == 'incorrect email'){
        errors.email = 'Email is not registered'
    }
    if(error.message == 'incorrect password'){
        errors.password = 'Password is incorrect'
    }

    return errors
}

//------------------------------------
// CREATE TOKENS
//------------------------------------

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT , {
        expiresIn: 3 * 24 * 60 * 60
    })
}

// #######################################################################
// AUTH CONTROLLER
// #######################################################################

//------------------------------------
// RENDERS
//------------------------------------

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

//------------------------------------
// SIGNUP
//------------------------------------

module.exports.signup_post = async (req, res) => {

    try {
        const data = await UserModel.create(req.body)
        const token = createToken(data._id)
        res.cookie('jwt', token, { secure: true, httpOnly: true, maxAge: 259200000})
        res.status(201).json({data: data._id})

    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({message: 'user not created', errors})
    }

}

//------------------------------------
// LOGIN
//------------------------------------

module.exports.login_post = async (req, res) => {

    try {
        const user = await UserModel.login(req.body)
        const token = createToken(user._id)
        res.cookie('jwt', token, { secure: true, httpOnly: true, maxAge: 259200000})
        res.status(200).json({user: user._id})

    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({message: 'login error', errors})
    }

}


// #######################################################################
// DEV FUNCTIONS
// #######################################################################

module.exports.deleteMany = (req, res) => {
    UserModel.deleteMany({}).then((res)=> res.json('success'))
    .catch(err => res.json(err))
}