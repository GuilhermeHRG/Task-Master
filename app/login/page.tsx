"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const { user, loading, login, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  // Assim que o user existir e o loading acabar, vai pra home "/"
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, pass);
      // não precisa do push aqui
    } catch (e: any) {
      setErr(e.message);
    }
  }

  async function handleGoogle() {
    setErr("");
    try {
      await signInWithGoogle();
      // não precisa do push aqui
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md space-y-6 p-6">
        <CardHeader>
          <CardTitle>Faça login</CardTitle>
        </CardHeader>

        {err && <p className="text-red-500 text-center">{err}</p>}

        <CardContent className="space-y-4">
          

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Entrar
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center">
          <Link href="/register" className="text-primary hover:underline">
            Não tem conta? Registre‑se
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
