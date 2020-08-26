const {Router} = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const {SENDGRID_API_KEY} = require('../enums/db-enums');
const registrationEmail = require('../emails/registration');

const router = Router();
const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: SENDGRID_API_KEY}
}));

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError'),
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save((err) => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/');
                    }
                })
            } else {
                req.flash('loginError', 'User does not exists');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'User does not exists');
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
});

router.post('/register', async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body;
        const candidate = await User.findOne({email});

        if (candidate) {
            req.flash('registerError', 'This email is already used');
            res.redirect('/auth/login#register');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                name,
                password: hashedPassword,
                cart: {items: []}
            });

            await user.save();
            res.redirect('/auth/login#login');
            await transporter.sendMail(registrationEmail(email));
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    })
});

module.exports = router;
