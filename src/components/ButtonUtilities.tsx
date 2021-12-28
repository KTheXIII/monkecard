import React from 'react'

export const ActionButton: React.FC<{
  text: string,
  onClick?: () => void
}> = (props) => {
  return (
    <button className="text-mtext-dim-1 h-7 rounded-memo px-4 py-1
                       transition-colors duration-150 ease-out
                       hover:text-mtext-base active:text-mtext-dim-2"
    onClick={() => props.onClick && props.onClick()}>
      {props.text}
    </button>
  )
}

export const FilterButton: React.FC<{
  text: string,
  active: boolean,
  onClick?: () => void
}> = (props) => {
  return (
    <button className={`text-mtext-dim-1 w-16 h-7 rounded-memo
                        ${props.active && 'text-mtext-base'}
                        transition-colors duration-150 ease-out
                        hover:text-mtext-base active:text-mtext-dim-2`}
    onClick={() => props.onClick && props.onClick()}>
      {props.text}
    </button>
  )
}
