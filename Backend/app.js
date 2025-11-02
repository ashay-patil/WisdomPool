const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const notFound = require('./middlewares/not-found');
const dbConnect = require('./db/connect');
const experienceProtected = require('./routes/experience-protected');
const experiencePublic = require('./routes/experience-public');
const user = require('./routes/user');
const ai = require('./routes/aiService');
const careerMentor = require('./routes/career-mentor');
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', user);
app.use('/api/v1/protected',experienceProtected);
app.use('/api/v1/public',experiencePublic);
app.use('/api/v1/ask-AI',ai);
app.use('/api/v1/ai-career-mentor',careerMentor);



app.get('/',(req,res)=>{
    res.status(200).send('Hello World');
})


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not set in environment variables');
    }
    await dbConnect(process.env.MONGO_URI);
    console.log('DB connected');
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();