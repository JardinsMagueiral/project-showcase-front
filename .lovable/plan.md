

## Problema

Ao clicar "Ver Mais" / "Ver Todos" os Imóveis, o usuário vai para `/imoveis`. Essa página não mostra filtros visíveis — apenas aplica filtros vindos da URL (query params). Sem barra de filtros, o usuário não consegue alterar os critérios na própria página.

## Solução

Adicionar uma barra de filtros inline no topo da listagem em `/imoveis`, igual à do `FeaturedProperties` (Tipo, Operação, Quartos, Banheiros, Preço mín/máx). Os filtros sincronizam com a URL via `setSearchParams`, preservando os valores que vieram da home/PropertySearch e permitindo alteração.

## Alteração

**Arquivo: `src/pages/Imoveis.tsx`**

1. Trocar `useSearchParams` para usar tanto leitura quanto escrita: `const [searchParams, setSearchParams] = useSearchParams()`
2. Adicionar bloco de filtros logo abaixo do hero, antes da contagem de resultados:
   - Selects: Tipo, Operação, Quartos, Banheiros
   - Inputs: Preço mín., Preço máx.
   - Botão "Limpar filtros" quando houver algum ativo
3. Cada alteração chama `setSearchParams` atualizando o param correspondente (removendo se vazio)
4. Layout responsivo: `grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6` (funciona bem em 390px)
5. Manter toda a lógica existente de `filteredImoveis` (já lê de `searchParams`)

### Detalhes técnicos

- Sem mudanças de banco
- Sem novas rotas
- Filtros refletidos na URL (compartilháveis e persistentes)
- Valores iniciais vêm dos query params da URL — então filtros aplicados na home aparecem pré-preenchidos

