const express=require('express'),
      app=express();
const cors=require('cors');
app.use(cors());
const path=require('path');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.all('*',(req,res,next)=>{
    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Methods','GET');
    res.set('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
    if ('OPTIONS'==req.method)return res.send(200);
    next();
});

app.use("/",express.static(path.join(__dirname,'../dist')));

app.listen(8399,()=>{
    console.log('Port :8399 is opened');
});