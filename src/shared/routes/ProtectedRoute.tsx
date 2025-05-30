'use client';

import {useAuth} from "@/features/auth/context/AuthProvider";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const {user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user]);
    if (!user) return null;
    return <>{children}</>;
}