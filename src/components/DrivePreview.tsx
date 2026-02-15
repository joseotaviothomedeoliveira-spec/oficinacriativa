import { Eye, ShieldCheck } from "lucide-react";

interface Props {
  folderId: string;
}

const DrivePreview = ({ folderId }: Props) => {
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Pré-visualização do material
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Conteúdo protegido</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <iframe
          src={embedUrl}
          className="h-[520px] w-full border-0 bg-background"
          title="Pré-visualização do material"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        📋 Visualização apenas — o acesso completo é liberado após a compra.
      </p>
    </div>
  );
};

export default DrivePreview;
