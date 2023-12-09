import { Typography } from 'antd'
import { BUILD_TIME } from '../constant.ts'
import React from 'react'

export const Copyright: React.FC = () => {
  return (
    <div className={'mx-auto w-fit text-center py-8'}>
      <Typography.Text type={'secondary'}>更新于 {new Date(BUILD_TIME).toString()}</Typography.Text>
    </div>
  )
}
