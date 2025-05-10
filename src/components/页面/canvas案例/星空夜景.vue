<template>
    <div class="main">
        <div class="landscape"></div>
        <div class="filter"></div>
        <div class="moon">
            <span class="crater"></span>
            <span class="crater"></span>
            <span class="crater"></span>
            <span class="crater"></span>
        </div>
        <canvas ref="canvasRef"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 定义画布引用
const canvasRef = ref(null);
let ctx;
let WIDTH;
let HEIGHT;
let mouseMoving = false;
let mouseMoveChecker;
let mouseX;
let mouseY;
let stars = [];
const initStarsPopulation = 1000;
let dots = [];
const dotsMinDist = 2;
const maxDistFromCursor = 50;

// Star 类
class Star {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 2) + 1;
        // 初始透明度
        this.alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        // 透明度变化的速度，范围在 -0.01 到 0.01 之间
        this.alphaSpeed = (Math.random() - 0.5) * 0.03;
        this.color = `rgba(255,255,255,${this.alpha})`;
    }

    draw() {
        // 更新透明度
        this.alpha += this.alphaSpeed;
        // 确保透明度在 0 到 0.5 之间
        if (this.alpha > 0.5) {
            this.alpha = 0.5;
            this.alphaSpeed = -this.alphaSpeed;
        } else if (this.alpha < 0) {
            this.alpha = 0;
            this.alphaSpeed = -this.alphaSpeed;
        }
        this.color = `rgba(255,255,255,${this.alpha})`;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    move() {
        this.y -= 0.15;
        if (this.y <= -10) this.y = HEIGHT + 10;
        this.draw();
    }

    die() {
        stars[this.id] = null;
        delete stars[this.id];
    }
}

// Dot 类
class Dot {
    constructor(id, x, y, r) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = Math.floor(Math.random() * 5) + 1;
        this.maxLinks = 2;
        this.speed = 0.5;
        this.a = 0.5;
        this.aReduction = 0.005;
        this.color = `rgba(255,255,255,${this.a})`;
        this.linkColor = `rgba(255,255,255,${this.a / 4})`;
        this.dir = Math.floor(Math.random() * 140) + 200;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.r * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }

    link() {
        if (this.id === 0) return;
        const previousDot1 = getPreviousDot(this.id, 1);
        const previousDot2 = getPreviousDot(this.id, 2);
        const previousDot3 = getPreviousDot(this.id, 3);
        if (!previousDot1) return;
        ctx.strokeStyle = this.linkColor;
        ctx.moveTo(previousDot1.x, previousDot1.y);
        ctx.beginPath();
        ctx.lineTo(this.x, this.y);
        if (previousDot2) ctx.lineTo(previousDot2.x, previousDot2.y);
        if (previousDot3) ctx.lineTo(previousDot3.x, previousDot3.y);
        ctx.stroke();
        ctx.closePath();
    }

    move() {
        this.a -= this.aReduction;
        if (this.a <= 0) {
            this.die();
            return;
        }
        this.color = `rgba(255,255,255,${this.a})`;
        this.linkColor = `rgba(255,255,255,${this.a / 4})`;
        this.x = this.x + Math.cos(degToRad(this.dir)) * this.speed;
        this.y = this.y + Math.sin(degToRad(this.dir)) * this.speed;
        this.draw();
        this.link();
    }

    die() {
        dots[this.id] = null;
        delete dots[this.id];
    }
}

// 获取前一个点
function getPreviousDot(id, stepback) {
    if (id === 0 || id - stepback < 0) return false;
    if (typeof dots[id - stepback] !== 'undefined') return dots[id - stepback];
    return false;
}

// 设置画布大小
function setCanvasSize() {
    WIDTH = document.documentElement.clientWidth;
    HEIGHT = document.documentElement.clientHeight;
    canvasRef.value.setAttribute('width', 1700);
    canvasRef.value.setAttribute('height', HEIGHT);
}

// 绘制月亮
function drawMoon() {
    const moonX = WIDTH * 0.8; // 月亮的 x 坐标，这里设置在画布宽度的 80% 位置
    const moonY = HEIGHT * 0.13; // 月亮的 y 坐标，这里设置在画布高度的 20% 位置
    const moonRadius = Math.min(WIDTH, HEIGHT) * 0.06; // 月亮的半径，根据画布大小自适应

    ctx.shadowColor = 'white';
    ctx.shadowBlur = 20; // 设置阴影模糊程度，实现边缘模糊效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0; // 绘制完月亮后将阴影模糊重置为 0
}
//绘制薄雾

