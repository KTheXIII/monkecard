import React, { ReactElement } from 'react'

export const ToolsFloat: React.FC = (props) => {
  return (
    <div className="tools-float fixed left-1/2 bottom-0 -translate-x-1/2 mb-6
                    flex flex-row flex-nowrap justify-center select-none">
      <div className="tools my-0 mx-auto flex h-10 rounded-memo bg-mbg-1 overflow-hidden
                      shadow-memo">
        {props.children}
      </div>
    </div>
  )
}

interface ToolsButtonProps {
  text: string
  icon: ReactElement
  onClick?: () => void
  isIconLeft?: boolean
  title?: string
}

export const ToolsFloatButton: React.FC<ToolsButtonProps> = (props) => {
  const isIconLeft = props.isIconLeft ?? true
  const IconDisplay: ReactElement = (
    <div className="w-4 h-4 m-auto mr-3">
      {props.icon}
    </div>
  )

  return (
    <button className="cursor-pointer m-0 p-3
                       transition-all duration-100 ease-in
                       border-solid border-r border-mbg-0 last:border-r-0
                       hover:bg-mbg-3 active:bg-mbg-2"
    title={props.title}
    onClick={props.onClick}>
      <div className="flex flex-row flex-nowrap">
        {isIconLeft && IconDisplay }
        <div className="text-sm">{props.text}</div>
        {!isIconLeft && IconDisplay}
      </div>
    </button>
  )
}
