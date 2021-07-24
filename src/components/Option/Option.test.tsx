import React from 'react'
import { render } from '@testing-library/react'
import { expect } from 'chai'

import { OptionElement } from '.'

describe('<OptionElement />', () => {
  it('should render', () => {
    const { getByText } = render(
      <OptionElement
        text="Option Element"
        isMarked={false}
        onButton={() => {
          //
        }}
      />
    )
    expect(getByText('Option Element')).to.be.ok
  })
})
