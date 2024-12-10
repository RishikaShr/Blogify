const mongoose=require("mongoose");//this inbuilt module is used to hash, in this problem it is used to hash the password
const {createHmac,randomBytes}=require("crypto");
const {createToken}=require("../services/auth");

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    salt:{
        type:String,
    },
    profileImage:{
        type:String,
        default:"/images/image.png",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],//entering other value than these will give you an error.
        default:"USER",
    }
},{
    timestamps:true
});

userSchema.pre("save",function(next){//pre middleware is used so that before saving the user execute this callback
    const user=this;//this represents current user
    if(!user.isModified("password")) return;//isModified used to check if the password path in user, modified or not.

    const salt=randomBytes(16).toString();//salt will be assigned to the random 16 bytes string.
    const newPassword=createHmac("sha256",salt).update(user.password).digest("hex");//"sha256" is an algorithm and by using salt, we are hashing password of current user and getting the hashed password in hex form.

    this.salt=salt;
    this.password=newPassword;
    next();
});

userSchema.static("matchPassword",async function(email,password){//virtual function creation
    //matchPassword is the function name and the body of that function is second parameter.
    const user=await this.findOne({"email":email});
    if(!user) throw new Error("User not found!!");
    const salt=user.salt;
    const userpassword=user.password;
    // console.log(userpassword);
    const userHashedPassword=createHmac("sha256",salt).update(password).digest("hex");//hashing the given password by the user during signin to check with the stored password during signup.
    // console.log(userHashedPassword);

    if(userHashedPassword!=userpassword) throw new Error("Incorrect Password");

    const token=createToken(user);
    console.log("token " + token);
    
    return token;
});



const USER=mongoose.model("user",userSchema);
module.exports=USER;