<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const canvas = ref(null)
// 获取 Canvas 并设置全屏
let ctx
function resizeCanvas() {
    canvas.value.width = window.innerWidth - 250;
    canvas.value.height = window.innerHeight - 50;
}
function initParticles() {
    // 初始化粒子系统
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle());
    }
}
function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
}

// 定义 distance 函数
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
const NUM_PARTICLES = 200; // 粒子数量
const particles = []; // 粒子数组
const CONNECT_DISTANCE = 120; // 连接距离

// 鼠标追踪
const mouse = { x: null, y: null };
window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
const MOUSE_FOLLOW_DISTANCE = 50;


class Particle {
    constructor() {
        // this.x = random(0, canvas.width); // 随机位置
        // this.y = random(0, canvas.height);
        // this.r = random(2, 6); // 随机半径
        // this.vx = random(-2, 2); // 随机速度
        // this.vy = random(-2, 2);
        this.x = Math.random() * canvas.value.width; // 随机位置
        this.y = Math.random() * canvas.value.height;
        this.r = Math.random() * 4 + 2; // 随机半径
        this.vx = Math.random() * 4 - 2; // 随机速度
        this.vy = Math.random() * 4 - 2;
        this.color = randomColor(); // 随机颜色
    }

    update() {
        // 鼠标追踪逻辑
        if (mouse.x !== null && mouse.y !== null) {
            const distToMouse = distance(this.x, this.y, mouse.x, mouse.y);
            if (distToMouse < MOUSE_FOLLOW_DISTANCE) {
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const mag = Math.sqrt(dx * dx + dy * dy);
                if (mag > 0) {
                    this.vx = (dx / mag) * speed;
                    this.vy = (dy / mag) * speed;
                }
            }
        }

        this.x += this.vx; // 更新位置
        this.y += this.vy;

        // 边界反弹
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dist = distance(p1.x, p1.y, p2.x, p2.y);
            if (dist < CONNECT_DISTANCE) {
                const alpha = 1 - dist / CONNECT_DISTANCE;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height); // 清除画布

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    connectParticles();

    requestAnimationFrame(animate); // 循环调用
}
onMounted(() => {
    ctx = canvas.value.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    initParticles();
    animate();
});


</script>
<style scoped>
canvas{
    background-color: black;
}
</style>