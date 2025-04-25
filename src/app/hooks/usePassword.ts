"use client";

import { useState } from "react";

export const usePassword = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

    return {
        showPassword,
        togglePasswordVisibility,
    };
}
