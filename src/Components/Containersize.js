import { useState, useEffect, useRef } from 'react'

export const useContainerSize = () => {
  const ref = useRef()
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return //if somehow ref isn't connected yet, just exit early
    //Create a ResizeObserver (built-in browser API that watches a DOM element for size changes)
    const observer = new ResizeObserver(entries => { 
      for (let entry of entries) { //when the observer triggers, it returns an array of entries (entries), each entry corresponds to a different element being observed
        setSize({
          width: entry.contentRect.width
        });
      }
    })
    observer.observe(ref.current) //Start watching the container
    return () => observer.disconnect() //Cleanup when unmounting
  }, [])

  return [ref, size]
}