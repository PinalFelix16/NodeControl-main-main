import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

    useEffect(() => {
      if (!userId) {
        Router.replace("/auth/login"); // Redirige al login si no está autenticado
      }
    }, [userId]);

    return userId ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
