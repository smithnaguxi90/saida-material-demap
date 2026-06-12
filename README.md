# 📦 Gestão de Materiais | COENG

Um Sistema Web Progressivo (PWA) de alta performance para gerenciamento e controle de saídas de materiais de almoxarifado. Construído com arquitetura limpa em Vanilla JavaScript, integração em tempo real com Firebase e interface responsiva desenhada com Tailwind CSS.

---

## ✨ Funcionalidades

- **Autenticação Segura:** Login via E-mail/Senha, Acesso Anônimo (Visitante), Redefinição de Senha e Edição de Perfil.
- **Controle de Acessos (RBAC):** Níveis de permissão distintos para Administradores, Usuários Padrão e Visitantes.
- **Painel Gerencial (Dashboard):** Gráficos interativos renderizados com _Chart.js_ mostrando o top 10 de encarregados e top 5 materiais mais consumidos. Suporte a _Lazy Loading_ (Gráficos só são gerados quando a aba é acessada).
- **CRUD de Lançamentos:** Registro rápido de saídas com auto-preenchimento via Código do Almoxarifado, edição de status (Pendente/Concluído) e exclusão controlada.
- **Processamento de Lotes (Batch):** Otimização massiva de banco de dados na inserção e deleção de dados agrupados usando o Firestore.
- **Integração com Excel:**
  - Importação de _Base de Materiais_ e _Histórico de Lançamentos_ lendo arquivos `.xlsx` / `.csv` direto no navegador via _SheetJS_.
  - Exportação inteligente da visão atual da tabela de lançamentos para Excel.
- **Filtros Avançados & Paginação:** Busca instantânea (com _Debounce_), filtro por encarregado, por status, ordenação e paginação otimizada via DOM Batching.
- **Offline-First (PWA):** Instalação nativa em Desktop/Mobile com Service Worker (`sw.js`), permitindo acesso offline aos assets cacheados.

---

## 🚀 Tecnologias e Bibliotecas

- **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
- **Estilização:** Tailwind CSS
- **Banco de Dados & Autenticação:** Firebase Firestore & Firebase Auth (Web SDK v11.6.1)
- **Gráficos:** Chart.js
- **Leitura e Geração de Excel:** SheetJS (xlsx)
- **Build/Minificação:** Vite (Bundler)

---

## 📂 Arquitetura do Projeto (Clean Architecture)

Para facilitar a manutenção e escalar rapidamente, a lógica do projeto foi modularizada rigorosamente:

```text
/
├── assets/               # Ícones, Favicons (SVG)
├── css/
│   └── output.css        # CSS compilado pelo Tailwind
├── js/
│   ├── app.js            # Controlador Principal & Event Delegation
│   ├── database.js       # Todas as regras de negócio e consultas do Firebase
│   ├── firebase.js       # Inicialização das credenciais da Nuvem
│   └── ui.js             # Funções de interface, Toasts, Abas e Ícones SVG
├── index.html            # Estrutura e marcação principal da Aplicação
├── manifest.json         # Manifesto de Instalação (PWA)
├── sw.js                 # Service Worker (Cache offline)
└── vite.config.js        # Configuração do Bundler e Servidor de Desenvolvimento
```

---

## 🛠️ Como Rodar Localmente

### 1. Clonando e executando

Por se tratar de um sistema client-side com BaaS (Firebase), o projeto não requer um back-end local pesado (como Express ou Django).

1. Clone o repositório.
2. Abra a pasta raiz.
3. Utilize o **Live Server** (Extensão do VS Code) ou qualquer servidor estático local para abrir o arquivo `index.html`.
   _⚠️ Nota: Abrir o HTML diretamente pelo navegador (`file:///`) bloqueará a importação dos módulos ES6 devido às políticas de CORS._

### 2. Configurando o Firebase

As chaves de API estão no arquivo `js/firebase.js`. Se quiser usar o seu próprio banco de dados, substitua o objeto `firebaseConfig` com as chaves geradas pelo seu Console do Firebase. Certifique-se de habilitar:

- Firestore Database
- Authentication (Email/Senha e Anônimo)

---

## 📦 Minificação e Deploy para Produção

Este projeto possui um script customizado para **minificar e ofuscar** o JavaScript antes de ir para o servidor de produção, melhorando a segurança e o tempo de carregamento.

**Pré-requisitos:** Node.js instalado.

```bash
# Instale o Terser globalmente ou na pasta do projeto
npm install terser

# Execute o script de build
node minificar.js
```

Isso comprimirá `app.js`, `database.js`, `ui.js` e `firebase.js`, mantendo as referências modulares seguras.

---

## 📄 Licença

Desenvolvido para uso da **COENG**. Uso restrito para a gestão de materiais autorizada.
