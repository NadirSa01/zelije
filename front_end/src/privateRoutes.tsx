import { Navigate } from "react-router-dom";
import { useMeQuery } from "./services/auth/authApi";
import type { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { data: admin, isLoading, isSuccess } = useMeQuery();
  
if (isLoading) return (
  <div className="w-full h-screen gap-x-2 flex justify-center items-center">
    <div
      className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"
    ></div>
    <div
      className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"
    ></div>
    <div
      className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"
    ></div>
  </div>
)
  if (!isSuccess || !admin) {
    return <Navigate to="/admin" replace />; // redirect to login
  }

  return children;
}
