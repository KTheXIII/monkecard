import React from 'react'

export const Overlay: React.FC = (props) => {
  return (
    <div className="overlay">
      {props.children}
    </div>
  )
}
