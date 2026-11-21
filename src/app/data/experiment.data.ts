export interface NavStation {
  readonly id: string;
  readonly code: string;
  readonly label: string;
  readonly theme: 'light' | 'dark';
}

export interface BroadcastChannel {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly statValue: string;
  readonly statLabel: string;
  readonly synthesis: string;
  readonly quote: string;
  readonly quoteAuthor: string;
  readonly conceptTag: string;
}

export interface TvNetwork {
  readonly number: string;
  readonly callsign: string;
  readonly city: string;
  readonly frequency: string;
}

export type FeedVector = 'ciencia' | 'antipolitica' | 'conspiracao';
export type PostCategory = 'neutro' | FeedVector;
export type ReactionType = 'curtir' | 'indignar' | 'compartilhar';

export interface FeedPost {
  readonly id: string;
  readonly category: PostCategory;
  readonly level: 1 | 2 | 3;
  readonly handle: string;
  readonly format: 'Corte 14s' | 'Ao vivo' | 'Post' | 'Urgente';
  readonly headline: string;
  readonly subline: string;
  readonly baseViews: string;
}

export interface AlgorithmConcept {
  readonly id: 'bolha' | 'infocracia' | 'cansaco';
  readonly title: string;
  readonly author: string;
  readonly summary: string;
  readonly triggerLabel: string;
}

export interface AuditOption {
  readonly label: string;
  readonly score: number;
}

export interface AuditPreset {
  readonly id: string;
  readonly label: string;
  readonly subtitle: string;
  readonly hours: number;
  readonly secondScreen: number;
  readonly newsFormat: number;
  readonly opposingView: number;
}

export interface AuditProfile {
  readonly id: 'espectador-1969' | 'hibrido' | 'refem-algoritmo';
  readonly title: string;
  readonly rangeLabel: string;
  readonly accent: string;
  readonly bullets: readonly [string, string, string];
}

export const NAV_STATIONS: readonly NavStation[] = [
  { id: 'estacao-1', code: '01', label: 'Proporção', theme: 'light' },
  { id: 'estacao-2', code: '02', label: 'Sinal Único', theme: 'light' },
  { id: 'estacao-3', code: '03', label: 'Algoritmo', theme: 'dark' },
  { id: 'estacao-4', code: '04', label: 'Perfis', theme: 'light' },
];

export const TV_NETWORKS: readonly TvNetwork[] = [
  { number: '02', callsign: 'TV Nacional', city: 'Sinal aberto', frequency: '54 MHz VHF' },
  { number: '04', callsign: 'Rede Central', city: 'Via satélite', frequency: '66 MHz VHF' },
  { number: '07', callsign: 'Canal Continental', city: 'Rede nacional', frequency: '174 MHz VHF' },
];

export const BROADCAST_CHANNELS: readonly BroadcastChannel[] = [
  {
    id: 'ritual',
    code: 'Canal 1',
    title: 'Ritual Coletivo',
    statValue: '650M',
    statLabel: 'pessoas vendo a mesma tela ao mesmo tempo',
    synthesis:
      'Famílias inteiras e até desconhecidos em vitrines de loja pararam juntos para ver o pouso na Lua. A TV fazia o mundo inteiro olhar para o mesmo lugar na mesma hora.',
    quote: 'Um só relógio, uma só imagem, um público inteiro respirando no mesmo compasso.',
    quoteAuthor: 'Registro histórico da transmissão, 1969',
    conceptTag: 'Sincronia de massa',
  },
  {
    id: 'guerra-fria',
    code: 'Canal 2',
    title: 'Guerra Fria',
    statValue: '4,4%',
    statLabel: 'do orçamento federal dos EUA investido na NASA',
    synthesis:
      'Ir à Lua não foi iniciativa privada, mas um projeto de Estado na corrida espacial. A ciência virou disputa política direta entre Estados Unidos e União Soviética.',
    quote: 'Escolhemos ir à Lua nesta década porque esse desafio mede o melhor das nossas energias públicas.',
    quoteAuthor: 'John F. Kennedy, 1962',
    conceptTag: 'Política de Estado',
  },
  {
    id: 'espaco-publico',
    code: 'Canal 3',
    title: 'Espaço Público',
    statValue: '1 tela',
    statLabel: 'mesmo acontecimento debatido por toda a cidade',
    synthesis:
      'Mesmo quem discordava de política partia do mesmo fato exibido no telejornal. Existia uma base comum de realidade que todo mundo enxergava.',
    quote: 'Sem um mundo comum visível a todos, o debate político perde sua base compartilhada.',
    quoteAuthor: 'A partir de Hannah Arendt',
    conceptTag: 'Realidade comum',
  },
  {
    id: 'industria-cultural',
    code: 'Canal 4',
    title: 'Indústria Cultural',
    statValue: '100%',
    statLabel: 'mesma narrativa repetida em todas as emissoras',
    synthesis:
      'A cultura de massa unia as pessoas, mas também padronizava o jeito de pensar. Mesmo trocando de canal na TV, a história contada era exatamente a mesma.',
    quote: 'A indústria cultural molda o espectador de cima para baixo, transformando tudo em espetáculo padrão.',
    quoteAuthor: 'Adorno e Horkheimer, 1947',
    conceptTag: 'Padronização',
  },
];

