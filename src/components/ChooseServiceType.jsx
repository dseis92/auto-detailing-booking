import { useState } from 'react'
import Lottie from 'lottie-react'

// Sample Lottie JSONs (use your own or replace with updated ones later)
import interiorAnim from '../lotties/interior.json'
import exteriorAnim from '../lotties/exterior.json'
import fullDetailAnim from '../lotties/full.json'
import ceramicAnim from '../lotties/ceramic.json'

const services = [
  { anim: interiorAnim, label: 'Interior Detail' },
  { anim: exteriorAnim, label: 'Exterior Detail' },
  { anim: fullDetailAnim, label: 'Full-Detail' },
  { anim: ceramicAnim, label: 'Ceramic Coating' },
]

export default function ChooseServiceType({ onSelect }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (label) => {
    setSelected(label)
    if (onSelect) onSelect(label)
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-10">
      {services.map(({ anim, label }) => (
        <div
          key={label}
          className={`service-card w-40 ${selected === label ? 'service-card--active' : ''}`}
          onClick={() => handleSelect(label)}
        >
          <Lottie animationData={anim} className="h-20" loop autoplay />
          <div className="service-label">{label}</div>
        </div>
      ))}
    </div>
  )
}