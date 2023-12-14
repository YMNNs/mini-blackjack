import { Typography } from 'antd'
import { BUILD_TIME } from '../constant.ts'
import { name, version } from '../../package.json'
import React from 'react'

export const Copyright: React.FC = () => {
  return (
    <div className={'mx-auto w-fit text-center py-8'}>
      <div>
        <Typography.Text strong>
          {name} v{version}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text type={'secondary'}>构建于 {new Date(BUILD_TIME).toString()}</Typography.Text>
      </div>
    </div>
  )
}