export const ALGORITHM_POSTS: readonly FeedPost[] = [
  {
    id: 'n-1',
    category: 'neutro',
    level: 1,
    handle: '@cronica.orbital',
    format: 'Post',
    headline: '57 anos depois da Apollo 11: quem decide o futuro da Lua?',
    subline: 'Agências públicas e empresas privadas disputam a mesma órbita hoje.',
    baseViews: '48 mil',
  },
  {
    id: 'n-2',
    category: 'neutro',
    level: 1,
    handle: '@radar.espacial',
    format: 'Corte 14s',
    headline: 'Módulo lunar de 1969 comparado aos foguetes reutilizáveis de hoje',
    subline: 'De computadores de 72 KB a transmissões ao vivo na palma da mão.',
    baseViews: '91 mil',
  },
  {
    id: 'n-3',
    category: 'neutro',
    level: 1,
    handle: '@arquivo.tv',
    format: 'Corte 14s',
    headline: 'Por que quase ninguém assiste mais lançamentos inteiros na TV?',
    subline: 'A atenção migrou para cortes curtos e rápidos no celular.',
    baseViews: '62 mil',
  },

  {
    id: 'c-1',
    category: 'ciencia',
    level: 1,
    handle: '@observatorio.pub',
    format: 'Post',
    headline: 'Programa Artemis libera dados abertos sobre a superfície lunar',
    subline: 'Universidades públicas analisam amostras em parceria internacional.',
    baseViews: '34 mil',
  },
  {
    id: 'c-2',
    category: 'ciencia',
    level: 1,
    handle: '@fisica.em.dados',
    format: 'Corte 14s',
    headline: 'Espelhos deixados na Lua em 1969 ainda refletem lasers da Terra',
    subline: 'O experimento mede até hoje o afastamento da Lua em milímetros.',
    baseViews: '77 mil',
  },
  {
    id: 'c-3',
    category: 'ciencia',
    level: 2,
    handle: '@ciencia.aberta',
    format: 'Post',
    headline: 'Sem verba pública não existe foguete privado: a conta que poucos mostram',
    subline: 'Contratos estatais financiam a pesquisa básica usada por empresas.',
    baseViews: '129 mil',
  },
  {
    id: 'c-4',
    category: 'ciencia',
    level: 2,
    handle: '@dados.espaciais',
    format: 'Ao vivo',
    headline: 'Satélites públicos monitoram clima e desmatamento em tempo real',
    subline: 'Infraestrutura estatal ajuda a prever enchentes e proteger cidades.',
    baseViews: '115 mil',
  },
  {
    id: 'c-5',
    category: 'ciencia',
    level: 3,
    handle: '@alerta.cientifico',
    format: 'Urgente',
    headline: 'Cortes na ciência pública entregam a órbita para monopólios privados',
    subline: 'Pesquisadores alertam para dependência total de redes particulares.',
    baseViews: '340 mil',
  },
  {
    id: 'c-6',
    category: 'ciencia',
    level: 3,
    handle: '@consenso.lab',
    format: 'Urgente',
    headline: 'Como algoritmos enterram estudos científicos para priorizar polêmica',
    subline: 'Artigos revisados perdem alcance para vídeos feitos só para gerar raiva.',
    baseViews: '412 mil',
  },

  {
    id: 'a-1',
    category: 'antipolitica',
    level: 1,
    handle: '@mercado.orbital',
    format: 'Corte 14s',
    headline: 'Foguete privado pousa de ré enquanto agência estatal atrasa calendário',
    subline: 'Críticos dizem que burocracia pública trava o avanço tecnológico.',
    baseViews: '280 mil',
  },
  {
    id: 'a-2',
    category: 'antipolitica',
    level: 1,
    handle: '@founder.clips',
    format: 'Corte 14s',
    headline: 'Bilionário explica em podcast por que quer colonizar Marte sem políticos',
    subline: 'Corte de 20 segundos passa de 2 milhões de visualizações em 4 horas.',
    baseViews: '510 mil',
  },
  {
    id: 'a-3',
    category: 'antipolitica',
    level: 2,
    handle: '@estado.zero',
    format: 'Corte 14s',
    headline: 'SEU IMPOSTO QUEIMADO: estatal gasta 10x mais que empresa privada',
    subline: 'Políticos só criam burocracia; quem constrói o futuro são bilionários.',
    baseViews: '890 mil',
  },
  {
    id: 'a-4',
    category: 'antipolitica',
    level: 2,
    handle: '@cortes.disruptivos',
    format: 'Ao vivo',
    headline: 'A política morreu: um foguete e um app fazem mais que o Congresso',
    subline: 'Empresário ironiza agências reguladoras e viraliza entre jovens.',
    baseViews: '1,1 mi',
  },
  {
    id: 'a-5',
    category: 'antipolitica',
    level: 3,
    handle: '@antissistema.hd',
    format: 'Urgente',
    headline: 'FECHEM AS AGÊNCIAS! Burocratas travam a humanidade com impostos',
    subline: 'Chega de Estado inútil: entregue o espaço para quem entrega resultado.',
    baseViews: '2,4 mi',
  },
  {
    id: 'a-6',
    category: 'antipolitica',
    level: 3,
    handle: '@alfa.tech.br',
    format: 'Urgente',
    headline: 'Governo tenta censurar satélites privados porque odeia concorrência',
    subline: 'Só o mercado salva; nenhum político deveria controlar tecnologia.',
    baseViews: '3,1 mi',
  },

  {
    id: 'k-1',
    category: 'conspiracao',
    level: 1,
    handle: '@detalhe.oculto',
    format: 'Corte 14s',
    headline: 'Por que a bandeira de 1969 parece mexer se não existe vento na Lua?',
    subline: 'Vídeo em câmera lenta reacende dúvidas sobre a gravação original.',
    baseViews: '430 mil',
  },
  {
    id: 'k-2',
    category: 'conspiracao',
    level: 1,
    handle: '@arquivos.x.br',
    format: 'Corte 14s',
    headline: 'Cadê as estrelas nas fotos oficiais da Apollo 11? Ninguém explica',
    subline: 'Zoom extremo nas imagens antigas viraliza nos comentários.',
    baseViews: '670 mil',
  },
  {
    id: 'k-3',
    category: 'conspiracao',
    level: 2,
    handle: '@verdade.sem.filtro',
    format: 'Ao vivo',
    headline: 'A FARSA DO SÉCULO: estúdio secreto gravou o pouso lunar em 1969',
    subline: 'Se fomos com tecnologia de calculadora, por que demoramos tanto para voltar?',
    baseViews: '1,4 mi',
  },
  {
    id: 'k-4',
    category: 'conspiracao',
    level: 2,
    handle: '@desperta.feed',
    format: 'Corte 14s',
    headline: 'Fitas originais da NASA sumiram: coincidência ou queima de arquivo?',
    subline: 'A TV repetiu a mesma história em todos os canais para ninguém questionar.',
    baseViews: '1,8 mi',
  },
  {
    id: 'k-5',
    category: 'conspiracao',
    level: 3,
    handle: '@sistema.hackeado',
    format: 'Urgente',
    headline: 'PROVADO! Nunca saímos da Terra — o maior golpe da história',
    subline: 'Compartilhe antes que derrubem este vídeo do ar.',
    baseViews: '4,2 mi',
  },
  {
    id: 'k-6',
    category: 'conspiracao',
    level: 3,
    handle: '@codigosecreto.99',
    format: 'Urgente',
    headline: 'ACORDE AGORA: mídia, Estado e ciência mentiram juntos desde 1969',
    subline: 'Tudo foi teatro de estúdio para controlar a opinião pública.',
    baseViews: '5,0 mi',
  },
];

