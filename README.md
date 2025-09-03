# Sistema de Relatórios - Grupo Nasli

Sistema de gestão e relatórios desenvolvido para o Grupo Nasli, com funcionalidades para gerenciar clientes, analistas, ordens de serviço e avarias.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Storage)
- **Deploy**: Vercel

## 📋 Funcionalidades

### Autenticação
- ✅ Login e cadastro de usuários
- ✅ Verificação por email
- ✅ Recuperação de senha
- ✅ Gestão de perfil com upload de avatar

### Gestão de Dados
- ✅ **Clientes**: Cadastro, visualização e edição
- ✅ **Analistas**: Cadastro com especialidades e níveis
- ✅ **Ordens de Serviço**: Criação com campos personalizáveis
- ✅ **Avarias**: Registro com diferentes níveis de gravidade

### Relatórios
- 📊 Análise de Ordens
- 📈 Produtividade de Analistas
- 🏆 Ranking de Analistas
- 📋 Relatório de Avarias
- 🔍 Relatório de Vistorias

### Configurações
- 🌓 Modo escuro/claro
- 👥 Gerenciamento de usuários
- ⚙️ Configurações do sistema

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+ ou Bun
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd relatorios-grupo-nasli
```

2. Instale as dependências:
```bash
npm install
# ou
bun install
```

3. Configure as variáveis de ambiente:
```bash
# As variáveis já estão configuradas no código
# VITE_SUPABASE_URL=https://yyatcbxhyyuabmoziliq.supabase.co
# VITE_SUPABASE_ANON_KEY=<sua-chave-anonima>
```

4. Execute o projeto:
```bash
npm run dev
# ou
bun dev
```

## 🚀 Deploy

### Deploy na Vercel

Este projeto está configurado para deploy automático na Vercel.

1. **Fork/Clone** este repositório
2. **Conecte** à sua conta Vercel
3. **Deploy** será automático usando as configurações do `vercel.json`

### Configurações do Deploy
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `dist`
- **Framework**: Vite

## 📊 Banco de Dados

### Estrutura das Tabelas

#### usuarios
- Perfis de usuário com nome, email, cargo
- Integração com Supabase Auth

#### clientes
- Informações de clientes (nome, CNPJ, contato, endereço)

#### analistas
- Dados dos analistas (nome, email, especialidade, nível)

#### ordens_servico
- Ordens de serviço com placa, tipo de serviço, local da vistoria
- Relacionamento com clientes e analistas

#### avarias
- Registro de avarias com tipo, gravidade, valores
- Campos opcionais para flexibilidade

### Storage
- **Bucket avatars**: Fotos de perfil dos usuários

## 🔐 Segurança

- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acesso por usuário
- ✅ Upload seguro de arquivos
- ✅ Autenticação via JWT

## 📱 Responsividade

- ✅ Design responsivo para desktop e mobile
- ✅ Sidebar colapsável
- ✅ Componentes adaptáveis

## 🎨 Design System

- **Cores**: Sistema de tokens CSS personalizados
- **Componentes**: shadcn/ui customizados
- **Tipografia**: Sistema hierárquico
- **Modo Escuro**: Suporte completo

## 📈 Performance

- ✅ Bundle otimizado com Vite
- ✅ Lazy loading de componentes
- ✅ Otimização de imagens
- ✅ Caching estratégico

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificação de código
```

## 📝 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── AuthForm.tsx     # Formulário de autenticação
│   ├── DashboardLayout.tsx
│   └── reports/         # Componentes de relatórios
├── pages/               # Páginas da aplicação
├── hooks/               # Hooks customizados
├── lib/                 # Utilitários
├── integrations/
│   └── supabase/        # Cliente e tipos do Supabase
└── index.css           # Estilos globais e tokens
```

## 🔄 Roadmap

- [ ] Filtros avançados nos relatórios
- [ ] Exportação para PDF/Excel
- [ ] Notificações em tempo real
- [ ] Dashboard com métricas
- [ ] API para integrações externas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade do **Grupo Nasli**.

## 📞 Suporte

Para suporte e dúvidas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o Grupo Nasli**
