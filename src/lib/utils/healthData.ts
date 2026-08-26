export interface CondicaoMedica {
  id: string;
  nome: string;
  categoria: 'Cognitivo' | 'Cardiovascular' | 'Metabólico' | 'Motor & Articular' | 'Respiratório' | 'Sensorial' | 'Geral';
  cuidadosSugeridos: string;
  risco: 'baixo' | 'moderado' | 'alto' | 'critico';
}

export const BANCO_CONDICOES_MEDICAS: CondicaoMedica[] = [
  {
    id: 'alzheimer',
    nome: 'Doença de Alzheimer',
    categoria: 'Cognitivo',
    cuidadosSugeridos: 'Rotina previsível, ambiente seguro contra quedas e desorientação, estímulo cognitivo calmo.',
    risco: 'alto'
  },
  {
    id: 'parkinson',
    nome: 'Doença de Parkinson',
    categoria: 'Motor & Articular',
    cuidadosSugeridos: 'Apoio na marcha, vigilância de tremores, tempo estendido para alimentação e medicação nos horários exatos.',
    risco: 'alto'
  },
  {
    id: 'demencia-vascular',
    nome: 'Demência Vascular',
    categoria: 'Cognitivo',
    cuidadosSugeridos: 'Controle rigoroso da pressão arterial, acompanhamento de alterações de humor e memória.',
    risco: 'alto'
  },
  {
    id: 'diabetes-2',
    nome: 'Diabetes Mellitus Tipo 2',
    categoria: 'Metabólico',
    cuidadosSugeridos: 'Monitoramento de glicemia capilar, dieta com restrição de açúcares, inspeção diária dos pés.',
    risco: 'moderado'
  },
  {
    id: 'hipertensao',
    nome: 'Hipertensão Arterial Sistêmica (Pressão Alta)',
    categoria: 'Cardiovascular',
    cuidadosSugeridos: 'Aferição periódica de PA, controle de sódio nas refeições e regularidade nos anti-hipertensivos.',
    risco: 'moderado'
  },
  {
    id: 'osteoporose',
    nome: 'Osteoporose Avançada',
    categoria: 'Motor & Articular',
    cuidadosSugeridos: 'Prevenção total contra quedas, retirada de tapetes, suporte para locomoção e banho assistido.',
    risco: 'alto'
  },
  {
    id: 'avc-sequela',
    nome: 'Sequelas de AVC (Acidente Vascular Cerebral)',
    categoria: 'Motor & Articular',
    cuidadosSugeridos: 'Auxílio na hemiplegia/paresia, exercícios fisioterapêuticos recomendados e estímulo fonoaudiológico.',
    risco: 'critico'
  },
  {
    id: 'insuficiencia-cardiaca',
    nome: 'Insuficiência Cardíaca Congestiva (ICC)',
    categoria: 'Cardiovascular',
    cuidadosSugeridos: 'Controle de ingestão hídrica, observação de inchaço (edema) nos membros inferiores e falta de ar.',
    risco: 'alto'
  },
  {
    id: 'artrite-artrose',
    nome: 'Artrite Reumatoide / Artrose Severa',
    categoria: 'Motor & Articular',
    cuidadosSugeridos: 'Aplicação de compressas conforme prescrição, auxílio no manuseio de talheres e roupas.',
    risco: 'baixo'
  },
  {
    id: 'dpoc',
    nome: 'Doença Pulmonar Obstrutiva Crônica (DPOC)',
    categoria: 'Respiratório',
    cuidadosSugeridos: 'Monitoramento de saturação de oxigênio (oximetria), suporte com inalação ou oxigenoterapia.',
    risco: 'alto'
  },
  {
    id: 'insuficiencia-renal',
    nome: 'Doença Renal Crônica (DRC)',
    categoria: 'Metabólico',
    cuidadosSugeridos: 'Dieta hipoproteica/restrita em potássio conforme nutricionista, controle rigoroso de líquidos.',
    risco: 'alto'
  },
  {
    id: 'depressao-idoso',
    nome: 'Depressão Geriátrica / Isolamento Social',
    categoria: 'Cognitivo',
    cuidadosSugeridos: 'Companhia ativa, conversação empática, atividades lúdicas e passeios ao ar livre.',
    risco: 'moderado'
  },
  {
    id: 'glaucoma-catarata',
    nome: 'Baixa Visão / Glaucoma / Catarata',
    categoria: 'Sensorial',
    cuidadosSugeridos: 'Iluminação adequada nos cômodos, eliminação de obstáculos e auxílio para leitura e medicamentos.',
    risco: 'moderado'
  },
  {
    id: 'hipotireoidismo',
    nome: 'Hipotireoidismo',
    categoria: 'Metabólico',
    cuidadosSugeridos: 'Tomada do hormônio tireoidiano em jejum estrito, 30 minutos antes do café da manhã.',
    risco: 'baixo'
  },
  {
    id: 'disfagia',
    nome: 'Disfagia (Dificuldade de Deglutição)',
    categoria: 'Geral',
    cuidadosSugeridos: 'Uso de espessante alimentar, postura ereta a 90° durante as refeições, vigilância contra engasgos.',
    risco: 'critico'
  },
  {
    id: 'incontinencia-urinaria',
    nome: 'Incontinência Urinária / Fecal',
    categoria: 'Geral',
    cuidadosSugeridos: 'Trocas regulares de fraldas geriátricas, uso de pomadas protetoras e higiene íntima meticulosa.',
    risco: 'moderado'
  },
  {
    id: 'lesao-pressao',
    nome: 'Risco de Lesão por Pressão (Escaras)',
    categoria: 'Geral',
    cuidadosSugeridos: 'Mudança de decúbito (posição) a cada 2 horas no leito, hidratação da pele e uso de colchão casca de ovo.',
    risco: 'critico'
  }
];

export const ALERGIAS_COMUNS = [
  'Dipirona',
  'Penicilina / Amoxicilina',
  'Anti-inflamatórios (AINEs)',
  'Sulfa',
  'Frutos do Mar',
  'Iodo / Contrastes',
  'Lactose',
  'Glúten',
  'Látex',
  'Picada de Insetos'
];
