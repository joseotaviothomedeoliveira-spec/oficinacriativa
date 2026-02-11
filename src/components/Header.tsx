import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container flex items-center gap-4 py-4">
        {/* Logo: troque por <img src="/logo.png" /> quando tiver o arquivo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">V+</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-foreground">Vetrina+</h1>
            <p className="text-xs text-muted-foreground">Acesse seus materiais e ofertas</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
