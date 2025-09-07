import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
	try {
		const header = req.headers.authorization || '';
		console.log('Auth header:', header);
		const token = header.startsWith('Bearer ') ? header.slice(7) : null;
		console.log('Extracted token:', token ? 'Present' : 'Missing');
		
		if (!token) return res.status(401).json({ message: 'Missing token' });

		const payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
		console.log('Token payload:', payload);
		req.user = { id: payload.id, name: payload.name, email: payload.email };
		next();
	} catch (error) {
		console.log('Token verification error:', error.message);
		return res.status(401).json({ message: 'Invalid token' });
	}
};

