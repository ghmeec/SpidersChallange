import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/auth";

interface ProtectedRouteProps {
    children: ReactNode;
}


const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    const conditions = user && profile && !loading

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/")
        } else {
            if (user && profile) {


            }
        }
    }, [user, profile, loading]);

    return <>{(conditions) ? children : null}</>;
};

export default ProtectedRoute;