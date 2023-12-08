import Markdown from 'react-markdown'
import rules from '../../rules.md?raw'
import React from 'react'
import remarkGfm from 'remark-gfm'
import 'github-markdown-css'

export const Help: React.FC = () => {
  return (
    <div className={'mt-10 px-4 mx-auto pb-10'} style={{ maxWidth: 1000 }}>
      <Markdown remarkPlugins={[remarkGfm]} className={'markdown-body'}>
        {rules}
      </Markdown>
    </div>
  )
}
