const express = require('express');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const sequelize = require('./config/database');
const errorMiddleware = require('./middlewares/errorMiddleware');
const scrapeRoute = require('./routes/scrapeRoute');
const urlRoute = require('./routes/urlRoute')
const authenRoute =require('./routes/authenRoute')
const {getBrowserInstance} = require('./service/ChormeService')
const cors = require('cors');

const app = express();
app.use(cors({
    origin: ['http://localhost:3000',
        'https://lekehien-mediascraper.onrender.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
        credentials: true // Allow cookies and credentials to be sent
}));
app.options('*', cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);
app.use('/api', authenRoute);
app.use('/api', scrapeRoute);
app.use('/api', urlRoute);


app.use(errorMiddleware);

const PORT = 3001;
app.listen(PORT, async () => {
    try {
        getBrowserInstance();
        await sequelize.authenticate();
        console.log(`Server is running on port ${PORT}`);
    }
    catch (err)
    {
        console.error('Unable to connect to the database:', err);
    }
   
});
