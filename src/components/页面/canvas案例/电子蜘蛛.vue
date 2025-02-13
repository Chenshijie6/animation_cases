<template>
    <canvas id="canvas" ></canvas>
</template>
<script setup>
import { ref, onMounted } from 'vue'

// 定义 requestAnimFrame 函数
const requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60)
        }
    )
})()

// 初始化函数，用于获取 canvas 元素并返回相关信息
function init(elemid) {
    const canvas = document.getElementById(elemid)
    if (!canvas) {
        throw new Error('Canvas element not found')
    }
    const c = canvas.getContext('2d')
    const w = (canvas.width = window.innerWidth-250)
    const h = (canvas.height = window.innerHeight-50)

    c.fillStyle = "rgba(30,30,30,1)"
    c.fillRect(0, 0, w, h)

    return { c, canvas }
}

// 计算两点距离的函数
function dist(p1x, p1y, p2x, p2y) {
    if (p1x == null || p1y == null || p2x == null || p2y == null) {
        return 0
    }
    return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2))
}

// 定义 segment 类
class Segment {
    constructor(parent, l, a, first) {
        this.first = first
        if (first) {
            this.pos = { x: parent.x, y: parent.y }
        } else {
            this.pos = { x: parent.nextPos.x, y: parent.nextPos.y }
        }
        this.l = l
        this.ang = a
        this.nextPos = {
            x: this.pos.x + this.l * Math.cos(this.ang),
            y: this.pos.y + this.l * Math.sin(this.ang),
        }
    }

    update(t) {
        this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x)
        this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI)
        this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI)
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang)
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang)
    }

    fallback(t) {
        this.pos.x = t.x
        this.pos.y = t.y
        this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang)
        this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang)
    }

    show() {
        c.lineTo(this.nextPos.x, this.nextPos.y)
    }
}

// 定义 tentacle 类
class Tentacle {
    constructor(x, y, l, n, a) {
        this.x = x
        this.y = y
        this.l = l
        this.n = n
        this.t = {}
        this.rand = Math.random()
        this.segments = [new Segment(this, this.l / this.n, 0, true)]
        for (let i = 1; i < this.n; i++) {
            this.segments.push(new Segment(this.segments[i - 1], this.l / this.n, 0, false))
        }
    }

    move(last_target, target) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x)
        this.dt = dist(last_target.x, last_target.y, target.x, target.y)
        this.t = {
            x: target.x - 0.8 * this.dt * Math.cos(this.angle),
            y: target.y - 0.8 * this.dt * Math.sin(this.angle)
        }
        if (this.t.x) {
            this.segments[this.n - 1].update(this.t)
        } else {
            this.segments[this.n - 1].update(target)
        }
        for (let i = this.n - 2; i >= 0; i--) {
            this.segments[i].update(this.segments[i + 1].pos)
        }
        if (
            dist(this.x, this.y, target.x, target.y) <=
            this.l + dist(last_target.x, last_target.y, target.x, target.y)
        ) {
            this.segments[0].fallback({ x: this.x, y: this.y })
            for (let i = 1; i < this.n; i++) {
                this.segments[i].fallback(this.segments[i - 1].nextPos)
            }
        }
    }

    show(target) {
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
            c.globalCompositeOperation = "lighter"
            c.beginPath()
            c.moveTo(this.x, this.y)
            for (let i = 0; i < this.n; i++) {
                this.segments[i].show()
            }
            c.strokeStyle = `hsl(${this.rand * 60 + 180}, 100%, ${this.rand * 60 + 25}%)`
            c.lineWidth = this.rand * 2
            c.lineCap = "round"
            c.lineJoin = "round"
            c.stroke()
            c.globalCompositeOperation = "source-over"
        }
    }

    show2(target) {
        c.beginPath()
        if (dist(this.x, this.y, target.x, target.y) <= this.l) {
            c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI)
            c.fillStyle = "white"
        } else {
            c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI)
            c.fillStyle = "darkcyan"
        }
        c.fill()
    }
}

// 初始化变量
const maxl = 400
const minl = 50
const n = 30
const numt = 600
const tent = []
const mouse = { x: null, y: null }
const target = { x: 0, y: 0, errx: 0, erry: 0 }
const last_target = { x: 0, y: 0 }
let clicked = false
let t = 0
const q = 10

// 创建触手对象
for (let i = 0; i < numt; i++) {
    tent.push(
        new Tentacle(
            Math.random() * window.innerWidth-250,
            Math.random() * window.innerHeight-50,
            Math.random() * (maxl - minl) + minl,
            n,
            Math.random() * 2 * Math.PI 
        )
    )
}

// 获取绘图上下文和 canvas 元素
let c, canvas

// 绘制图像的方法
function draw() {
    if (mouse.x !== null) {
        target.errx = mouse.x - target.x
        target.erry = mouse.y - target.y
    } else {
        target.errx =
            window.innerWidth / 2 +
            ((window.innerHeight / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
            (Math.pow(Math.sin(t), 2) + 1) -
            target.x
        target.erry =
            window.innerHeight / 2 +
            ((window.innerHeight / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
            (Math.pow(Math.sin(t), 2) + 1) -
            target.y
    }

    target.x += target.errx / 10
    target.y += target.erry / 10

    t += 0.01

    c.beginPath()
    c.arc(
        target.x,
        target.y,
        dist(last_target.x, last_target.y, target.x, target.y) + 5,
        0,
        2 * Math.PI
    )
    c.fillStyle = "hsl(210,100%,80%)"
    c.fill()

    for (let i = 0; i < numt; i++) {
        tent[i].move(last_target, target)
        tent[i].show2(target)
    }
    for (let i = 0; i < numt; i++) {
        tent[i].show(target)
    }

    last_target.x = target.x
    last_target.y = target.y
}

// 循环执行绘制动画的函数
function loop() {
    requestAnimFrame(loop)
    c.clearRect(0, 0, canvas.width, canvas.height)
    draw()
}

// 监听窗口大小改变事件
function handleResize() {
    canvas.width = window.innerWidth-250
    canvas.height = window.innerHeight-50
}

// 监听鼠标移动事件
function handleMouseMove(e) {
    last_target.x = mouse.x
    last_target.y = mouse.y
    mouse.x = e.pageX - this.offsetLeft
    mouse.y = e.pageY - this.offsetTop
}

// 监听鼠标离开事件
function handleMouseLeave() {
    mouse.x = null
    mouse.y = null
}

// 确保在组件挂载后初始化
onMounted(() => {
    try {
        ({ c, canvas } = init("canvas"))

        // 循环执行回执动画的函数
        loop()

        // 监听窗口大小改变事件
        window.addEventListener("resize", handleResize)

        // 监听鼠标移动事件
        canvas.addEventListener("mousemove", handleMouseMove)

        // 监听鼠标离开事件
        canvas.addEventListener("mouseleave", handleMouseLeave)
    } catch (error) {
        console.error(error)
    }
})
</script>
<style scoped>
canvas{
    background-color: black;
}</style>