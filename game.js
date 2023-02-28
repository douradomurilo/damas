var board = document.getElementById('board');
var deleteablePieces = [];
var nonPlayable = [];

var game = {
    colors: ['black', 'white'],
    activeColor: 'white',
    cells: function () {
        let cellClass = 'even';

        for (let x = 0; x < 8; x++) {
            cellClass = cellClass == 'even' ? 'odd' : 'even';

            for (let y = 0; y < 8; y++) {
                let cell = document.createElement('div');
                
                cell.className = cellClass; 
                board.appendChild(cell);

                cellClass = cellClass == 'even' ? 'odd' : 'even';
            }    
        }
    },
    pieces: function () {
        let oddCells = document.getElementsByClassName('odd');
        
        for (let i = 0; i < 12; i++) {
            let piece = document.createElement('div');
            piece.className = 'piece black up disabled';
            oddCells[i].appendChild(piece);
        }

        for (let i = 20; i < 32; i++) {
            let piece = document.createElement('div');
            piece.className = 'piece white down';
            oddCells[i].appendChild(piece);
        }

        game.pieceActions();
    },
    pieceActions: function () {
        let pieces = document.getElementsByClassName('piece');
        
        for (let i = 0; i < pieces.length; i++) {
            
            let piece = pieces[i];

            if (!piece.classList.contains('disabled')) {
                piece.onclick = function () {
                
                    if (!piece.classList.contains('selected')) {
                        game.clearPlayable();

                        let selected = document.getElementsByClassName('selected')[0];
                        
                        if (selected) {
                            selected.classList.remove('selected');
                        }
                        
                        piece.classList.add('selected');
                        
                        let cell = piece.parentNode;
                        let cellIndex = Array.prototype.indexOf.call(board.children, cell);
                        game.capture(cellIndex);

                        if (!deleteablePieces.length) {
                            game.pieceMoves(piece);
                        }

                        game.cellActions();
                    }
                };
            } else {
                piece.onclick = null;
            }
        }
    },
    pieceMoves: function (piece) {
        let cell = piece.parentNode;
        let cellIndex = Array.prototype.indexOf.call(board.children, cell);

        game.capture(cellIndex);

        const possibleMoves = {
            down: [-7, -9],
            up: [7, 9] 
        };

        Object.entries(possibleMoves).forEach(([upOrDown, moves]) => {    
            if (piece.classList.contains(upOrDown)) {
                moves.forEach(move => {
                    let newIndex = cellIndex + move;
                    
                    if (board.children[newIndex] && board.children[newIndex].classList.contains('odd') && !board.children[newIndex].hasChildNodes()) {
                        board.children[newIndex].classList.add('playable');
                    }
                });
            }
        });
    },
    capture: function (cellIndex) {
        let possibleMoves = [-7, -9, 7, 9];

        possibleMoves.forEach(move => {
            let newIndex = cellIndex + move;
            
            if (!nonPlayable.includes(newIndex)) {
                if (board.children[newIndex] && board.children[newIndex].classList.contains('odd') && board.children[newIndex].hasChildNodes()) {
                    if (!board.children[newIndex].firstChild.classList.contains(game.activeColor)) {
                        let adversaryPieceIndex = Array.prototype.indexOf.call(board.children, board.children[newIndex]);
                        newIndex = (adversaryPieceIndex + move);

                        if (board.children[newIndex] && board.children[newIndex].classList.contains('odd') && !board.children[newIndex].hasChildNodes()) {
                            deleteablePieces.push([adversaryPieceIndex, newIndex]);
                            nonPlayable.push(adversaryPieceIndex);
                            board.children[newIndex].classList.add('playable');
                            game.capture(newIndex);
                        }
                    }
                }
            }
        });

        game.nonPlayable = [];
    },
    cellActions: function () {
        let playable = document.getElementsByClassName('playable');
        
        for (let i = 0; i < playable.length; i++) {
            playable[i].onclick = function () {
                let selected = document.getElementsByClassName('selected')[0];
                playable[i].appendChild(selected);
                
                if (deleteablePieces.length) {
                    let newIndex = Array.prototype.indexOf.call(board.children, playable[i]);
                    
                    deleteablePieces.forEach((deleteablePiece, index) => {
                        if (newIndex == deleteablePiece[1]) {
                            board.children[deleteablePiece[0]].firstChild.remove();
                            deleteablePieces.splice(index, 1);
                        }
                    });
                }

                if (!deleteablePieces.length) {
                    selected.classList.remove('selected');
                    game.clearPlayable();
                    game.changeColor();
                }
                
                game.pieceActions();
            }
        }
    },
    changeColor: function () {
        let active = document.getElementsByClassName(game.activeColor);
        
        for (let i = 0; i < active.length; i++) {
            active[i].classList.add('disabled');
        }

        game.activeColor = game.activeColor == 'white' ? 'black' : 'white';

        let inactive = document.getElementsByClassName(game.activeColor);

        for (let i = 0; i < inactive.length; i++) {
            inactive[i].classList.remove('disabled');
        }

        document.getElementById('activeColor').innerHTML = game.activeColor.charAt(0).toUpperCase() + game.activeColor.slice(1) + '!';
    },
    clearPlayable: function () {
        let playable;

        while (playable = document.getElementsByClassName('playable')[0]) {
            playable.classList.remove('playable');
            playable.onclick = null;
        }
    }
}

game.cells();
game.pieces();