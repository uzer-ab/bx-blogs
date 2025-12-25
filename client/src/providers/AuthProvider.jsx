import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { validateSession } from "@/store/slices/authSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateSession());
  }, [dispatch]);

  return children;
};

export default AuthProvider;
