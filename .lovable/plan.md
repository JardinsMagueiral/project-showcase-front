

## Plano: Filtros funcionando ao "Mostrar Mais" na página inicial

### Problema
Ao clicar "Mostrar Mais" na home, todos os imóveis aparecem mas sem opção de filtrá-los. O `PropertySearch` atual apenas navega para `/imoveis` — não filtra a listagem inline.

### Solução
Adicionar filtros inline no `FeaturedProperties` que aparecem quando o usuário clica "Mostrar Mais", permitindo filtrar por tipo, operação, quartos, banheiros e faixa de preço — tudo client-side, sem navegar para outra página.

### Alterações

**Arquivo: `src/components/FeaturedProperties.tsx`**

1. Adicionar estados de filtro (tipo, operação, precoMin, precoMax, quartos, banheiros)
2. Quando `showAll` é true, mostrar uma barra de filtros compacta acima do grid (usando Select e Input existentes)
3. Aplicar filtros client-side sobre o array `imoveis` antes de renderizar:
   - `tipo` → `imovel.tipo === tipo`
   - `operacao` → `imovel.operacao === operacao`
   - `quartos` → `imovel.quartos >= Number(quartos)`
   - `banheiros` → `imovel.banheiros >= Number(banheiros)`
   - `precoMin/precoMax` → range no `imovel.preco`
4. Mostrar contagem de resultados filtrados
5. Manter o botão "Mostrar Menos" para recolher de volta para 16

### Detalhes técnicos
- Filtragem 100% client-side (dados já carregados)
- Usa os mesmos componentes Select/Input do PropertySearch
- Nenhuma alteração de banco ou rotas necessária

