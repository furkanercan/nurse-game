"use client";

import React, { useState } from "react";
import { auth } from "@/app/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { User } from "firebase/auth"; // Import User type


const LoginRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">{user ? "Welcome!" : "Login / Register"}</h2>
      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded mt-4">Logout</button>
        </>
      ) : (
        <>
          <input className="p-2 border mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="p-2 border mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded mb-2">Login</button>
          <button onClick={handleRegister} className="bg-green-500 text-white p-2 rounded">Register</button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
};

export default LoginRegister;
