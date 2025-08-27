import Player from "lottie-react";
import soccerAnimation from "../assets/Footballer.json";

interface LoadingSpinnerProps {
  msg?: string;
}

export default function LoadingSpinner({ msg }: LoadingSpinnerProps) {
  return (
    <div
      style={{
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        background: "#f6faff",
      }}
    >
      <Player
        autoplay
        loop
        animationData={soccerAnimation}
        style={{ width: 160, height: 160, marginBottom: 16 }}
      />
      <h4 style={{ color: "#1746A2", fontWeight: 700, margin: 0 }}>
        {msg || "Loading, please wait..."}
      </h4>
    </div>
  );
}
