import '../global.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from "../contexts/auth";
import ProtectedRoute from "../components/protected";
import { useRouter } from "next/router";

const protectedRoute = [
  "/app",
  "/app/rooms/[roomId]"
];

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  return (
    <>
      <AuthProvider>
        {protectedRoute.includes(router.pathname) ? (
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthProvider>
    </>
  )
}
