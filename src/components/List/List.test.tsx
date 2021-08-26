import React from 'react'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import { ListComponent, ListItemButton } from '.'

describe('List', () => {
  it('should render list component with header', () => {
    const { getByText } = render(<ListComponent text="Test" />)
    expect(getByText('Test')).to.be.ok
  })

  it('should render button', () => {
    const { getByText } = render(
      <ListComponent>
        <ListItemButton text="Test Button"/>
      </ListComponent>
    )
    expect(getByText('Test Button')).to.be.ok
  })

  it('should click the button', () => {
    const { getByText } = render(
      <ListComponent>
        <ListItemButton text="Test Button" onClick={() => {
          expect(true).to.be.ok
        }}/>
      </ListComponent>
    )
    getByText('Test Button').click()
  })
})
