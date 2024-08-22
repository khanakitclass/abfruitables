const express = require("express");
const { usersControler } = require("../../../controler");
const passport = require("passport");
const upload = require("../../../middleware/upload");
const { genAccRefToken } = require("../../../controler/user.controler");
const { Redirect } = require("twilio/lib/twiml/VoiceResponse");

const app = express();
const router = express.Router();


router.post("/register",
    // upload.single("avtar"),
    usersControler.register
)

router.post("/login",
    usersControler.login
)

router.post("/generateNewToken",
    usersControler.generateNewToken
)

router.post("/logout",
    usersControler.logout
)


router.get("/list-user",
    usersControler.listuser
);

router.post("/add-user",
    usersControler.adduser
);

router.put("/update-user/:user_id",
    usersControler.updateuser
);

router.delete("/delete-user/:user_id",
    usersControler.deleteuser
);

router.get('/googleLogin',
    passport.authenticate('google',
        { scope: ['profile', 'email'] }
    ));

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        async function (req, res) {
            console.log("Successful authentication, redirect home.");
            console.log(req.isAuthenticated());
            console.log(req.session);
            console.log("vxbcvnbmn");
    
            if (req.isAuthenticated()) {
                try {
                    const { accessToken, refreshToken } = await genAccRefToken(req.session.passport.user._id);
    
                    const optionsAcc = {
                        httpOnly: true,
                        secure: true,
                        sameSite:"None",
                        maxAge: 60 * 60 * 1000,
                    };
    
                    const optionsRff = {
                        httpOnly: true,
                        secure: true,
                        sameSite:"None",
                        maxAge: 3 * 24 * 60 * 60 * 1000, 
                    };
    
                    res.cookie("accessToken", accessToken, optionsAcc)
                       .cookie("refreshToken", refreshToken, optionsRff);
    
                    return res.redirect("https://fruitable-frontend-five.vercel.app");
    
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        success: false,
                        message: "Error generating access and refresh tokens",
                        error: error.message
                    });
                }
            }
        }
    );
    

router.get('/authChecked',
    usersControler.authChecked
)


module.exports = router;