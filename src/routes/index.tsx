import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  Clock3,
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
  UserRound,
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

const rawReport =
  "Doutor, tô com uma dor de cabeça forte desde terça-feira na nuca, tá latejando. Tomei Neosaldina por conta própria ontem à noite e não aliviou nada. Minha pressão aferida na farmácia hoje de manhã deu 160 por 100. Aliás, ano passado retirei a vesícula.";

const pressureData = [
  { date: "12 jul", sistolica: 150, diastolica: 90 },
  { date: "18 ago", sistolica: 145, diastolica: 95 },
  { date: "22 set", sistolica: 160, diastolica: 100 },
];

const entityGroups = [
  { label: "Sintomas", tone: "symptom", items: ["Dor de cabeça na nuca", "Latejamento"] },
  { label: "Tempo de evolução", tone: "time", items: ["Há 3 dias"] },
  { label: "Medicamentos citados", tone: "medication", items: ["Neosaldina (sem eficácia)"] },
  { label: "Histórico cirúrgico citado", tone: "history", items: ["Colecistectomia (2025)"] },
] as const;

const previousConsultations = [
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
] as const;

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
  const [report, setReport] = useState("");
  const [processed, setProcessed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  const simulate = () => {
    setReport("");
    setProcessed(false);
    let cursor = 0;
    const interval = window.setInterval(() => {
      cursor += 5;
      setReport(rawReport.slice(0, cursor));
      if (cursor >= rawReport.length) window.clearInterval(interval);
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 xl:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <span className="text-lg font-bold">CS</span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h1 className="truncate text-xl font-bold text-heading">Carlos Eduardo Souza</h1>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">48 anos</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>CPF: ***.456.789-**</span>
                  <span className="hidden h-3 w-px bg-border sm:block" />
                  <span>Prontuário #P-029841</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="h-8 gap-1.5 border-alert-border bg-alert-soft text-alert-foreground shadow-none hover:bg-alert-soft">
                <AlertTriangle size={14} /> Alergia severa a penicilina
              </Badge>
              <Badge className="h-8 gap-1.5 border-attention-border bg-attention-soft text-attention-foreground shadow-none hover:bg-attention-soft">
                <Activity size={14} /> Hipertensão em investigação
              </Badge>
              <Badge variant="outline" className="h-8 gap-1.5 bg-card text-muted-foreground">
                <ShieldCheck size={14} className="text-success" /> Acesso auditado (LGPD)
              </Badge>
              <Badge variant="outline" className="h-8 gap-1.5 bg-card text-heading">
                <Stethoscope size={14} className="text-primary" /> Dr. Marcos Silva · CRM/SP 198.432
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-surface-subtle">
        <div className="mx-auto flex max-w-[1720px] items-center justify-between px-4 py-2.5 text-xs sm:px-6 xl:px-8">
          <div className="flex items-center gap-2 font-semibold text-primary">
            <HeartPulse size={16} /> Atendimento em andamento
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" /><span className="relative inline-flex size-2 rounded-full bg-success" /></span>
            Atualização segura · Hoje, 09:42
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
                <div key={updateKey} className="animate-data-in space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {entityGroups.map((group) => (
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
                    <p className="text-sm leading-6 text-foreground">Paciente relata cefaleia occipital intensa e pulsátil, com início há três dias. Refere uso de Neosaldina na noite anterior, sem alívio. Pressão arterial aferida em farmácia nesta manhã: 160/100 mmHg. Antecedente cirúrgico informado: colecistectomia em 2025.</p>
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
                <TimelineEntry date="Hoje · 22/09/2026" title="Entrada atual em triagem" detail="Relato recebido e aguardando validação médica." active />
                <TimelineEntry date="18/08/2026" title="Consulta · Dr. Marcos Silva" detail="Pressão arterial: 145 × 95 mmHg" locked />
                <TimelineEntry date="12/07/2026" title="Pronto atendimento" detail="Pressão arterial: 150 × 90 mmHg" locked>
                  <div className="mt-3 border-l-2 border-attention-border bg-attention-soft px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase text-attention-foreground">Adendo · 13/07/2026, 08:15</p>
                    <p className="mt-1 text-xs text-foreground">Horário de aferição corrigido para 21:40. Registro original preservado.</p>
                  </div>
                </TimelineEntry>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="min-w-0 space-y-5">
          <Card className={cn("border-border shadow-clinical", processed && "animate-data-pulse")}>
            <CardHeader className="flex-row items-center justify-between border-b border-border p-5">
              <SectionTitle icon={TrendingUp} eyebrow="Série temporal" title="Tendência da pressão arterial" />
              <Badge className="border-alert-border bg-alert-soft text-alert-foreground shadow-none hover:bg-alert-soft">160 / 100</Badge>
            </CardHeader>
            <CardContent className="p-5">
              <div className="mb-3 flex items-end justify-between">
                <div><p className="text-[10px] font-bold uppercase text-muted-foreground">Última aferição</p><p className="mt-0.5 text-2xl font-bold text-heading">160/100 <span className="text-xs font-medium text-muted-foreground">mmHg</span></p></div>
                <span className="flex items-center gap-1 text-xs font-semibold text-alert-foreground"><TrendingUp size={14} /> Tendência ascendente</span>
              </div>
              <div className="h-52 w-full" aria-label="Gráfico de pressão arterial nas últimas três consultas">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pressureData} margin={{ top: 8, right: 6, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="var(--chart-grid)" vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 11 }} />
                    <YAxis domain={[80, 170]} axisLine={false} tickLine={false} tick={{ fill: "var(--chart-label)", fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Line name="Sistólica" type="monotone" dataKey="sistolica" stroke="var(--chart-systolic)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }} activeDot={{ r: 5 }} />
                    <Line name="Diastólica" type="monotone" dataKey="diastolica" stroke="var(--chart-diastolic)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }} activeDot={{ r: 5 }} />
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
                    <tr><th className="px-5 py-3">Métrica</th><th className="px-3 py-3">2024 · Fleury</th><th className="px-3 py-3">2025 · Lavoisier</th><th className="px-3 py-3">2026 · SUS</th><th className="px-3 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-5 py-4 font-semibold text-heading">Glicose de jejum</td><td className="px-3 py-4">94 mg/dL</td><td className="px-3 py-4">102 mg/dL</td><td className="px-3 py-4 font-bold text-alert-foreground">118 mg/dL</td><td className="px-3 py-4"><span className="status-high">Alta</span></td></tr>
                    <tr><td className="px-5 py-4 font-semibold text-heading">Colesterol total</td><td className="px-3 py-4">180 mg/dL</td><td className="px-3 py-4">195 mg/dL</td><td className="px-3 py-4 font-bold text-attention-foreground">220 mg/dL</td><td className="px-3 py-4"><span className="status-attention">Atenção</span></td></tr>
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
              {previousConsultations.map((consult) => (
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