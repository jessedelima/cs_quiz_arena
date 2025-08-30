# CS Quiz Arena

Uma plataforma de quiz competitivo sobre Counter-Strike, onde jogadores podem testar seus conhecimentos, competir com outros e ganhar prêmios.

## 🚀 Tecnologias

- **React 18** - Versão do React com renderização aprimorada e recursos concorrentes
- **Vite** - Ferramenta de build e servidor de desenvolvimento ultrarrápido
- **Redux Toolkit** - Gerenciamento de estado com configuração Redux simplificada
- **TailwindCSS** - Framework CSS utilitário com ampla personalização
- **React Router v6** - Roteamento declarativo para aplicações React
- **Data Visualization** - D3.js e Recharts integrados para visualização de dados
- **Form Management** - React Hook Form para manipulação eficiente de formulários
- **Animation** - Framer Motion para animações suaves de UI
- **Testing** - Configuração de Jest e React Testing Library

## 📋 Pré-requisitos

- Node.js (v14.x ou superior)
- npm ou yarn

## 🛠️ Instalação

1. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
   
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## 📁 Estrutura do Projeto

```
cs_quiz_arena/
├── public/             # Ativos estáticos
├── src/
│   ├── components/     # Componentes UI reutilizáveis
│   ├── pages/          # Componentes de página
│   ├── styles/         # Estilos globais e configuração Tailwind
│   ├── utils/          # Serviços e utilitários
│   ├── App.jsx         # Componente principal da aplicação
│   ├── Routes.jsx      # Rotas da aplicação
│   └── index.jsx       # Ponto de entrada da aplicação
├── backend/            # Backend Node.js
│   ├── src/            # Código fonte do backend
│   ├── prisma/         # Schema e migrações do banco
│   └── data/           # Banco de dados SQLite
├── .env                # Variáveis de ambiente
├── index.html          # Template HTML
├── package.json        # Dependências e scripts do projeto
├── tailwind.config.js  # Configuração do Tailwind CSS
└── vite.config.mjs     # Configuração do Vite
```

## 🚧 Status de Desenvolvimento

### ✅ **Funcionalidades Implementadas**

#### Autenticação e Usuários
- ✅ Sistema de login (Steam e Email)
- ✅ Registro de usuários
- ✅ Confirmação de email
- ✅ Painel administrativo
- ✅ Configurações de perfil
- ✅ Usuários de teste para desenvolvimento

#### Interface Principal
- ✅ Dashboard com lobbies disponíveis
- ✅ Sistema de salas de jogo (GameRooms)
- ✅ Lobby de quiz com chat
- ✅ Quiz ao vivo (LiveQuiz)
- ✅ Leaderboards/Rankings
- ✅ Sistema de notificações
- ✅ Interface responsiva com Tailwind CSS

### 🚧 **Funcionalidades Pendentes**

#### 1. **Sistema de Torneios** (Alta Prioridade)
- ❌ Página de torneios (`tournament-room` existe mas vazia)
- ❌ Rota `/tournament-room` não implementada
- ❌ Criação e gerenciamento de torneios
- ❌ Brackets de eliminação
- ❌ Sistema de inscrições
- ❌ Premiações de torneios

#### 2. **Backend Completo** (Alta Prioridade)
- ❌ API REST para todas as funcionalidades
- ❌ Banco de dados real (atualmente usando mocks)
- ❌ Sistema de WebSocket para tempo real
- ❌ Autenticação JWT
- ❌ Middleware de segurança
- ❌ Validação de dados

#### 3. **Sistema de Perguntas** (Alta Prioridade)
- ❌ CRUD de perguntas no painel admin
- ❌ Categorização por dificuldade
- ❌ Upload de imagens para perguntas
- ❌ Sistema de tags
- ❌ Importação/exportação de perguntas
- ❌ Banco de perguntas sobre Counter-Strike

#### 4. **Funcionalidades de Jogo** (Média Prioridade)
- ❌ Sistema de pontuação em tempo real
- ❌ Power-ups e bônus
- ❌ Sistema de conquistas
- ❌ Histórico de partidas
- ❌ Estatísticas detalhadas
- ❌ Sistema de ranking ELO

#### 5. **Sistema Financeiro** (Média Prioridade)
- ❌ Carteira virtual funcional
- ❌ Transações de entrada/prêmios
- ❌ Histórico financeiro
- ❌ Sistema de recompensas
- ❌ Integração com pagamentos
- ❌ Sistema de cashout

#### 6. **Funcionalidades Sociais** (Baixa Prioridade)
- ❌ Sistema de amigos
- ❌ Chat global
- ❌ Perfis públicos
- ❌ Compartilhamento de resultados
- ❌ Sistema de clãs/equipes
- ❌ Feed de atividades

#### 7. **Administração Avançada** (Média Prioridade)
- ❌ Relatórios detalhados
- ❌ Moderação de conteúdo
- ❌ Logs do sistema
- ❌ Configurações globais
- ❌ Gestão de usuários
- ❌ Analytics e métricas

