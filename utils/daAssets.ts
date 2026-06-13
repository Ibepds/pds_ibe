/** Assets charte graphique craie (dossier public/images/da) */
export const DA = {
  picto: {
    highFive: '/images/da/picto-1-blanc.png',
    children: '/images/da/picto-2-blanc.png',
    gift: '/images/da/picto-3-blanc.png',
    heart: '/images/da/picto-4-blanc.png',
    heartSm: '/images/da/picto-5-blanc.png',
    plane: '/images/da/picto-6-blanc.png',
    trophy: '/images/da/picto-7-blanc.png',
    /** Variante CGPT — enfants sur le globe (drive-download) */
    childrenGlobe: '/images/da/picto-7-blanc-cgpt.png',
  },
  trait: {
    stroke1: '/images/da/trait-1-blanc.png',
    stroke2: '/images/da/trait-2-blanc.png',
    stroke3: '/images/da/trait-3-blanc.png',
    stroke4: '/images/da/trait-4-blanc.png',
    stroke5: '/images/da/trait-5-blanc.png',
    stroke6: '/images/da/trait-6-blanc.png',
    stroke7: '/images/da/trait-7-blanc.png',
  },
  /** Boutons craie (maquette CGPT) */
  cgpt: {
    sparkles: '/images/da/cgpt/picto-1-blanc.png',
    ticket: '/images/da/cgpt/picto-2-blanc.png',
    heartOutline: '/images/da/cgpt/picto-3-blanc.png',
    dove: '/images/da/cgpt/picto-4-blanc.png',
    btnDonate: '/images/da/cgpt/picto-5-blanc.png',
    btnAuctions: '/images/da/cgpt/picto-6-blanc.png',
    btnDonateBlue: '/images/da/cgpt/picto-5-bleu.png',
    btnAuctionsBlue: '/images/da/cgpt/picto-6-bleu.png',
  },
  fond: '#0546A0',
} as const

export type ChalkButtonPreset = 'donate' | 'auctions' | 'ticket'

export const CHALK_BUTTON_SRC: Record<ChalkButtonPreset, string> = {
  donate: DA.cgpt.btnDonate,
  auctions: DA.cgpt.btnAuctions,
  ticket: DA.cgpt.ticket,
}

export const CHALK_BUTTON_LABEL: Record<ChalkButtonPreset, string> = {
  donate: 'Faire un don',
  auctions: 'Accéder aux enchères',
  ticket: 'Faire un don',
}
