# Clarity Clinic

Crie uma aplicação web moderna de Prontuário Eletrônico Inteligente (Dashboard Clínico) focado em organização técnica de dados via IA para médicos. O objetivo da aplicação é reduzir o tempo de leitura do profissional organizando dados desestruturados sem emitir diagnósticos médicos.

### 🎨 Estilo Visual e Design System

- Estilo minimalista, limpo e profissional voltado para saúde (estilo SaaS clínico moderno).

- Paleta de cores: Fundo em tons de cinza/ardósia neutro (slate-50), cartões brancos com sombras suaves, detalhes em azul-petróleo (teal-600) e azul-marinho hospitalar.

- Alertas e tags usando cores semânticas bem delimitadas (vermelho suave para alergias/alertas críticos, amarelo para atenção, azul para medicamentos, verde para normalidade).

- Ícones via lucide-react (Activity, FileText, AlertTriangle, ShieldCheck, TrendingUp, Clock, User, Mic).

---

### 🧱 Estrutura da Interface (Layout em Grid)

1. **Cabeçalho Superior (Header Clínico):**

   - Dados do Paciente: Foto/Avatar, "Carlos Eduardo Souza, 48 anos, CPF: ***.456.789-**".

   - Alertas Críticos em Destaque: Badge vermelho fixo com "🔴 Alergia Severa a Penicilina" e badge amarelo "🟡 Hipertensão em Investigação".

   - Badges de Conformidade: "🔒 Acesso Auditado (LGPD)" e "Dr. Marcos Silva - CRM/SP 198.432".

2. **Coluna Esquerda: Simulação de Consulta em Ação (Entrada de Dados):**

   - Um card de "Simulador de Triagem / Entrada do Paciente".

   - Um botão de destaque: "▶️ Simular Áudio/Relato do Paciente" que preenche automaticamente uma caixa de texto com o relato cru:

     *"Doutor, tô com uma dor de cabeça forte desde terça-feira na nuca, tá latejando. Tomei Neosaldina por conta própria ontem à noite e não aliviou nada. Minha pressão aferida na farmácia hoje de manhã deu 160 por 100. Aliás, ano passado retirei a vesícula."*

   - Botão de ação: "Processar com IA Clínica (Extrair Entidades)".

   - Ao clicar, exibe um estado de carregamento rápido (spinner) e atualiza os cards do dashboard em tempo real.

3. **Coluna Central: Inteligência e Linha do Tempo (Output da IA):**

   - **Card de Entidades Extraídas (NER):**

     - Chips interativos agrupados:

       - Sintomas: `[Dor de cabeça na nuca]`, `[Latejamento]`

       - Tempo de Evolução: `[Há 3 dias]`

       - Medicamentos Citados: `[Neosaldina (sem eficácia)]`

       - Histórico Cirúrgico Citado: `[Colecistectomia (2025)]`

     - Texto do relato limpo e sintetizado tecnicamente (sem gírias ou repetições).

   - **Linha do Tempo Imutável (Histórico Append-Only):**

     - Linha do tempo visual mostrando 3 atendimentos anteriores:

       - Hoje (22/09/2026): Entrada atual em triagem.

       - 18/08/2026: Consulta com Dr. Silva (Aferição PA: 145x95) - Ícone de cadeado "Registro Assinado".

       - 12/07/2026: Pronto Atendimento (Aferição PA: 150x90) - Com demonstração de "Adendo/Errata" encadeada abaixo do registro, demonstrando que nenhum registro anterior é apagado.

4. **Coluna Direita: Séries Temporais e Exames Comparativos:**

   - **Gráfico de Tendência (Recharts):**

     - Gráfico de linha compacto mostrando a evolução da Pressão Arterial Sistólica/Diastólica nas últimas 3 consultas (150x90 -> 145x95 -> 160x100) com destaque visual para a curva ascendente.

   - **Tabela Comparativa de Exames Antigos:**

     - Uma tabela simples normalizando dados extraídos de PDFs de laboratórios diferentes:

       - Colunas: Métrica | 2024 (Lab Fleury) | 2025 (Lab Lavoisier) | 2026 (SUS) | Status

       - Linhas:

         - Glicose de Jejum: 94 mg/dL | 102 mg/dL | 118 mg/dL (com tag de alta)

         - Colesterol Total: 180 mg/dL | 195 mg/dL | 220 mg/dL

     - Botão discreto ao lado da tabela: "📄 Ver laudos originais digitalizados".

---

### ⚠️ Regras Cruciais de Comportamento

- **NÃO incluir sugestões de diagnóstico, prescrição automática ou códigos CID.** A ferramenta deve agir estritamente como um assistente de organização documental e visualização de dados.

- Deixar a interface interativa: ao clicar no botão de simulação, os cards devem ter uma animação sutil de atualização dos dados.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ai-med-organizer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c5574dbb-60e1-5c7f-a32f-a41a62165ebe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
