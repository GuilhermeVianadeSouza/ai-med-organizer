import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  FileSearch,
  FileText,
  HeartPulse,
  LoaderCircle,
  LockKeyhole,
  Mic,
  Pill,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ---------- Tipos ----------

type TimelineItem = {
  date: string;
  title: string;
  detail: string;
  active?: boolean;
  locked?: boolean;
  addendum?: { date: string; text: string };
};

type ExamRow = { metric: string; values: string[]; status?: "high" | "attention" };

type ChartSeries = { key: string; name: string; colorVar: string };

type Consultation = {
  date: string;
  doctor: string;
  specialty: string;
  unit: string;
  summary: string;
  observations: string[];
  documents: string[];
};

type Scenario = {
  id: string;
  label: string;
  icon: typeof HeartPulse;
  patient: { name: string; initials: string; age: string; cpf: string; record: string };
  badges: { tone: "alert" | "attention"; icon: typeof Activity; text: string }[];
  doctorBadge: string;
  statusLine: string;
  statusTime: string;
  rawReport: string;
  entityGroups: readonly { label: string; tone: string; items: string[] }[];
  synthesis: string;
  chart: {
    title: string;
    eyebrow: string;
    lastLabel: string;
    lastValue: string;
    lastUnit: string;
    badge: string;
    trend: string;
    ariaLabel: string;
    yDomain: [number, number];
    series: ChartSeries[];
    data: Record<string, string | number>[];
  };
  exams: { columns: string[]; rows: ExamRow[] };
  timeline: TimelineItem[];
  consultations: Consultation[];
};

// ---------- Cenário 1: Clínica Médica ----------

const clinicoScenario: Scenario = {
  id: "clinico",
  label: "Clínica Médica",
  icon: HeartPulse,
  patient: {
    name: "Carlos Eduardo Souza",
    initials: "CS",
    age: "48 anos",
    cpf: "***.456.789-**",
    record: "#P-029841",
  },
  badges: [
    { tone: "alert", icon: AlertTriangle, text: "Alergia severa a penicilina" },
    { tone: "attention", icon: Activity, text: "Hipertensão em investigação" },
  ],
  doctorBadge: "Dr. Marcos Silva · CRM/SP 198.432",
  statusLine: "Atendimento em andamento",
  statusTime: "Atualização segura · Hoje, 09:42",
  rawReport:
    "Doutor, tô com uma dor de cabeça forte desde terça-feira na nuca, tá latejando. Tomei Neosaldina por conta própria ontem à noite e não aliviou nada. Minha pressão aferida na farmácia hoje de manhã deu 160 por 100. Aliás, ano passado retirei a vesícula.",
  entityGroups: [
    { label: "Sintomas", tone: "symptom", items: ["Dor de cabeça na nuca", "Latejamento"] },
    { label: "Tempo de evolução", tone: "time", items: ["Há 3 dias"] },
    { label: "Medicamentos citados", tone: "medication", items: ["Neosaldina (sem eficácia)"] },
    { label: "Histórico cirúrgico citado", tone: "history", items: ["Colecistectomia (2025)"] },
  ] as const,
  synthesis:
    "Paciente relata cefaleia occipital intensa e pulsátil, com início há três dias. Refere uso de Neosaldina na noite anterior, sem alívio. Pressão arterial aferida em farmácia nesta manhã: 160/100 mmHg. Antecedente cirúrgico informado: colecistectomia em 2025.",
  chart: {
    title: "Tendência da pressão arterial",
    eyebrow: "Série temporal",
    lastLabel: "Última aferição",
    lastValue: "160/100",
    lastUnit: "mmHg",
    badge: "160 / 100",
    trend: "Tendência ascendente",
    ariaLabel: "Gráfico de pressão arterial nas últimas três consultas",
    yDomain: [80, 170],
    series: [
      { key: "sistolica", name: "Sistólica", colorVar: "var(--chart-systolic)" },
      { key: "diastolica", name: "Diastólica", colorVar: "var(--chart-diastolic)" },
    ],
    data: [
      { date: "12 jul", sistolica: 150, diastolica: 90 },
      { date: "18 ago", sistolica: 145, diastolica: 95 },
      { date: "22 set", sistolica: 160, diastolica: 100 },
    ],
  },
  exams: {
    columns: ["2024 · Fleury", "2025 · Lavoisier", "2026 · SUS"],
    rows: [
      { metric: "Glicose de jejum", values: ["94 mg/dL", "102 mg/dL", "118 mg/dL"], status: "high" },
      { metric: "Colesterol total", values: ["180 mg/dL", "195 mg/dL", "220 mg/dL"], status: "attention" },
    ],
  },
  timeline: [
    { date: "Hoje · 22/09/2026", title: "Entrada atual em triagem", detail: "Relato recebido e aguardando validação médica.", active: true },
    { date: "18/08/2026", title: "Consulta · Dr. Marcos Silva", detail: "Pressão arterial: 145 × 95 mmHg", locked: true },
    {
      date: "12/07/2026",
      title: "Pronto atendimento",
      detail: "Pressão arterial: 150 × 90 mmHg",
      locked: true,
      addendum: { date: "Adendo · 13/07/2026, 08:15", text: "Horário de aferição corrigido para 21:40. Registro original preservado." },
    },
  ],
  consultations: [
    {
      date: "18/08/2026",
      doctor: "Dr. Marcos Silva",
      specialty: "Clínica Médica",
      unit: "Clínica Vitae · Unidade Centro",
      summary: "Retorno para acompanhamento pressórico. Paciente relatou cansaço ao final do dia.",
      observations: [
        "Pressão aferida em consultório: 145 × 95 mmHg",
        "Orientação sobre redução de sódio registrada em texto livre",
        "Solicitado perfil lipídico e glicemia de jejum",
      ],
      documents: ["Evolução assinada (PDF)", "Pedido de exames"],
    },
    {
      date: "12/07/2026",
      doctor: "Dra. Helena Prado",
      specialty: "Pronto Atendimento",
      unit: "Hospital São Rafael",
      summary: "Atendimento por cefaleia e mal-estar. Registro de aferição pressórica alterada.",
      observations: [
        "Pressão aferida na admissão: 150 × 90 mmHg",
        "Relato de uso ocasional de analgésico sem orientação",
        "Alta com orientação de seguimento ambulatorial",
      ],
      documents: ["Ficha de atendimento digitalizada", "Adendo de correção de horário"],
    },
    {
      date: "03/03/2025",
      doctor: "Dr. Ricardo Alves",
      specialty: "Cirurgia Geral",
      unit: "Hospital São Rafael",
      summary: "Consulta de revisão pós-operatória de colecistectomia realizada em 2025.",
      observations: [
        "Cicatrização descrita como adequada no registro original",
        "Sem queixas digestivas anotadas na evolução",
        "Alta do acompanhamento cirúrgico",
      ],
      documents: ["Descrição cirúrgica", "Relatório de alta"],
    },
  ],
};

