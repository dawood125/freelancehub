
const crypto = require('crypto');

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  return {
    resetToken,   
    hashedToken,  
    expiresAt     
  };
};


const hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

module.exports = { generateResetToken, hashToken };