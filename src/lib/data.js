export const SLAYERS = {
  tanjiro: {
    code: "竈門 炭治郎 // OP_01 // 水",
    bio: "Tanjiro es un joven amable y de gran determinación cuya familia fue masacrada por un demonio. Su hermana menor Nezuko sobrevivió pero fue transformada en demonio. Decidido a devolverle su humanidad, se une al Cuerpo de Exterminio de Demonios. Domina la Respiración del Agua y posteriormente hereda la antigua danza sagrada del fuego: Hinokami Kagura.",
    stats: { strength: 75, speed: 82, technique: 90, concentration: 95 },
    abilityTitle: "水の呼吸 // RESPIRACIÓN DEL AGUA",
    abilityDesc:
      "Uno de los estilos de respiración más fundamentales. Traza elegantes remolinos de agua con su espada, combinando fluidez y precisión para abrumar a sus enemigos. Domina las once formas completas de este estilo.",
    audioFile: "src/audio/tanjiro.mp3",
    audioTitle: "Kamado Tanjiro no Uta",
  },
  zenitsu: {
    code: "我妻 善逸 // OP_02 // 雷",
    bio: "Zenitsu es un espadachín extremadamente miedoso que duda de sí mismo constantemente. Sin embargo, cuando cae inconsciente, su verdadero potencial emerge. Es un prodigio de la Respiración del Rayo, capaz de ejecutar la Primera Forma «Relámpago Veloz» a una velocidad sobrehumana que ni los demonios más rápidos pueden esquivar.",
    stats: { strength: 60, speed: 98, technique: 45, concentration: 30 },
    abilityTitle: "雷の呼吸 // RESPIRACIÓN DEL RAYO",
    abilityDesc:
      "Un estilo de respiración que imita la velocidad y el poder destructivo de un rayo. La Primera Forma «Relámpago Veloz» es un corte de velocidad divina que divide al enemigo en un instante. Solo seis formas se han transmitido a través de las generaciones.",
    audioFile: "src/audio/zenitsu.mp3",
    audioTitle: "Zenitsu Theme (Epic Version)",
  },
  inosuke: {
    code: "嘴平 伊之助 // OP_03 // 獣",
    bio: "Inosuke fue criado por jabalíes en la montaña y desarrolló un estilo de lucha salvaje e impredecible. Creador autodidacta de su propia Respiración de la Bestia, posee un sentido del tacto extremadamente desarrollado que le permite detectar enemigos fuera de su campo visual. Bajo su máscara de jabalí se esconde un rostro hermoso y femenino.",
    stats: { strength: 95, speed: 78, technique: 55, concentration: 60 },
    abilityTitle: "獣の呼吸 // RESPIRACIÓN DE LA BESTIA",
    abilityDesc:
      "Un estilo de respiración único creado por el propio Inosuke sin entrenamiento formal. Combina movimientos salvajes e impredecibles con el uso de dos espadas. El Primer Colmillo «Perforar» es una estocada giratoria que atraviesa al enemigo como un jabalí enfurecido.",
    audioFile: "src/audio/inosuke.mp3",
    audioTitle: "Inosuke Theme V3 (Epic Version)",
  },
};

export const STYLE_TO_CHARACTER = {
  water: "tanjiro",
  thunder: "zenitsu",
  beast: "inosuke",
};

export const CHARACTER_TO_STYLE = {
  tanjiro: "water",
  zenitsu: "thunder",
  inosuke: "beast",
};

export const ETO_MAP = [
  { hour: 23, symbol: "子", romaji: "Ne" },
  { hour: 1, symbol: "丑", romaji: "Ushi" },
  { hour: 3, symbol: "寅", romaji: "Tora" },
  { hour: 5, symbol: "卯", romaji: "U" },
  { hour: 7, symbol: "辰", romaji: "Tatsu" },
  { hour: 9, symbol: "巳", romaji: "Mi" },
  { hour: 11, symbol: "午", romaji: "Uma" },
  { hour: 13, symbol: "未", romaji: "Hitsuji" },
  { hour: 15, symbol: "申", romaji: "Saru" },
  { hour: 17, symbol: "酉", romaji: "Tori" },
  { hour: 19, symbol: "戌", romaji: "Inu" },
  { hour: 21, symbol: "亥", romaji: "I" },
];

export function getEtoki(hour) {
  for (const eto of ETO_MAP) {
    if (hour >= eto.hour && hour < eto.hour + 2) return eto;
  }
  return ETO_MAP[0];
}

export const SOUND_PROFILES = {
  water: {
    accent: [1320, 1040, 780],
    chimeOscTypes: ["sine", "sine", "triangle"],
    chimeLFORate: 4.2,
    chimeLFODepth: 5,
    drawOscType: "triangle",
    drawFreqStart: 660,
    drawFreqEnd: 1320,
    drawDecay: 0.18,
    drawNoiseColor: "bandpass",
    drawNoiseFreq: 800,
    clashFreqs: [420, 840, 210, 1680],
    clashOscTypes: ["sawtooth", "triangle", "sine", "square"],
    clashDelay: 0.02,
    reverbMix: 0.35,
    reverbDecay: 1.8,
    stereoWidth: 0.4,
    distortion: 0,
    preBreath: true,
    breathFreq: 600,
    breathDuration: 0.25,
    bgColor: "79, 195, 247",
    bgGlow: "rgba(79, 195, 247, 0.32)",
    ambientX: "22%",
    ambientY: "28%",
  },
  thunder: {
    accent: [2340, 1860, 1320],
    chimeOscTypes: ["triangle", "triangle", "sawtooth"],
    chimeLFORate: 14.0,
    chimeLFODepth: 18,
    drawOscType: "sawtooth",
    drawFreqStart: 1200,
    drawFreqEnd: 2400,
    drawDecay: 0.1,
    drawNoiseColor: "highpass",
    drawNoiseFreq: 2000,
    clashFreqs: [640, 1280, 320, 2560],
    clashOscTypes: ["sawtooth", "square", "sine", "triangle"],
    clashDelay: 0.015,
    reverbMix: 0.2,
    reverbDecay: 0.8,
    stereoWidth: 0.6,
    distortion: 0.3,
    preBreath: true,
    breathFreq: 1200,
    breathDuration: 0.12,
    bgColor: "255, 223, 92",
    bgGlow: "rgba(255, 223, 92, 0.42)",
    ambientX: "50%",
    ambientY: "45%",
  },
  beast: {
    accent: [780, 620, 460],
    chimeOscTypes: ["sawtooth", "triangle", "square"],
    chimeLFORate: 7.8,
    chimeLFODepth: 10,
    drawOscType: "sawtooth",
    drawFreqStart: 380,
    drawFreqEnd: 760,
    drawDecay: 0.15,
    drawNoiseColor: "lowpass",
    drawNoiseFreq: 400,
    clashFreqs: [260, 520, 130, 1040],
    clashOscTypes: ["square", "sawtooth", "sine", "triangle"],
    clashDelay: 0.025,
    reverbMix: 0.25,
    reverbDecay: 1.2,
    stereoWidth: 0.5,
    distortion: 0.5,
    preBreath: true,
    breathFreq: 300,
    breathDuration: 0.3,
    bgColor: "120, 191, 171",
    bgGlow: "rgba(120, 191, 171, 0.32)",
    ambientX: "75%",
    ambientY: "35%",
  },
};
