
# Redesign da Pagina do Assistente Pedagogico

Vou fazer um redesign completo da pagina para ficar com um visual mais moderno, premium e conversivo. Aqui esta o que vai mudar:

---

## 1. Botao CTA customizado (mais redondinho e moderno)

Em vez de usar o HotmartButton padrao (verde retangular), vou criar um botao CTA customizado direto na pagina com:
- Bordas bem arredondadas (rounded-full)
- Gradiente roxo vibrante
- Efeito de brilho/pulse sutil para chamar atencao
- Sombra colorida
- Icone de seta
- Texto: "QUERO ACESSO AO ASSISTENTE PEDAGOGICO"
- Continua usando o checkout da Hotmart (carregando o widget)

## 2. Hero Section mais impactante

- Badge animado com efeito de brilho
- Headline com destaque em gradiente de texto (gradient text)
- Blobs de fundo maiores e mais vibrantes com animacao sutil
- Container do video com borda gradiente e glassmorphism
- Maior espacamento e hierarquia visual

## 3. Secao de Dores redesenhada

- Cards individuais com icone, em vez de lista simples
- Layout em grid (2 colunas no mobile, 3 no desktop)
- Fundo com gradiente sutil
- Cada dor com um icone relacionado

## 4. Secao "O que e" mais visual

- Cards glassmorphism para cada feature
- Icones maiores e coloridos
- Layout mais espaçado e respirado

## 5. Secao de Beneficios melhorada

- Cards maiores com efeito hover mais pronunciado
- Gradiente de fundo nos icones
- Animacao de escala no hover

## 6. Secao de Oferta mais urgente

- Container com borda gradiente
- Background diferenciado
- Botao CTA duplicado com destaque maximo

## 7. Garantia com visual de selo

- Card centralizado com borda e selo visual
- Icone maior e mais destaque

---

## Detalhes Tecnicos

### Arquivo alterado: `src/pages/AssistentePedagogicoPage.tsx`
- Reescrever completamente o componente com o novo design
- Criar um componente `CtaButton` customizado inline que carrega o widget Hotmart mas usa styling proprio (rounded-full, gradiente roxo, sombra, icone ArrowRight, texto em caps)
- Adicionar classes de animacao com Tailwind (animate-pulse, transition, hover:scale)
- Manter toda a estrutura semantica e o mesmo conteudo/copy
- Manter o mesmo checkout URL da Hotmart

### Nenhum arquivo novo necessario
- Tudo sera feito com Tailwind CSS inline no componente
- O widget Hotmart continua sendo carregado para o checkout funcionar
