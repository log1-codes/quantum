"use client"
import { useState } from 'react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <></>
    );
};

export default ThemeToggle;