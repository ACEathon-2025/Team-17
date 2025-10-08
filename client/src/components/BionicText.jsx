import React from 'react'
import { bionicReading } from '../utils/bionicReading'

const BionicText = ({ text, intensity = 0.5, className = '' }) => {
  if (!text) return null
  
  const words = bionicReading.convertForReact(text, intensity)
  
  return (
    <span className={className} style={{ display: 'inline' }}>
      {words.map((item) => {
        if (item.type === 'space') {
          return <span key={item.key}>{item.content}</span>
        }
        
        return (
          <span key={item.key} style={{ display: 'inline' }}>
            <span style={{ 
              fontWeight: 900,
              opacity: 1,
              color: 'inherit'
            }}>
              {item.bold}
            </span>
            <span style={{ 
              fontWeight: 300,
              opacity: 0.6,
              color: 'inherit'
            }}>
              {item.normal}
            </span>
            <span>{item.punctuation}</span>
          </span>
        )
      })}
    </span>
  )
}

export default BionicText
