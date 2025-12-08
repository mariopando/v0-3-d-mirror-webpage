"use client"

export default function RainbowBackground() {
  return (
    <>
      <style jsx>{`
        .rainbow-bg-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          background-color: hsl(var(--background));
          overflow: hidden;
        }

        .rainbow {
          height: 100vh;
          width: 0;
          top: 0;
          position: absolute;
          transform: rotate(10deg);
          transform-origin: top right;
          opacity: 0.2;
        }
        .rainbow:nth-child(1) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #60a5fa, 0 0 50px 25px #5eead4, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 44.1s linear infinite slide;
          animation-delay: -1.8s;
        }
        .rainbow:nth-child(2) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 43.2s linear infinite slide;
          animation-delay: -3.6s;
        }
        .rainbow:nth-child(3) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #5eead4, 130px 0 80px 40px hsl(var(--background));
          animation: 42.3s linear infinite slide;
          animation-delay: -5.4s;
        }
        .rainbow:nth-child(4) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 41.4s linear infinite slide;
          animation-delay: -7.2s;
        }
        .rainbow:nth-child(5) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #e879f9, 50px 0 50px 25px #60a5fa, 130px 0 80px 40px hsl(var(--background));
          animation: 40.5s linear infinite slide;
          animation-delay: -9s;
        }
        .rainbow:nth-child(6) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #5eead4, 130px 0 80px 40px hsl(var(--background));
          animation: 39.6s linear infinite slide;
          animation-delay: -10.8s;
        }
        .rainbow:nth-child(7) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #5eead4, 50px 0 50px 25px #60a5fa, 130px 0 80px 40px hsl(var(--background));
          animation: 38.7s linear infinite slide;
          animation-delay: -12.6s;
        }
        .rainbow:nth-child(8) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 37.8s linear infinite slide;
          animation-delay: -14.4s;
        }
        .rainbow:nth-child(9) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #5eead4, 130px 0 80px 40px hsl(var(--background));
          animation: 36.9s linear infinite slide;
          animation-delay: -16.2s;
        }
        .rainbow:nth-child(10) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #5eead4, 130px 0 80px 40px hsl(var(--background));
          animation: 36s linear infinite slide;
          animation-delay: -18s;
        }
        .rainbow:nth-child(11) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #60a5fa, 0 0 50px 25px #e879f9, 50px 0 50px 25px #5eead4, 130px 0 80px 40px hsl(var(--background));
          animation: 35.1s linear infinite slide;
          animation-delay: -19.8s;
        }
        .rainbow:nth-child(12) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #e879f9, 50px 0 50px 25px #60a5fa, 130px 0 80px 40px hsl(var(--background));
          animation: 34.2s linear infinite slide;
          animation-delay: -21.6s;
        }
        .rainbow:nth-child(13) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #5eead4, 130px 0 80px 40px hsl(var(--background));
          animation: 33.3s linear infinite slide;
          animation-delay: -23.4s;
        }
        .rainbow:nth-child(14) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #5eead4, 50px 0 50px 25px #60a5fa, 130px 0 80px 40px hsl(var(--background));
          animation: 32.4s linear infinite slide;
          animation-delay: -25.2s;
        }
        .rainbow:nth-child(15) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #60a5fa, 0 0 50px 25px #5eead4, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 31.5s linear infinite slide;
          animation-delay: -27s;
        }
        .rainbow:nth-child(16) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 30.6s linear infinite slide;
          animation-delay: -28.8s;
        }
        .rainbow:nth-child(17) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #60a5fa, 0 0 50px 25px #5eead4, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 29.7s linear infinite slide;
          animation-delay: -30.6s;
        }
        .rainbow:nth-child(18) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 28.8s linear infinite slide;
          animation-delay: -32.4s;
        }
        .rainbow:nth-child(19) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #60a5fa, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 27.9s linear infinite slide;
          animation-delay: -34.2s;
        }
        .rainbow:nth-child(20) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #60a5fa, 0 0 50px 25px #5eead4, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 27s linear infinite slide;
          animation-delay: -36s;
        }
        .rainbow:nth-child(21) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #e879f9, 50px 0 50px 25px #60a5fa, 130px 0 80px 40px hsl(var(--background));
          animation: 26.1s linear infinite slide;
          animation-delay: -37.8s;
        }
        .rainbow:nth-child(22) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #60a5fa, 0 0 50px 25px #e879f9, 50px 0 50px 25px #5eead4, 130px 0 80px 40px hsl(var(--background));
          animation: 25.2s linear infinite slide;
          animation-delay: -39.6s;
        }
        .rainbow:nth-child(23) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #60a5fa, 0 0 50px 25px #5eead4, 50px 0 50px 25px #e879f9, 130px 0 80px 40px hsl(var(--background));
          animation: 24.3s linear infinite slide;
          animation-delay: -41.4s;
        }
        .rainbow:nth-child(24) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #5eead4, 0 0 50px 25px #e879f9, 50px 0 50px 25px #60a5fa, 130px 0 80px 40px hsl(var(--background));
          animation: 23.4s linear infinite slide;
          animation-delay: -43.2s;
        }
        .rainbow:nth-child(25) {
          box-shadow: -130px 0 80px 40px hsl(var(--background)), -50px 0 50px 25px #e879f9, 0 0 50px 25px #5eead4, 50px 0 50px 25px #60a5fa, 130px 0 80px 40px hsl(var(--background));
          animation: 22.5s linear infinite slide;
          animation-delay: -45s;
        }

        @keyframes slide {
          from {
            right: -25vw;
          }
          to {
            right: 125vw;
          }
        }

        .h {
          box-shadow: 0 0 50vh 40vh hsl(var(--background));
          width: 100vw;
          height: 0;
          bottom: 0;
          left: 0;
          position: absolute;
        }

        .v {
          box-shadow: 0 0 35vw 25vw hsl(var(--background));
          width: 0;
          height: 100vh;
          bottom: 0;
          left: 0;
          position: absolute;
        }
      `}</style>

      <div className="rainbow-bg-container">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="rainbow"></div>
        ))}
        <div className="h"></div>
        <div className="v"></div>
      </div>
    </>
  )
}