#### 8. **Mobile e PWA** (Baixa Prioridade)
- ❌ Responsividade completa
- ❌ App mobile nativo
- ❌ Notificações push
- ❌ Modo offline

### 🎯 **Roadmap de Desenvolvimento**

#### Fase 1 - Backend e Core (Prioridade Alta)
1. Implementar API REST completa
2. Configurar banco de dados real
3. Sistema de autenticação JWT
4. CRUD de perguntas
5. Sistema de WebSocket

#### Fase 2 - Gameplay (Prioridade Alta)
1. Sistema de torneios
2. Pontuação em tempo real
3. Sistema financeiro básico
4. Histórico de partidas

#### Fase 3 - Funcionalidades Avançadas (Prioridade Média)
1. Sistema de conquistas
2. Funcionalidades sociais
3. Administração avançada
4. Analytics

#### Fase 4 - Mobile e Otimizações (Prioridade Baixa)
1. PWA completo
2. App mobile
3. Otimizações de performance
4. Testes automatizados

### 👥 **Credenciais de Teste**

#### Administrador
- **Email**: admin@csquiz.com
- **Senha**: admin123

#### Usuários de Teste
- **Email**: usuario@teste.com | **Senha**: teste123
- **Email**: jogador1@csquiz.com | **Senha**: jogador123
├── .env                # Variáveis de ambiente
├── index.html          # Template HTML
├── package.json        # Dependências e scripts do projeto
├── tailwind.config.js  # Configuração do Tailwind CSS
└── vite.config.mjs     # Configuração do Vite
```

## 🧩 Adicionando Rotas

Para adicionar novas rotas à aplicação, atualize o arquivo `Routes.jsx`:

```jsx
import { useRoutes } from "react-router-dom";
import Dashboard from "pages/dashboard";
import GameRooms from "pages/game-rooms";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <SteamLoginPage /> },
    { path: "/dashboard", element: <Dashboard /> },
    // Adicione mais rotas conforme necessário
  ]);

  return element;
};
```

## 🎨 Estilização

Este projeto usa Tailwind CSS para estilização. A configuração inclui:

- Plugin de formulários para estilização de formulários
- Plugin de tipografia para estilização de texto
- Plugin de proporção para elementos responsivos
- Consultas de contêiner para design responsivo específico de componentes
- Tipografia fluida para texto responsivo
- Utilitários de animação

## 📱 Design Responsivo

O aplicativo é construído com design responsivo usando os breakpoints do Tailwind CSS.


## 📦 Implantação

Construa a aplicação para produção:

```bash
npm run build
```

## 📋 Lista de Funcionalidades e Botões

### Autenticação e Registro
- [x] Login com Steam
- [x] Registro com email
- [x] Confirmação de email
- [x] Recuperação de senha
- [x] Logout

### Dashboard
- [x] Visualização de saldo de moedas
- [x] Botão de depósito
- [x] Botão de perfil
- [x] Lista de lobbies disponíveis
- [x] Filtros de lobbies (dificuldade, taxa de entrada, jogadores)
- [x] Botão de criar sala
- [x] Botão de entrar em sala
- [x] Notificações do sistema
- [x] Visão geral de estatísticas

### Salas de Jogo (Game Rooms)
- [x] Lista de salas disponíveis
- [x] Filtros de salas
- [x] Botão de criar sala
- [x] Botão de entrar em sala
- [x] Informações de taxa de entrada e prêmio
- [x] Contador de jogadores

### Lobby de Quiz
- [x] Lista de participantes
- [x] Chat da sala
- [x] Botão de pronto/não pronto
- [x] Botão de sair do lobby
- [x] Controles do host (iniciar jogo, configurações)
- [x] Modal de taxa de entrada
- [x] Temporizador de início

### Quiz ao Vivo
- [x] Exibição de perguntas
- [x] Temporizador de resposta
- [x] Opções de resposta
- [x] Pontuação atual
- [x] Lista de participantes com status
- [x] Indicador de progresso do quiz
- [x] Botão de sair do quiz
- [x] Modal de dobrar ou nada

### Tabelas de Classificação
- [x] Classificação global
- [x] Filtros de classificação
- [x] Estatísticas pessoais
- [x] Botões de navegação de página
- [x] Indicador de posição atual do usuário

### Configurações de Perfil
- [x] Edição de perfil
- [x] Integração com Steam
- [x] Configurações de privacidade
- [x] Preferências de notificação
- [x] Preferências de exibição
- [x] Configurações de segurança (senha, 2FA)
- [x] Gerenciamento de conta (exportar dados, excluir conta)

### Administração
- [x] Login de administrador
- [x] Painel de controle
- [x] Gerenciamento de usuários
- [x] Gerenciamento de quizzes
- [x] Relatórios e estatísticas

## 🙏 Agradecimentos

- Desenvolvido com React e Vite
- Estilizado com Tailwind CSS

