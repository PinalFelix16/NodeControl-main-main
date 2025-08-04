import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      // Solo en cliente
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/auth/login"); // O la ruta real de tu login
        }
      }
    }, []);

    // Si no hay token, no renderiza nada (opcional: puedes poner un loader/spinner)
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