export const RETENTION_TOASTS: Record<FeedVector, readonly string[]> = {
  ciencia: [
    'Novo alerta: 19 comentários responderam ao debate sobre ciência pública',
    'Recomendado agora: dossiê urgente sobre monopólios de satélites',
    'Seu feed foi ajustado para manter você mais tempo em alertas científicos',
  ],
  antipolitica: [
    'Corte polêmico sobre impostos acabou de viralizar no seu feed',
    '142 pessoas curtiram sua reação contra agências estatais',
    'Próximo vídeo automático: bilionário critica políticos ao vivo',
  ],
  conspiracao: [
    'Urgente: assista antes que apaguem a suposta prova sobre 1969',
    '89 novas respostas: "finalmente alguém mostrou o outro lado"',
    'Fontes científicas foram empurradas para fora da sua tela inicial',
  ],
};

export const ALGORITHM_CONCEPTS: readonly AlgorithmConcept[] = [
  {
    id: 'bolha',
    title: 'Filtro Bolha',
    author: 'Eli Pariser',
    summary: 'O algoritmo esconde opiniões diferentes e mostra quase só aquilo que confirma seus cliques.',
    triggerLabel: 'Ativa quando 1 tema passa de 45%',
  },
  {
    id: 'infocracia',
    title: 'Infocracia',
    author: 'Byung-Chul Han',
    summary: 'O poder digital não censura à força: ele captura nossa atenção usando dados e indignação.',
    triggerLabel: 'Ativa acima de 50% de polarização',
  },
  {
    id: 'cansaco',
    title: 'Sociedade do Cansaço',
    author: 'Byung-Chul Han',
    summary: 'Notificações e estímulos sem pausa esgotam nossa capacidade de parar e refletir.',
    triggerLabel: 'Ativa após 4 interações no feed',
  },
];