// 初始化
function init() {
    ctx = canvasRef.value.getContext('2d');
    ctx.strokeStyle = 'white';
    ctx.shadowColor = 'white';
    for (let i = 0; i < initStarsPopulation; i++) {
        stars[i] = new Star(i, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
    }
    // drawMoon(); // 绘制月亮
    ctx.shadowBlur = 0;
    animate();
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // drawMoon(); // 每次动画循环都绘制月亮，确保一直显示
    for (const i in stars) {
        stars[i].move();
    }
    for (const i in dots) {
        dots[i].move();
    }

    // drawIfMouseMoving();
    requestAnimationFrame(animate);
}

// 鼠标移动事件处理
const onMouseMove = (e) => {
    mouseMoving = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    clearInterval(mouseMoveChecker);
    mouseMoveChecker = setTimeout(() => {
        mouseMoving = false;
    }, 100);
};

// 根据鼠标移动绘制
function drawIfMouseMoving() {
    if (!mouseMoving) return;
    if (dots.length === 0) {
        dots[0] = new Dot(0, mouseX, mouseY);
        dots[0].draw();
        return;
    }
    const previousDot = getPreviousDot(dots.length, 1);
    const prevX = previousDot.x;
    const prevY = previousDot.y;
    const diffX = Math.abs(prevX - mouseX);
    const diffY = Math.abs(prevY - mouseY);
    if (diffX < dotsMinDist || diffY < dotsMinDist) return;
    let xVariation = Math.random() > 0.5 ? -1 : 1;
    xVariation = xVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
    let yVariation = Math.random() > 0.5 ? -1 : 1;
    yVariation = yVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
    dots[dots.length] = new Dot(dots.length, mouseX + xVariation, mouseY + yVariation);
    dots[dots.length - 1].draw();
    dots[dots.length - 1].link();
}

// 角度转弧度
function degToRad(deg) {
    return deg * (Math.PI / 180);
}

// 挂载后初始化
onMounted(() => {
    setCanvasSize();
    init();
    window.addEventListener('mousemove', onMouseMove);
});
onUnmounted(() => {
    if (ctx) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style scoped>
.main {
    margin: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    /* cursor: pointer; */
    background: black;
    background: linear-gradient(to bottom, #000000 0%, #5788fe 100%);
}

.filter {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    /* left: 0; */
    /* cursor: none; */
    background: #fe5757;
    animation: colorChange 30s ease-in-out infinite;
    animation-fill-mode: both;
    mix-blend-mode: overlay;
}

@keyframes colorChange {

    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 0.9;
    }
}

.landscape {
    position: fixed;
    /* bottom: 0px; */
    /* left: 0; */
    width: 100%;
    height: 100%;
    background-image: url('@/assets/image/xkbg.png');
    background-size: 1000px 250px;
    background-repeat: repeat-x;
    background-position: center bottom;
}
.moon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #ffffdd;
  box-shadow: inset -11px -8px 0px 4px #feffa2, 0px 0px 10px 0px #feffa2, 0px 0px 50px 0px #feffa2, 0px 0px 500px 0px #feffa2;
  display: inline-block;
  position: relative;
  top: 10%;
  left: 10%;
  animation: 3s moonglow ease-in-out infinite alternate;
}

.crater {
  position: absolute;
  background: rgba(255, 244, 118, 1);
  border-radius: 50%;
  box-shadow: inset 1px 1px 0px 1px #ecec79;
}

.crater:nth-child(1) {
  width: 25px;
  height: 25px;
  top: 57%;
  left: 30%;
}

.crater:nth-child(2) {
  width: 16px;
  height: 16px;
  top: 30%;
  left: 23%;
}

.crater:nth-child(3) {
  width: 12px;
  height: 12px;
  top: 50%;
  left: 14%;
}

.crater:nth-child(4) {
  width: 30px;
  height: 30px;
  top: 20%;
  left: 30%;
  box-shadow: none;
  background: rgba(255, 244, 118, 0.3);
}

</style>