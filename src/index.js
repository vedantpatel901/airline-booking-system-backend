const { Serverconfig, Logger } = require('./config');

const express = require('express');
const apiRoutes = require('./routes');
const app = express();

app.use(express.json()); // it is used in postman to send the Data in json format and it is used to parse the data in json format 
app.use(express.urlencoded({extended: true})); // it is used to parse the data in urlencoded format and it is used in postman to send the data in urlencoded format
app.use('/api' , apiRoutes);


app.listen(Serverconfig.PORT,  () => {
    console.log(`Server is running on port ${Serverconfig.PORT}`);
    Logger.info('server is running fine');

}); 