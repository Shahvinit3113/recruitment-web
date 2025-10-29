// pages/Login.tsx
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/Redux/Slices/authSlice";
import BaseButton from "@/baseComponent/BaseButton";
import type { RootState, AppDispatch } from "@/Redux/Store";
import BaseInput from "@/baseComponent/BaseInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const componentSize = useSelector(
    (state: RootState) => state.settings.componentSize
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const response = await dispatch(
          loginUser({
            Email: email,
            Password: password,
          })
        ).unwrap();

        if (response.Status === 200) {
          navigate("/");
        }
      } catch (err: any) {
        console.error("Login failed:", err);
      }
    },
    [dispatch, email, password, navigate]
  );

  return (
    <form
      className="max-w-md mx-auto mt-10 p-6 border rounded shadow"
      onSubmit={handleSubmit}
    >
      <h1 className="text-xl font-bold mb-4">Login</h1>

      <BaseInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        size={componentSize}
        variant={error ? "error" : "default"}
        className="mb-3"
      />

      <BaseInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        size={componentSize}
        variant={error ? "error" : "default"}
        showPasswordToggle
        className="mb-3"
      />

      <BaseButton
        type="submit"
        size={componentSize}
        className={`bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={loading}
        loading={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </BaseButton>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default Login;
