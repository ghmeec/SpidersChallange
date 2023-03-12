import '../global.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from "../contexts/auth";
import ProtectedRoute from "../components/protected";
import { useRouter } from "next/router";
import NextNprogress from "nextjs-progressbar";

const protectedRoute = [
  "/app",
  "/app/rooms/[roomId]"
];

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  return (
    <>
      <NextNprogress
        color="#3482F6"
        startPosition={0.3}
        stopDelayMs={200}
        height={1}
        showOnShallow={true}
      />
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
