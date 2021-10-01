import { h, FunctionalComponent as Func } from 'preact'

interface Props {
  isHidden: boolean
}

export const CommandPalette: Func<Props> = (props) => {
  const { isHidden } = props
  return (
    <div class="command-palette">
      {!isHidden && <div className="container"></div>}
    </div>
  )
}
