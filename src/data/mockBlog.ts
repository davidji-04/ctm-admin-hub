import { EditorialSeries } from '@/types/blog';
import { Author } from '@/types/blog';
import { Category, Tag } from '@/types/blog';
import { Article, ArticleCard, ArticleBlock } from '@/types/blog';

export const editorialSeries: EditorialSeries[] = [
  {
    id: 'series-horizontes',
    name: 'Horizontes',
    slug: 'horizontes',
    description: 'Rotas que definem o fim do mundo conhecido.',
  },
  {
    id: 'series-terra-e-tempo',
    name: 'Terra e Tempo',
    slug: 'terra-e-tempo',
    description: 'Histórias lentas sobre lugares que ficam.',
  },
];

export const mockAuthors: Author[] = [
  {
    id: 'autor-afonso-luz',
    name: 'Afonso Luz',
    slug: 'afonso-luz',
    bio: 'Cofundador do Cheiro de Terra Molhada, fotógrafo documental e guia de expedições nos lugares mais remotos do planeta.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'autor-clara-neves',
    name: 'Clara Neves',
    slug: 'clara-neves',
    bio: 'Escritora e alpinista. Escreve sobre o silêncio, a montanha e o impacto do tempo na paisagem.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
  },
];

export const mockCategories: Category[] = [
  {
    id: 'cat-diarios',
    name: 'Diários de Bordo',
    slug: 'diarios-de-bordo',
    description: 'Relatos na primeira pessoa das nossas expedições.',
  },
  {
    id: 'cat-guias',
    name: 'Manuais de Sobrevivência',
    slug: 'manuais-sobrevivencia',
    description: 'Guias técnicos, dicas de equipamento e preparação.',
  },
  {
    id: 'cat-ensaios',
    name: 'Ensaios Visuais',
    slug: 'ensaios-visuais',
    description: 'A fotografia como linguagem principal.',
  },
];
export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'trekking' }, { id: 'tag-2', name: 'inverno' },
  { id: 'tag-3', name: 'ártico' },   { id: 'tag-4', name: 'diário' },
  { id: 'tag-5', name: 'natureza' }, { id: 'tag-6', name: 'aventura' },
  { id: 'tag-7', name: 'solo' },     { id: 'tag-8', name: 'guia' },
  { id: 'tag-9', name: 'europa' },   { id: 'tag-10', name: 'expedição' },
];



export const mockSeries: EditorialSeries[] = [
  {
    id: 'series-horizontes',
    name: 'Horizontes',
    slug: 'horizontes',
    description: 'Rotas que definem o fim do mundo conhecido.', //
  },
  {
    id: 'series-terra-e-tempo',
    name: 'Terra e Tempo',
    slug: 'terra-e-tempo',
    description: 'Histórias lentas sobre lugares que ficam.', //
  },
];

const kungsledenBlocks: ArticleBlock[] = [
  {
    id: 'b1',
    type: 'text',
    order: 1,
    content: '<p>A primeira coisa que notas quando entras no Círculo Polar Ártico não é o frio, mas o silêncio. Um silêncio tão denso que parece ter peso. O <em>Kungsleden</em>, ou O Caminho do Rei, estende-se por mais de 400 quilómetros através do norte da Suécia, mas nós viemos apenas para a secção mais selvagem, em pleno inverno.</p>',
  },
  {
    id: 'b2',
    type: 'image',
    order: 2,
    layout: 'full_width',
    media: {
      url: 'https://images.unsplash.com/photo-1548560781-a7a07d9d33db?auto=format&fit=crop&q=80&w=2000',
      alt: 'Caminhantes na neve profunda do Ártico',
      caption: 'A vastidão branca a caminho de Abiskojaure.',
      credit: 'Afonso Luz',
    },
  },
  {
    id: 'b3',
    type: 'quote',
    order: 3,
    text: 'Não conquistamos a montanha, apenas a nós mesmos no processo de a atravessar.',
    author: 'Clara Neves, Diários de Inverno',
  },
  {
    id: 'b4',
    type: 'text',
    order: 4,
    content: '<p>Nestas latitudes, a preparação não é apenas recomendada, é a diferença entre uma memória épica e um pesadelo logístico. O equipamento certo é o teu único seguro de vida. As noites descem aos -30ºC com facilidade e os abrigos, embora confortáveis, exigem que cortes a tua própria lenha e derretas neve para beber.</p>',
  },
  {
    id: 'b5',
    type: 'route_card',
    order: 5,
    routeId: 'route-kungsleden-inverno', 
  },
  {
    id: 'b6',
    type: 'separator',
    order: 6,
  },
  {
    id: 'b7',
    type: 'cta',
    order: 7,
    text: 'Pronto para testar os teus limites no Ártico? As vagas para a próxima expedição de inverno já estão abertas.',
    buttonLabel: 'Ver Expedição',
    buttonLink: '/percursos/kungsleden',
  },
];

