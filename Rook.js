class Rook extends Piece {

    constructor (x, y, player, board) {
        super(x, y, player, board)
        this.x = x
        this.y = y
        if(player === 0) this.img = loadImage('resources/RookWhite.png')
        else if (player === 1) this.img = loadImage('resources/RookBlack.png')
    }

    canMoveTo(x, y, square) {
        if (!this.isPlayableSquare(x, y)) 
            return false
        if (this.getAttackingSquares().includes(square)) {
            return true
        }
    }


    getAttackingSquares() {
        let attackingSquares = []
        
        for (let i = 1; i < 8; i++) {
            let xx = this.x + i
            let sq = xx + ' ' + this.y

            if (xx > 7) break
            if (!this.board.isEmptySquare(sq)) {
                if (this.board.isAttackableSquare(sq, this.player)) attackingSquares.push(sq)
                if (!this.board.isOpponnentKingSquare(sq, this.player)) break;
            }
            attackingSquares.push(sq)
        }
        
        for (let i = 1; i < 8; i++) {
            let xx = this.x - i
            let sq = xx + ' ' + this.y
            
            if (xx < 0) break
            if(!this.board.isEmptySquare(sq)) {
                if (this.board.isAttackableSquare(sq, this.player)) attackingSquares.push(sq)
                if (!this.board.isOpponnentKingSquare(sq, this.player)) break;
            }
            attackingSquares.push(sq)
        }

        for (let i = 1; i < 8; i++) {
            let yy = this.y + i
            let sq = this.x + ' ' + yy

            if (yy > 7) break
            if (!this.board.isEmptySquare(sq)) {
                if (this.board.isAttackableSquare(sq, this.player)) attackingSquares.push(sq)
                if (!this.board.isOpponnentKingSquare(sq, this.player)) break;
            }
            attackingSquares.push(sq)
        }

        for (let i = 1; i < 8; i++) {
            let yy = this.y - i
            let sq = this.x + ' ' + yy

            if (yy < 0) break
            if (!this.board.isEmptySquare(sq)) {
                if (this.board.isAttackableSquare(sq, this.player)) attackingSquares.push(sq)
                if (!this.board.isOpponnentKingSquare(sq, this.player)) break;
            }
            attackingSquares.push(sq)
        }
        
        return attackingSquares
    }
}