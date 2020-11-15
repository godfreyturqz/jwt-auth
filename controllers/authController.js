const UserModel = require('../models/userModel')

const handleErrors = error => {

    let errors = { email: '', password: ''}

    // duplicate error
    if(error.code === 11000){
        errors.email = 'Email already exists'
        return errors
    }

    //validation errors
    if(error.message.includes('users validation failed')){
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })

        return errors
    }
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.signup_post = async (req, res) => {

    try {
        const data = await UserModel.create(req.body)
        res.status(201).json(data)
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({message: 'user not created', errors})
    }
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.login_post = (req, res) => {
    res.send('user login')
}