module.exports ={
    PORT: process.env.PORT || 3000,

    ROOT_EMAIL: process.env.ROOT_EMAIL || 'email@gmail.com',
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',

    BASE_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

    MONGODB_URI: process.env.MONGODB_URI || '',

    SESSION_SECRET: process.env.SESSION_SECRET || 'some value'
}
