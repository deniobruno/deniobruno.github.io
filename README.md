# ⚡ Portfólio Pessoal — Dênio Mingote

> Portfólio profissional de página única (*single-page application* pura), com estética de terminal tecnológico / cyberpunk moderno, visual interativo e alta performance.

🌐 **Site no ar:** [deniomingote.github.io](https://deniomingote.github.io)  
👨‍💻 **Autor:** Dênio Mingote — Estudante de Sistemas de Informação na UFVJM (2024–2028) & Desenvolvedor Web  
💼 **LinkedIn:** [linkedin.com/in/denio-mingote](https://www.linkedin.com/in/denio-mingote)  
🐙 **GitHub:** [github.com/deniobruno](https://github.com/deniobruno)

---

## 🎯 Destaques do Projeto

- **Zero Frameworks ou Bundlers**: Construído 100% com **HTML5 semântico, CSS3 moderno e JavaScript puro (ES6+)**. Sem dependências externas de build (sem Node, npm, React ou Tailwind).
- **Globo 3D Holográfico Interativo**: Esfera 3D projetada em Canvas puro com rotação manual por arrasto do mouse/touch, inércia suave e anéis orbitais.
- **Fundo Cibernético Contínuo**: Malha de nós e partículas que reagem dinamicamente à posição do cursor em toda a página e através do cabeçalho de vidro fosco (*glassmorphism*).
- **Projetos Orientados a Dados (JSON)**: Os projetos são carregados via `fetch()` assíncrono a partir de `data/projetos.json`. Adicionar ou editar projetos não exige mexer no HTML.
- **Efeito 3D Tilt nos Cards**: Inclinação em perspectiva tridimensional ao passar o mouse sobre os cards dos projetos.
- **Busca e Filtros Instantâneos**: Busca em tempo real por tecnologia, nome ou palavra-chave, além de filtros por categoria.
- **Modal de Detalhes Holográfico**: Exibe história do projeto, aprendizados, desafios e links reais para demonstração no ar.
- **Sintetizador de Áudio Nativo**: Efeitos sonoros cibernéticos táteis sintetizados em tempo real via **Web Audio API pura** (sem carregar arquivos de áudio externos), com botão para mutar/desmutar no topo.
- **Acessibilidade e SEO**: Alto contraste (WCAG AA), foco visível para navegação por teclado, meta tags completas (Open Graph e Twitter Card) e suporte a `prefers-reduced-motion`.

---

## 📂 Estrutura de Arquivos

```text
./
├── index.html               # Estrutura semântica principal
├── .nojekyll                # Desativa o processamento do Jekyll no GitHub Pages
├── README.md                # Documentação do projeto
├── css/
│   └── style.css            # Design system, variáveis CSS, temas e componentes
├── js/
│   ├── main.js              # Inicializador, alternância de tema, menu mobile, contato
│   ├── globe.js             # Globo 3D holográfico interativo em Canvas
│   ├── audio.js             # Sintetizador sonoro via Web Audio API
│   ├── particles.js         # Malha de nós e partículas interativas globais
│   ├── typing.js            # Efeito de digitação realista de terminal
│   ├── projects.js          # Renderização dinâmica, tilt 3D, filtros, busca e modal
│   └── reveal.js            # Barras de habilidades neon, odômetro e spotlight
├── data/
│   └── projetos.json        # Base de dados dos projetos
└── assets/
    ├── img/
    │   └── favicon.svg      # Favicon minimalista com logo <DM/>
    └── curriculo.pdf        # Arquivo do currículo para download
```

---

## 🚀 Como Rodar Localmente

> ⚠️ **Atenção:** Como o site carrega o arquivo `data/projetos.json` dinamicamente via `fetch()`, você **não deve** abrir o arquivo `index.html` com duplo clique direto (protocolo `file:///`), pois os navegadores bloqueiam requisições locais por segurança (política CORS). É necessário um servidor local simples.

### Opção 1 — VS Code (Recomendado)
1. Instale a extensão **[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** no VS Code.
2. Abra a pasta do projeto no VS Code.
3. Clique com o botão direito no arquivo `index.html` → **Open with Live Server**.

### Opção 2 — Python (Terminal)
Abra o terminal na pasta do projeto e execute:
```bash
python -m http.server 8000
```
Depois, acesse no navegador: `http://localhost:8000`

---

## 📝 Como Adicionar ou Modificar Projetos

Para adicionar um novo projeto ao portfólio, você **não precisa mexer no código HTML**. Basta abrir o arquivo `data/projetos.json` e adicionar um novo objeto seguindo este formato:

```json
{
  "id": "meu-novo-projeto",
  "titulo": "Nome do Projeto",
  "descricaoCurta": "Uma frase resumida para o card principal.",
  "descricaoLonga": "Descrição completa, desafios técnicos superados e aprendizados para o modal.",
  "categorias": ["web", "dados"],
  "tecnologias": ["HTML", "CSS", "JavaScript", "Python"],
  "imagem": "",
  "galeria": [],
  "github": "https://github.com/deniobruno/meu-repo",
  "demo": "https://meu-projeto.com.br",
  "destaque": true,
  "ano": 2026
}
```

- `destaque: true`: Faz o projeto aparecer no topo do grid com a badge **Destaque**.
- Se `github` ou `demo` ficarem como `""` (vazios), o site não exibirá botões vazios nem quebrará.
- Se `imagem` for vazia `""`, o site exibe automaticamente o elegante **wireframe de terminal holográfico**.

---

## 📄 Como Atualizar o Currículo

1. Salve o seu novo currículo em formato **PDF**.
2. Renomeie o arquivo para: `curriculo.pdf`.
3. Substitua o arquivo dentro da pasta `assets/`:
   ```text
   assets/curriculo.pdf
   ```
4. Pronto! O botão **"Baixar currículo"** no Hero fará o download do arquivo atualizado automaticamente.

---

## 🌐 Passo a Passo para Publicar no GitHub Pages

Para colocar o seu site no ar gratuitamente no endereço `https://deniomingote.github.io`:

### Passo 1: Criar o Repositório no GitHub
1. Acesse o seu GitHub ([github.com](https://github.com)).
2. Clique em **New Repository** (Novo Repositório).
3. No campo **Repository name**, digite exatamente:
   ```text
   deniomingote.github.io
   ```
   *(ou `portfolio`, se preferir que fique em `deniobruno.github.io/portfolio`)*.
4. Deixe como **Public** (Público) e **não** marque a opção de criar README (já temos um).
5. Clique em **Create repository**.

### Passo 2: Enviar os Arquivos pelo Terminal
Na pasta do seu projeto, abra o terminal (PowerShell, Bash ou Git Bash) e execute:

```bash
# 1. Inicializa o repositório git (caso ainda não esteja inicializado)
git init

# 2. Adiciona todos os arquivos do projeto
git add .

# 3. Cria o primeiro commit
git commit -m "feat: portfolio tecnologico e interativo concluido"

# 4. Define o branch principal como main
git branch -M main

# 5. Conecta ao seu repositório remoto no GitHub
git remote add origin https://github.com/deniobruno/deniomingote.github.io.git

# 6. Envia os arquivos para o GitHub
git push -u origin main
```

### Passo 3: Ativar o GitHub Pages
1. No seu repositório no GitHub, clique na aba **Settings** (Configurações) no topo.
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment** > **Source**, selecione:
   - Branch: `main`
   - Pasta: `/ (root)`
4. Clique em **Save**.
5. Aguarde cerca de 1 a 2 minutos. O GitHub exibirá o link oficial:  
   `Your site is live at https://deniomingote.github.io/`

---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte `LICENSE` para mais informações.
