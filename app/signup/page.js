"use client"; // Ensure this is a client component
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast'; // Assuming you are using react-hot-toast for notifications
import { motion } from 'framer-motion';

const Signup = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        leetcode: '',
        codechef: '',
        codeforces: '',
        geekforgeeks: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form data
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        // Send signup request to your backend
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                name: formData.name,
                username: formData.username,
                password: formData.password,
                platforms: {
                    leetcode: formData.leetcode,
                    codechef: formData.codechef,
                    codeforces: formData.codeforces,
                    geeksforgeeks: formData.geekforgeeks,
                }
            }),
        });

        const data = await response.json();
        if (data.success) {
            toast.success("Signup successful!");
            // Optionally sign in the user
            await signIn('credentials', { email: formData.email, password: formData.password });
            router.push('/profile'); // Redirect to profile after signup
        } else {
            toast.error(data.message || "Signup failed!");
        }
        setIsLoading(false);
    };

    const handleGoogleSignup = async () => {
        await signIn("google", { callbackUrl: "/profile" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-300 bg-clip-text text-transparent">
                            Join CodeCracker
                        </h1>
                        <p className="mt-2 text-zinc-400">
                            Connect your competitive programming profiles
                        </p>
                    </div>

                    {/* Google Signup Button */}
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full max-w-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mb-4"
                    >
                        Sign up with Google
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="text" name="leetcode" placeholder="LeetCode Username (optional)" onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="text" name="codechef" placeholder="CodeChef Username (optional)" onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="text" name="codeforces" placeholder="Codeforces Username (optional)" onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <input type="text" name="geekforgeeks" placeholder="Geeks for Geeks Username (optional)" onChange={handleChange} className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-3 font-medium transition-colors" disabled={isLoading}>
                            {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;