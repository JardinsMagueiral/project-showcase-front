

## Problema

A seção "Imóveis em Destaque" na página inicial não mostra nenhum imóvel porque o componente `FeaturedProperties` filtra por `destaque=true`, mas todos os 21 imóveis no banco têm `destaque=false`.

## Solução

Alterar o `FeaturedProperties.tsx` para mostrar os imóveis aprovados mais recentes quando não houver nenhum marcado como destaque. Ou seja, remover o filtro `.eq("destaque", true)` e mostrar simplesmente os 6 imóveis aprovados mais recentes, renomeando a seção para algo mais genérico como "Imóveis Disponíveis".

Alternativamente, manter a lógica de destaque mas fazer fallback: primeiro busca destaques, se não houver, busca os mais recentes.

### Arquivo: `src/components/FeaturedProperties.tsx`

- Remover `.eq("destaque", true)` da query
- Manter `.eq("status", "aprovado")` e `.order("created_at", { ascending: false }).limit(6)`
- Atualizar o título para "Imóveis Disponíveis" ou manter "Imóveis em Destaque" com fallback

### Detalhes tecnicos

- Apenas uma linha removida na query Supabase
- O `queryKey` deve ser atualizado para refletir a mudança
- Nenhuma migração de banco necessária

