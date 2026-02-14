import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const LoginPage = () => {
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signInWithEmail(email.trim().toLowerCase());

    if (error) {
      setError("Erro ao entrar. Tente novamente.");
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Entrar — Oficina Criativa</title>
        <meta name="description" content="Faça login para acessar seus materiais comprados." />
      </Helmet>

      <main className="container flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="rounded-lg border border-border bg-card p-6 space-y-5">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold text-foreground">Entrar na sua conta</h1>
              <p className="text-sm text-muted-foreground">
                Digite seu email para acessar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
