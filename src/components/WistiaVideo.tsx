import { useEffect } from "react";

let wistiaPlayerLoaded = false;

interface WistiaVideoProps {
  mediaId: string;
  aspect: string;
}

const WistiaVideo = ({ mediaId, aspect }: WistiaVideoProps) => {
  useEffect(() => {
    // Load player.js once globally
    if (!wistiaPlayerLoaded) {
      const script = document.createElement("script");
      script.src = "https://fast.wistia.com/player.js";
      script.async = true;
      document.head.appendChild(script);
      wistiaPlayerLoaded = true;
    }

    // Load per-media embed script
    const embedId = `wistia-embed-${mediaId}`;
    if (!document.getElementById(embedId)) {
      const script = document.createElement("script");
      script.id = embedId;
      script.src = `https://fast.wistia.com/embed/${mediaId}.js`;
      script.async = true;
      script.type = "module";
      document.head.appendChild(script);
    }
  }, [mediaId]);

  const paddingTop = aspect ? `${(1 / parseFloat(aspect)) * 100}%` : "56.25%";

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <style>{`
        wistia-player[media-id='${mediaId}']:not(:defined) {
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');
          display: block;
          filter: blur(5px);
          padding-top: ${paddingTop};
        }
      `}</style>
      <wistia-player media-id={mediaId} aspect={aspect} />
    </div>
  );
};

export default WistiaVideo;
