class Pawn extends Piece {
    constructor (x, y, player, board) {
        super(x, y, player, board)
        this.enPassant = false
        if(player === 0) this.img = loadImage('resources/PawnWhite.png')
        else if (player === 1) this.img = loadImage('resources/PawnBlack.png')
    }

    canMoveTo(x, y, square){
        if(this.isDouleCheck(this.player)) 
            return false;
        if (!this.isPlayableSquare(x, y)) 
            return false
        if (this.checkCaptureMove(square)) return true
        if (this.checkEnPassant(x, y)) return true
        if (this.board.isEmptySquare(square)) {
            if (this.player === 0) {
                if (this.x === x) {
                    if (this.y + 1 === y) {
                        return true
                    }
                    if (this.y === 1 && y === 3 && this.board.isEmptySquare(x + ' 2')) {
                        return true
                    }
                }
            }
            if (this.player === 1) {
                if (this.x === x) {
                    if (this.y - 1 === y) {
                        return true
                    }
                    if (this.y === 6 && y === 4 && this.board.isEmptySquare(x + ' 5')) {
                        return true
                    }
                }

            }
        }
    }

    getAttackingSquares() {
        let attackingSquares = []
        
        if (this.player === 0) {
            let x1 = this.x + 1
            let x2 = this.x - 1
            let yy = this.y + 1

            if (yy < 8) {
                if (x1 < 8) attackingSquares.push(x1 + ' ' + yy)
                if (x2 > -1) attackingSquares.push(x2 + ' ' + yy)
            }
        }

        else if (this.player === 1) {
            let x1 = this.x + 1
            let x2 = this.x - 1
            let yy = this.y - 1

            if (yy > -1) {
                if (x1 < 8) attackingSquares.push(x1 + ' ' + yy)
                if (x2 > -1) attackingSquares.push(x2 + ' ' + yy)
            }
        }

        return attackingSquares
    }

    checkCaptureMove(square) {
        let attackingSquares = this.getAttackingSquares()

        if (!attackingSquares.includes(square)) return false
        let opponentPieces = this.board.getOpponentPieces(this.player)
        if (!(square in opponentPieces)) return false
        return true
    }

    checkEnPassant(x, y, takePiece = false) {
        if (this.player === 0 && y !== this.y + 1) return false
        else if (this.player === 1 && y !== this.y - 1) return false

        let squareCheck, opponentPieces, opponentPawn
        if (x === this.x - 1) squareCheck = str(this.x - 1) + ' ' + str(this.y)
        else if (x === this.x + 1) squareCheck = str(this.x + 1) + ' ' + str(this.y)
        else return false
        opponentPieces = this.board.getOpponentPieces(this.player)
        if (!(squareCheck in opponentPieces)) return false
        opponentPawn = opponentPieces[squareCheck]
        if (opponentPawn instanceof Pawn && opponentPawn.enPassant) {
            if (takePiece) {
                opponentPieces[squareCheck].showImage = false
                delete opponentPieces[squareCheck]
            }
            return true
        }
    }
}