import { ModularPage } from '@/types/modular-page';

export const mockModularPages: ModularPage[] = [
  {
    id: 'page-1',
    slug: 'guia-completo-trilhas',
    pageTitle: 'Guia Completo das Melhores Trilhas',
    status: 'published',
    cardListing: {
      title: 'Guia de Trilhas',
      image: {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
        alt: 'Trilha montanhosa com vista panorâmica',
        caption: 'Paisagem natural',
      },
      shortDescription: 'Descubra as trilhas mais populares com dicas práticas e informações úteis para planejadores de aventuras.',
    },
    seo: {
      title: 'Guia Completo das Melhores Trilhas - CTM Adventure',
      metaDescription: 'Explore trilhas incríveis com nosso guia completo. Dicas, mapas e informações para planejadores de aventuras.',
      ogImage: {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
        alt: 'Trilha',
      },
    },
    blocks: [
      {
        id: 'block-hero-1',
        type: 'hero',
        order: 1,
        backgroundMedia: {
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
          alt: 'Hero background',
        },
        title: 'Descubra as Melhores Trilhas',
        subtitle: 'Planeje sua próxima aventura com confiança',
      },
      {
        id: 'block-text-1',
        type: 'text',
        order: 2,
        content: 'As trilhas portuguesas oferecem algumas das paisagens mais espetaculares da Europa. Neste guia, exploramos as melhores rotas para cada nível de experiência.',
      },
      {
        id: 'block-image-1',
        type: 'image',
        order: 3,
        layout: 'full_width',
        media: {
          url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&h=600&fit=crop',
          alt: 'Caminhante em trilha montanhosa',
          caption: 'Exploring mountain trails',
        },
      },
      {
        id: 'block-accordion-1',
        type: 'accordion',
        order: 4,
        items: [
          {
            id: 'acc-1',
            question: 'Qual é a melhor época para fazer trilhas?',
            answer: 'A primavera e outono são as melhores estações, com temperaturas moderadas e paisagens espetaculares.',
          },
          {
            id: 'acc-2',
            question: 'Que equipamento devo levar?',
            answer: 'Essencial: mapa, bússola, água, lanche, protetor solar, capa de chuva e sapatos apropriados.',
          },
          {
            id: 'acc-3',
            question: 'Como me preparo fisicamente?',
            answer: 'Comece com trilhas fáceis e aumente gradualmente a dificuldade. Treino cardiovascular é importante.',
          },
        ],
      },
      {
        id: 'block-cta-1',
        type: 'cta',
        order: 5,
        text: 'Pronto para começar sua aventura?',
        buttonLabel: 'Explorar Rotas',
        buttonLink: '/routes',
      },
    ],
    relatedRouteIds: ['route-1', 'route-2', 'route-3'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    publishedAt: '2024-01-20',
  },
  {
    id: 'page-2',
    slug: 'dicas-fotografia-natureza',
    pageTitle: 'Dicas de Fotografia da Natureza',
    status: 'draft',
    cardListing: {
      title: 'Fotografia de Natureza',
      image: {
        url: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=300&fit=crop',
        alt: 'Câmera fotográfica profissional',
      },
      shortDescription: 'Aprenda técnicas essenciais de fotografia para capturar a beleza natural das paisagens.',
    },
    seo: {
      title: 'Dicas de Fotografia da Natureza | CTM Adventure',
      metaDescription: 'Domine a fotografia de natureza com nossas dicas profissionais. Técnicas, equipamento e inspiração.',
    },
    blocks: [
      {
        id: 'block-text-2',
        type: 'text',
        order: 1,
        content: 'A fotografia de natureza é uma forma maravilhosa de expressar sua criatividade e preservar memórias.',
      },
    ],
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
  },
];
