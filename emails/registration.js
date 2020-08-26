const {EMAIL_FROM, EMAIL_SUBJECT_REGISTRATION, BASE_URL} = require('../enums/db-enums');

module.exports = function (email) {
    return {
        to: email,
        from: EMAIL_FROM,
        subject: EMAIL_SUBJECT_REGISTRATION,
        html: `
        <h1>Welcome to our shop!</h1>
        <p>Account successfully created</p>
        <p>Your email: ${email}</p>
        <hr/>
        <a href="${BASE_URL}">Courses shop</a>
        `
    }
}
