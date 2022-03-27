import { useState, useEffect, useRef } from 'react';
import './App.css';
import Flag from "./img/flag.png"
import MineRed from "./img/mine.png"

const minesPercentage = 20;

function App() {
  const [mines, setMines] = useState(5)
  const [minesArr, setMinesArr] = useState([])
  const [flagsArr, setFlagsArr] = useState(new Array(mines * mines).fill(false))
  const [openMinesArr, setOpenMinesArr] = useState(new Array(mines * mines).fill(false))
  const [score, setScore] = useState(0)
  const [timeCounter, setTimeCounter] = useState(0);
  var timeoutId = useRef(null);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  /**
   * Generate new game board. 
   *  - generate mine filed. Mine propabilitybased on minesPercentage. 
   *    If generated number [0-100] is below minesPercentage, mine will be added
   *  - count number on other fields. Number on filed represet with how many mines is bordered
   */
  const createGameBoard = () => {
    const randomMinesArr = [];

    for (let i = 0; i < mines * mines; i++) {
      if ((Math.random() * 100) < minesPercentage) {
        randomMinesArr.push('m')
      } else {
        randomMinesArr.push(0)
      }
    }

    //TODO: add additional if on edge. Dont add to last when mine in first col, and dont add to last when mine in first
    for (let randomMine = 0; randomMine < randomMinesArr.length; randomMine++) {
      if (randomMinesArr[randomMine] === 'm') {

        //above
        if (randomMinesArr[randomMine + mines] !== undefined && randomMinesArr[randomMine + mines] !== 'm') randomMinesArr[randomMine + mines]++
        //below
        if (randomMinesArr[randomMine - mines] !== undefined && randomMinesArr[randomMine - mines] !== 'm') randomMinesArr[randomMine - mines]++

        if (randomMine % mines !== mines) {
          //left
          if (randomMinesArr[randomMine - 1] !== undefined && randomMinesArr[randomMine - 1] !== 'm') randomMinesArr[randomMine - 1]++
          //above - left
          if (randomMinesArr[randomMine + mines - 1] !== undefined && randomMinesArr[randomMine + mines - 1] !== 'm') randomMinesArr[randomMine + mines - 1]++
          //below - left
          if (randomMinesArr[randomMine - mines - 1] !== undefined && randomMinesArr[randomMine - mines - 1] !== 'm') randomMinesArr[randomMine - mines - 1]++
        }

        if (randomMine % mines !== mines - 1) {
          //right
          if (randomMinesArr[randomMine + 1] !== undefined && randomMinesArr[randomMine + 1] !== 'm') randomMinesArr[randomMine + 1]++
          //above - right
          if (randomMinesArr[randomMine + mines + 1] !== undefined && randomMinesArr[randomMine + mines + 1] !== 'm') randomMinesArr[randomMine + mines + 1]++
          //below - right
          if (randomMinesArr[randomMine - mines + 1] !== undefined && randomMinesArr[randomMine - mines + 1] !== 'm') randomMinesArr[randomMine - mines + 1]++
        }


      }
    }

    setMinesArr(randomMinesArr)
  }

  /**
   * Action to be performed when setting the flag on the field (Right Click action)
   * @param {*} e 
   */
  const flagMine = (e) => {
    e.preventDefault()
    let id = parseInt(e.target.getAttribute('data-id'))
    flagsArr[id] = !flagsArr[id]
    if (flagsArr[id]) {
      setScore(score + 1)
    } else {
      setScore(score - 1)
    }
    setFlagsArr([...flagsArr])

  }

  /**
   * Action to be performed when opening the field (Left Click action)
   * @param {Event} e 
   */
  const openField = (e) => {
    let id = parseInt(e.target.getAttribute('data-id'))
    openMinesArr[id] = !openMinesArr[id]
    setOpenMinesArr([...openMinesArr])

    //if open mine, end game
    if (minesArr[id] === 'm') {
      endGame()
    }
  }

  /**
   * Execute when game reset
   */
  const resetGame = () => {
    setFlagsArr(new Array(mines * mines).fill(false)) //cleare flags array
    setOpenMinesArr(new Array(mines * mines).fill(false)) //clear open field array
    setScore(0) //reset score board
    setTimeCounter(0) //reset time counter
    clearTimeout(timeoutId.current) //remove setTimeout to prevent multiple counters
    createGameBoard() // generate new game
  }

  /**
   * Execute when end of game. Open all fields
   */
  const endGame = () => {
    setOpenMinesArr(new Array(mines * mines).fill(true))
  }

  const zeroPad = (num, places) => String(num).padStart(places, '0')

  /**
   * Create new game on page load
   */
  useEffect(() => {
    createGameBoard();
  }, [])

  /**
   * Start counting time
   */
  useEffect(() => {
    timeoutId.current = setTimeout(() => setTimeCounter(timeCounter + 1), 1000);
  }, [timeCounter]);


/**
 *  Function to draw single game field (box with mine,number,flag or empty)
 * @param {Number} index filed index
 * @param {*} mine Number or 'm' 
 * @returns 
 */
  const drawField = (index, mine) => {
    if (flagsArr[index]) {
      return <img key={index} alt='f' data-id={index} src={Flag} onContextMenu={flagMine} />
    }
    if (openMinesArr[index]) {
      if (mine === 'm') {
        return <img key={index} alt='m' data-id={index} src={MineRed} onContextMenu={(e) => { e.preventDefault() }} />
      } else {
        return <div key={index} className={`mine open type${mine}`} data-id={index} onContextMenu={(e) => { e.preventDefault() }} >{mine ? mine : ''} </div>
      }

    }
    return <div key={index} className='mine' data-id={index} onContextMenu={flagMine} onClick={openField} />
  }


  return (
    <div className="app">
      <div className='score-bar' style={{ width: (mines * 26) }}>
        <div className='time column'>{zeroPad(timeCounter, 4)}</div>
        <button className='reset-game column' onClick={resetGame}>Reset</button>
        <div className='score column'>{score}/{minesArr.filter(x => x === 'm').length}</div>
      </div >

      <div className='mine-filed' style={{ width: (mines * 26), height: (mines * 26) }}>
        {minesArr.map((mine, index) => (
          drawField(index, mine)

        ))}
      </div>
    </div>
  );
}

export default App;
