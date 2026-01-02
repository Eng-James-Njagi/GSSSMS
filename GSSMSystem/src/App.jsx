import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/Sign";
import LogIn from "./components/LogIn";
import Dashboard from "./components/dashboard";
import { Toaster } from "sonner";

async function getSession() {
  try {
    const res = await fetch("/api/session", { credentials: "include" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function logout() {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Sign" element={<SignIn />} />
          <Route path="/LogIn" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}
