import React, { Component } from 'react'
import axios from 'axios'
import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      displayComponent: 0,
      score: 0,
      initials: '',
      topScores: [],
      counter: 3,
      ywcounter: 9,
      flash: true,
      yorn: true,
      kup: 0,
      kdown: 0,
      kleft: 0,
      kright: 0,
      kb: 0,
      ka: 0,
      code: false
    }
    this.nextComponent = this.nextComponent.bind(this)
    this.addOne = this.addOne.bind(this)
    this.countdown = this.countdown.bind(this)
    this.resetCounters = this.resetCounters.bind(this)
    this.addInitials = this.addInitials.bind(this)
    this.topTen = this.topTen.bind(this)
    this.playAgain = this.playAgain.bind(this)
    this.ywcountdown = this.ywcountdown.bind(this)
    this.keypress = this.keypress.bind(this)
    this.escForCredits = this.escForCredits.bind(this)
    this.enterHome = this.enterHome.bind(this)
  }
  render() {

    const screen = [<Start next={this.nextComponent} kcode={this.state.code} credits={this.escForCredits} />,
    <Countdown next={this.nextComponent} cdown={this.state.counter} cdownFunc={this.countdown} />,
    <Add1 next={this.nextComponent} a1={this.addOne} />,
    <YouWin next={this.nextComponent} ywcdown={this.state.ywcounter} ywcdownFunc={this.ywcountdown} flash={this.state.flash} />,
    <EnterInitials next={this.nextComponent} addI={this.addInitials} />,
    <TopScores next={this.nextComponent} tScores={this.state.topScores} resetcdown={this.resetCounters} top10={this.topTen} pAgain={this.playAgain} yorn={this.state.yorn} />,
    <Credits eHome={this.enterHome} />]

    const display = this.state.displayComponent

    return (
      <div className="BlackBG">
        <div className="AddOne">
          {screen[display]}
        </div>
      </div>
    )
  }

  componentWillMount() {
    let fn = (e) => { this.keypress(e) }
    document.addEventListener('keydown', fn)
    const promiseGettopScores = axios.get('http://localhost:8080/topScores')
    promiseGettopScores.then((result) => {
      console.log('Woot! GETts')
      console.log(result.data)
      this.setState({
        topScores: result.data
      })
    }).catch((error) => {
      console.log('Boo! GETts')
      console.log(error)
    })
  }

  componentDidMount() {
    const promiseGetscore = axios.get('http://localhost:8080/score')
    promiseGetscore.then((result) => {
      console.log('Woot! GETs')
      console.log(result.data.savedScore)
      this.setState({
        score: result.data.savedScore
      })
    }).catch((error) => {
      console.log('Boo! GETs')
      console.log(error)
    })
  }


  nextComponent() {
    let first = 0
    let next = this.state.displayComponent + 1
    if (this.state.displayComponent === 5) {
      this.setState({
        displayComponent: first
      })
    } else (
      this.setState({
        displayComponent: next
      })
    )
  }

  escForCredits() {
    this.setState({
      displayComponent: 6
    })
  }

  enterHome() {
    this.setState({
      displayComponent: 0,
      code: false,
      kup: 0,
      kdown: 0,
      kleft: 0,
      kright: 0,
      kb: 0,
      ka: 0
    })
  }

  playAgain() {
    this.setState({
      displayComponent: 1
    })
  }

  countdown() {
    let countdown = setInterval(() => {
      this.setState({
        counter: this.state.counter - 1
      })
      // console.log(this.state.counter)
      if (this.state.counter < 0)
        clearInterval(countdown)
    }, 750)
  }

  ywcountdown() {
    let ywcountdown = setInterval(() => {
      this.setState({
        ywcounter: this.state.ywcounter - 1,
        flash: !this.state.flash
      })
      // console.log(this.state.ywcounter)
      if (this.state.ywcounter < 0)
        clearInterval(ywcountdown)
    }, 300)
  }

  resetCounters() {
    if (this.state.counter < 0)
      this.setState({
        counter: 3,
        ywcounter: 6,
        yorn: true,
        code: false,
        kup: 0,
        kdown: 0,
        kleft: 0,
        kright: 0,
        kb: 0,
        ka: 0
      })
  }

  addOne() {
    this.setState({
      score: this.state.score + 1
    })
  }

  addInitials(e) {
    e.preventDefault()
    let newScore = this.state.topScores
    let initials = document.getElementById('name').value.toUpperCase()
    if (initials.length === 0) {
      return
    } else {
      newScore.unshift({ name: initials, score: this.state.score })
      this.setState({
        topScores: newScore
      })
      if (this.state.topScores.length > 10) {
        this.state.topScores.pop()
      }
      const promisePosttopScores = axios.post('http://localhost:8080/topScores', { name: initials, score: this.state.score })
      promisePosttopScores.then((result) => {
        console.log('Woot! POST')
        console.log(result.data)
      }).catch((error) => {
        console.log('Boo! POST')
        console.log(error)
      })
      const promisePostscore = axios.post('http://localhost:8080/score', { savedScore: this.state.score })
      promisePostscore.then((result) => {
        console.log('Woot! POST')
        console.log(result.data)
      }).catch((error) => {
        console.log('Boo! POST')
        console.log(error)
      })
      this.nextComponent()
    }
  }

  keypress(e) {
    console.log(e.key)
    if ((e.keyCode === 38) && this.state.displayComponent === 0) {
      this.setState({
        kup: this.state.kup + 1
      })
    }
    if ((e.keyCode === 40) && this.state.displayComponent === 0) {
      this.setState({
        kdown: this.state.kdown + 1
      })
    }
    if ((e.keyCode === 37) && this.state.displayComponent === 0) {
      this.setState({
        kleft: this.state.kleft + 1
      })
    }
    if ((e.keyCode === 39) && this.state.displayComponent === 0) {
      this.setState({
        kright: this.state.kright + 1
      })
    }
    if ((e.keyCode === 66) && this.state.displayComponent === 0) {
      this.setState({
        kb: this.state.kb + 1
      })
    }
    if ((e.keyCode === 65) && this.state.displayComponent === 0) {
      this.setState({
        ka: this.state.ka + 1
      })
    }
    if (((this.state.kup + this.state.kdown + this.state.kleft + this.state.kright + this.state.kb + this.state.ka) === 10) && this.state.displayComponent === 0) {
      this.setState({
        code: true,
      })
    }
    if ((e.keyCode === 13) && this.state.displayComponent === 0) {
      this.nextComponent()
    }
    if ((e.key.length !== 0) && this.state.displayComponent === 2) {
      this.addOne()
      this.nextComponent()
    }
    if ((e.keyCode === 89) && this.state.displayComponent === 5) {
      this.playAgain()
      this.resetCounters()
    }
    if ((e.keyCode === 37) && this.state.displayComponent === 5) {
      this.setState({
        yorn: true
      })
      // console.log(this.state.yorn)
    }
    if ((e.keyCode === 39) && this.state.displayComponent === 5) {
      this.setState({
        yorn: false
      })
      // console.log(this.state.yorn)
    }
    if ((e.keyCode === 13) && this.state.displayComponent === 5 && this.state.yorn) {
      this.playAgain()
      this.resetCounters()
    }
    if ((e.keyCode === 13) && this.state.displayComponent === 5 && !this.state.yorn) {
      this.nextComponent()
      this.resetCounters()
    }
    if ((e.keyCode === 78) && this.state.displayComponent === 5) {
      this.nextComponent()
      this.resetCounters()
    }
    if ((e.keyCode === 27) && this.state.displayComponent === 0) {
      this.escForCredits()
    }
    if ((e.keyCode === 13) && this.state.displayComponent === 6) {
      this.enterHome()
    }
  }

  topTen() {
    let scores = []
    for (let i = 0; i < this.state.topScores.length; ++i) {
      scores.push(<tr><td className="Left">{this.state.topScores[i].name}</td>
        <td className="Right">{this.state.topScores[i].score}</td></tr>)
    }
    return scores
  }
}

