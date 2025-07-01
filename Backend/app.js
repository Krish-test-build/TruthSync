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


connectDB()
app.use(cors({
    origin:true,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.use('/uploads', express.static('uploads'));
app.use(userRoutes);    
app.use(publicRoutes);
app.use('/claim',claimRoutes);
app.use('/admin',adminRoutes);
app.use(voteRoutes)
app.use('/notifications',notificationRoutes)

module.exports=app
