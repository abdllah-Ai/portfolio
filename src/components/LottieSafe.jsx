import { memo, useMemo } from "react";
import Lottie from "lottie-react";

// Quick validation that the file is a Lottie JSON with layers
function isValidLottie(data) {
  return !!(data && typeof data === "object" && Array.isArray(data.layers));
}

/**
 * props:
 *  - data: Lottie JSON object (import ... from '.../file.json')
 *  - className, loop, autoplay
 *  - fallback: JSX to show if data is invalid
 */
function LottieSafe({ data, className = "h-40", loop = true, autoplay = true, fallback }) {
  const valid = useMemo(() => isValidLottie(data), [data]);

  if (!valid) {
    return (
      fallback ?? (
        <div className={`card flex items-center justify-center ${className}`}>
          <span className="text-muted text-sm">Invalid Lottie data</span>
        </div>
      )
    );
  }

  return (
    <Lottie
      animationData={data}
      loop={loop}
      autoplay={autoplay}
      className={className}
    />
  );
}

export default memo(LottieSafe);
