const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const app=express();
const userRoutes=require('./routes/User.routes');
const claimRoutes=require('./routes/Claim.routes');
const adminRoutes=require('./routes/Admin.routes');
const publicRoutes=require('./routes/Public.routes');
const voteRoutes=require('./routes/Vote.routes');
const notificationRoutes=require('./routes/Notification.routes')
const cookieParser=require('cookie-parser');
const cors=require('cors');
const connectDB=require('./db/MyDb')
const authRoutes=require('./routes/auth.routes');
const path = require('path');



connectDB()
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(userRoutes);    
app.use(publicRoutes);
app.use('/claim',claimRoutes);
app.use('/admin',adminRoutes);
app.use(voteRoutes)
app.use('/notifications',notificationRoutes)
app.use('/', authRoutes);

module.exports=app
