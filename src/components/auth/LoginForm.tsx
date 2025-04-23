import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Card className="w-[500px] mx-auto mt-30 bg-white shadow-md rounded-lg p-4">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-[#9f94eb]">Login</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit"  className="w-full bg-[#9f94eb] text-white hover:bg-[#9f94eb]/90 hover:text-white hover:scale-105 transition-all duration-300 hover:cursor-pointer">
            Login
          </Button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
            Don't have an account? <NavLink to="/signup" className="text-[#9f94eb] hover:text-[#9f94eb]/90">Register</NavLink>
        </p>
      </CardContent>
    </Card>
  );
} 