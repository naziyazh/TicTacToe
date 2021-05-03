import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { //changed to function since it doesn't have its own state
      return (
        <button className="square" 
                onClick = {props.onClick}>
          {props.value}
        </button>
      );
  }

  function Restart(props){
    return (
      <button className = "restart"
              onClick = {props.onClick}>
                Restart Game
      </button>
    );
  }
  
  class Board extends React.Component{
    renderSquare(i) {
      return <Square value = {this.props.squares[i]} onClick = {() => this.props.onClick(i)}/>;
    }
    render(){
      return (
        <div>
          <div className="status"></div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{squares: Array(9).fill(null)}],
        xIsNext: true,
        stepNumber: 0
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const xIsNext = this.state.xIsNext;

      if (calculateWinner(squares) || squares[i])
        return;
      squares[i] = xIsNext ? 'X' : 'O';
      this.setState({history: history.concat([{squares: squares}]),
                     xIsNext: !xIsNext,
                    stepNumber: history.length});
    }

    jumpTo(step){
      const new_history = this.state.history.slice(0, step + 1);
      this.setState({stepNumber: step, 
                    xIsNext: step % 2 == 0,
                    history: new_history});
    }


    renderRestart(){
      return <Restart onClick = {() => this.restartGame()} />;
    }

    restartGame(){
      const squares = Array(9).fill(null);
      this.setState({history: [{squares: Array(9).fill(null)}],
      xIsNext: true,
      stepNumber: 0});
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      let status;
      //array.map(function(currentValue, index, arr), thisValue)
      const moves = history.map((step, move)=> {
        const desc = (move != -1) ? "Go to move #" + move : "Go to the start";
        return(
          <li key = {move}>
            <button class = "history" onClick = {() => this.jumpTo(move)}> {desc} </button>
          </li>
        );
      });

      if (winner != null){
        status = 'The winner is ' + winner;
       }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div>
            <div className="game">
            <div className="game-board">
              <Board squares = {current.squares} onClick = {(i) => this.handleClick(i)}/>
            </div>
            
            <div className="game-info">
              <div>{status}</div>
              <div>{this.renderRestart()}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        </div>

      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  