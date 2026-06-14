import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [ true, "Please enter your name" ],
        trim: true,
        minlength:[ 3, "userName must be at least 3 characters long" ],
        unique: true,
    },
    email:{
        type: String,
        required:[ true, "Please enter your email address"],
        unique: true,
        lowercase: true  ,   
        match:[/^\S+@\S+\.\S+$/, "Please fill a valid email address" ]
    },
    password:{
        type: String,   
        required: [ true, "Please enter your password" ],
        minlength: [ 6, "Password must be at least 6 characters long" ],
        select:false
    },
    profileImage:{
        type: String,
        default: null
    }
}, { timestamps: true })

// hash password before saving user
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next;
}
);

// method to compare password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;

