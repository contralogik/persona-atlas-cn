import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const AUDIO_KEY = 'persona-atlas-ambient-preference'

export function AmbientSoundToggle() {
  const [enabled, setEnabled] = useState(false)
  const contextRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])

  const stop = () => {
    nodesRef.current.forEach((node) => {
      if ('stop' in node && typeof node.stop === 'function') {
        try { node.stop() } catch { /* already stopped */ }
      }
      node.disconnect()
    })
    nodesRef.current = []
    if (contextRef.current) void contextRef.current.close()
    contextRef.current = null
  }

  const start = async () => {
    stop()
    const AudioContextClass = window.AudioContext
    const context = new AudioContextClass()
    const master = context.createGain()
    const filter = context.createBiquadFilter()
    master.gain.value = 0.035
    filter.type = 'lowpass'
    filter.frequency.value = 720
    filter.Q.value = 0.7
    filter.connect(master)
    master.connect(context.destination)

    const tones = [130.81, 196, 261.63]
    const nodes: AudioNode[] = [master, filter]
    tones.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const lfo = context.createOscillator()
      const lfoGain = context.createGain()
      oscillator.type = index === 1 ? 'triangle' : 'sine'
      oscillator.frequency.value = frequency
      oscillator.detune.value = index * -4
      gain.gain.value = index === 0 ? 0.22 : 0.12
      lfo.frequency.value = 0.035 + index * 0.012
      lfoGain.gain.value = 0.05
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      oscillator.connect(gain)
      gain.connect(filter)
      oscillator.start()
      lfo.start()
      nodes.push(oscillator, gain, lfo, lfoGain)
    })
    contextRef.current = context
    nodesRef.current = nodes
    await context.resume()
  }

  const toggle = async () => {
    if (enabled) {
      stop(); setEnabled(false)
      try { localStorage.setItem(AUDIO_KEY, 'off') } catch { /* ignore */ }
      return
    }
    try {
      await start(); setEnabled(true)
      localStorage.setItem(AUDIO_KEY, 'on')
    } catch { setEnabled(false) }
  }

  useEffect(() => () => stop(), [])

  return <button className={`ambient-toggle ${enabled ? 'active' : ''}`} onClick={() => void toggle()} aria-pressed={enabled} aria-label={enabled ? '关闭背景环境音' : '开启背景环境音'}>
    {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    <span>环境音 {enabled ? '开' : '关'}</span>
    {enabled && <i aria-hidden="true"><b /><b /><b /></i>}
  </button>
}
