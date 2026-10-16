# 📋 Formulário de Locação e Documentação — Santos e Mello Imóveis

Formulário moderno de alta conversão para cadastro e qualificação de locações da **Santos e Mello Imóveis**, desenvolvido com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, com integração para **Superlógica Imobiliárias** e cálculo automatizado do **Seguro Incêndio Tokio Marine**.

---

## 🚀 Funcionalidades

1. **Dados da Locação**:
   - Identificação do Corretor e Código do Imóvel.
   - **Tipo do Imóvel**: Casa, Sobrado, Assobradada, Apartamento, Cobertura, Apto sem condomínio, Salão, Sala, Galpão, Loja, Sobreloja, Terreno, Kitnet.
   - Finalidade (Residencial e Comercial com ramo de atividade).
   - Busca automática de endereço via **ViaCEP** (auto-preenchimento de rua, bairro, cidade, UF).
   - Valores (Aluguel, IPTU, Condomínio, Dia de Vencimento).
   - **Cálculo automático de Taxas**:
     - Taxa de Intermediação (%) $\rightarrow$ Valor calculado em R$ em tempo real.
     - Taxa de ADM (%) $\rightarrow$ Valor calculado em R$ em tempo real.
     - Taxa de Renovação e Observações de negociação.
   - **Garantias Locatícias**: Seguro Almada, Too, Pottencial, Porto, Loft, Fiador, Título de Capitalização, Caução e Caução Imóvel.
   - **Seguro Incêndio Tokio Marine**:
     - Cálculo automático baseado na tabela oficial Tokio Marine conforme o Tipo do Imóvel e o Valor do Aluguel.
     - Link direto para consulta da tabela oficial no Google Drive.
     - Campo editável para ajustes manuais caso necessário.
   - Anexos de aceite (Locatário e Locador).

2. **Dados do Locatário**:
   - Qualificação civil completa (Nome, CPF, RG, Nascimento, Estado Civil com anexo de certidão).
   - Anexos de RG / CNH e Comprovante de Residência.
   - Contatos rápidos (WhatsApp e E-mail com validação).
   - Endereço atual com consulta ViaCEP integrada.
   - Regime de contratação (CLT, PJ, Autônomo, Funcionário Público, Empresário) e renda mensal.
   - **Moradores adicionais dinâmicos**: Adição e remoção de moradores com anexo de documentos.

3. **Dados do Locador (Proprietário) & Superlógica**:
   - **Lupa Superlógica**: Botão de consulta direta ao Superlógica via CPF ou Nome.
   - Preenchimento automático de dados cadastrais e bancários.
   - Dados Bancários para repasse de aluguel (Banco, Agência, Conta, Chave PIX, Tipo de Conta).

4. **Dados do Imóvel & Consumos**:
   - Conferência de endereço espelhado da Parte 1.
   - Local das Chaves (Proprietário, Unidade Marajoara, Jardim ou Parque das Nações).
   - Anexo da Matrícula do Imóvel.
   - **Tabela de Consumos**: Água, Luz, Gás, Condomínio e IPTU com identificação (RGI/instalação), toggle de isenção, % de rateio e upload de contas.

---

## 🛠️ Como Rodar Localmente

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

3. **Compilar para produção**:
   ```bash
   npm run build
   ```

---

## ☁️ Deploy na Vercel

### Opção 1: Via GitHub (Recomendado)

1. Envie o projeto para o GitHub:
   ```bash
   gh repo create formulario-locacao-santosemello --public --source=. --remote=origin --push
   ```
2. Acesse [vercel.com/new](https://vercel.com/new).
3. Importe o repositório `formulario-locacao-santosemello`.
4. (Opcional) Adicione as variáveis de ambiente:
   - `SUPERLOGICA_APP_TOKEN`
   - `SUPERLOGICA_ACCESS_TOKEN`
   - `FORM_SUBMIT_EMAIL` (padrão: `adrianogerentesm@gmail.com`)
5. Clique em **Deploy**. A Vercel publicará com HTTPS e CDN global.

### Opção 2: Via Vercel CLI
```bash
npx vercel --prod
```
