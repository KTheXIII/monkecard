import React, {
  ReactElement,
  useEffect,
  useState
} from 'react'
import ReactMarkdown from 'react-markdown'
import yaml from 'js-yaml'

import { ToolsTop } from './ToolsTop'
import { QToolsFloat } from './QToolsFloat'
import { QOptionContainer, QOption } from './QOption'

import { IQuestionModel } from '../model/question'

import '../style/question.scss'

const TIMER_UPDATE_DELAY = 1000  // ms

export const Question: React.FC = () => {
  const start = Date.now()
  const [currentTime, setCurrentTime] = useState(0)
  const [isFlagOn, setFlagOn] = useState(false)

  const [imageLink, setImageLink] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [options, setOptions] = useState<ReactElement[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - start)
    }, TIMER_UPDATE_DELAY)
    return () => {
      clearInterval(interval)
    }
  }, [])

  // FIXME: Have a better logic structure
  useEffect(() => {
    fetch('./static/assets/test.yml')
      .then(res => {
        if (res.status == 200) return res.text()
        else throw new Error('File not found: ' + res.status)
      })
      .then(text => {
        const parsedText = yaml.load(text) as any
        if (parsedText.version) {
          const question = parsedText.questions[0] as IQuestionModel
          setContent(question.content)
          const tmpOptions: ReactElement[] = []
          for (let i = 0;i < question.options.length;i++) {
            tmpOptions.push(
              <QOption
                key={i}
                onMark={(marked) => console.log(marked)}
                text={question.options[i]}
              />
            )
          }
          setOptions(tmpOptions)
          setImageLink(question.image.source)
        }
      }).catch(err => {
        console.error(err)
      })
  }, [])

  return (
    <div className="question">
      <ToolsTop time={currentTime} />
      <div className="display">
        <div className="image-container">
          {imageLink && <img src={imageLink} />}
        </div>
        <div className="content-container">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
        <QOptionContainer>
          {options}
        </QOptionContainer>
      </div>
      <QToolsFloat
        isFlagOn={isFlagOn}
        onMark={() => {
          setFlagOn(!isFlagOn)
        }}
        onAnswered={() => {
          console.log('answered')
        }}
        onNext={() => {
          console.log('next')
        }} />
    </div>
  )
}
