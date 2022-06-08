class Knight extends Piece {
    constructor (x, y, player, board){
        super(x, y, player, board)
        this.x = x
        this.y = y
        if(player === 0) this.img = loadImage('resources/KnightWhite.png')
        else if (player === 1) this.img = loadImage('resources/KnightBlack.png')
    }

    canMoveTo(x, y, square) {
        if(this.isDouleCheck(this.player)) 
            return false;
        if (!this.isPlayableSquare(x, y)) 
            return false
        if (this.x + 1 === x && this.y + 2 == y ||
            this.x - 1 === x && this.y + 2 == y ||
            this.x + 1 === x && this.y - 2 == y ||
            this.x - 1 === x && this.y - 2 == y ||
            this.x + 2 === x && this.y + 1 == y ||
            this.x - 2 === x && this.y + 1 == y ||
            this.x + 2 === x && this.y - 1 == y ||
            this.x - 2 === x && this.y - 1 == y)
            return true
    }

    getAttackingSquares() {
        let attackingSquares = []
        if (this.x + 1 < 8 && this.y + 2 < 8) attackingSquares.push((this.x + 1) + ' ' + (this.y + 2))
        if (this.x + 1 < 8 && this.y - 2 > -1) attackingSquares.push((this.x + 1) + ' ' + (this.y - 2))
        if (this.x - 1 > -1 && this.y + 2 < 8) attackingSquares.push((this.x - 1) + ' ' + (this.y + 2))
        if (this.x - 1 > -1 && this.y - 2 > -1) attackingSquares.push((this.x - 1) + ' ' + (this.y - 2))
        if (this.x + 2 < 8 && this.y + 1 < 8) attackingSquares.push((this.x + 2) + ' ' + (this.y + 1))
        if (this.x + 2 < 8 && this.y - 1 > -1) attackingSquares.push((this.x + 2) + ' ' + (this.y - 1))
        if (this.x - 2 > -1 && this.y - 1 > -1) attackingSquares.push((this.x - 2) + ' ' + (this.y - 1))
        if (this.x - 2 > -1 && this.y + 1 < 8) attackingSquares.push((this.x - 2) + ' ' + (this.y + 1))
        return attackingSquares
    }
}