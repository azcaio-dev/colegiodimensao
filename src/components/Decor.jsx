// Elementos decorativos (SVG): halftone da logo, aviãozinho de papel e lápis.

export function Plane({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 150" fill="none" stroke="#2f9bff" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M190 15 100 52l28 14 14 34 18-24z" />
      <path d="M128 66 190 15" />
      <path d="M12 138C40 148 85 140 110 115" strokeDasharray="5 6" strokeLinecap="round" />
    </svg>
  )
}

export function Pencil({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" stroke="#2f7bff" strokeWidth="2" aria-hidden="true">
      <path d="M20 100 28 72 80 20l16 16-52 52z" />
      <path d="m70 30 16 16M20 100l24-8" />
      <path d="M96 96c-10-12 4-20 10-10 6-10 20-2 10 10l-10 10z" />
    </svg>
  )
}

// Halftone da logo: pontos grandes na borda que vão diminuindo para dentro.
// Metade de cima em azul e metade de baixo em turquesa, como na logo da escola.
const COLS = 20
const ROWS = 24
const STEP = 28
const RMAX = 12.5

function montarHalftone() {
  let pontos = ''
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const dist = Math.pow(1 - c / COLS, 1.6)
      const borda = Math.pow(Math.sin((Math.PI * (r + 0.5)) / ROWS), 0.7)
      const raio = RMAX * dist * borda
      if (raio < 0.9) continue
      const cor = r < ROWS / 2 ? '#2f9bff' : '#14c8ee'
      pontos += `<circle cx='${c * STEP + STEP / 2}' cy='${r * STEP + STEP / 2}' r='${raio.toFixed(1)}' fill='${cor}'/>`
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${COLS * STEP} ${ROWS * STEP}'>${pontos}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const halftoneUrl = montarHalftone()

export function Halftone({ side = 'left', opacity = 0.1 }) {
  // Estilo inline de propósito: o halftone não depende de nenhuma regra do styles.css para aparecer.
  const estilo = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    [side]: 0,
    width: 'min(42vw, 560px)',
    backgroundImage: halftoneUrl,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'left center',
    opacity,
    pointerEvents: 'none',
    transform: side === 'right' ? 'scaleX(-1)' : undefined,
  }
  return <div className="halftone" style={estilo} aria-hidden="true" />
}