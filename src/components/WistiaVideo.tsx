interface WistiaVideoProps {
  mediaId: string;
  aspect: string;
}

const WistiaVideo = ({ mediaId, aspect }: WistiaVideoProps) => {
  const aspectNum = parseFloat(aspect) || 0.5625;
  const paddingTop = `${(1 / aspectNum) * 100}%`;

  return (
    <div className="w-full overflow-hidden rounded-lg" style={{ position: "relative", paddingTop, height: 0 }}>
      <iframe
        src={`https://fast.wistia.net/embed/iframe/${mediaId}?seo=true&videoFoam=true`}
        title="Video"
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default WistiaVideo;
