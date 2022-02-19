import { CommandPaletteRef } from '@components/CommandPalette'
import { GetPlatform } from '@scripts/env'

export function CommandKeyBinds(e: KeyboardEvent, cmd: CommandPaletteRef): boolean {
  if (e.code === 'Escape' && cmd.setIsHidden(true))
    return true
  if (e.code === 'KeyK' && e.metaKey) {
    cmd.setIsHidden(!cmd.isHidden())
    return true
  }
  if (e.code === 'KeyP' && e.metaKey && e.shiftKey && GetPlatform() !== 'macOS') {
    cmd.setIsHidden(!cmd.isHidden())
    return true
  }
  if (!cmd.isHidden()) cmd.onKeyDown(e)
  return false
}

export function CommandMouseBinds(e: MouseEvent, cmd: CommandPaletteRef): boolean {
  // NOTE: Maybe ask for confirmation before closing the
  //       command palette if it's in a middle of a command?
  if (!cmd.isHidden() && e.target === cmd.target) {
    cmd.setIsHidden(true)
    e.preventDefault
    return false
  }

  return false
}
