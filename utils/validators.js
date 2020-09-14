const {body, validationResult} = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Please enter correct email')
        .custom(async (value, {req}) => {
            try {
                const candidate = await User.findOne({email: value});

                if (candidate) {
                    return Promise.reject('User is already exists');
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),

    body('password', 'Password should be 6 symbols at least')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),

    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must be the same');
            }

            return true;
        })
        .trim(),

    body('name')
        .isLength({min: 3})
        .withMessage('Name should be 3 symbols at least')
        .trim()
];

exports.loginValidators = [
    body('email', 'Please enter correct email')
        .isEmail()
        .normalizeEmail(),

    body('password')
        .isAlphanumeric()
        .trim()
];

exports.courseValidators = [
    body('title', 'Course title should be 3 characters at least').isLength({min: 3}),
    body('price', 'Please enter correct price').isNumeric(),
    body('img', 'Please enter correct image URL').isURL()
];
