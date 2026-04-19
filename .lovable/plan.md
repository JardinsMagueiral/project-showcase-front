

## Problema

Ao clicar em "Mostrar Mais" na home, os imóveis expandem mas os filtros não aparecem no mobile (viewport 390px). Olhando o código atual em `FeaturedProperties.tsx`, os filtros JÁ existem dentro do bloco `if (isLoading)` — ou seja, só aparecem durante o carregamento, e ficam fora do retorno principal. Isso é um bug de estrutura.

## Solução

Mover o bloco de filtros (que está erroneamente dentro do `if (isLoading)`) para o retorno principal do componente, posicionado logo após o cabeçalho da seção, condicional ao `showAll`.

## Alteração

**Arquivo: `src/components/FeaturedProperties.tsx`**

1. Remover o bloco de filtros que está dentro do `if (isLoading)` (linhas ~62-114) — manter o loading limpo
2. Inserir o mesmo bloco de filtros no retorno principal, logo após o `<div className="mb-8 flex items-center justify-between">` do cabeçalho, condicional a `showAll`
3. Garantir que o grid responsivo dos filtros funcione bem no mobile (já usa `grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6`)

### Detalhes técnicos

- Nenhuma mudança de lógica — estados, `useMemo` e handlers já estão corretos
- Apenas reposicionamento JSX
- Filtros aparecerão imediatamente quando o usuário clicar "Mostrar Mais"

