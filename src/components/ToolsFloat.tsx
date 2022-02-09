import React, { ReactElement } from 'react'

interface ToolsFloatProps {
  isHidden?: boolean
}
export const ToolsFloat: React.FC<ToolsFloatProps> = (props) => {
  const isHidden = props.isHidden === undefined ? false : props.isHidden
  return (
    <div className="fixed left-1/2 bottom-0 -translate-x-1/2 mb-8
                    flex flex-row flex-nowrap justify-center select-none print:hidden">
      <div className="tools my-0 mx-auto flex h-10 rounded-memo bg-mbg-1 overflow-hidden
                      shadow-memo">
        {!isHidden && props.children}
      </div>
    </div>
  )
}

interface ToolsButtonProps {
  text: string
  icon?: ReactElement
  onClick?: () => void
  isIconLeft?: boolean
  title?: string
}

export const ToolsFloatButton: React.FC<ToolsButtonProps> = (props) => {
  const isIconLeft = props.isIconLeft ?? true
  const IconDisplay: ReactElement = (
    <div className="w-4 h-4 m-auto">
      {props.icon}
    </div>
  )

  return (
    <button className={`cursor-pointer m-0 px-3
                       transition-all duration-100 ease-in
                       border-solid border-r border-mbg-base last:border-r-0
                       hover:bg-mbg-3 active:bg-mbg-2`}
    title={props.title}
    onClick={props.onClick}>
      <div className="flex gap-3">
        {isIconLeft  && props.icon && IconDisplay }
        <div className="text-sm whitespace-nowrap">{props.text}</div>
        {!isIconLeft && props.icon && IconDisplay}
      </div>
    </button>
  )
}
