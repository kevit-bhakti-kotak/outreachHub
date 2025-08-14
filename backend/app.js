const express = require('express'); 
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const workspaceRoutes = require('./routes/workspaces');
const contactRoutes = require('./routes/contacts.js');

//userroutes here
app.use('/users', userRoutes);
app.use('/workspaces', workspaceRoutes);
app.use('/contacts', contactRoutes);

const PORT = 5000;


mongoose.connect('mongodb+srv://bhaktikotak:qYtKC&ZwM^Y9dh3@bhakti.fkqpbgi.mongodb.net/outreachHub?retryWrites=true&w=majority&appName=bhakti').then(()=>{
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
})

//cors error prevention
app.use((req,res,next)=>{
    res.header('access-control-allow-origin', '*');
    res.header('access-control-allow-headers', 'oeigin, X-Requested-With, Content_Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});