export const SECOND_SCREEN_OPTIONS: readonly AuditOption[] = [
  { label: 'Nunca', score: 0 },
  { label: 'Às vezes', score: 13 },
  { label: 'Sempre', score: 25 },
];

export const NEWS_FORMAT_OPTIONS: readonly AuditOption[] = [
  { label: 'Texto ou jornal', score: 0 },
  { label: 'Misto', score: 13 },
  { label: 'Cortes de 30s', score: 25 },
];

export const OPPOSING_VIEW_OPTIONS: readonly AuditOption[] = [
  { label: 'Lê e reflete', score: 0 },
  { label: 'Passa direto', score: 12 },
  { label: 'Bloqueia ou briga', score: 25 },
];

export const AUDIT_PRESETS: readonly AuditPreset[] = [
  {
    id: 'preset-1969',
    label: 'Rotina de 1969',
    subtitle: 'TV aberta, foco longo',
    hours: 2,
    secondScreen: 0,
    newsFormat: 0,
    opposingView: 0,
  },
  {
    id: 'preset-hibrido',
    label: 'Rotina Híbrida',
    subtitle: 'Divide entre tela e celular',
    hours: 6,
    secondScreen: 1,
    newsFormat: 1,
    opposingView: 1,
  },
  {
    id: 'preset-feed',
    label: 'Preso no Feed',
    subtitle: 'Cortes curtos e bolha fechada',
    hours: 10,
    secondScreen: 2,
    newsFormat: 2,
    opposingView: 2,
  },
];

export const AUDIT_PROFILES: readonly AuditProfile[] = [
  {
    id: 'espectador-1969',
    title: 'Espectador de 1969',
    rangeLabel: '0 a 33 pontos',
    accent: '#C94A29',
    bullets: [
      'Atenção contínua: consegue acompanhar conteúdos longos sem trocar de tela.',
      'Espaço comum: consome fontes variadas fora de um único feed automático.',
      'Lembrete de Adorno e Horkheimer: menos bolha não anula a influência da grande mídia.',
    ],
  },
  {
    id: 'hibrido',
    title: 'Híbrido em Transição',
    rangeLabel: '34 a 66 pontos',
    accent: '#A3E635',
    bullets: [
      'Atenção dividida: alterna entre telas maiores e checagens rápidas no celular.',
      'Filtro Bolha (Eli Pariser): o algoritmo já entende seus gostos, mas ainda há frestas.',
      'Infocracia (Byung-Chul Han): vulnerável a picos de raiva em assuntos políticos quentes.',
    ],
  },
  {
    id: 'refem-algoritmo',
    title: 'Refém do Algoritmo',
    rangeLabel: '67 a 100 pontos',
    accent: '#EF4444',
    bullets: [
      'Bolha fechada (Eli Pariser): o feed só confirma certezas e apaga o contraditório.',
      'Infocracia (Byung-Chul Han): indignação rápida toma o lugar do debate político.',
      'Sociedade do Cansaço: excesso de estímulos cansa a mente sem dar tempo para pensar.',
    ],
  },
];
