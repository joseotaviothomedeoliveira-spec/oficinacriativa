import { Eye } from "lucide-react";

interface Props {
  folderId: string;
}

const DrivePreview = ({ folderId }: Props) => {
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Pré-visualização das atividades
        </span>
      </div>
      <div className="overflow-hidden rounded-lg border border-border">
        <iframe
          src={embedUrl}
          className="h-[480px] w-full border-0"
          title="Pré-visualização do material"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Visualização apenas — o material completo é liberado após a compra.
      </p>
    </div>
  );
};

export default DrivePreview;
