import {
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import './App.css'

import Portrait from './components/Portrait'
import { dragListener } from './utility/dragListener'

const App = () => {
  const [isLandscape, setIsLandscape] = useState(false)
  const [players, editPlayers] = useState([
    { pName: 'P1', score: 0, serve: true, firstServe: true, win: false },
    { pName: 'P2', score: 0, serve: false, firstServe: false, win: false },
  ])
  const isChangeCourt = useRef(false)

  const manageScore = {
    add: (pi: number) => {
      const score = players[pi].score + 1
      editPlayers(prev => prev.map((v, i) => (i === pi ? { ...v, score } : v)))
    },
    minus: (pi: number) => {
      const score = players[pi].score - 1
      if (score < 0) return
      editPlayers(prev => prev.map((v, i) => (i === pi ? { ...v, score } : v)))
    },
  }

  const changeServe = (firstServe = false) => {
    editPlayers(prev => prev.map(v => ({ ...v, serve: !v.serve })))

    if (firstServe)
      editPlayers(prev => prev.map(v => ({ ...v, firstServe: !v.firstServe })))
  }

  const handleChangeCourt = (e: SyntheticEvent) => {
    //spin logo
    const ele = e.currentTarget as HTMLButtonElement
    ele.classList.add('spin-360')
    setTimeout(() => ele.classList.remove('spin-360'), 150)

    isChangeCourt.current = true

    editPlayers(prev => structuredClone(prev).reverse())
  }

  const checkForWin = () => {
    //Race to 11
    const p1Score = players[0].score
    const p2Score = players[1].score

    if (p1Score > 10 && p1Score > p2Score + 1) {
      editPlayers(prev =>
        prev.map((v, i) => (i === 0 ? { ...v, win: true } : v))
      )
    } else if (players[0].win) {
      editPlayers(prev =>
        prev.map((v, i) => (i === 0 ? { ...v, win: false } : v))
      )
    }

    if (p2Score > 10 && p2Score > p1Score + 1) {
      editPlayers(prev =>
        prev.map((v, i) => (i === 1 ? { ...v, win: true } : v))
      )
    } else if (players[1].win) {
      editPlayers(prev =>
        prev.map((v, i) => (i === 1 ? { ...v, win: false } : v))
      )
    }
  }

  useEffect(() => {
    if (!isChangeCourt.current) {
      //put logic around heree
      const sum = players[0].score + players[1].score

      if (!(sum % 2)) {
        const devide = sum / 2

        if (!(devide % 2) && sum !== 2) {
          //EVEN
          if (players[0].firstServe && !players[0].serve) changeServe()
          if (players[1].firstServe && !players[1].serve) changeServe()
        } else {
          //ODD
          if (players[0].firstServe && players[0].serve) changeServe()
          if (players[1].firstServe && players[1].serve) changeServe()
        }
      }
    } else {
      isChangeCourt.current = false
    }

    //Allow Change on Drag if score is 0 0
    if (players[0].score > 0 || players[1].score > 0) {
      dragListener()
    } else {
      dragListener(changeServe)
    }

    checkForWin()
  }, [players[0].score, players[1].score])

  useEffect(() => {
    if (players[0].win) {
    }

    //RESET
  }, [players[0].win, players[1].win])

  useLayoutEffect(() => {
    // WINDOW MEDIA HANDLER

    const windowMedia = window.matchMedia('(orientation: landscape)')

    windowMedia.addEventListener('change', e => {
      const v = e.matches
      setIsLandscape(v)
    })

    document.body.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) {
        document.body.requestFullscreen()
        navigator.wakeLock.request('screen')
      }
    })

    setIsLandscape(windowMedia.matches)
  }, [])

  return (
    <>
      {isLandscape ? (
        <>
          <section className='relative flex-center select-none'>
            <button
              onClick={handleChangeCourt}
              className='absolute z-100 transition-transform rounded-full bg-black p-1'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                x='0px'
                y='0px'
                width='60'
                height='60'
                viewBox='0 0 50 50'
                fill='#ffffff'
              >
                <path d='M 25 5 C 14.351563 5 5.632813 13.378906 5.054688 23.890625 C 5.007813 24.609375 5.347656 25.296875 5.949219 25.695313 C 6.550781 26.089844 7.320313 26.132813 7.960938 25.804688 C 8.601563 25.476563 9.019531 24.828125 9.046875 24.109375 C 9.511719 15.675781 16.441406 9 25 9 C 29.585938 9 33.699219 10.925781 36.609375 14 L 34 14 C 33.277344 13.988281 32.609375 14.367188 32.246094 14.992188 C 31.878906 15.613281 31.878906 16.386719 32.246094 17.007813 C 32.609375 17.632813 33.277344 18.011719 34 18 L 40.261719 18 C 40.488281 18.039063 40.71875 18.039063 40.949219 18 L 44 18 L 44 8 C 44.007813 7.460938 43.796875 6.941406 43.414063 6.558594 C 43.03125 6.175781 42.511719 5.964844 41.96875 5.972656 C 40.867188 5.988281 39.984375 6.894531 40 8 L 40 11.777344 C 36.332031 7.621094 30.964844 5 25 5 Z M 43.03125 23.972656 C 41.925781 23.925781 40.996094 24.785156 40.953125 25.890625 C 40.488281 34.324219 33.558594 41 25 41 C 20.414063 41 16.304688 39.074219 13.390625 36 L 16 36 C 16.722656 36.011719 17.390625 35.632813 17.753906 35.007813 C 18.121094 34.386719 18.121094 33.613281 17.753906 32.992188 C 17.390625 32.367188 16.722656 31.988281 16 32 L 9.71875 32 C 9.507813 31.96875 9.296875 31.96875 9.085938 32 L 6 32 L 6 42 C 5.988281 42.722656 6.367188 43.390625 6.992188 43.753906 C 7.613281 44.121094 8.386719 44.121094 9.007813 43.753906 C 9.632813 43.390625 10.011719 42.722656 10 42 L 10 38.222656 C 13.667969 42.378906 19.035156 45 25 45 C 35.648438 45 44.367188 36.621094 44.945313 26.109375 C 44.984375 25.570313 44.800781 25.039063 44.441406 24.636719 C 44.078125 24.234375 43.570313 23.996094 43.03125 23.972656 Z'></path>
              </svg>
            </button>

            <div className='absolute bg-white w-0.5 h-full'></div>

            {players.map((v, i) => (
              <div
                key={i}
                className={
                  'relative flex-1 flex-center h-dvh transition-colors ' +
                  (v.serve ? 'bg-red-500/20' : '')
                }
              >
                <h2 className='absolute top-2 text-3xl font-semibold w-50 text-center outline-none'>
                  {v.pName}
                </h2>

                <div className=' flex-center flex-col gap-2'>
                  <h1
                    onClick={() => manageScore.add(i)}
                    className={
                      'text-[10rem] font-bold transition-colors ' +
                      (players[i].win ? 'text-green-600' : '')
                    }
                  >
                    {v.score}
                  </h1>

                  <button
                    onClick={() => manageScore.minus(i)}
                    className='[&>svg]:size-8 opacity-60'
                  >
                    <svg
                      fill='#ffffff'
                      height='200px'
                      width='200px'
                      version='1.1'
                      id='Capa_1'
                      xmlns='http://www.w3.org/2000/svg'
                      xmlnsXlink='http://www.w3.org/1999/xlink'
                      viewBox='0 0 330 330'
                      xmlSpace='preserve'
                    >
                      <g
                        id='SVGRepo_bgCarrier'
                        strokeWidth='0'
                      ></g>
                      <g
                        id='SVGRepo_tracerCarrier'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      ></g>
                      <g id='SVGRepo_iconCarrier'>
                        {' '}
                        <g>
                          {' '}
                          <path d='M281.633,48.328C250.469,17.163,209.034,0,164.961,0C120.888,0,79.453,17.163,48.289,48.328 c-64.333,64.334-64.333,169.011,0,233.345C79.453,312.837,120.888,330,164.962,330c44.073,0,85.507-17.163,116.671-48.328 c31.165-31.164,48.328-72.599,48.328-116.672S312.798,79.492,281.633,48.328z M260.42,260.46 C234.922,285.957,201.021,300,164.962,300c-36.06,0-69.961-14.043-95.46-39.54c-52.636-52.637-52.636-138.282,0-190.919 C95,44.042,128.901,30,164.961,30s69.961,14.042,95.459,39.54c25.498,25.499,39.541,59.4,39.541,95.46 S285.918,234.961,260.42,260.46z'></path>{' '}
                          <path d='M254.961,150H74.962c-8.284,0-15,6.716-15,15s6.716,15,15,15h179.999c8.284,0,15-6.716,15-15S263.245,150,254.961,150z'></path>{' '}
                        </g>{' '}
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </section>
        </>
      ) : (
        <Portrait />
      )}
    </>
  )
}

export default App
