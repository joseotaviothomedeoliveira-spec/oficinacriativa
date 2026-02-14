import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut } from "lucide-react";

const Header = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">OC</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight tracking-tight text-foreground" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>Oficina Criativa</h1>
            <p className="text-xs text-muted-foreground">Acesse seus materiais e ofertas</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {!loading && (
            user ? (
              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
