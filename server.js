const express=require('express');
const app=express();
const ejs=require('ejs');
const path=require('path');
const PORT=process.env.PORT||3000;
app.set('view engine','ejs');
app.get("/",function(req,res){
  res.render('home');
})


app.listen(PORT,function(req,res){
   console.log("Server is Listening");
});
