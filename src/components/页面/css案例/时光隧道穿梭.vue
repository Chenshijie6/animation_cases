<template>
    <div class="main">
        <div class="scene">
            <div class="wrap">
                <div class="wall wall-right"></div>
                <div class="wall wall-left"></div>
                <div class="wall wall-top"></div>
                <div class="wall wall-bottom"></div>
                <div class="wall wall-back"></div>
            </div>
            <div class="wrap">
                <div class="wall wall-right"></div>
                <div class="wall wall-left"></div>
                <div class="wall wall-top"></div>
                <div class="wall wall-bottom"></div>
                <div class="wall wall-back"></div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>
<style lang="scss" scoped>
.main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #000;
    text-align: center;
}

.main::before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
}

.scene {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    perspective: 15px;
    perspective-origin: 50% 50%;
}

.wrap {
    position: absolute;
    width: 1000px;
    height: 1000px;
    left: -500px;
    top: -500px;
    transform-style: preserve-3d;
    animation: move 12s infinite linear;
    animation-fill-mode: forwards;
}

.wrap:nth-child(2) {
    animation: move 12s infinite linear;
    animation-delay: 6s;
}

.wall {
    width: 100%;
    height: 100%;
    position: absolute;
    background: url(@/assets/image/sg.jpg);
    background-size: cover;
    opacity: 0;
    animation: fade 12s infinite linear;
}

.wrap:nth-child(2) .wall {
    animation-delay: 6s;
}

.wall-right {
    transform: rotateY(90deg) translateZ(500px);
}

.wall-left {
    transform: rotateY(-90deg) translateZ(500px);
}

.wall-top {
    transform: rotateX(90deg) translateZ(500px);
}

.wall-bottom {
    transform: rotateX(-90deg) translateZ(500px);
}

.wall-back {
    transform: rotateX(180deg) translateZ(500px);
}

@keyframes fade {
    0% {
        opacity: 0;
    }

    25% {
        opacity: 1;
    }

    75% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes move {
    0% {
        transform: translateZ(-500px) rotate(0deg);
    }

    100% {
        transform: translateZ(500px) rotate(0deg);
    }
}
</style>