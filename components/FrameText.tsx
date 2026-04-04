import React from 'react'
import TrueFocus from './UI/TrueFocus'

const FrameText = () => {
  return (

<div className='my-[100px]'><TrueFocus 
sentence="Why NetX?"
manualMode
blurAmount={5}
borderColor="#06b6d4"
glowColor="rgba(6, 182, 212, 0.6)"
animationDuration={0.5}
pauseBetweenAnimations={1}
/></div>
  )
}

export default FrameText