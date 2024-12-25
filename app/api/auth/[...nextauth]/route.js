import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/mongoose";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      await connectDB();
      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: profile.email });
  
        if (existingUser) {
          await User.findOneAndUpdate(
            { email: profile.email },
            {
              $set: {
                name: profile.name,
                image: profile.picture,
              },
            }
          );
        } else {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
          });
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
    verifyRequest: '/verify',
    newUser: '/profile',
  },
  events: {
    async signIn({ user, account }) {
      await connectDB();
      if (account.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          });
        }
      }
      await User.findOneAndUpdate(
        { email: user.email },
        { lastLogin: new Date() }
      );
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
