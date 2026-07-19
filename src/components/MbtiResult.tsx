import type { TestResults } from '../types'

const axisInfo: Record<string, { left: string; right: string; topic: string }> = {
  EI: { left: '外向 E', right: '内向 I', topic: '精力来源' }, SN: { left: '实感 S', right: '直觉 N', topic: '信息获取' },
  TF: { left: '思考 T', right: '情感 F', topic: '决策方式' }, JP: { left: '判断 J', right: '感知 P', topic: '生活方式' },
}

const typeCopy: Record<string, string> = {
  E: '通过互动和外部反馈激活思路', I: '通过独处与内部整理恢复精力', S: '信任事实、经验与可执行细节', N: '关注模式、含义与未来可能',
  T: '偏好逻辑一致与可比较标准', F: '重视价值、关系与具体影响', J: '喜欢确定、计划和阶段闭环', P: '喜欢弹性、探索和保留选择',
}

export function MbtiResult({ results }: { results: TestResults }) {
  const type = results.mbti.type
  return <div className="result-content detail-page">
    <header className="detail-header"><span>04 · 认知方式</span><h1>MBTI 偏好</h1><p>偏好不是能力边界。它描述你自然状态下更常使用的方式，而不是你“只能”如何行动。</p></header>
    <section className="mbti-hero"><div><small>你的当前偏好</small><strong>{type}</strong></div><p>{type.split('').map((letter) => typeCopy[letter]).join('；')}。</p></section>
    <section className="mbti-axes">{Object.entries(results.mbti.axes).map(([key, axis]) => {
      const info = axisInfo[key]; const balanced = Math.abs(axis.left - 50) <= 8
      return <article key={key}><header><span>{info.topic}</span>{balanced && <em>双向偏好</em>}</header><div className="mbti-labels"><strong>{info.left} <b>{axis.left}%</b></strong><strong><b>{axis.right}%</b> {info.right}</strong></div><div className="dual-bar"><i style={{ width: `${axis.left}%` }} /><i style={{ width: `${axis.right}%` }} /></div><p>{balanced ? '接近 50%，说明你会根据情境灵活调用两侧偏好。' : `你目前更常使用${axis.left > axis.right ? info.left : info.right}一侧的方式。`}</p></article>
    })}</section>
    <section className="interpret-grid four"><article><span>思维方式</span><p>{type.includes('N') ? '先建立整体模型，再寻找证据与细节。' : '先掌握事实与经验，再形成可落地判断。'}</p></article><article><span>决策习惯</span><p>{type.includes('T') ? '重视逻辑、原则和标准的一致性。' : '重视价值、关系和决定对人的影响。'}</p></article><article><span>工作方式</span><p>{type.includes('J') ? '明确目标、计划与完成节点能提升效率。' : '开放空间、迭代反馈与弹性更能激发表现。'}</p></article><article><span>人际互动</span><p>{type.includes('E') ? '在交流中形成能量与清晰度。' : '更重视有准备、低干扰和深入的交流。'}</p></article></section>
  </div>
}
