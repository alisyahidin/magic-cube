import { RubikRotation } from "../entity/cube"
import state from "./"

// https://hannuhartikainen.fi/blog/modeling-rubiks-cube/
// [:u :f :l] [:u :l :b] [:u :b :r] [:u :r :f]              ; corners - top
// [:d :f :l] [:d :l :b] [:d :b :r] [:d :r :f]              ; corners - bottom
// [:u :f] [:u :l] [:u :b] [:u :r]                          ; edges - top
// [:f :l] [:l :b] [:b :r] [:r :f]                          ; edges - middle
// [:d :f] [:d :l] [:d :b] [:d :r]                          ; edges - bottom

export const fwdRing = ['U', 'F', 'L', 'D', 'B', 'R']

const fwdRingOf = (face: keyof RubikRotation) => {
  const indexFace = fwdRing.indexOf(face)
  const oppositeIndexFace = (indexFace + 3) % fwdRing.length
  return fwdRing.filter(f => f !== face && f !== fwdRing[oppositeIndexFace])
}

const piecesLocation = [
  'U-F-L', 'U-L-B', 'U-B-R', 'U-R-F',
  'D-F-L', 'D-L-B', 'D-B-R', 'D-R-F',
  'U-F', 'U-L', 'U-B', 'U-R',
  'F-L', 'L-B', 'B-R', 'R-F',
  'D-F', 'D-L', 'D-B', 'D-R',
  'U-U', 'F-F', 'D-D', 'B-B', 'L-L', 'R-R'
]

const nextRotationM = (piece: typeof piecesLocation[number], inversed = false) => {
  const rotationFLow = ['F-F', 'U-F', 'U-U', 'U-B', 'B-B', 'D-B', 'D-D', 'D-F']
  return (inversed ? rotationFLow.reverse() : rotationFLow)[(rotationFLow.indexOf(piece) + 2) % rotationFLow.length]
}

const getNextRotationPiece = (face: keyof RubikRotation, piece: typeof piecesLocation[number], inversed: boolean = false) => {
  if (face === 'M') return nextRotationM(piece, inversed)

  const isEven = fwdRing.indexOf(face) % 2 === 0
  let fwdRingFace = isEven ? fwdRingOf(face) : [...fwdRingOf(face)].reverse()
  fwdRingFace = inversed ? [...fwdRingFace].reverse() : fwdRingFace
  const nextFwdRingFace = (position: string) => (fwdRingFace.indexOf(position) + 1) % fwdRingFace.length
  const nextRotate = piece.split('-')
    .map(position => position === face
      ? position
      : fwdRingFace[nextFwdRingFace(position)]
    )
    .join('')

  return piecesLocation.find(face => face.replaceAll('-', '').length === nextRotate.length && new RegExp(`[${nextRotate}]-`.repeat(nextRotate.length).slice(0, -1)).test(face))
}

const rotate = (face: keyof RubikRotation, inversed: boolean = false) => {
  const mapRotationPieces = piecesLocation
    .filter(item => {
      if (face === 'M') {
        return !item.includes('L') && !item.includes('R')
      } else {
        return item.includes(face)
      }
    })
    .map(current => [current, getNextRotationPiece(face, current, inversed)])

  const latestState = { ...state }
  mapRotationPieces.forEach(([currentPosition, targetPosition]) => {
    state[targetPosition as keyof typeof state] = latestState[currentPosition as keyof typeof state]
  })
}

export default rotate