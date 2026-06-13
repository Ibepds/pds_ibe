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
    /** Variante CGPT — enfants sur le globe */
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
  /** Pictos CGPT (maquettes slides 1–6 + page freestyle) */
  cgpt: {
    sparkles: '/images/da/cgpt/picto-1-blanc.png',
    ticket: '/images/da/cgpt/picto-2-blanc.png',
    heartOutline: '/images/da/cgpt/picto-3-blanc.png',
    dove: '/images/da/cgpt/picto-4-blanc.png',
    btnDonate: '/images/da/cgpt/picto-5-blanc.png',
    btnAuctions: '/images/da/cgpt/picto-6-blanc.png',
    btnDonateBlue: '/images/da/cgpt/picto-5-bleu.png',
    btnAuctionsBlue: '/images/da/cgpt/picto-6-bleu.png',
    /** Enfants sur le globe (countdown / planning) */
    childrenGlobe: '/images/da/cgpt/picto-7-blanc.png',
    /** Bulles — table ronde / contact */
    chat: '/images/da/cgpt/picto-8-blanc.png',
    /** Cadeau enchères */
    gift: '/images/da/cgpt/picto-9-blanc.png',
    /** Microphone — freestyles */
    microphone: '/images/da/cgpt/picto-10-blanc.png',
    /** Couronne — enchère finale */
    crown: '/images/da/cgpt/picto-11-blanc.png',
    /** Étoile — concepts / temps fort */
    star: '/images/da/cgpt/picto-12-blanc.png',
    /** Calendrier + horloge */
    calendar: '/images/da/cgpt/picto-13-blanc.png',
    /** Cadenas — lots verrouillés */
    padlock: '/images/da/cgpt/picto-14-blanc.png',
    /** Profil utilisateur */
    user: '/images/da/cgpt/picto-15-blanc.png',
    /** Pseudo / artiste */
    artist: '/images/da/cgpt/picto-16-blanc.png',
    /** Profil alternatif */
    userAlt: '/images/da/cgpt/picto-17-blanc.png',
    /** Note de musique (double) */
    musicNote: '/images/da/cgpt/picto-18-blanc.png',
    /** Note de musique (simple) */
    musicNoteSm: '/images/da/cgpt/picto-19-blanc.png',
    /** Validation / confirmation */
    check: '/images/da/cgpt/picto-20-blanc.png',
  },
  refs: {
    screen1: '/images/da/refs/screen-1-cgpt.jpeg',
    screen2: '/images/da/refs/screen-2-cgpt.jpeg',
    screen3: '/images/da/refs/screen-3-cgpt.jpeg',
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
