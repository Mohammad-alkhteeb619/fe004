import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ userRole, children }) {
  const getTokenData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const isLoggedIn = () => !!getTokenData();

  const hasRole = (roles) => {
    const data = getTokenData();
    console.log(data.role);
  
    // Use a for loop instead of 'some'
    for (let i = 0; i < roles.length; i++) {
      if (data?.role == roles[i]) {
        return true;
      }
    }
  
    return false;
  };
  

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (hasRole(userRole)) {
    return children;
  }

  return <Navigate to="/unauthorized" />;
}
