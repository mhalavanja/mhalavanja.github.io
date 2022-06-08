class King extends Piece {
    constructor (x, y, player, board) {
        super(x, y, player, board)
        this.x = x
        this.y = y
        this.inCheck = false
        this.kSideRook
        this.qSideRook

        if(player === 0) {
            this.img = loadImage('resources/KingWhite.png')
            this.kSideCastleSquare = '1 0'
            this.qSideCastleSquare = '5 0'
        }
        else if (player === 1) {
            this.img = loadImage('resources/KingBlack.png')
            this.kSideCastleSquare = '1 7'
            this.qSideCastleSquare = '5 7'
        }
    }

    canMoveTo(x, y, square) {
        let opponentAttackingSquares = this.board.getAttackingSquares((this.player + 1) % 2)
        if(!this.isPlayableSquare(x, y)
            || opponentAttackingSquares.includes(square)) {
                return false
        }
        if ((this.x === x + 1 && this.y >= y - 1 && this.y <= y + 1) 
            || (this.x === x - 1 && this.y >= y - 1 && this.y <= y + 1) 
            || (this.x === x && (this.y === y - 1 || this.y === y + 1)) 
            || (square === this.kSideCastleSquare && this.canCastleKSide())
            || (square === this.qSideCastleSquare && this.canCastleQSide())) {
                this.checkCapture(square)
                return true
        }
        return false
    }

    getAttackingSquares() {
        let attackingSquares = []
        if (this.x + 1 < 8) attackingSquares.push((this.x + 1) + ' ' + this.y)
        if (this.x - 1 > -1) attackingSquares.push((this.x - 1) + ' ' +  this.y)
        if (this.y + 1 < 8) attackingSquares.push(this.x + ' ' + (this.y + 1))
        if (this.y - 1 > -1) attackingSquares.push(this.x + ' ' + (this.y - 1))
        if (this.x + 1 < 8 && this.y + 1 < 8) attackingSquares.push((this.x + 1) + ' ' + (this.y + 1))
        if (this.x + 1 < 8 && this.y - 1 > -1) attackingSquares.push((this.x + 1) + ' ' + (this.y - 1))
        if (this.x - 1 > -1 && this.y - 1 > -1) attackingSquares.push((this.x - 1) + ' ' + (this.y - 1))
        if (this.x - 1 > -1 && this.y + 1 < 8) attackingSquares.push((this.x - 1) + ' ' + (this.y + 1))
        return attackingSquares
    }

    canCastleKSide() {
        if (this.inCheck) return false

        let sq1, sq2, attackingSquares
        if (this.player === 0) {
            sq1 = '1 0'
            sq2 = '2 0'
            attackingSquares = this.board.getAttackingSquares(1)
        }
        else if (this.player === 1) {
            sq1 = '1 7'
            sq2 = '2 7'
            attackingSquares = this.board.getAttackingSquares(0)
        }
        if (!this.hasMoved
            && !this.kSideRook.hasMoved
            && this.board.isEmptySquare(sq1)
            && this.board.isEmptySquare(sq2)
            && !(attackingSquares.includes(sq1))
            && !(attackingSquares.includes(sq2))) {
                return true
        }
    }

    canCastleQSide() {
        if (this.inCheck) return false

        let sq1, sq2, attackingSquares
        if (this.player === 0) {
            sq1 = '4 0'
            sq2 = '5 0'
            attackingSquares = this.board.getAttackingSquares(1)
        }
        else if (this.player === 1) {
            sq1 = '4 7'
            sq2 = '5 7'
            attackingSquares = this.board.getAttackingSquares(0)
        }
        if (!this.hasMoved
            && !this.qSideRook.hasMoved
            && this.board.isEmptySquare(sq1)
            && this.board.isEmptySquare(sq2)
            && !(attackingSquares.includes(sq1))
            && !(attackingSquares.includes(sq2))) {
                return true
        }
    }
}