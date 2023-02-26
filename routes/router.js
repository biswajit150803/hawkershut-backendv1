const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const posts=require("../models/buisnessSchema");

// for user registration

router.post("/register", async (req, res) => {

    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {

        const preuser = await userdb.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password Not Match" })
        } else {
            const finalUser = new userdb({
                fname, email, password, cpassword
            });

            // here password hasing

            const storeData = await finalUser.save();

            // console.log(storeData);
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }

});




// user Login

router.post("/login", async (req, res) => {
    // console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
       const userValid = await userdb.findOne({email:email});

        if(userValid){

            const isMatch = await bcrypt.compare(password,userValid.password);

            if(!isMatch){
                res.status(422).json({ error: "invalid details"})
            }else{

                
                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error);
        console.log("catch block");
    }
});

router.get("/login", async (req, res) => {
    const userValid = await userdb.find({});
    res.status(201).json({status:201,userValid})
})

// user valid
router.get("/validuser",authenticate,async(req,res)=>{
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
    }
});


// user logout

router.get("/logout",authenticate,async(req,res)=>{
    try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie",{path:"/"});

        req.rootUser.save();

        res.status(201).json({status:201})

    } catch (error) {
        res.status(401).json({status:401,error})
    }
})
// router.post("/businessregister", async (req, res) => {

//     const fname=req.body.Name;
//     const type=req.body.type;
//     const email=req.body.email;
//     const password=req.body.password;
//     const cpassword=req.body.cpassword;
//     // const { fname, type, email, password, cpassword } = req.body;
//     console.log(req.body);
//     if (!fname || !type || !email || !password || !cpassword) {
//         res.status(422).json({ error: "fill all the details" })
//     }
//     try {

//         const preuser = await Posts.findOne({ email: email });
//         console.log(preuser);
//         if (preuser) {
//             res.status(422).json({ error: "This Email is Already Exist" })
//         } else if (password !== cpassword) {
//             res.status(422).json({ error: "Password and Confirm Password Not Match" })
//         } else {
//             const finalUserr = new Posts({
//                 Username:fname,
//                 type:type,
//                 Email:email,
//                 Password:password
//             });

//             // here password hasing

//             const storeData = await finalUserr.save();

//              console.log(storeData);
//             res.status(201).json({ status: 201, storeData })
//         }

//     } catch (error) {
//         res.status(422).json(error);
//         console.log("catch block error");
//     }

// });
router.post("/businessregister", async (req, res) => {

    const fname=req.body.Name;
    const type=req.body.type;
    const email=req.body.email;
    const password=req.body.password;
    const cpassword=req.body.cpassword;
    // const { fname, type, email, password, cpassword } = req.body;
    console.log(req.body);
    if (!fname || !type || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" })
    }
    try {

        const preuser = await posts.findOne({ email: email });
        console.log(preuser);
        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password Not Match" })
        } else {
            const finalUserr = new posts({
                Username:fname,
                type:type,
                Email:email,
                Password:password
            });

            // here password hasing

            const storeData = await finalUserr.save();

             console.log(storeData);
            res.status(201).json({ status: 201, storeData })
        }

    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }

});
router.get("/blogin", async (req, res) => {
    const userValid = await posts.find({});
    res.status(201).json({status:201,userValid})
})


module.exports = router;