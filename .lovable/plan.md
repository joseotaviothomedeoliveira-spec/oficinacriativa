

## Problema

As imagens dos produtos nao aparecem na pagina individual porque o campo `gallery_image_urls` esta vazio (`[]`) para todos os produtos na base de dados. O componente `ProductGallery` tenta mostrar `images[0]` que e `undefined`, resultando numa imagem quebrada.

A `cover_image_url` existe e funciona (aparece nos cards da pagina inicial), mas nao e usada como fallback na pagina do produto.

## Plano

### 1. Atualizar ProductPage.tsx
- Passar a `coverImageUrl` como fallback para o `ProductGallery` quando `galleryImageUrls` estiver vazio
- Logica: se `galleryImageUrls.length > 0`, usa-las; senao, usar `[coverImageUrl]`

### 2. Atualizar ProductGallery.tsx
- Esconder as miniaturas de selecao quando so existe 1 imagem (so o cover)
- Garantir que a imagem usa `object-contain` em vez de `object-cover` para manter consistencia com os cards (conforme memoria do projeto)

### Detalhes tecnicos
- Em `ProductPage.tsx` linha ~72: `images={product.galleryImageUrls.length > 0 ? product.galleryImageUrls : [product.coverImageUrl]}`
- Em `ProductGallery.tsx`: condicionar thumbnails a `images.length > 1`, e trocar `object-cover` por `object-contain`

