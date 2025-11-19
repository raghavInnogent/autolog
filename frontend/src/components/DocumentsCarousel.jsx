import React, {useRef, useState, useEffect} from 'react'
import DocumentCard from './DocumentCard'
import '../styles/components/DocumentsCarousel.css'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function DocumentsCarousel({docs=[]}){
  const [index, setIndex] = useState(0)
  const trackRef = useRef()

  // number of visible cards depending on width (desktop 4)
  const visible = 4

  const maxIndex = Math.max(0, Math.ceil(docs.length - visible))

  function prev(){ setIndex(i => Math.max(0, i-1)) }
  function next(){ setIndex(i => Math.min(maxIndex, i+1)) }

  useEffect(()=>{
    const track = trackRef.current
    if(!track) return
    const cardWidth = 260 + 12 // approximate card width + gap
    const x = -(index * cardWidth)
    track.style.transform = `translateX(${x}px)`
  },[index, docs.length])

  return (
    <div className="docs-carousel">
      <div className="docs-track">
        <button className="navy-btn carousel-btn left" onClick={prev} aria-label="Previous"><FiChevronLeft /></button>
        <div style={{overflow:'hidden',width:'100%'}}>
          <div className="docs-row" ref={trackRef}>
            {docs.map((d,i)=> (
              <div key={i} style={{minWidth:260,maxWidth:260}}>
                <DocumentCard doc={d} />
              </div>
            ))}
          </div>
        </div>
        <button className="navy-btn carousel-btn right" onClick={next} aria-label="Next"><FiChevronRight /></button>
      </div>
    </div>
  )
}
