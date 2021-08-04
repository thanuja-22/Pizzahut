require('dotenv').config();
const express=require('express');
const app=express();
const ejs=require('ejs');
const path=require('path');
const expressLayout=require('express-ejs-layouts');
const PORT=process.env.PORT||3000;
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
const passport=require('passport');
const Emitter = require('events')


//database connection
const url='mongodb://localhost/pizza';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindandModify:true});
const connection=mongoose.connection;
connection.once('open',()=>{
  console.log("Database connected");
}).catch(err=>{
  console.log("Connection Failed");
});

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

app.use(session({
   secret:process.env.COOKIE_SECRET,
   resave:false,
   store:MongoDbStore.create({
     mongoUrl:'mongodb://localhost/pizza'
   }),
   saveUninitialized:false,
   cookie:{
     maxAge:1000*60*60*24
   }
}));

const passportInit=require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user=req.user;
    next();
})
app.use(expressLayout);
//session config


app.set('view engine','ejs');


require('./routes/web')(app);



const server=app.listen(PORT,function(req,res){
   console.log("Server is Listening");
});
//socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      console.log(socket.id);
      socket.on('join', (orderId) => {
        console.log(orderId);
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
