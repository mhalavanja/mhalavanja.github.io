let squareSize = window.innerWidth > window.innerHeight ? window.innerHeight/8 : window.innerWidth/8;
let leftOffset = window.innerWidth/2 - 4* squareSize
let topOffset = window.innerHeight/2 - 4* squareSize
let totalBoardSizeX = 8 * squareSize 
let totalBoardSizeY = topOffset + 8 * squareSize 
let mouseDown = 1
let board
let startSquare, endSquare
let movingPiece
let modalW = document.getElementById("whiteModal")
let modalB = document.getElementById("blackModal")

function setup() {
	board = new Board(modalW, modalB, topOffset)
	background(0);
	let cnv = createCanvas(8 * squareSize, 8 * squareSize);
	cnv.position(leftOffset, topOffset, "fixed");
}

function draw() {
	board.show()
	if (!isModalOpen()) {
		if (mouseIsPressed) {
			if (mouseDown === 1) startSquare = mousePressed()
			mouseDown = 0

			if (startSquare) {
				movingPiece = board.getMovingPiece(startSquare)
			}

			if (movingPiece) {
				board.showMovingPiece(movingPiece, mouseX, mouseY)		
			}
		}

		if (mouseDown === 0 && !mouseIsPressed) {
			endSquare = mouseReleased()
			mouseDown = 1
			if (endSquare && movingPiece) {
				board.makeMove(movingPiece, endSquare)
			}
			else if (movingPiece){
				movingPiece.showImage = true
			}	
		}
	}
}

function mousePressed() {
	if (mouseDown === 1) {
		if (mouseX < totalBoardSizeX && 
			mouseY < totalBoardSizeY) {
				const x = Math.floor(mouseX / squareSize)
				const y = Math.floor(mouseY / squareSize)
				return x + ' ' + y
		}
	}
}

function mouseReleased() {
	if (mouseDown === 0) {
		if (mouseX < totalBoardSizeX && 
			mouseY < totalBoardSizeY) {
				if (mouseX > totalBoardSizeX 
					|| mouseY > totalBoardSizeY
					) return 
				const x = Math.floor(mouseX / squareSize)
				const y = Math.floor(mouseY / squareSize)
				return x + ' ' + y
		}
	}
}

function isModalOpen() {
	if (modalW.style.display === "block" || modalB.style.display === "block") {
		return true
	}
}

function choosePiece(id) {
	if (!(movingPiece instanceof Pawn)) throw "ERROR: Only pawns can promote"
	let pawn = movingPiece
	let modal = id.substring(0,1) === "w" ?  modalW : modalB
	let pieces = id.substring(0,1) === "w" ? board.wPieces : board.bPieces;
	let player = id.substring(0,1) === "w" ? 0 : 1;
	switch(id.substring(1)){
		case "Queen":
			pieces[pawn.square] = new Queen(pawn.x, pawn.y, player, board);
			break;
		case "Rook":
			pieces[pawn.square] = new Rook(pawn.x, pawn.y, player, board);
			break;
		case "Knight":
			pieces[pawn.square] = new Knight(pawn.x, pawn.y, player, board);
			break;
		case "Bishop":
			pieces[pawn.square] = new Bishop(pawn.x, pawn.y, player, board);
			break;
		default:
			throw "ERROR: That is not a valid chess piece"
	}
	board.changeTurn();
	board.wAttackingSquares = board.getAttackingSquares(0)
	board.bAttackingSquares = board.getAttackingSquares(1)
	board.setCheck()
	modal.style.display = "none";
}

function endGame(){
	location.reload();
}