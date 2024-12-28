import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
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
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/signup',  // Changed this to redirect to signup by default
    error: '/signup',
  },
  callbacks: {
    async signIn({ account, profile }) {
      await connectDB();
      
      // Check if user exists
      const existingUser = await User.findOne({ email: profile.email });
      
      if (existingUser) {
        // Update existing user's provider if not already added
        if (!existingUser.providers.includes(account.provider)) {
          await User.findOneAndUpdate(
            { email: profile.email },
            { 
              $push: { providers: account.provider },
              $set: { lastLogin: new Date() }
            }
          );
        }
        return true;
      }

      // Create new user
      await User.create({
        email: profile.email,
        name: profile.name,
        image: account.provider === "google" ? profile.picture : profile.avatar_url,
        username: profile.email.split('@')[0],
        providers: [account.provider],
        platforms: {
          leetcode: "",
          codechef: "",
          codeforces: "",
          geeksforgeeks: "",
          hackerrank: ""
        },
        lastLogin: new Date(),
        createdAt: new Date()
      });
      
      return true;
    },
    async session({ session, user }) {
      // Add user data to session
      const userData = await User.findOne({ email: user.email });
      if (userData) {
        session.user = {
          ...session.user,
          username: userData.username,
          platforms: userData.platforms,
          providers: userData.providers
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after auth
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };