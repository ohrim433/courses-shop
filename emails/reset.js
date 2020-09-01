const {EMAIL_FROM, EMAIL_SUBJECT_PASSWORD_RESET, BASE_URL} = require('../enums/db-enums');

module.exports = (email, token) => {
    return {
        to: email,
        from: EMAIL_FROM,
        subject: EMAIL_SUBJECT_PASSWORD_RESET,
        html: `
        <h1>Forgot your password?</h1>
        <p>If no - ignore this email.</p>
        <p>Otherwise follow by the link below:</p>
        <a href="${BASE_URL}/auth/password/${token}">Reset your password</a>
        <hr/>
        <a href="${BASE_URL}">Courses shop</a>
        `
    }
}
