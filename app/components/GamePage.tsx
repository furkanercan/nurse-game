"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import LoginRegister from "@/app/components/LoginRegister";
import NurseGame from "@/app/components/NurseGame";

const GamePage = () => {
  const [user] = useAuthState(auth);

  return user ? <NurseGame /> : <LoginRegister />;
};

export default GamePage;
