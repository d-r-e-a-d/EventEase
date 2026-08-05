const express =require('express');
const dotenv = require('dotenv');
const cors =require('cors');
const mongoose =require('mongoose');
const authRoutes =require('./routes/auth.js');
const eventRoutes =require('./routes/events.js');
const bookingRoutes =require('./routes/booking.js');
dotenv.config();



const app = express();
const corsOptions = {
    origin: 'https://eventease-frontend-a8mp.onrender.com',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
//routes
app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/bookings',bookingRoutes);
mongoose.connect(process.env.MONGODB_URI).then(() =>{
    console.log('Connected to MongoDB');
}).catch((err) =>{
    console.error('Error connecting to MongoDB',err);
});




const port= process.env.PORT ||5000;
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});