// ---------- Cenário 2: Oftalmologia ----------

const oftalmoScenario: Scenario = {
  id: "oftalmo",
  label: "Oftalmologia",
  icon: Eye,
  patient: {
    name: "Marina Costa Lima",
    initials: "ML",
    age: "62 anos",
    cpf: "***.321.654-**",
    record: "#P-031507",
  },
  badges: [
    { tone: "alert", icon: AlertTriangle, text: "Diabetes tipo 2 em acompanhamento" },
    { tone: "attention", icon: Eye, text: "Pressão intraocular elevada" },
  ],
  doctorBadge: "Dra. Paula Nogueira · CRM/SP 145.678",
  statusLine: "Atendimento oftalmológico em andamento",
  statusTime: "Atualização segura · Hoje, 10:15",
  rawReport:
    "Doutora, de uns dois meses pra cá minha visão tá ficando embaçada, principalmente à noite, e vejo uns halos em volta das luzes. Uso o colírio de lágrima artificial que comprei na farmácia, mas não melhora. Meu irmão mais velho tem glaucoma. Na última medição aí mesmo na clínica deu 26 no olho direito e 24 no esquerdo. Também sou diabética e a glicemia anda descontrolada.",
  entityGroups: [
    { label: "Sintomas", tone: "symptom", items: ["Visão embaçada noturna", "Halos ao redor de luzes"] },
    { label: "Tempo de evolução", tone: "time", items: ["Há 2 meses"] },
    { label: "Medicamentos citados", tone: "medication", items: ["Lágrima artificial (sem eficácia)"] },
    { label: "Histórico familiar citado", tone: "history", items: ["Glaucoma (irmão)", "Diabetes tipo 2 (paciente)"] },
  ] as const,
  synthesis:
    "Paciente relata turvação visual progressiva, predominante no período noturno, com início há dois meses, associada a percepção de halos ao redor de fontes luminosas. Refere uso de colírio lubrificante de automedicação, sem melhora. Tonometria realizada na clínica nesta data: 26 mmHg no olho direito e 24 mmHg no olho esquerdo. Antecedentes informados: diabetes mellitus tipo 2 com controle glicêmico irregular e histórico familiar de glaucoma em familiar de primeiro grau.",
  chart: {
    title: "Tendência da pressão intraocular",
    eyebrow: "Série temporal",
    lastLabel: "Última tonometria",
    lastValue: "26 / 24",
    lastUnit: "mmHg",
    badge: "26 / 24",
    trend: "Tendência ascendente",
    ariaLabel: "Gráfico de pressão intraocular nas últimas três consultas",
    yDomain: [10, 30],
    series: [
      { key: "od", name: "Olho direito (OD)", colorVar: "var(--chart-systolic)" },
      { key: "oe", name: "Olho esquerdo (OE)", colorVar: "var(--chart-diastolic)" },
    ],
    data: [
      { date: "10 mar", od: 18, oe: 17 },
      { date: "22 jun", od: 22, oe: 20 },
      { date: "24 set", od: 26, oe: 24 },
    ],
  },
  exams: {
    columns: ["2024 · Hosp. Olhos", "2025 · Clínica Visão", "2026 · Clínica Visão"],
    rows: [
      { metric: "Pressão intraocular OD", values: ["18 mmHg", "22 mmHg", "26 mmHg"], status: "high" },
      { metric: "Pressão intraocular OE", values: ["17 mmHg", "20 mmHg", "24 mmHg"], status: "high" },
      { metric: "Acuidade visual OD", values: ["20/25", "20/30", "20/40"], status: "attention" },
      { metric: "Acuidade visual OE", values: ["20/25", "20/30", "20/35"], status: "attention" },
      { metric: "Hemoglobina glicada", values: ["6,8 %", "7,4 %", "8,1 %"], status: "high" },
    ],
  },
  timeline: [
    { date: "Hoje · 24/09/2026", title: "Entrada atual em triagem", detail: "Relato recebido e aguardando validação médica.", active: true },
    { date: "22/06/2026", title: "Consulta · Dra. Paula Nogueira", detail: "Pressão intraocular: OD 22 mmHg · OE 20 mmHg", locked: true },
    {
      date: "10/03/2026",
      title: "Consulta · Dr. Fernando Reis",
      detail: "Pressão intraocular: OD 18 mmHg · OE 17 mmHg",
      locked: true,
      addendum: { date: "Adendo · 11/03/2026, 14:30", text: "Acuidade visual corrigida para 20/25 em ambos os olhos. Registro original preservado." },
    },
  ],
  consultations: [
    {
      date: "22/06/2026",
      doctor: "Dra. Paula Nogueira",
      specialty: "Oftalmologia",
      unit: "Clínica Visão · Unidade Jardins",
      summary: "Retorno para acompanhamento de pressão intraocular. Paciente relatou dificuldade para leitura noturna.",
      observations: [
        "Tonometria de aplanação: OD 22 mmHg · OE 20 mmHg",
        "Campimetria visual computadorizada anexada ao registro",
        "Solicitada retinografia colorida e paquimetria ultrassônica",
      ],
      documents: ["Evolução assinada (PDF)", "Campimetria visual", "Pedido de OCT de papila"],
    },
    {
      date: "10/03/2026",
      doctor: "Dr. Fernando Reis",
      specialty: "Oftalmologia",
      unit: "Hospital dos Olhos",
      summary: "Primeira avaliação por turvação visual. Registro de tonometria limítrofe e fundoscopia documentada.",
      observations: [
        "Tonometria: OD 18 mmHg · OE 17 mmHg",
        "Fundoscopia: escavação de disco óptico anotada para reavaliação",
        "Orientado retorno semestral com exame de campo visual",
      ],
      documents: ["Ficha de atendimento digitalizada", "Retinografia simples", "Adendo de correção de acuidade"],
    },
    {
      date: "05/11/2024",
      doctor: "Dra. Camila Ferraz",
      specialty: "Endocrinologia",
      unit: "Clínica Vitae · Unidade Centro",
      summary: "Consulta de acompanhamento de diabetes tipo 2. Registro de controle glicêmico irregular.",
      observations: [
        "Hemoglobina glicada registrada: 7,4 %",
        "Orientação sobre rastreamento oftalmológico anual anotada no registro",
        "Solicitado exame de fundo de olho com dilatação",
      ],
      documents: ["Evolução assinada (PDF)", "Pedido de fundoscopia"],
    },
  ],
};

