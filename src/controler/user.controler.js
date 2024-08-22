const Review = require("../model/review.model");
const Users = require("../model/users.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { options } = require("../routes/api/v1/categories.route");
const path = require('path');
const fs = require('fs');
const { sendWelcomeEmail } = require("../utils/nodeemailer");
const { log } = require("console");





const genAccRefToken = async (id) => {
    console.log(id);
    
    try {
        const user = await Users.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            
                expiresIn: 60 * 60
            },
            process.env.ACCESSTOKEN,
            { expiresIn: 60 * 60 * 100 }
        );

        const refreshToken = jwt.sign(
            {
                _id: user._id,
            },
            process.env.REFRESHTOKEN,
            { expiresIn: 3 * 24 * 60 * 60 * 1000 }
        );

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log('Error in genAccRefToken:', error);
        return { accessToken: null, refreshToken: null };
    }
}


const listuser = async (req, res) => {
    try {
        const user = await Users.find();
        if (!user || user.length === 0) {
            res.status(404).json({
                message: "No user found",
                success: false,
            })
        }

       return res.status(200).json({
            message: "user fetched successfully",
            success: true,
            data: user,
        })


    } catch (error) {
        res.status(500).json({
            message: "Error occurred while fetching users" + error.message,
            success: false
        })
    }
}

const getuser = async (req, res) => {
    try {
        const user = await Users.findById(req.params.user_id);
        if (!user) {
           return res.status(404).json({
                message: "user not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "user fetched successfully",
            success: true,
            data: user,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while fetching user" + error.message,
            success: false
        })
    }
}


const adduser = async (req, res) => {
    try {
        console.log(req.body);
        const user = await Users.create(req.body);

        if (!user) {
            return res.status(400).json({
                message: "Name and description are required",
                success: false,
            });
        }

        return res.status(201).json({
            message: "user added successfully",
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while adding user: " + error.message,
            success: false,
        });
    }
};

const updateuser = async (req, res) => {
    try {
        console.log(req.body);
        const user_id = (req.params.user_id)
        const user = await Users.findByIdAndUpdate(user_id, req.body, { new: true, runValidators: true });
        console.log(user);

        if (!user) {
            return res.status(400).json({
                message: "user not update",
                success: false,
            });
        };

        res.status(200).json({
            message: "user updated successfully",
            success: true,
            data: user,
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while updating user: " + error.message,
            success: false,
        });
    };
};


const deleteuser = async (req, res) => {
    try {

        const user = await Users.findByIdAndDelete(req.params.user_id);

        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "user deleted successfully",
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while deleting user: " + error.message,
            success: false,
        });
    }
};

const register = async (req, res) => {
   

    
    try {
        const { email, password } = req.body;
        console.log(req.body,"sdd");

        const user = await Users.findOne({
            $or: [{ email }]
        })

        if (user) {
            return res.status(409).json({
                message: "user already exists",
                success: false
            })
        }

        const hashPass = await bcrypt.hash(password, 10);
        console.log(hashPass,"dgdfg");

        if (!hashPass) {
            return res.status(500).json({
                message: "Error occurred while hashing password",
                success: false
            })
        }

        const userData = await Users.create({ ...req.body, password: hashPass });
        // const userData = await Users.create({ ...req.body, password: hashPass,avtar:req.file.path });
        console.log(userData,"dfdf");

        if (!userData) {
            return res.status(500).json({
                message: "Error occurred while creating user",
                success: false
            })
        }

        const userDataF = await Users.findById(userData._id).select("-password");
        console.log(userDataF,"ssdfsdf");


        try {
            await sendWelcomeEmail(email, "Welcome to Our Service", "Thank you for registering!");
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
        }

       return res.status(201).json({
           message: "User created successfully",
            success: true,
            data: userDataF
        })


    } catch (error) {
        console.log(error);
        
       return res.status(500).json({
            message: "Error occurred while creating user",
            success: false
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }

        const validateUser = await bcrypt.compare(password, user.password);

        if (!validateUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const { accessToken, refreshToken } = await genAccRefToken(user._id);

        const optionsAcc = {
            httpOnly: true,
            secure: true,
            sameSite:"None",
            maxAge:  60 * 60 * 1000,
        }

        const optionsRff = {
            httpOnly: true,
            secure: true,
            sameSite:"None",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        }


        const userDataF = await Users.findById(user._id).select("-password -refreshToken");
        console.log(userDataF);

       return res.status(200)
            .cookie("accessToken", accessToken, optionsAcc)
            .cookie("refreshToken", refreshToken, optionsRff)
            .json({
                success: true,
                message: "User logged in successfully",
                data: { ...userDataF.toObject(), accessToken }
            })

    } catch (error) {
        console.log(error);
       return res.status(500).json({
            success: false,
            message: "Error occurred during login: " + error.message
        });
    }
};


const generateNewToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        console.log(refreshToken);

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"
            });
        }

        const decoded = await jwt.verify(refreshToken,  process.env.REFRESHTOKEN);


        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        const user = await Users.findById(decoded._id);
        console.log(user.refreshToken);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (refreshToken != user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        const data = await genAccRefToken(user._id);
        console.log(data);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite:"None",
        };

        res.status(200)
            .cookie("accessToken", data.accessToken, options)
            .cookie("refreshToken", data.refreshToken, options)
            .json({
                success: true,
                message: "Tokens generated successfully",
                data: { ...user.toObject(), accessToken: data.accessToken }
            });

    } catch (error) {
        console.log('Error in generateNewToken:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while generating new token: " + error.message
        });
    }
};


const logout = async (req, res) => {
    try {
        const user = await Users.findByIdAndUpdate(req.body._id,
            {
                $unset: {
                    refreshToken: 1
                },
            },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite:"None",
        };

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "User logged out successfully"
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while logging out: " + error.message
        })
    }
};



const authChecked = async (req, res) => {
    console.log(res.body,"sdsd");
    
try {
    const accessToken = req.cookies.accessToken;

    if(!accessToken){
        return res.status(401).json({
            success: false,
            message: "Access token is missing"
        });
    }

    const verifyToken = await jwt.verify( accessToken,process.env.ACCESSTOKEN);
    
    const user = await Users.findById(verifyToken._id);


    if(!user){
        return res.status(401).json({
            success: false,
            message: "User not found",
          
            });
    }

    return res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: user
    })
    

    
    
    
} catch (error) {
    return res.status(500).json({
        success: false,
        message: "Error occurred while authenticate: " + error.message
    })
}
};

    // const forgotPassword = async (req, res) => {
    //     try {
    //         const { email } = req.body;
    //         const user = await Users.findOne({ email });
    //         if (!user) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "User not found"
    //             });
    //         }
    //         const token = await generateToken(user._id);
    //         const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    //         const mailOptions = {
    //             from: process.env.NODEMAILER_USER,
    //             to: user.email,
    //             subject: "Reset Password",
    //             text: `Please click on the link to reset your password: ${link}`,
    //         };
    //         await sendMail(mailOptions);
    //         res.status(200).json({
    //             success: true,
    //             message: "Email sent successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: "Error occurred while sending email: " + error.message
    //         })
    //     }
    // }








    module.exports = {
        listuser,
        getuser,
        adduser,
        updateuser,
        deleteuser,
        register,
        login,
        generateNewToken,
        logout,
        authChecked,
        genAccRefToken
        // forgotPassword

    }