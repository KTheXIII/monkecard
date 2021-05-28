import React from 'react'

import '../style/footer.scss'

interface IFooter {
  year: number
  copyright: string
  link: string
}

export const Footer: React.FC<IFooter> = (props) => {
  return (
    <footer className="noselect">
      <a
        href={props.link}
        rel="noreferrer"
        target="_blank">
        {props.year} &copy; {props.copyright}
      </a>
    </footer >
  )
}
