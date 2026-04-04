import React from 'react'
import InfiniteMenu from './UI/InfiniteMenu';


const items = [
  {
    image: '/logo.png',
    link: '/new#home',
    title: 'NetX',
    description: 'Not Events. Experiences.'
  },
];

export const InfiniteImages = () => {
  return (
   <div style={{ height: '600px', position: 'relative' }}>
  <InfiniteMenu items={items}
    scale={1}
/>
</div>
  )
}
