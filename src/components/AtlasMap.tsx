import { Brain, Globe2, Heart, Layers3, Orbit } from 'lucide-react'

const nodes = [
  { n: '01', label: '人格特质', icon: Brain, className: 'node-one' },
  { n: '02', label: '价值观', icon: Heart, className: 'node-two' },
  { n: '03', label: '社会期待', icon: Globe2, className: 'node-three' },
  { n: '04', label: '生活条件', icon: Layers3, className: 'node-four' },
  { n: '05', label: '环境匹配', icon: Orbit, className: 'node-five' },
]

export function AtlasMap({ compact = false }: { compact?: boolean }) {
  return <div className={`atlas-map ${compact ? 'compact' : ''}`} aria-hidden="true">
    <div className="atlas-cross horizontal" /><div className="atlas-cross vertical" />
    <div className="atlas-ring ring-one" /><div className="atlas-ring ring-two" /><div className="atlas-ring ring-three" />
    <div className="atlas-polygon" />
    {nodes.map(({ n, label, icon: Icon, className }) => <div className={`atlas-node ${className}`} key={n}>
      <span><Icon size={17} strokeWidth={1.5} /></span><small>{n}</small><strong>{label}</strong>
    </div>)}
    <em className="coord coord-n">N 0°</em><em className="coord coord-e">E 90°</em><em className="coord coord-s">S 180°</em><em className="coord coord-w">W 270°</em>
  </div>
}
