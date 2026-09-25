const santaScript = [
  {
    id: 'intro_1',
    speaker: 'Santa',
    text: 'Ho ho ho. ¡Feliz Navidad a todos! Y en especial a ti, DarkraiMola.',
  },
  {
    id: 'intro_2',
    speaker: 'Santa',
    text: 'Espero que este año no hayas sido muy travieso. Aunque mi lista dice cosas interesantes.',
    sound: 'hoho.m4a',
  },
  {
    id: 'intro_3',
    speaker: 'Santa',
    text: 'Te peleaste con muchos niños en Twitter. Eso está mal y me pone muy triste 😭',
  },
  {
    id: 'intro_4',
    speaker: 'Santa',
    text: 'También robaste bastante contenido con reacciones. Otros youtubers trabajaron duro en eso.',
  },
  {
    id: 'intro_5',
    speaker: 'Santa',
    text: 'Y ni hablar de esos gustos cuestionables por las “lolis”. El carbón ya estaba casi asegurado.',
  },
  {
    id: 'intro_6',
    speaker: 'Santa',
    text: 'Pero no todo es malo, ho ho ho. También trajiste felicidad a muchos niños peruanos pobres.',
    sound: 'hoho laugh.m4a',
  },
  {
    id: 'intro_7',
    speaker: 'Santa',
    text: 'Tus lecturas semanales de manga los mantuvieron con vida. Eso suma muchos puntos.',
  },
  {
    id: 'intro_8',
    speaker: 'Santa',
    text: 'Así que tendrás perdón. Y tal vez incluso un regalo.',
  },
  {
    id: 'intro_9',
    speaker: 'Santa',
    text: 'Por cierto, vi que se hizo viral tu clip de "Nacada Mesopotámica". Muy divertido, ho ho ho.',
    sound: 'hoho laugh.m4a',
  },
  {
    id: 'question_wish',
    speaker: 'Santa',
    text: 'Asi que. Dime, mi pequeño Darkrai. ¿Qué deseas esta Navidad?',
    option: {
      peace: {
        option: 'La Paz Mundial',
        function: () => 'wish_peace_1',
      },
      capitalism: {
        option: 'Acabar con el Capitalismo',
        function: () => 'wish_capitalism_1',
      },
      chainsaw: {
        option: 'Cancelar Chainsaw Man',
        function: () => 'wish_chainsaw_1',
      },
    },
  },

  // === LA PAZ MUNDIAL ===
  {
    id: 'wish_peace_1',
    speaker: 'Santa',
    text: 'Ho ho ho. Un deseo noble y muy común. Pero seamos sinceros, sería un mundo aburrido.',
  },
  {
    id: 'wish_peace_2',
    speaker: 'Santa',
    text: 'Sin peleas no habría Twitter, ni clips, ni drama. Piénsalo mejor, joven.',
    nextLabel: 'question_wish',
  },

  // === CAPITALISMO ===
  {
    id: 'wish_capitalism_1',
    speaker: 'Santa',
    text: 'Ho ho ho. Muy gracioso. No sabía que hablaba con un Kukardo.',
    sound: 'hoho laugh.m4a',
  },
  {
    id: 'wish_capitalism_2',
    speaker: 'Santa',
    text: 'Sin capitalismo yo no podría repartir regalos. Ni tú hacer contenido.',
  },
  {
    id: 'wish_capitalism_3',
    speaker: 'Santa',
    text: 'Piénsalo otra vez, ho ho ho.',
    nextLabel: 'question_wish',
  },

  // === CHAINSAW MAN ===
  {
    id: 'wish_chainsaw_1',
    speaker: 'Santa',
    text: 'Ho ho ho. Ese sí es un gran deseo. El mejor que he escuchado este año.',
    sound: 'hoho.m4a',
  },
  {
    id: 'wish_chainsaw_2',
    speaker: 'Santa',
    text: 'Ojalá tu deseo se cumpla. Yo solo soy un PNG mal recortado de Santa. Ho Ho Ho.',
    sound: 'hoho laugh.m4a',
  },

  // === DESPEDIDA ===
  {
    id: 'ending_1',
    speaker: 'Santa',
    text: 'Bueno Darkrai, mi trabajo aquí terminó. Intenta portarte mejor el próximo año.',
  },
  {
    id: 'ending_2',
    speaker: 'Santa',
    text: 'Menos peleas, menos Twitter, y menos gustos raros. El carbón es caro.',
  },
  {
    id: 'ending_3',
    speaker: 'Santa',
    text: 'Sigue leyendo manga, pero que sean buenos porfavor.',
  },
  {
    id: 'ending_4',
    speaker: 'Santa',
    text: 'Si estas triste por no tener un regalo, no te preocupes. Toma un Pepelu DVD para que te animes.',
  },
  {
    id: 'ending_finale',
    speaker: 'Santa',
    text: 'Te deseo un muy Feliz Halloween. Ho Ho Ho.',
    sound: 'hoho.m4a',
    nextLabel: 'END_SCENE',
  },
];

const santaActors = [
  {
    name: 'Santa',
    image: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsyBDhi2DWE2RrHWPuACU6tblTSchKogFveVfM',
  },
];

export { santaScript, santaActors };
