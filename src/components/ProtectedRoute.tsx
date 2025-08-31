import {type ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface Props {
 children: ReactNode;
}

export default function ProtectedRoute({children}: Props) {
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
   navigate("/auth");
  }
  setLoading(false);
 }, [navigate]);

 if (loading) return <div className="text-center mt-10">Loading...</div>;
 return <>{children}</>;
}
