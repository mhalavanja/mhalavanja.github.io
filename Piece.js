class Piece {
    static squareSize
    imageWidth = squareSize
    imageHeight = squareSize
    img
    
    constructor (x, y, player, board) {
        this.x = x
        this.y = y
        this.player = player
        this.board = board
        this.imageX = x * squareSize
        this.imageY = y * squareSize
        this.showImage = true
        this.inPlay = true
        this.square = x + ' ' + y
        this.hasMoved = false
    }

    setSquare(x, y, newSquare, setImage = true) {
        this.x = x
        this.y = y
        if (setImage) {
            if (this instanceof King && !this.hasMoved) {
                if (newSquare === this.kSideCastleSquare && !this.kSideRook.hasMoved) {
                    this.kSideRook.setSquare(2, y, 2 + ' ' + y)
                }
                else if (newSquare === this.qSideCastleSquare && !this.qSideRook.hasMoved) {
                    this.qSideRook.setSquare(4, y, 4 + ' ' + y)
                }
            }
            this.imageX = x * squareSize
            this.imageY = y * squareSize
            this.hasMoved = true
        }
        if (this.player === 0) {
            delete this.board.wPieces[this.square]
            this.board.wPieces[newSquare] = this
        }
        else if (this.player === 1) {
            delete this.board.bPieces[this.square]
            this.board.bPieces[newSquare] = this
        }

        this.square = newSquare
        return this.checkCapture()
    }

    show() {
        if(this.showImage) image(this.img, this.imageX, this.imageY, this.imageWidth, this.imageHeight)
    }

    moveImage(x, y) {
        image(this.img, x - this.imageWidth / 2, y - this.imageHeight / 2, this.imageWidth, this.imageHeight)
    }

    isPlayableSquare(x, y) {
        if (this.x === x && this.y === y || !this.board.isPlayableSquare(x + ' ' + y, this.player))
            return false
        return true
    }

    checkCapture() {
        let deletedPiece;
        let pieces = this.board.turn === 0 ? this.board.bPieces : this.board.wPieces;
        if (this.square in pieces) {
            pieces[this.square].showImage = false
            deletedPiece = pieces[this.square]
            delete pieces[this.square]
        }
        return deletedPiece
    }

    isDouleCheck(player) {
        let count = 0;
        let pieces = player === 0 ? board.bPieces : board.wPieces;
        let king = player === 0 ? board.wKing : board.bKing;
        for (const piece of Object.entries(pieces)) {
            if(piece[1].getAttackingSquares().includes(king.square)){
                ++count;
                if(count > 1) return true;
            }
        }
    }
}