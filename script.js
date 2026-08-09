const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const MESSAGE = "I LOVE YOU MERI BACCHAAW ❤️";

let width, height, centerX, centerY;
let points = [];
let progress = 0;
let pulse = 1;
let phase = "draw";

function resize() {
    const dpr = window.devicePixelRatio || 1;

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    centerX = width / 2;
    centerY = height / 2;

    generateHeart();
}

window.addEventListener("resize", resize);

function generateHeart() {

    points = [];

    const scale = Math.min(width, height) / 42;

    for (let t = 0; t < Math.PI * 2; t += 0.02) {

        const x = 16 * Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        points.push({
            x: centerX + x * scale,
            y: centerY - y * scale
        });
    }

    progress = 0;
    phase = "draw";
    overlay.classList.remove("show");
}

function drawBackground() {

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

}
function drawHeart() {

    const visible = Math.floor(progress);

    for (let i = 0; i < visible && i < points.length; i++) {

        const p = points[i];

        const alpha = i / points.length;

        ctx.save();

        ctx.translate(p.x, p.y);

        // Rotate text to follow the curve
        if (i < points.length - 1) {

            const next = points[i + 1];

            const angle = Math.atan2(next.y - p.y, next.x - p.x);

            ctx.rotate(angle);

        }

        ctx.font = `bold ${Math.max(10, Math.min(width, height) / 48)}px Arial`;

        ctx.fillStyle = `rgba(255,182,193,${0.4 + alpha * 0.6})`;

        ctx.shadowColor = "#ff4da6";
        ctx.shadowBlur = 20;

        ctx.fillText(MESSAGE, 0, 0);

        ctx.restore();

    }

}

function heartbeat() {

    pulse = 1 + Math.sin(Date.now() / 250) * 0.03;

}

function animate() {

    drawBackground();

    ctx.save();

    ctx.translate(centerX, centerY);
    ctx.scale(pulse, pulse);
    ctx.translate(-centerX, -centerY);

    drawHeart();

    ctx.restore();

    if (phase === "draw") {

        progress += 1.5;

        if (progress >= points.length) {

            progress = points.length;

            phase = "beat";

            overlay.classList.add("show");

        }

    } else {

        heartbeat();

    }

    requestAnimationFrame(animate);

}

resize();
animate();
