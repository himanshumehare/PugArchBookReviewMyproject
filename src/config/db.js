import mongoose from 'mongoose';

export const connectDB = async (cloud.mongodb.com) => {
	try {
		await mongoose.connect(mongoUri, { autoIndex: true });
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error', err.message);
		process.exit(1);
	}
};

