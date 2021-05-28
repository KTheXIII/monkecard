import React from 'react'

import '../style/header.scss'

interface IHeader {
  title: string
}

export const Header: React.FC<IHeader> = (props) => {
  return (
    <header>
      <a href="/" >{props.title}</a>
    </header>
  )
}
