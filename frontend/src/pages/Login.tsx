import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/globals";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${api}/auth/user`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setIsLoggedIn(true);
          window.location.href = "/lists";
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    if (isLoggedIn) checkLogin();
  }, []);

  if (isLoggedIn) {
    return <Navigate to="/lists" />;
  }

  const handleGoogleLogin = () => {
    console.log(process.env.NODE_ENV);
    console.log(process.env.JWT_SECRET);
    // window.location.href = `${api}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute w-full h-1/2 -top-10 -z-10">
        <div className="absolute w-[90%] h-[64%] bg-primary rounded-md left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-[88%] h-[60%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 animate-pulse"></div>
          <div
            className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-teal-400 to-pink-400 mix-blend-overlay animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-bl from-purple-300 via-gray-400 to-red-500 mix-blend-overlay animate-pulse"
            style={{ animationDelay: "1.3s" }}
          ></div>

          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-20 animate-spin"
            style={{ animationDuration: "60s" }}
          ></div>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-white to-transparent opacity-15 animate-spin"
            style={{ animationDuration: "45s", animationDirection: "reverse" }}
          ></div>
          <div
            className="absolute inset-0 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-indigo-500 mix-blend-overlay opacity-30 animate-spin"
            style={{ animationDuration: "30s" }}
          ></div>
        </div>
      </div>
      <div className="absolute w-full h-1/2 left-0 top-[50%] -z-10 overflow-hidden">
        <div className="absolute ">
          <div className="flex flex-wrap w-full justify-center">
            {[...Array(window.innerHeight)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-primary m-1 opacity-80"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            ))}
          </div>
        </div>
      </div>
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Gathered</CardTitle>
          <CardDescription>
            <span>Sign in to access your show/film lists</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleGoogleLogin()}
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
