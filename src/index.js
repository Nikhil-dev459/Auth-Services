const express=require('express');

const {serverConfig}=require('./config');
const apiRoutes=require('./routes/index');

const db=require('./models/index');

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));   //makes sure to read the url encoded stuff

app.use('/api',apiRoutes);

app.listen(serverConfig.PORT,async()=>{
    console.log(`Successfully started the server on PORT : ${serverConfig.PORT}`);
    if(process.env.DB_SYNC){
        db.sequelize.sync({alter:true});
    }
});