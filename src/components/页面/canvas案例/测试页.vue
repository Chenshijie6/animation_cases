<template>
    <canvas ref="canvasRef" width="800" height="600"></canvas>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  
  onMounted(() => {
    if (!canvasRef.value) return;
    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;
  
    const width = canvasRef.value.width;
    const height = canvasRef.value.height;
  
    // 绘制不规则薄雾的函数
    function drawIrregularMist(x: number, y: number, numPoints: number, size: number) {
      ctx.beginPath();
  
      // 随机生成点来构成不规则形状
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = Math.random() * size * 0.5 + size * 0.5;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;
        points.push({ x: x + dx, y: y + dy });
      }
  
      // 使用贝塞尔曲线连接这些点形成不规则路径
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }
      ctx.quadraticCurveTo(
        points[points.length - 1].x,
        points[points.length - 1].y,
        points[0].x,
        points[0].y
      );
  
      // 创建径向渐变来实现朦胧效果
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  
    // 绘制多个不规则薄雾
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const numPoints = Math.floor(Math.random() * 10) + 5;
      const size = Math.random() * 200 + 100;
      drawIrregularMist(x, y, numPoints, size);
    }
  });
  </script>
  
  <style scoped>
  canvas {
    background-color:  #000;
  }
  </style>