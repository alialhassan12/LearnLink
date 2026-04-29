import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { ThemeToggle } from './components/ThemeToggle'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=''>
      <div className="flex items-center justify-center">
        <ThemeToggle />
      </div>
      <div className=" text-text-strong text-2xl ">
        Hello LearnLink
      </div>
      <p className='text-text-weak'>Hello LearnLink</p>
    </div>
  )
}

export default App
