import React, { ReactElement } from 'react'

import { Header } from './components/Header'
import { AppMain } from './components/AppMain'
import { Footer } from './components/Footer'

import { Question } from './components/Question'

export const App: React.FC = (props): ReactElement => {
  return (
    <div className='app'>
      <Question />
      {/* <AppMain /> */}
      {/* <Footer
        year={2021}
        copyright={'KTheXIII'}
        link='https://github.com/KTheXIII'
      /> */}
    </div>
  )
}
