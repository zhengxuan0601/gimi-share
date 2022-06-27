export const categoryOption = [
  {
    value: '1',
    label: '生活分享'
  },
  {
    value: '2',
    label: 'IT技术'
  },
  {
    value: '3',
    label: '游戏'
  }
]

export const categoryMap = categoryOption.reduce((prev, cur) => {
  prev[cur.value] = cur.label
  return prev
}, {})

export const tagOptions = [
  { label: '后端', value: 'hd', pid: '2' },
  { label: '前端', value: 'qd', pid: '2' },
  { label: 'Android', value: 'android', pid: '2' },
  { label: 'IOS', value: 'ios', pid: '2' },
  { label: '人工智能', value: 'rgzn', pid: '2' },
  { label: '数据库', value: 'sjk', pid: '2' },
  { label: '程序开发', value: 'cxkf', pid: '2' },
  { label: 'JavaScript', value: 'js', pid: '2' },
  { label: 'GitHub', value: 'github', pid: '2' },
  { label: '面试', value: 'ms', pid: '2' },
  { label: '架构', value: 'jiagou', pid: '2' },
  { label: 'Vue.js', value: 'vue', pid: '2' },
  { label: 'Nuxt.js', value: 'nuxt', pid: '2' },
  { label: 'React.js', value: 'react', pid: '2' },
  { label: 'Jquery', value: 'jquery', pid: '2' },
  { label: '微信小程序', value: 'wxapp', pid: '2' },
  { label: '前端架构', value: 'qdjg', pid: '2' },
  { label: 'Java', value: 'java', pid: '2' },
  { label: '代码规范', value: 'dmgf', pid: '2' },
  { label: 'CSS', value: 'css', pid: '2' },
  { label: 'HTML', value: 'html', pid: '2' },
  { label: 'Linux', value: 'linux', pid: '2' },
  { label: '产品', value: 'changpin', pid: '2' },
  { label: '设计模式', value: 'shejimoshi', pid: '2' },
  { label: '旅行', value: 'lvxing', pid: '1' },
  { label: '心态', value: 'xintai', pid: '1' },
  { label: '食材', value: 'shicai', pid: '1' },
  { label: '厨艺', value: 'chuyi', pid: '1' },
  { label: '攻略', value: 'gonglue', pid: '1' },
  { label: '阅读', value: 'yuedu', pid: '1' },
  { label: '生活', value: 'shenghuo', pid: '1' },
  { label: 'LOL', value: 'lol', pid: '3' },
  { label: '英雄联盟', value: 'lol1', pid: '3' },
  { label: '王者荣耀', value: 'wzry', pid: '3' },
  { label: 'DNF', value: 'dnf', pid: '3' },
  { label: '游戏', value: 'game', pid: '3' },
  { label: '操作', value: 'caozuo', pid: '3' },
  { label: '网游', value: 'wangyou', pid: '3' },
  { label: '手游', value: 'shouyou', pid: '3' },
  { label: '端游', value: '端游', pid: '3' },
  { label: '腾讯游戏', value: 'tengxungame', pid: '3' },
  { label: '网易游戏游戏', value: 'wangyigame', pid: '3' }
]

export const tagMap = tagOptions.reduce((prev, cur) => {
  prev[cur.value] = cur.label
  return prev
}, {})

export const userCategoryTabs = [
  { label: '动态', url: '' },
  { label: '文章', url: '/article' },
  { label: '友圈', url: '/circle' },
  { label: '收藏', url: '/collect' },
  { label: '关注', url: '/focus' },
  { label: '赞', url: '/agree' }
]