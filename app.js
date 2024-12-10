const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const userRouter=require("./routes/user");
const cookieParser=require("cookie-parser");
const check=require("./middleware/auth");
const blogRouter=require("./routes/blog");
const BLOG=require("./models/blog");

const app=express();

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(check("token"));
app.use(express.static(path.resolve("./public")));


mongoose.connect("mongodb://localhost:27017/blogify").then(()=>{
    console.log("MongoDB is connected!!");
})

app.get("/",async(req,res)=>{
    const allBlogs=await BLOG.find({});
    return res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
});
app.use("/users",userRouter);
app.use("/blog",blogRouter);

app.listen(3000,()=>{
    console.log("Server started!!");
});