// Controles do cartão: salve este arquivo e recarregue o navegador.
export const CARD_CONFIG = {
  logo: 'WPZ',
  email: 'seuemail@exemplo.com',
  contactNote: 'Contato de exemplo',
  frontHeading: '{ DEV / DATA / DESIGN }',
  backHeading: '{ CONTATO }',
  frontFooter: 'FORMA & FUNÇÃO.',
  backFooter: 'EM BREVE.',
  geometry: {
    depth: 0.22,           // Espessura da peça (antes: 0.48).
    bevelThickness: 0.07,  // Espessura das bordas (antes: 0.15).
    bevelSize: 0.09
  },
  text: {
    headerSize: 34,        // Textos pequenos em cima (antes: 26).
    footerSize: 32,        // Textos pequenos embaixo (antes: 24).
    emailSize: 46,
    noteSize: 30,
    frontLogoSize: 380,
    backLogoSize: 150,
    padding: 70            // Margem lateral na textura de 1536 px.
  },
  glass: { dispersion: 5, thickness: 0.72, roughness: 0.015, ior: 1.5 },
  motion: { durationMs: 1800, tiltX: 0.42, tiltY: 0.6, hoverScale: 1.035 },
  images: {
    front: {
      src: '', // Exemplo: 'assets/images/minha-imagem.webp'. Vazio desativa.
      alt: 'Imagem na frente do cartão',
      fit: 'contain', // 'contain' mostra inteira; 'cover' preenche e recorta.
      replaceLogo: true,
      opacity: 1,
      box: { x: 0.20, y: 0.22, width: 0.60, height: 0.52 }
    },
    back: {
      src: '',
      alt: 'Imagem no verso do cartão',
      fit: 'contain',
      replaceLogo: true,
      opacity: 1,
      box: { x: 0.34, y: 0.17, width: 0.32, height: 0.26 }
    }
  }
};


