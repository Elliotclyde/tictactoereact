function Square({
  onClick,
  value,
  lightUp
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: lightUp ? "square lightup" : "square",
    onClick: onClick
  }, value);
}

function renderSquare({
  squares,
  onClick,
  i,
  lightUp
}) {
  return /*#__PURE__*/React.createElement(Square, {
    key: i,
    value: squares[i],
    lightUp: lightUp,
    onClick: () => onClick(i)
  });
}

function Board(props) {
  return /*#__PURE__*/React.createElement("div", null, [0, 1, 2].map(n => /*#__PURE__*/React.createElement("div", {
    key: n,
    className: "board-row"
  }, [0 + n * 3, 1 + n * 3, 2 + n * 3].map(function (i) {
    if (props.winningSquares && props.winningSquares.includes(i)) {
      return renderSquare({
        i: i,
        lightUp: true,
        ...props
      });
    } else {
      return renderSquare({
        i: i,
        lightUp: false,
        ...props
      });
    }
  }))));
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        change: -1
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      change: i,
      history: history.concat([{
        squares: squares,
        change: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    if (winner) {
      status = "The winner is: " + winner.winner;
    } else {
      if (!current.squares.includes(null)) {
        status = "That's a draw!";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    const moves = history.map((step, move) => {
      const wasX = move % 2 !== 0;
      const desc = move ? "Go to move #" + move + ": " + getTurnDescription(step.change, wasX) : "Go to game start";
      let movesClass = "moves";

      if (move === this.state.stepNumber) {
        movesClass = movesClass + " moves-bold";
      }

      if (winner && move === history.length - 1) {
        movesClass = movesClass + " moves-gold";
      }

      return /*#__PURE__*/React.createElement("li", {
        className: "movecont",
        key: move
      }, /*#__PURE__*/React.createElement("button", {
        className: movesClass,
        onClick: () => this.jumpTo(move)
      }, desc));
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "game"
    }, /*#__PURE__*/React.createElement("div", {
      className: "game-board"
    }, /*#__PURE__*/React.createElement(Board, {
      squares: current.squares,
      winningSquares: winner ? winner.winningSquares : null,
      onClick: i => this.handleClick(i)
    })), /*#__PURE__*/React.createElement("div", {
      className: "game-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "status"
    }, status), /*#__PURE__*/React.createElement("ol", null, moves)));
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(Game, null), document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i]
      };
    }
  }

  return null;
}

function getTurnDescription(index, wasX) {
  const xory = wasX ? "X" : "O";
  const indexToColumns = {
    0: "column 1, row 1",
    1: "column 2, row 1",
    2: "column 3, row 1",
    3: "column 1, row 2",
    4: "column 2, row 2",
    5: "column 3, row 2",
    6: "column 1, row 3",
    7: "column 2, row 3",
    8: "column 3, row 3"
  };
  return xory + " on " + indexToColumns[index];
}