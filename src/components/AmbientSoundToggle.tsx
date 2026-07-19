import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const AUDIO_KEY = 'persona-atlas-ambient-preference'

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext
}

function createAirBuffer(context: AudioContext) {
  const duration = 8
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate)
  const data = buffer.getChannelData(0)
  let brown = 0

  // Brown-ish noise keeps the bed soft and organic instead of sounding like a pure tone.
  for (let index = 0; index < data.length; index += 1) {
    const white = Math.random() * 2 - 1
    brown = (brown + white * 0.12) / 1.12
    data[index] = brown * 2.2 + white * 0.08
  }

  return buffer
}

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
    const AudioContextClass = (window as AudioWindow).AudioContext ?? (window as AudioWindow).webkitAudioContext
    if (!AudioContextClass) throw new Error('Web Audio is not supported')

    const context = new AudioContextClass()
    const compressor = context.createDynamicsCompressor()
    const master = context.createGain()
    const highpass = context.createBiquadFilter()
    const lowpass = context.createBiquadFilter()
    const now = context.currentTime

    compressor.threshold.value = -24
    compressor.knee.value = 18
    compressor.ratio.value = 3
    compressor.attack.value = 0.12
    compressor.release.value = 0.8
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.42, now + 1.6)
    highpass.type = 'highpass'
    highpass.frequency.value = 120
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 1500
    highpass.connect(lowpass)
    lowpass.connect(master)
    master.connect(compressor)
    compressor.connect(context.destination)

    const air = context.createBufferSource()
    air.buffer = createAirBuffer(context)
    air.loop = true
    const airGain = context.createGain()
    airGain.gain.value = 0.012
    air.connect(airGain)
    airGain.connect(highpass)

    const swell = context.createOscillator()
    const swellGain = context.createGain()
    swell.frequency.value = 0.018
    swellGain.gain.value = 0.003
    swell.connect(swellGain)
    swellGain.connect(airGain.gain)

    // Barely-audible, widely spaced tones add warmth without creating a low hum.
    const padBus = context.createGain()
    const padFilter = context.createBiquadFilter()
    padBus.gain.value = 0.0018
    padFilter.type = 'lowpass'
    padFilter.frequency.value = 900
    padBus.connect(padFilter)
    padFilter.connect(master)

    const nodes: AudioNode[] = [compressor, master, highpass, lowpass, air, airGain, swell, swellGain, padBus, padFilter]
    ;[196, 293.66].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      oscillator.detune.value = index === 0 ? -3 : 3
      oscillator.connect(padBus)
      oscillator.start()
      nodes.push(oscillator)
    })

    air.start()
    swell.start()
    contextRef.current = context
    nodesRef.current = nodes
    await context.resume()
  }

  const toggle = async () => {
    if (enabled) {
      stop()
      setEnabled(false)
      try { localStorage.setItem(AUDIO_KEY, 'off') } catch { /* ignore */ }
      return
    }

    try {
      await start()
      setEnabled(true)
      localStorage.setItem(AUDIO_KEY, 'on')
    } catch {
      setEnabled(false)
    }
  }

  useEffect(() => () => stop(), [])

  return <button className={`ambient-toggle ${enabled ? 'active' : ''}`} onClick={() => void toggle()} aria-pressed={enabled} aria-label={enabled ? '关闭背景环境音' : '开启背景环境音'}>
    {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    <span>环境音 {enabled ? '开' : '关'}</span>
    {enabled && <i aria-hidden="true"><b /><b /><b /></i>}
  </button>
}
