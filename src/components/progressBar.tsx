import React from 'react'

type Props = {
  value: number
}

const ProgressBar = (props: Props) => {
  return (
    <div className="w-full bg-neutral-200 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-md bg-[var(--brand-orange-500)]"
        style={{ width: `${props.value}%` }}
      />
    </div>
  )
}

export default ProgressBar