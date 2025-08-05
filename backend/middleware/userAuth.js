const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(404).json({message: 'No token provided'});
    }
    const token =authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30');
        req.user = decoded;
        next();
    }catch (error){
        res.status(401).json({message: 'Invalid or expired token'});
    }
};

module.exports = verifyToken;