const jwt = require("jsonwebtoken");

const generateToken = (id, name, email, shippingAddress) => {
  return jwt.sign(
    { id, name, email, shippingAddress },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateToken;
