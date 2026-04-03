const styles = `
@keyframes draw-circle {
  0% { stroke-dashoffset: 166; }
  100% { stroke-dashoffset: 0; }
}
@keyframes draw-check {
  0% { stroke-dashoffset: 36; }
  100% { stroke-dashoffset: 0; }
}
`;

export default function AnimatedCheckmark({ size = 24, color = '#8B1A2B' }) {
  const half = size / 2;
  const r = half * 0.85;
  const circumference = 2 * Math.PI * r;
  const checkLength = 36;

  return (
    <>
      <style>{styles}</style>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={half}
          cy={half}
          r={r}
          stroke={color}
          strokeWidth={size * 0.083}
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: 0,
            animation: `draw-circle 350ms ease-out forwards`,
          }}
        />
        <path
          d={`M${size * 0.28} ${half} L${size * 0.44} ${size * 0.62} L${size * 0.72} ${size * 0.34}`}
          stroke={color}
          strokeWidth={size * 0.083}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: checkLength,
            strokeDashoffset: 0,
            animation: `draw-check 250ms ease-out 350ms forwards`,
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        />
        {/* Use a separate style to handle opacity */}
        <style>{`
          @keyframes draw-check {
            0% { stroke-dashoffset: ${checkLength}; opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }
          @keyframes draw-circle {
            0% { stroke-dashoffset: ${circumference}; }
            100% { stroke-dashoffset: 0; }
          }
        `}</style>
      </svg>
    </>
  );
}
