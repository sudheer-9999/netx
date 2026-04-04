import React from 'react'
import ScrollReveal from './UI/ScrollReveal'

const WhyNextX = () => {
  return (
    <div className='my-[100px] container mx-auto text-center'>
      <ScrollReveal
        baseOpacity={0.5}
        enableBlur
        baseRotation={4}
        blurStrength={6}
      >
{`At NetX, we don’t create events — we create experiences.

No pressure, no perfection, just people coming together to vibe, play, and be part of something real.

Whether it’s singing your heart out at a jam session or competing in a high-energy tournament, NetX is where strangers turn into a vibe.`}
      </ScrollReveal>

    </div>
  )
}

export default WhyNextX