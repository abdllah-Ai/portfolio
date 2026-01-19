// src/components/HeroLottie.jsx
import Lottie from "lottie-react";
import heroAnim from "../assets/hero.json";

export default function HeroLottie() {
  return (
    <div className="relative h-64 md:h-80 card">
      <Lottie
        animationData={heroAnim}
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
