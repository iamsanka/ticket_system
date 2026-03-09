import confetti from "canvas-confetti";

// Burst for 1st place
export function confettiBurst() {
  confetti({
    particleCount: 250,
    spread: 90,
    startVelocity: 45,
    origin: { y: 0.6 }
  });
}

// Side-shooting for 2nd & 3rd place
export function confettiSide() {
  // Left side
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 }
  });

  // Right side
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 }
  });
}

// Continuous rain for final results
export function confettiRain() {
  const duration = 3000; // 3 seconds
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      spread: 70,
      origin: { x: Math.random(), y: 0 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