class Start extends Component {
  render() {
    return (
      <div>
        <span className={this.props.kcode ? 'Add1TitleCode' : 'Add1Title'}>Add1</span><br />
        <p onClick={this.props.next} className="Add1Start">PRESS <span className='Add1StartEnter'>ENTER</span> TO START</p><br />
        <p className="Add1Credits" onClick={this.props.credits}>PRESS ESC FOR CREDITS</p>
      </div>
    )
  }

}

class Countdown extends Component {
  render() {
    let text = ['GO!', 1, 2, 3]
    let c = this.props.cdown
    return (
      <div>
        <p className="Add1Countdown">{text[c]}</p>
      </div>
    )
  }

  componentDidMount() {
    this.props.cdownFunc()
  }

  componentDidUpdate() {
    if (this.props.cdown < 0) {
      this.props.next()
    }
  }

}

class Add1 extends Component {
  render() {
    return (
      <div onClick={() => { this.props.next(); this.props.a1() }} >
        <p className="Add1Button">+1</p>
        <p className="Add1Click PressAnyKey">PRESS ANY KEY</p>
      </div>
    )
  }
}

class YouWin extends Component {
  render() {
    return (
      <div>
        <p onClick={this.props.next} className={this.props.flash ? "Add1YouWin" : "Add1YouWin Flash"}>YOU WIN!</p>
      </div>
    )
  }

