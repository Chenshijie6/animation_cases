<template>
    <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// 获取 Canvas 元素的引用
const canvasRef = ref(null);

onMounted(() => {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');

    // 设置 Canvas 的宽度和高度为窗口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 星星数量
    const starCount = 200;
    const stars = [];

    // 定义星星类
    class Star {
        constructor() {
            // 随机位置
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // 随机大小
            this.size = Math.random() * 2;
            // 随机亮度变化速度
            this.speed = Math.random() * 0.05;
            // 初始亮度
            this.brightness = Math.random();
        }

        // 更新星星的亮度
        update() {
            this.brightness += this.speed;
            if (this.brightness > 1 || this.brightness < 0) {
                this.speed = -this.speed;
            }
        }

        // 绘制星星
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
            ctx.fill();
        }
    }

    // 初始化星星数组
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    // 动画循环函数
    function animate() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新并绘制每个星星
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // 请求下一帧动画
        requestAnimationFrame(animate);
    }

    // 启动动画
    animate();
});
</script>

<style scoped>
canvas {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
}
</style>