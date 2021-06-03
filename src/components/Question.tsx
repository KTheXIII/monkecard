import React, {
  ReactElement,
  useEffect,
  useState
} from 'react'
import ReactMarkdown from 'react-markdown'
import yaml from 'js-yaml'

import { ToolsTop } from './ToolsTop'
import { ToolsFloat } from './ToolsFloat'
import { OptionContainer, Option } from './Option'

import '../style/question.scss'

const TIMER_UPDATE_DELAY = 1000

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

  useEffect(() => {
    fetch('./static/assets/test.yml')
      .then(res => res.text()).then(text => {
        const parsedText = yaml.load(text) as any
        setContent(parsedText.questions[0].content)
        const tmpOptions: ReactElement[] = []
        for (let i = 0;i < parsedText.questions[0].options.length;i++) {
          tmpOptions.push(
            <Option
              key={i}
              onMark={(marked) => console.log(marked)}
              text={parsedText.questions[0].options[i]}
            />
          )
        }
        setOptions(tmpOptions)
        setImageLink(parsedText.questions[0].image.source)
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
        <OptionContainer>
          {options}
        </OptionContainer>
      </div>
      <ToolsFloat
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
