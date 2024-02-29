import React from 'react'
import cn from '../util/cn.js'

const Skeleton = ({ className , ...props}) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export default Skeleton