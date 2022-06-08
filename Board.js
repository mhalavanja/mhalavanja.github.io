class Board {
    constructor(modalW, modalB, topOffset) {
        this.topOffset =topOffset
        this.wPieces = this.startPieces(0)
        this.bPieces = this.startPieces(1)
        this.wAttackingSquares = this.getAttackingSquares(0)
        this.bAttackingSquares = this.getAttackingSquares(1)
        this.turn = 0
        this.wKing
        this.bKing
        this.lastMovedPiece
        this.modalW = modalW
        this.modalB = modalB
    }

    getMovingPiece(square) {
        if (this.turn === 0) {
            return this.wPieces[square]
        }
        else if (this.turn === 1) {
            return this.bPieces[square]
        }
    }

    showMovingPiece(movingPiece, mouseX, mouseY) {
		movingPiece.showImage = false
		movingPiece.moveImage(mouseX, mouseY)
    }

    changeTurn() {
        this.turn = (this.turn + 1) % 2
    }

    startPieces(player){
        let pieces = {}
        let pawnsRow = player === 0 ? 1 : 6
        let piecesRow = player === 0 ? 0 : 7
        let kSideRook = new Rook(0, piecesRow, player, this)
        let qSideRook = new Rook(7, piecesRow, player, this)
        let king = new King(3, piecesRow, player, this)
        king.kSideRook = kSideRook
        king.qSideRook = qSideRook
        player === 0 ? this.wKing = king : this.bKing = king

        for (let i = 0; i < 8; i++) {
            pieces[i + ' ' + pawnsRow] = new Pawn(i, pawnsRow, player, this)
        }

        pieces[0 + ' ' + piecesRow] = kSideRook
        pieces[1 + ' ' + piecesRow] = new Knight(1, piecesRow, player, this)
        pieces[2 + ' ' + piecesRow] = new Bishop(2, piecesRow, player, this)
        pieces[3 + ' ' + piecesRow] = king
        pieces[4 + ' ' + piecesRow] = new Queen(4, piecesRow, player, this)
        pieces[5 + ' ' + piecesRow] = new Bishop(5, piecesRow, player, this)
        pieces[6 + ' ' + piecesRow] = new Knight(6, piecesRow, player, this)
        pieces[7 + ' ' + piecesRow] = qSideRook

        return pieces
    }

    isOpponnentKingSquare(square, player) {
        let sq
        if (player === 0) 
        {
            sq = this.bKing.square
        } else
        {
            sq = this.wKing.square
        }
        return square === sq
    }

    getAttackingSquares(player) {
        let pieces = player === 0 ? this.wPieces : this.bPieces
        let squares = new Set()
        
        for (const [square, piece] of Object.entries(pieces)) {
            piece.getAttackingSquares().forEach(squares.add, squares)
        }

        return Array.from(squares)
    }

    isEmptySquare(square) {
        return !(square in this.wPieces) && !(square in this.bPieces)
    }

    isAttackableSquare(square, player) {
        if (player === 0) return !(square in this.wPieces)
        if (player === 1) return !(square in this.bPieces)
    }

    isPlayableSquare(square, player) {
        if (player === 0) {
            return !(square in this.wPieces)
        }
        else if (player === 1) {
            return !(square in this.bPieces)
        }
    }

    makeMove(movingPiece, square) {
        movingPiece.showImage = true
        let activePieces = this.getActivePieces()
        let [x, y] = square.split(' ')
		x = int(x)
		y = int(y)

		if(movingPiece.canMoveTo(x, y, square) 
            && !this.isCausingSelfCheck(movingPiece, x, y, square)
        ) {
            if (movingPiece instanceof Pawn) {
                if (this.turn === 0 && movingPiece.y === 1 && y === 3) movingPiece.enPassant = true
                else if (this.turn === 1 && movingPiece.y === 6 && y === 4) movingPiece.enPassant = true
                movingPiece.checkEnPassant(x, y, true)
            }
            delete activePieces[movingPiece.square]
			movingPiece.setSquare(x, y, square)
            if(!this.checkPawnToPieceChange(movingPiece)){
			    this.changeTurn();
            }
            this.wAttackingSquares = this.getAttackingSquares(0)
            this.bAttackingSquares = this.getAttackingSquares(1)
            this.setCheck()
            this.isGameOver()
            if (this.lastMovedPiece instanceof Pawn) this.lastMovedPiece.enPassant = false
            this.lastMovedPiece = movingPiece
		}
    }

    isGameOver() {
        let result = -1
        let activePieces = this.getActivePieces()
        let activeKing = this.getActiveKing()
        if (this.isThreeFoldRepetition() || this.isStaleMate(activeKing, activePieces)) result = 1/2
        if (this.isCheckMate(activeKing, activePieces)) result = this.turn === 1 ? 0 : 1
        switch(result){
            case 0:
                document.getElementById("matBijeli").style.display = "block";
                break;
            case 1:
                document.getElementById("matCrni").style.display = "block";
                break;
            case 1/2:
                document.getElementById("pat").style.display = "block";
                break;
            default:
                return;
        }
    }

    isCheckMate(activeKing, activePieces) {
        return activeKing.inCheck && !this.isTherePossibleMove(activePieces)
    }

    isStaleMate(activeKing, activePieces) {
        return !this.isTherePossibleMove(activePieces) && !activeKing.inCheck
    }

    // Ovu metodu ne moramo raditi jer u "over the board" sahu, nece nitko automatski zaustaviti igru ako se ovo dogodi
    isThreeFoldRepetition() {
        return false
    }

    isTherePossibleMove(activePieces) {
        for (const [_, piece] of Object.entries(activePieces)) {
            let attackingSquares = piece.getAttackingSquares()
            if (piece instanceof Pawn) {
                let direction = this.turn === 0 ? 1 : -1
                let xL = piece.x - 1
                let xR = piece.x + 1
                let y = piece.y + direction
                if ( (piece.checkEnPassant(xL, y) && !this.isCausingSelfCheck(piece, xL, y, xL+" "+y)) ||
                     (piece.checkEnPassant(xR, y) && !this.isCausingSelfCheck(piece, xR, y, xR+" "+y)) ) {
                    return true
                }
            }
            for (let square of attackingSquares) {
                let xy = square.split(" ")
                let x,y;
                x = int(xy[0])
                y = int(xy[1])
                if (piece.canMoveTo(x, y, square)  && !this.isCausingSelfCheck(piece, x, y, square)) {
                    return true
                }
            }
        }
        return false
    }

    checkPawnToPieceChange(movingPiece){
        if (!(movingPiece instanceof Pawn)){
            return false
        }
        let lastRow, modal
        if (this.turn === 0) {
            lastRow = 7
            modal = this.modalW
        }
        else if (this.turn === 1) {
            lastRow = 0
            modal = this.modalB
        }
        if(movingPiece.y != lastRow){
            return false
        }
        modal.style.display = "block"	
        return true
    }
    
    isCausingSelfCheck(movingPiece, x, y, square) {
        let oldX = movingPiece.x
        let oldY = movingPiece.y
        let oldSquare = movingPiece.square
        let opponentAttackingSquares, kingSquare
        let deletedPiece

        deletedPiece = movingPiece.setSquare(x, y, square, false)
        
        if (this.turn === 0) {
            opponentAttackingSquares = this.getAttackingSquares(1)
            kingSquare = this.wKing.square
        }
        else if (this.turn === 1) {
            opponentAttackingSquares = this.getAttackingSquares(0)
            kingSquare = this.bKing.square
        }

        movingPiece.setSquare(oldX, oldY, oldSquare, false)
        if(deletedPiece){
            if(deletedPiece.player == 0){
                this.wPieces[square] = deletedPiece;
                this.wPieces[square].showImage = true;
            } else{
                this.bPieces[square] = deletedPiece;
                this.bPieces[square].showImage = true;
            }
        }
        if (opponentAttackingSquares.includes(kingSquare)) {
            return true
        }
        return false
    }

    setCheck() {
        let activeKing = this.getActiveKing()
        let activeKingSquare = activeKing.square
        let opponentAttackingSquares = this.turn === 0 ? this.bAttackingSquares : this.wAttackingSquares
        if (opponentAttackingSquares.includes(activeKingSquare)) {
            activeKing.inCheck = true
        } else {
            activeKing.inCheck = false
        }
    }

    getActivePieces() {
        if (this.turn === 0) return this.wPieces
        else if (this.turn === 1) return this.bPieces
    }

    getActiveKing() {
        if (this.turn === 0) return this.wKing
        else if (this.turn === 1) return this.bKing
    }

    getOpponentPieces(player) {
        if (player === 0) return this.bPieces
        else if (player === 1) return this.wPieces
    }

    show() {
        let boja
        stroke(0)
        strokeWeight(2)

        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 9; i++) {
                if((i + j) % 2 == 0) {
                    boja = color(255, 255, 200)
                }
                else {
                    boja = color(177, 38, 0)
                }
                fill(boja)
                rect(i * squareSize, j * squareSize, squareSize, squareSize)
            }
        }

        for (const [_, piece] of Object.entries(this.wPieces)) {
            piece.show()
        }

        for (const [_, piece] of Object.entries(this.bPieces)) {
            piece.show()
        }
    }
}