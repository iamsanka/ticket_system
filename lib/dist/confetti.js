"use strict";
exports.__esModule = true;
exports.confettiRain = exports.confettiSide = exports.confettiBurst = void 0;
var canvas_confetti_1 = require("canvas-confetti");
// Burst for 1st place
function confettiBurst() {
    canvas_confetti_1["default"]({
        particleCount: 250,
        spread: 90,
        startVelocity: 45,
        origin: { y: 0.6 }
    });
}
exports.confettiBurst = confettiBurst;
// Side-shooting for 2nd & 3rd place
function confettiSide() {
    // Left side
    canvas_confetti_1["default"]({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 }
    });
    // Right side
    canvas_confetti_1["default"]({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 }
    });
}
exports.confettiSide = confettiSide;
// Continuous rain for final results
function confettiRain() {
    var duration = 3000; // 3 seconds
    var end = Date.now() + duration;
    (function frame() {
        canvas_confetti_1["default"]({
            particleCount: 5,
            spread: 70,
            origin: { x: Math.random(), y: 0 }
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}
exports.confettiRain = confettiRain;