const scenarios = [clinicoScenario, oftalmoScenario] as const;

// ---------- Rota ----------

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitae Clinical — Prontuário Inteligente" },
      {
        name: "description",
        content: "Dashboard clínico para organização técnica e visualização segura de dados do prontuário.",
      },
      { property: "og:title", content: "Vitae Clinical — Prontuário Inteligente" },
      {
        property: "og:description",
        content: "Organização documental inteligente para uma leitura clínica mais objetiva.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClinicalDashboard,
});

function SectionTitle({ icon: Icon, title, eyebrow }: { icon: typeof Activity; title: string; eyebrow: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <CardTitle className="mt-0.5 text-[15px]">{title}</CardTitle>
      </div>
    </div>
  );
}

function ClinicalDashboard() {
  const [scenarioId, setScenarioId] = useState<Scenario["id"]>("clinico");
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? clinicoScenario;

  const [report, setReport] = useState("");
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const switchScenario = (id: Scenario["id"]) => {
    if (id === scenarioId) return;
    setScenarioId(id);
    setReport("");
    setProcessed(false);
    setProcessing(false);
    setUpdateKey(0);
  };

  const simulate = () => {
    setReport("");
    setProcessed(false);
    let cursor = 0;
    const interval = window.setInterval(() => {
      cursor += 5;
      setReport(scenario.rawReport.slice(0, cursor));
      if (cursor >= scenario.rawReport.length) window.clearInterval(interval);
    }, 14);
  };

  const processReport = () => {
    if (!report.trim() || processing) return;
    setProcessing(true);
    setProcessed(false);
    window.setTimeout(() => {
      setProcessing(false);
      setProcessed(true);
      setUpdateKey((key) => key + 1);
    }, 850);
  };

  const { patient, chart } = scenario;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 xl:px-8">
          {/* Seletor de cenário demonstrativo */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Caso demonstrativo:</span>
            <div className="flex gap-1 rounded-md border border-border bg-surface-subtle p-1" role="tablist" aria-label="Selecionar caso demonstrativo">
              {scenarios.map((s) => {
                const Icon = s.icon;
                const active = s.id === scenarioId;
                return (
                  <button
                    key={s.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchScenario(s.id)}
                    className={cn(
                      "flex h-8 items-center gap-1.5 rounded px-3 text-xs font-semibold transition-colors",
                      active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-heading"
                    )}
                  >
                    <Icon size={14} /> {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <span className="text-lg font-bold">{patient.initials}</span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="truncate text-xl font-bold text-heading">{patient.name}</h1>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{patient.age}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>CPF: {patient.cpf}</span>
                  <span className="hidden h-3 w-px bg-border sm:block" />
                  <span>Prontuário {patient.record}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {scenario.badges.map((badge) => {
                const Icon = badge.icon;
                return badge.tone === "alert" ? (
                  <Badge key={badge.text} className="h-8 gap-1.5 border-alert-border bg-alert-soft text-alert-foreground shadow-none hover:bg-alert-soft">
                    <Icon size={14} /> {badge.text}
                  </Badge>
                ) : (
                  <Badge key={badge.text} className="h-8 gap-1.5 border-attention-border bg-attention-soft text-attention-foreground shadow-none hover:bg-attention-soft">
                    <Icon size={14} /> {badge.text}
                  </Badge>
                );
              })}
              <Badge variant="outline" className="h-8 gap-1.5 bg-card text-muted-foreground">
                <ShieldCheck size={14} className="text-success" /> Acesso auditado (LGPD)
              </Badge>
              <Badge variant="outline" className="h-8 gap-1.5 bg-card text-heading">
                <Stethoscope size={14} className="text-primary" /> {scenario.doctorBadge}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-surface-subtle">
        <div className="mx-auto flex max-w-[1720px] items-center justify-between px-4 py-2.5 text-xs sm:px-6 xl:px-8">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <scenario.icon size={16} /> {scenario.statusLine}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>
            {scenario.statusTime}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1720px] gap-5 px-4 py-5 sm:px-6 xl:grid-cols-[minmax(280px,0.78fr)_minmax(380px,1.15fr)_minmax(380px,1.07fr)] xl:px-8">
        <section className="min-w-0">
          <Card className="overflow-hidden border-border shadow-clinical">
            <CardHeader className="border-b border-border p-5">
              <SectionTitle icon={Mic} eyebrow="Entrada de dados" title="Simulador de triagem" />
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="rounded-md border border-info-border bg-info-soft p-3 text-xs leading-relaxed text-info-foreground">
                <div className="flex gap-2">
                  <FileSearch size={16} className="mt-0.5 shrink-0" />
                  <p>Use um relato demonstrativo para observar a estruturação documental em tempo real.</p>
                </div>
              </div>

              <Button onClick={simulate} variant="outline" className="h-11 w-full justify-start border-primary/25 text-primary hover:bg-primary-soft">
                <Play size={16} fill="currentColor" /> Simular áudio / relato do paciente
              </Button>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="patient-report" className="text-xs font-bold text-heading">Relato bruto transcrito</label>
                  <span className="text-[10px] text-muted-foreground">{report.length} caracteres</span>
                </div>
                <Textarea
                  id="patient-report"
                  value={report}
                  onChange={(event) => { setReport(event.target.value); setProcessed(false); }}
                  placeholder="O relato do paciente aparecerá aqui..."
                  className="min-h-52 resize-none bg-card leading-relaxed focus-visible:ring-primary"
                />
              </div>

              <Button onClick={processReport} disabled={!report.trim() || processing} className="h-12 w-full bg-primary shadow-action hover:bg-primary-strong">
                {processing ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                {processing ? "Organizando informações..." : "Processar com IA Clínica"}
              </Button>

              <div className="flex gap-2 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
                <ShieldCheck size={15} className="shrink-0 text-success" />
                <p>Organização documental assistida. Não gera diagnóstico, prescrição ou códigos CID.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="min-w-0 space-y-5">
          <Card className="overflow-hidden border-border shadow-clinical">
            <CardHeader className="flex-row items-center justify-between border-b border-border p-5">
              <SectionTitle icon={Sparkles} eyebrow="Estruturação inteligente" title="Entidades extraídas (NER)" />
              {processed && <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-success"><Check size={13} /> Atualizado</span>}
            </CardHeader>
            <CardContent className="p-5">
              {!processed ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"><FileText size={22} /></div>
                  <p className="text-sm font-semibold text-heading">Aguardando processamento</p>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">Simule ou digite um relato e processe para visualizar os dados organizados.</p>
                </div>
              ) : (
                <div key={`${scenarioId}-${updateKey}`} className="animate-data-in space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {scenario.entityGroups.map((group) => (
                      <div key={group.label}>
                        <p className="mb-2 text-[10px] font-bold uppercase text-muted-foreground">{group.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => <span key={item} className={cn("entity-chip", `entity-${group.tone}`)}>{item}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-border bg-surface-subtle p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-heading"><FileText size={15} className="text-primary" /> Síntese técnica do relato</div>
                    <p className="text-sm leading-6 text-foreground">{scenario.synthesis}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-clinical">
            <CardHeader className="border-b border-border p-5">
              <SectionTitle icon={Clock3} eyebrow="Rastreabilidade" title="Linha do tempo imutável" />
            </CardHeader>
            <CardContent className="p-5">
              <div className="relative ml-2 border-l border-timeline pl-6">
                {scenario.timeline.map((entry) => (
                  <TimelineEntry
                    key={entry.date}
                    date={entry.date}
                    title={entry.title}
                    detail={entry.detail}
                    active={entry.active}
                    locked={entry.locked}
                  >
                    {entry.addendum && (
                      <div className="mt-3 border-l-2 border-attention-border bg-attention-soft px-3 py-2.5">
                        <p className="text-[10px] font-bold uppercase text-attention-foreground">{entry.addendum.date}</p>
                        <p className="mt-1 text-xs text-foreground">{entry.addendum.text}</p>
                      </div>
                    )}
                  </TimelineEntry>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="min-w-0 space-y-5">
          <Card className={cn("border-border shadow-clinical", processed && "animate-data-pulse")}>
            <CardHeader className="flex-row items-center justify-between border-b border-border p-5">
              <SectionTitle icon={TrendingUp} eyebrow={chart.eyebrow} title={chart.title} />
              <Badge className="border-alert-border bg-alert-soft text-alert-foreground shadow-none hover:bg-alert-soft">{chart.badge}</Badge>
            </CardHeader>
            <CardContent className="p-5">
              <div className="mb-3 flex items-end justify-between">
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground">{chart.lastLabel}</p><p className="mt-0.5 text-2xl font-bold text-heading">{chart.lastValue} <span className="text-xs font-medium text-muted-foreground">{chart.lastUnit}</span></p></div>
                <span className="flex items-center gap-1 text-xs font-semibold text-alert-foreground"><TrendingUp size={14} /> {chart.trend}</span>
              </div>
              <div className="h-52 w-full" aria-label={chart.ariaLabel}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart.data} margin={{ top: 8, right: 6, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="var(--chart-grid)" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 11 }} />
                    <YAxis domain={chart.yDomain} axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    {chart.series.map((s) => (
                      <Line
                        key={s.key}
                        name={s.name}
                        type="monotone"
                        dataKey={s.key}
                        stroke={s.colorVar}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border shadow-clinical">
            <CardHeader className="border-b border-border p-5">
              <SectionTitle icon={FileSearch} eyebrow="Dados normalizados" title="Comparativo de exames" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead className="bg-surface-subtle text-[10px] uppercase text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3">Métrica</th>
                      {scenario.exams.columns.map((col) => <th key={col} className="px-3 py-3">{col}</th>)}
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {scenario.exams.rows.map((row) => (
                      <tr key={row.metric}>
                        <td className="px-5 py-4 font-semibold text-heading">{row.metric}</td>
                        {row.values.map((value, i) => (
                          <td key={i} className={cn("px-3 py-4", i === row.values.length - 1 && "font-bold", i === row.values.length - 1 && row.status === "high" && "text-alert-foreground", i === row.values.length - 1 && row.status === "attention" && "text-attention-foreground")}>
                            {value}
                          </td>
                        ))}
                        <td className="px-3 py-4">
                          {row.status === "high" ? <span className="status-high">Alta</span> : row.status === "attention" ? <span className="status-attention">Atenção</span> : <span className="text-muted-foreground">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border p-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"><FileText /> Ver laudos originais digitalizados <ChevronRight /></Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-clinical">
            <CardHeader className="border-b border-border p-5">
              <SectionTitle icon={Stethoscope} eyebrow="Atendimentos anteriores" title="Consultas com outros profissionais" />
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {scenario.consultations.map((consult) => (
                <PreviousConsultation key={consult.date} consult={consult} />
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function TimelineEntry({ date, title, detail, active, locked, children }: { date: string; title: string; detail: string; active?: boolean; locked?: boolean; children?: React.ReactNode }) {
  return (
    <div className="relative pb-6 last:pb-0">
      <span className={cn("absolute -left-[31px] top-1 flex size-3 rounded-full border-2 border-card", active ? "bg-primary ring-4 ring-primary-soft" : "bg-timeline")} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cn("text-xs font-bold", active ? "text-primary" : "text-muted-foreground")}>{date}</p>
        {locked && <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground"><LockKeyhole size={11} /> Registro assinado</span>}
      </div>
      <p className="mt-1 text-sm font-bold text-heading">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      {children}
    </div>
  );
}

function PreviousConsultation({ consult }: { consult: Consultation }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-heading">{consult.doctor}</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase text-muted-foreground">
            {consult.specialty} · {consult.unit}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="shadow-none">{consult.date}</Badge>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
            <LockKeyhole size={11} /> Assinado
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm leading-6 text-foreground">{consult.summary}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-2 -ml-2 text-muted-foreground hover:text-primary"
      >
        <FileSearch /> {open ? "Ocultar registro original" : "Ver observações registradas"}
        <ChevronRight className={cn("transition-transform", open && "rotate-90")} />
      </Button>
      {open && (
        <div className="mt-2 rounded-md border border-border bg-surface-subtle p-4">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Anotações extraídas do registro</p>
          <ul className="mt-2 space-y-1.5">
            {consult.observations.map((obs) => (
              <li key={obs} className="flex gap-2 text-xs leading-5 text-foreground">
                <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                {obs}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
            {consult.documents.map((doc) => (
              <span key={doc} className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground">
                <FileText size={12} className="text-primary" /> {doc}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
