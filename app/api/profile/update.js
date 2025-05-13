import connectDB from '../../../lib/mongoose'; 
import User from '../../../models/User';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === 'POST') {
    try {
      await connectDB();

      const { username, platforms, socials } = req.body;

      if (!req.files || !req.files.image) {
        return res.status(400).json({ error: "Image file is required." });
      }

      const imageFile = req.files.image;
      const imagePath = `/uploads/${Date.now()}-${imageFile.name}`;

      const fs = require('fs');
      const path = require('path');
      const uploadPath = path.join(process.cwd(), 'public/uploads', imagePath);

      fs.writeFileSync(uploadPath, imageFile.data);

      const parsedPlatforms = JSON.parse(platforms);
      const parsedSocials = JSON.parse(socials);

      const user = await User.findByIdAndUpdate(
        session.user.id,
        { 
          username, 
          image: imagePath, 
          platforms: parsedPlatforms, 
          socials: parsedSocials 
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}