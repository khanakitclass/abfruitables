const sendOtp = async(req,res,next) => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNTSID;
        const authToken =process.env.TWILIO_AUTHTOKEN;
        const client = require(`twilio`)(accountSid,authToken);
        
        const otp = Math.floor(1000 + Math.random()*9000); 

        req.session.otp = otp


        client.messages
            .create({
                from:process.env.TWILLIO_NUMBER,
                to: process.env.NUM,
                body:otp
               
            })
            .then(message => next())
            .done();
    } catch (error) {
        
    }
}

const verifyOTP = (req,res,next) => {
    console.log("otp",req.session.otp);
    
}

module.exports = {
    sendOtp,
    verifyOTP
}