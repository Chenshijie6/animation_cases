// src/config/menuConfig.js
export default [
  {
    index: '1',
    title: 'Canvas案例',
    icon: 'Picture',
    children: [
      {
        index: '1-1',
        title: '电子蜘蛛',
        icon: 'Cpu',
        component: 'Component1'
      },
      {
        index: '1-2',
        title: '烟花',
        icon: 'Promotion',
        component: 'Component2'
      },
      {
        index: '1-3',
        title: '粒子',
        icon: 'MagicStick',
        component: 'Component3'
      },
      {
        index: '1-4',
        title: '星空',
        icon: 'MoonNight',
        component: 'Component4'
      },
      {
        index: '1-5',
        title: '彩色大树',
        icon: 'Tree',
        component: 'Component5'
      },
      {
        index: '1-6',
        title: '星空夜景',
        icon: 'Moon',
        component: 'Component6'
      },
      {
        index: '1-7',
        title: '类星体探险家',
        icon: 'Star',
        component: 'Component10'
      }
    ]
  },
  {
    index: '2',
    title: 'CSS案例',
    icon: 'MagicStick',
    children: [
      {
        index: '2-1',
        title: '月光沙漠',
        icon: 'Sunny',
        component: 'Component8'
      },
      {
        index: '2-2',
        title: '时光隧道穿梭',
        icon: 'Clock',
        component: 'Component9'
      }
    ]
  },
  {
    index: '7',
    title: '测试页',
    icon: 'Setting',
    component: 'Component7'
  }
];