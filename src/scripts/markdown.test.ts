import { expect } from 'chai'
import {
  EQUATION_BLOCK_REGEX,
  EQUATION_INLINE_REGEX
} from '@scripts/markdown'

describe('Markdown', () => {
  const inlineEq  = '$a^2 + b^2 = b^2$'
  const block1    = '$$\na^2 + b^2 = b^2\n$$'
  const equations = `
${inlineEq}

${block1}

${block1}
  `
  it('should match inline equations', () => {
    expect(equations.match(EQUATION_INLINE_REGEX)).to.deep.equal([
      inlineEq
    ])
  })

  it('should match block equations', () => {
    expect(equations.match(EQUATION_BLOCK_REGEX)).to.deep.equal([
      block1,
      block1,
    ])
  })
})