  componentDidMount() {
    this.props.ywcdownFunc()
  }

  componentDidUpdate() {
    if (this.props.ywcdown < 0) {
      this.props.next()
    }
  }

}

class EnterInitials extends Component {
  render() {
    return (
      <div>
        <p onClick={this.props.next} className="Add1EnterName">ENTER NAME</p>
        <div>
          <form onSubmit={(e) => { this.props.addI(e) }}>
            <input type="text" id="name" name="name" maxLength="10" size="11" autoFocus pattern="[a-zA-Z0-9]{1,10}" title="LETTERS OR NUMBERS ONLY" /><br /><br />
            <button id="submit" type="submit" name="DONE" className="Add1Submit">DONE</button>
          </form>
        </div>
      </div>
    )
  }
}

class TopScores extends Component {
  render() {
    return (
      <div>
        <div className="Centered">
          <table >
            <tbody >
              <tr><td className="Left">NAME</td><td className="Right">SCORE</td></tr>
              {this.props.top10()}
            </tbody>
          </table>
        </div>
        <div>
          <br />
          <p>Play Again?</p>
          <p className="YesOrNo"><span onClick={() => { this.props.pAgain(); this.props.resetcdown() }} className={this.props.yorn ? "YORNSelected" : ''}>Y</span> / <span onClick={() => { this.props.next(); this.props.resetcdown() }} className={!this.props.yorn ? "YORNSelected" : ''}>N</span> ?</p><br />
        </div>
      </div>
    )
  }
}

class Credits extends Component {
  render() {
    return (
      <div className="Add1CreditsPage">
        <p className="RollCredits">
          <span className="Add1CreditsPageThankYou">THANK YOU FOR<br />PLAYING ADD1</span><br /><br />
          <span className="Add1CreditsPageParagraph">
            <p>THIS GAME WAS CREATED AS PART OF THE
          WEB DEVELOPMENT FULL TIME (WDFT) PROGRAM
          AT BRAINSTATION TORONTO
          DURING THE SUMMER OF 2017</p>
            <p>SPECIAL THANKS TO IAN, JONATHAN, MARC,
          DAN, ALICE, WILL AND ALL THE WONDERFUL
          STAFF THAT MADE THE EXPERIENCE
          UNFORGETABLE</p>
            <p>THANK YOU TO ALL MY CLASSMATES
          FOR YOUR HELP AND SUPPORT AND I HOPE
          WE ALL GET JOBS!</p></span><br />
          <p className="SayHello">
            <span className="Add1CreditsPageEmail">SAY HELLO!<br />THEOTHERJONJANES<br />AT ICLOUD DOT COM</span><br />
            <span className="Add1CreditsPageEnterHome EnterHomeFlash" onClick={this.props.eHome}>PRESS ENTER TO RETURN HOME</span></p>
        </p>
      </div>
    )
  }
}

export default App;