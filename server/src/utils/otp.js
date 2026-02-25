const crypto = require('crypto');

const generateOTP = () => {

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return {
    otp,        
    hashedOTP,  
    expiresAt   
  };
};


const verifyOTP = (inputOTP, storedHash) => {
 
  const inputHash = crypto
    .createHash('sha256')
    .update(inputOTP)
    .digest('hex');

  return inputHash === storedHash;
};

module.exports = { generateOTP, verifyOTP };