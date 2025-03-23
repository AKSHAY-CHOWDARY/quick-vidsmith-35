
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center glass-panel p-12 max-w-md">
          <h1 className="text-6xl font-bold mb-6 text-vidsmith-accent">404</h1>
          <p className="text-xl text-gray-300 mb-8">Oops! Page not found</p>
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
