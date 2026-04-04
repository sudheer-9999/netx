import React from 'react'
import ScrollVelocity from './UI/ScrollVelocity'

const ScrollText = () => {
  return (
   <div className='mb-[100px]'><ScrollVelocity
  texts={['real people.', 'real vibes.','no pressure.','no perfection.','show up.']} 
  velocity={100}
  className="custom-scroll-text"
/></div>
  )
}

export default ScrollText