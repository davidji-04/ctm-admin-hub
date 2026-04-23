import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Type, Image as ImageIcon, Map, Quote, Trash2, ArrowUp, ArrowDown, 
  Film, LayoutGrid, SplitSquareHorizontal, Minus, Megaphone, Link 
} from 'lucide-react';

// Se estes caminhos derem erro, confirma se os ficheiros existem exatamente nestes locais
import { SHARED_MOCK_ROUTES } from '@/data/mockData'; 
import { mockFullArticles } from '@/data/mockBlog'; 

interface ModularEditorProps {
  blocks: any[];
  onChange: (blocks: any[]) => void;
}

export default function ModularEditor({ blocks, onChange }: ModularEditorProps) {
  
  // ─── LÓGICA DE GESTÃO DE BLOCOS ──────────────────────────────────────────
  
  const addBlock = (type: string) => {
    const baseBlock = { id: `block-${Date.now()}`, type, order: blocks.length + 1 };
    
    let newBlock: any = { ...baseBlock };
    switch (type) {
      case 'text': newBlock.content = ''; break;
      case 'image': newBlock = { ...newBlock, layout: 'full_width', media: { url: '', alt: '', caption: '', credit: '' } }; break;
      case 'gallery': newBlock = { ...newBlock, displayMode: 'grid', images: [] }; break;
      case 'video': newBlock.url = ''; newBlock.caption = ''; break;
      case 'quote': newBlock = { ...newBlock, text: '', author: '' }; break;
      case 'text_image': newBlock = { ...newBlock, imagePosition: 'left', content: '', media: { url: '', alt: '' } }; break;
      case 'separator': break;
      case 'cta': newBlock = { ...newBlock, text: '', buttonLabel: '', buttonLink: '' }; break;
      case 'route_card': newBlock.routeId = ''; break;
      case 'related_articles': newBlock.articleIds = []; break;
    }
    
    onChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => onChange(blocks.filter(b => b.id !== id));

  const updateBlock = (id: string, field: string, value: any) => {
    onChange(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    
    const orderedBlocks = newBlocks.map((b, i) => ({ ...b, order: i + 1 }));
    onChange(orderedBlocks);
  };

  // ─── RENDERIZADOR ────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      
      {/* MENU DE INSERÇÃO RÁPIDA DE BLOCOS */}
      <Card className="bg-gray-50 border-dashed sticky top-4 z-10 shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Construtor Modular (+ Adicionar Bloco)</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => addBlock('text')}><Type className="w-4 h-4 mr-2" /> Texto</Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('image')}><ImageIcon className="w-4 h-4 mr-2" /> Imagem</Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('gallery')}><LayoutGrid className="w-4 h-4 mr-2" /> Galeria</Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('video')}><Film className="w-4 h-4 mr-2" /> Vídeo</Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('quote')}><Quote className="w-4 h-4 mr-2" /> Citação</Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('text_image')}><SplitSquareHorizontal className="w-4 h-4 mr-2" /> Texto+Imagem</Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('separator')}><Minus className="w-4 h-4 mr-2" /> Separador</Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('cta')}><Megaphone className="w-4 h-4 mr-2" /> CTA</Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
            <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm" onClick={() => addBlock('route_card')}>
              <Map className="w-4 h-4 mr-2" /> Inserir Card de Rota
            </Button>
            <Button className="bg-[#0e0e0e] hover:bg-gray-800 text-white" size="sm" onClick={() => addBlock('related_articles')}>
              <Link className="w-4 h-4 mr-2" /> Artigos Relacionados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ÁREA DE CONSTRUÇÃO (CANVAS) */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400 italic">O artigo está vazio. Escolha um bloco acima para começar a escrever.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <Card key={block.id} className="relative group border-gray-300 hover:border-[#0e0e0e] transition-colors overflow-visible">
              
              {/* CONTROLOS DO BLOCO (REORDENAR E APAGAR) */}
              <div className="absolute -left-12 top-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="outline" size="icon" className="h-8 w-8 rounded-full shadow-sm bg-white" onClick={() => moveBlock(index, 'up')} disabled={index === 0}><ArrowUp className="w-4 h-4" /></Button>
                 <Button variant="outline" size="icon" className="h-8 w-8 rounded-full shadow-sm bg-white" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1}><ArrowDown className="w-4 h-4" /></Button>
              </div>
              <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" onClick={() => removeBlock(block.id)} className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
              </div>

              <CardContent className="p-6">
                
                {/* 1. TEXTO RICH TEXT */}
                {block.type === 'text' && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">1. Texto Narrativo</span>
                    <textarea 
                      className="w-full min-h-[150px] p-3 border rounded-md font-serif text-lg focus:outline-none focus:ring-1 focus:ring-black" 
                      placeholder="Escreva a sua história..." 
                      value={block.content || ''} 
                      onChange={(e) => updateBlock(block.id, 'content', e.target.value)} 
                    />
                  </div>
                )}

                {/* 2. IMAGEM */}
                {block.type === 'image' && (
                  <div className="space-y-4 pr-10">
                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><ImageIcon className="w-4 h-4"/> 2. Bloco de Imagem</span>
                    <div className="grid grid-cols-2 gap-4">
                      <select className="p-2 border rounded-md text-sm bg-white" value={block.layout || 'full_width'} onChange={(e) => updateBlock(block.id, 'layout', e.target.value)}>
                        <option value="full_width">100% Largura (Full-Width)</option>
                        <option value="centered">Margens Brancas (Centralizada)</option>
                      </select>
                      <Input placeholder="URL da Imagem..." value={block.media?.url || ''} onChange={(e) => updateBlock(block.id, 'media', { ...block.media, url: e.target.value })} />
                      <Input placeholder="Alt Text (Obrigatório) *" className="col-span-2 border-red-300" value={block.media?.alt || ''} onChange={(e) => updateBlock(block.id, 'media', { ...block.media, alt: e.target.value })} />
                      <Input placeholder="Legenda (Opcional)" value={block.media?.caption || ''} onChange={(e) => updateBlock(block.id, 'media', { ...block.media, caption: e.target.value })} />
                      <Input placeholder="Créditos da Foto (Opcional)" value={block.media?.credit || ''} onChange={(e) => updateBlock(block.id, 'media', { ...block.media, credit: e.target.value })} />
                    </div>
                  </div>
                )}

                {/* 3. GALERIA */}
                {block.type === 'gallery' && (
                  <div className="space-y-4 pr-10">
                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><LayoutGrid className="w-4 h-4"/> 3. Galeria de Imagens</span>
                    <div className="flex gap-4 mb-4">
                      <select className="p-2 border rounded-md text-sm bg-white w-1/3" value={block.displayMode || 'grid'} onChange={(e) => updateBlock(block.id, 'displayMode', e.target.value)}>
                        <option value="grid">Grelha Uniforme (Grid)</option>
                        <option value="masonry">Mosaico (Masonry)</option>
                        <option value="slider">Carrossel (Slider)</option>
                      </select>
                      <Button variant="outline" className="w-2/3" onClick={() => updateBlock(block.id, 'images', [...(block.images || []), { url: '', alt: '', caption: '' }])}>
                        + Adicionar Imagem à Galeria
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(block.images || []).length === 0 && <p className="text-sm text-gray-400 italic">Nenhuma imagem adicionada.</p>}
                      {(block.images || []).map((img: any, imgIndex: number) => (
                        <div key={imgIndex} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded border border-gray-100">
                          <Input className="col-span-4 text-sm bg-white" placeholder="URL da Imagem" value={img.url || ''} onChange={(e) => { const newImages = [...block.images]; newImages[imgIndex].url = e.target.value; updateBlock(block.id, 'images', newImages); }} />
                          <Input className="col-span-3 text-sm bg-white border-red-300" placeholder="Alt Text *" value={img.alt || ''} onChange={(e) => { const newImages = [...block.images]; newImages[imgIndex].alt = e.target.value; updateBlock(block.id, 'images', newImages); }} />
                          <Input className="col-span-4 text-sm bg-white" placeholder="Legenda (Opcional)" value={img.caption || ''} onChange={(e) => { const newImages = [...block.images]; newImages[imgIndex].caption = e.target.value; updateBlock(block.id, 'images', newImages); }} />
                          <Button variant="ghost" size="icon" className="col-span-1 text-red-500 hover:bg-red-50" onClick={() => updateBlock(block.id, 'images', block.images.filter((_: any, i: number) => i !== imgIndex))}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. VÍDEO */}
                {block.type === 'video' && (
                  <div className="space-y-3 pr-10">
                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Film className="w-4 h-4"/> 4. Bloco de Vídeo</span>
                    <Input placeholder="URL do Vídeo (Link YouTube, Vimeo ou MP4)..." value={block.url || ''} onChange={(e) => updateBlock(block.id, 'url', e.target.value)} />
                    <Input placeholder="Legenda do vídeo (Opcional)" value={block.caption || ''} onChange={(e) => updateBlock(block.id, 'caption', e.target.value)} />
                  </div>
                )}

                {/* 5. CITAÇÃO */}
                {block.type === 'quote' && (
                   <div className="space-y-3 pr-10">
                     <span className="text-xs font-bold text-gray-400 uppercase">5. Citação (Pull Quote)</span>
                     <textarea className="w-full p-4 border rounded-md font-serif text-2xl focus:outline-none focus:ring-1 focus:ring-black" placeholder='"Insira uma frase de impacto..."' value={block.text || ''} onChange={(e) => updateBlock(block.id, 'text', e.target.value)} />
                     <Input placeholder="Autor da citação (Ex: Afonso Luz)" value={block.author || ''} onChange={(e) => updateBlock(block.id, 'author', e.target.value)} />
                   </div>
                )}

                {/* 6. TEXTO + IMAGEM */}
                {block.type === 'text_image' && (
                  <div className="space-y-4 pr-10">
                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><SplitSquareHorizontal className="w-4 h-4"/> 6. Texto + Imagem Assimétrica</span>
                    <select className="w-full p-2 border rounded-md text-sm bg-white mb-2" value={block.imagePosition || 'left'} onChange={(e) => updateBlock(block.id, 'imagePosition', e.target.value)}>
                      <option value="left">🖼️ Imagem à Esquerda / 📝 Texto à Direita</option>
                      <option value="right">📝 Texto à Esquerda / 🖼️ Imagem à Direita</option>
                    </select>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                      <div className="space-y-3 md:border-r md:pr-4 border-gray-200">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Imagem</span>
                        <Input placeholder="URL da Imagem..." className="bg-white" value={block.media?.url || ''} onChange={(e) => updateBlock(block.id, 'media', { ...block.media, url: e.target.value })} />
                        <Input placeholder="Alt Text (Obrigatório) *" className="bg-white border-red-300" value={block.media?.alt || ''} onChange={(e) => updateBlock(block.id, 'media', { ...block.media, alt: e.target.value })} />
                      </div>
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Texto</span>
                        <textarea className="w-full min-h-[120px] p-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black" placeholder="Escreva o texto..." value={block.content || ''} onChange={(e) => updateBlock(block.id, 'content', e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. SEPARADOR */}
                {block.type === 'separator' && (
                   <div className="py-4 flex flex-col items-center justify-center opacity-50">
                     <span className="text-xs font-bold text-gray-400 uppercase mb-4">7. Pausa Visual (Separador)</span>
                     <div className="w-16 h-[2px] bg-[#0e0e0e]"></div>
                   </div>
                )}

                {/* 8. CTA */}
                {block.type === 'cta' && (
                  <div className="space-y-3 pr-10 bg-gray-50 p-4 rounded-md border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase">8. Chamada para Ação (CTA)</span>
                    <Input placeholder="Texto de Apelo (Ex: Pronto para a aventura?)" className="bg-white" value={block.text || ''} onChange={(e) => updateBlock(block.id, 'text', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Label do Botão (Ex: Ver Expedição)" className="bg-white" value={block.buttonLabel || ''} onChange={(e) => updateBlock(block.id, 'buttonLabel', e.target.value)} />
                      <Input placeholder="Link de Destino (Ex: /percursos/kungsleden)" className="bg-white" value={block.buttonLink || ''} onChange={(e) => updateBlock(block.id, 'buttonLink', e.target.value)} />
                    </div>
                  </div>
                )}

                {/* 9. CARD ROTA */}
                {block.type === 'route_card' && (
                  <div className="space-y-4 pr-10">
                    <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-2"><Map className="w-4 h-4" /> 9. Card de Rota / Experiência</span>
                    <select className="w-full p-3 border border-green-300 rounded-md bg-green-50/30 font-semibold" value={block.routeId || ''} onChange={(e) => updateBlock(block.id, 'routeId', e.target.value)}>
                      <option value="" disabled>Selecione um percurso na base de dados...</option>
                      {SHARED_MOCK_ROUTES.map(route => (
                        <option key={route.id} value={route.id}>{route.title} — {route.category.toUpperCase()}</option>
                      ))}
                    </select>
                    {block.routeId && (
                      <div className="mt-4 p-4 border border-green-200 rounded-md flex gap-6 items-center bg-white shadow-sm">
                         <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1548560781-a7a07d9d33db?w=150&h=150&fit=crop" className="object-cover w-full h-full" alt="Preview" />
                         </div>
                         <div className="flex-1">
                            <span className="text-xs text-green-600 font-bold uppercase mb-1 block">Pré-visualização</span>
                            <h4 className="font-serif text-xl">{SHARED_MOCK_ROUTES.find(r => r.id === block.routeId)?.title}</h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{SHARED_MOCK_ROUTES.find(r => r.id === block.routeId)?.country}</p>
                         </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 10. ARTIGOS RELACIONADOS */}
                {block.type === 'related_articles' && (
                  <div className="space-y-4 pr-10">
                    <span className="text-xs font-bold text-[#0e0e0e] uppercase flex items-center gap-2"><Link className="w-4 h-4" /> 10. Artigos Relacionados (Carrossel Final)</span>
                    <select className="w-full p-3 border rounded-md bg-white" onChange={(e) => {
                        const newId = e.target.value;
                        if (newId && !block.articleIds?.includes(newId)) {
                          updateBlock(block.id, 'articleIds', [...(block.articleIds || []), newId]);
                        }
                      }}>
                      <option value="">+ Selecionar história para adicionar ao final...</option>
                      {mockFullArticles.map(art => (
                         <option key={art.id} value={art.id}>{art.title}</option>
                      ))}
                    </select>
                    {block.articleIds?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {block.articleIds.map((id: string) => {
                          const artInfo = mockFullArticles.find(a => a.id === id);
                          return (
                            <div key={id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm">
                              <span className="truncate max-w-[200px]">{artInfo?.title || id}</span>
                              <button onClick={() => updateBlock(block.id, 'articleIds', block.articleIds.filter((aid: string) => aid !== id))} className="text-red-500 hover:text-red-700 font-bold ml-1">&times;</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}