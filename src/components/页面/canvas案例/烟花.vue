<template>
  <div class="container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let ctx = null
let animationFrameId = null

// 星星数组
const stars = []
// 流星数组
const meteors = []
const starCount = 200
const meteorCount = 50

class Star {
  constructor(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.radius = Math.random() * 1.5
    this.color = Math.random() > 0.8 ? '#7ec0ee' : '#ffffff'
    this.speed = Math.random() * 0.3
    this.direction = Math.random() > 0.5 ? 1 : -1
  }

  update() {
    this.x += this.speed * this.direction
    if (this.x < 0) this.x = ctx.canvas.width
    if (this.x > ctx.canvas.width) this.x = 0
    this.radius = Math.random() * 1.5
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }
}

class Meteor {
  constructor(width, height) {
    this.reset(width, height)
  }

  reset(width, height) {
    this.start = {
      x: Math.random() * width * 0.5 + width * 0.25,
      y: Math.random() * height * 0.25
    }
    this.end = {
      x: this.start.x - width * 0.4,
      y: this.start.y + height * 0.4
    }
    this.x = this.start.x
    this.y = this.start.y
    this.speed = Math.random() * 5 + 3
    this.size = Math.random() * 2 + 1
    this.color = `hsl(${Math.random() * 50 + 200}, 100%, 70%)`
  }

  update() {
    this.x -= this.speed
    this.y += this.speed * 0.5
    if (this.x < this.end.x || this.y > this.end.y) {
      this.reset(ctx.canvas.width, ctx.canvas.height)
    }
  }

  draw() {
    const gradient = ctx.createLinearGradient(
      this.x, this.y, 
      this.x + this.size * 2, this.y + this.size * 2
    )
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x + this.size * 5, this.y + this.size * 5)
    ctx.strokeStyle = gradient
    ctx.lineWidth = this.size
    ctx.stroke()
  }
}

function initStars() {
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star(ctx.canvas.width, ctx.canvas.height))
  }
}

function initMeteors() {
  for (let i = 0; i < meteorCount; i++) {
    meteors.push(new Meteor(ctx.canvas.width, ctx.canvas.height))
  }
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight
}

function animate() {
  ctx.fillStyle = 'rgba(8, 8, 16, 0.2)'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // 绘制星星
  stars.forEach(star => {
    star.update()
    star.draw()
  })

  // 绘制流星
  meteors.forEach(meteor => {
    meteor.update()
    meteor.draw()
  })

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  resizeCanvas()
  initStars()
  initMeteors()
  animate()

  window.addEventListener('resize', () => {
    resizeCanvas()
    stars.length = 0
    initStars()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  /* left: 0; */
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #000000 0%, #1a1a2e 100%);
  overflow: hidden;
}

canvas {
  display: block;
}
</style>