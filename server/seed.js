require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User');

const adminEmail = 'eventease.admin@example.com';

const events = [
    {
        title: 'Indie Music Night',
        description: 'An evening of live indie performances from local artists.',
        date: new Date('2026-09-12T18:30:00.000Z'),
        location: 'Mumbai Arts Centre',
        category: 'Music',
        totalSeats: 150,
        availableSeats: 150,
        ticketPrice: 499,
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a'
    },
    {
        title: 'Startup Summit 2026',
        description: 'Meet founders, investors, and builders from across India.',
        date: new Date('2026-10-03T09:00:00.000Z'),
        location: 'Bengaluru Convention Hall',
        category: 'Business',
        totalSeats: 300,
        availableSeats: 300,
        ticketPrice: 999,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
    },
    {
        title: 'Design Workshop',
        description: 'A hands-on workshop on practical interface and product design.',
        date: new Date('2026-10-18T11:00:00.000Z'),
        location: 'Delhi Creative Studio',
        category: 'Workshop',
        totalSeats: 40,
        availableSeats: 40,
        ticketPrice: 799,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978'
    }
];

async function seed() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured');
    }

    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });

    const password = await bcrypt.hash('Admin@123', 10);
    const admin = await User.findOneAndUpdate(
        { email: adminEmail },
        {
            name: 'EventEase Admin',
            email: adminEmail,
            password,
            role: 'admin',
            isVerified: true
        },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    await Event.deleteMany({ createdBy: admin._id });
    await Event.insertMany(events.map((event) => ({ ...event, createdBy: admin._id })));

    console.log(`Seeded ${events.length} events.`);
    console.log(`Admin login: ${adminEmail} / Admin@123`);
}

seed()
    .catch((error) => {
        console.error('Seeding failed:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.connection.close();
    });