export const mockFullArticles: Article[] = [
  {
    id: 'art-kungsleden-silencio',
    slug: 'o-peso-do-silencio-no-artico',
    language: 'pt',
    title: 'O Peso do Silêncio no Kungsleden',
    subtitle: 'Uma travessia invernal na última fronteira da Europa.',
    excerpt: 'Atravessar o Caminho do Rei no inverno sueco é uma lição de humildade, resistência e um encontro profundo com o silêncio.',
    intro: 'Dias curtos, auroras boreais e temperaturas extremas. O Kungsleden exige tudo, mas devolve ainda mais.',
    blocks: kungsledenBlocks,
    
    heroImage: {
      url: 'https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&q=80&w=2000',
      alt: 'Montanhas cobertas de neve sob o céu nórdico',
    },
    
    authorId: mockAuthors[0].id,
    categoryIds: [mockCategories[0].id],
    tagIds: ['tag-artico', 'tag-silencio', 'tag-inverno'],
    seriesId: mockSeries[0].id,
    
    relatedRouteIds: ['route-kungsleden-inverno'],
    
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    publishedAt: '2024-01-20T09:00:00Z',
    status: 'published',
    
    featured: true,
    featuredOrder: 1,
    commentsEnabled: false,
    
    seo: {
      title: 'Travessia de Inverno no Kungsleden | Diários da Terra',
      description: 'Descobre o que é necessário para sobreviver e aproveitar uma travessia de inverno no Kungsleden, na Suécia.',
      indexable: true,
    },
  },
  {
    id: 'art-arte-fogueira',
    slug: 'a-arte-da-fogueira',
    language: 'pt',
    title: 'A Arte da Fogueira em Dias de Chuva',
    subtitle: 'Como o elemento mais primitivo ainda é o nosso maior conforto.',
    excerpt: 'Quando a tempestade cai e a roupa pesa, uma pequena chama é a fronteira entre a desistência e a esperança.',
    blocks: [
      {
        id: 'b-fogo-1',
        type: 'text',
        order: 1,
        content: '<p>A chuva batia nas folhas de carvalho com uma violência rítmica...</p>'
      }
    ],
    heroImage: {
      url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=2000',
      alt: 'Fogueira na floresta durante o crepúsculo',
    },
    authorId: mockAuthors[1].id,
    categoryIds: [mockCategories[1].id],
    tagIds: ['tag-equipamento'],
    seriesId: mockSeries[1].id,
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
    publishedAt: '2024-02-10T09:00:00Z',
    status: 'published',
    featured: false,
    commentsEnabled: true,
    seo: {
      title: 'A Arte de Fazer Fogo à Chuva | Manuais',
      description: 'Técnicas de sobrevivência e reflexões ao redor da fogueira.',
      indexable: true,
    },
  }
];




export const mockArticleCards: ArticleCard[] = mockFullArticles.map(article => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  subtitle: article.subtitle,
  excerpt: article.excerpt,
  heroImage: article.heroImage,
  author: mockAuthors.find(a => a.id === article.authorId)!,
  publishedAt: article.publishedAt || article.createdAt,
  categories: article.categoryIds.map(id => mockCategories.find(c => c.id === id)!),
  series: mockSeries.find(s => s.id === article.seriesId)!,
}));