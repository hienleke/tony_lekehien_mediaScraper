const express = require('express');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const sequelize = require('./config/database');
const errorMiddleware = require('./middlewares/errorMiddleware');
const scrapeRoute = require('./routes/scrapeRoute');
const urlRoute = require('./routes/urlRoute')
const authenRoute =require('./routes/authenRoute')

const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Replace with the actual URL of your frontend
  }));
app.use(express.json())

app.use(loggerMiddleware);

app.use('/api', scrapeRoute);
app.use('/api', urlRoute);
app.use('/api', authenRoute);

app.use(errorMiddleware);

const PORT = 3001;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server is running on port ${PORT}`);
    }
    catch (err)
    {
        console.error('Unable to connect to the database:', err);
    }
   
});
