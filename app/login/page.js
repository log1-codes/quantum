"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Import toast for notifications

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sign in using credentials provider
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.ok) {
            toast.success("Login successful!"); // Show success toast
            router.push("/profile");
        } else {
            toast.error("Invalid email or password"); // Show error toast
        }
    };

    const handleGoogleLogin = async () => {
        await signIn("google", { callbackUrl: "/profile" });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <h2 className="text-3xl font-bold mb-8">Login</h2>

            {/* Google Login Button */}
            <button
                onClick={handleGoogleLogin}
                className="w-full max-w-sm px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mb-4"
            >
                Login with Google
            </button>

            {/* Login Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-6 rounded shadow-md space-y-4 w-full max-w-sm"
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;