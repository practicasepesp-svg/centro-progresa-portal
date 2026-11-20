"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2, Circle, Compass, FileText, Briefcase, ShieldCheck,
  GraduationCap, ClipboardCheck, Sparkles, ArrowRight, ExternalLink,
  Search, Building2, ListChecks, Clock, X, RotateCcw, Award, Users,
  BookOpen, Calendar, AlertCircle
} from "lucide-react";

type RouteFilter = "all" | "seeking" | "has_place";

interface GuideModalContent {
  title: string;
  subtitle: string;
  items: { heading: string; text: string }[];
}

interface ActionTool {
  label: string;
  description: string;
  status: "active" | "guide" | "coming_soon";
  url?: string;
  guideKey?: string;
}

interface Phase {
  number: number;
  title: string;
  tag?: string;
  summary: string;
  onlyForSeeking?: boolean;
  isMergePoint?: boolean;
  tools: ActionTool[];
}

const GUIDES_CONTENT: Record<string, GuideModalContent> = {
  expectations: {
    title: "Qué esperar durante la práctica y Evaluación",
    subtitle: "Fase 1 • Lineamientos generales para estudiantes de UNIMINUTO Rectoría Bogotá",
    items: [
      {
        heading: "1. Desarrollo y compromisos en el escenario",
        text: "Cumplir con el horario acordado, el reglamento interno de la organización y las actividades definidas en el Plan de Formación aprobado por el tutor empresarial y el docente monitor."
      },
      {
        heading: "2. Acompañamiento tripartito",
        text: "Durante el periodo académico se realizan encuentros de seguimiento entre el estudiante, el jefe inmediato (tutor empresarial) y el docente monitor asignado por el programa académico."
      },
      {
        heading: "3. Evaluación y cierre",
        text: "La calificación final integra la evaluación de desempeño del tutor empresarial, las entregas de seguimiento (bitácoras/informes) y la sustentación o cierre ante el docente monitor, quien registra la nota definitiva en el sistema académico."
      }
    ]
  },
  preinscripcion_check: {
    title: "Checklist antes de la Preinscripción",
    subtitle: "Fase 2 • Verifica estos 4 puntos antes de diligenciar el formulario",
    items: [
      {
        heading: "1. Prerrequisitos académicos aprobados",
        text: "Confirma en tu sábana de notas (Génesis) que tienes aprobados los créditos y asignaturas prerrequisito exigidos por tu plan de estudios."
      },
      {
        heading: "2. Afiliación vigente a EPS",
        text: "Debes contar con afiliación activa a salud (régimen contributivo o subsidiado) y tener a la mano el certificado actualizado (descargado con menos de 30 días)."
      },
      {
        heading: "3. Documento de identidad legible",
        text: "Ten digitalizada tu cédula de ciudadanía ampliada al 150% en formato PDF."
      },
      {
        heading: "4. Definición de escenario",
        text: "Ten claro si vas a postularte a ofertas gestionadas por Centro Progresa o si ya cuentas con una empresa o vinculación laboral para validar."
      }
    ]
  },
  psychotechnical: {
    title: "Guía rápida: Entrevistas y Pruebas Psicotécnicas",
    subtitle: "Fase 3 • Consejos prácticos de selección universitaria",
    items: [
      {
        heading: "1. Entrevista por competencias (Método STAR)",
        text: "Responde cada pregunta contando una Situación real, la Tarea que tenías, la Acción concreta que realizaste y el Resultado obtenido en clases, proyectos o empleos previos."
      },
      {
        heading: "2. Pruebas psicotécnicas",
        text: "Evalúan razonamiento lógico, comprensión verbal, atención al detalle y rasgos de personalidad laboral. Realízalas en un lugar silencioso, con buena conexión a internet y sin interrupciones."
      },
      {
        heading: "3. Investigación previa de la empresa",
        text: "Antes de cada entrevista, revisa a qué se dedica la organización, cuáles son sus valores y qué funciones pide la vacante."
      }
    ]
  },
  validation_arl: {
    title: "Validación de Escenario de Práctica y ARL",
    subtitle: "Fase 5 • Requisitos documentales para formalizar el inicio",
    items: [
      {
        heading: "1. Legalidad de la empresa",
        text: "Se verifica la existencia y representación legal de la organización (Cámara de Comercio reciente y RUT) para garantizar un entorno seguro y acorde a tu perfil profesional."
      },
      {
        heading: "2. Formalización de la vinculación",
        text: "Dependiendo de tu modalidad (Contrato de Aprendizaje SENA, Convenio de Prácticas, Pasantía o Validación por experiencia laboral), se revisa la minuta, contrato o certificación laboral."
      },
      {
        heading: "3. Cobertura de Riesgos Laborales (ARL)",
        text: "Ningún estudiante puede iniciar actividades prácticas sin contar previamente con el certificado de afiliación activa a ARL cargado y validado."
      }
    ]
  },
  academic_enrollment: {
    title: "Inscripción de Materia y Asignación de Monitor",
    subtitle: "Fase 6 • Articulación con tu Programa Académico",
    items: [
      {
        heading: "1. Inscripción de la asignatura de Práctica",
        text: "Una vez validado tu escenario y documentos, se habilita o verifica la inscripción de la asignatura de Práctica Profesional en el periodo académico vigente."
      },
      {
        heading: "2. Remisión al Programa Académico",
        text: "Centro Progresa entrega el expediente de los estudiantes avalados a cada coordinación de programa en la Rectoría Bogotá."
      },
      {
        heading: "3. Asignación de Docente Monitor",
        text: "Tu programa académico asigna un docente monitor/tutor quien te acompañará metodológicamente y habilitará el aula virtual de seguimiento."
      }
    ]
  }
};

const PHASES: Phase[] = [
  {
    number: 1,
    title: "Preparación e Inducción",
    tag: "Inicio del proceso",
    summary:
      "Participa en el taller de inducción donde se explican los lineamientos institucionales, las modalidades de práctica disponibles, qué esperar durante el desarrollo y los criterios de evaluación y cierre.",
    tools: [
      {
        label: "Guía: Qué esperar y Evaluación",
        description: "Conoce compromisos, seguimiento y criterios de nota final.",
        status: "guide",
        guideKey: "expectations"
      },
      {
        label: "Asistente de Modalidades",
        description: "Árbol de decisión para identificar tu modalidad ideal.",
        status: "coming_soon"
      }
    ]
  },
  {
    number: 2,
    title: "Preinscripción Oficial",
    tag: "Requisito obligatorio",
    summary:
      "Diligencia el formulario institucional de preinscripción dentro de las fechas establecidas para el periodo académico y verifica tus prerrequisitos.",
    tools: [
      {
        label: "Checklist Pre-Preinscripción",
        description: "Verifica créditos, EPS, documento y requisitos previos.",
        status: "guide",
        guideKey: "preinscripcion_check"
      },
      {
        label: "Formulario de Preinscripción",
        description: "Enlace institucional del periodo vigente (habilitado en fechas oficiales).",
        status: "coming_soon"
      }
    ]
  },
  {
    number: 3,
    title: "Alistamiento para Selección",
    tag: "Solo si buscas escenario",
    onlyForSeeking: true,
    summary:
      "Si aún no cuentas con escenario de práctica, prepárate para los procesos de selección fortaleciendo tu hoja de vida institucional, entrevistas y pruebas psicotécnicas.",
    tools: [
      {
        label: "Creador de Hoja de Vida Institucional",
        description: "Genera tu HV oficial de UNIMINUTO lista para descargar en PDF.",
        status: "active",
        url: "https://centro-progresa-hv.vercel.app/"
      },
      {
        label: "Guía de Entrevistas y Psicotécnicas",
        description: "Claves prácticas para superar pruebas y entrevistas.",
        status: "guide",
        guideKey: "psychotechnical"
      },
      {
        label: "Simulador de Entrevista STAR",
        description: "Banco de preguntas por programa con temporizador.",
        status: "coming_soon"
      }
    ]
  },
  {
    number: 4,
    title: "Búsqueda y Postulación a Ofertas",
    tag: "Solo si buscas escenario",
    onlyForSeeking: true,
    summary:
      "Inicia tu búsqueda activa de empresa y postúlate a las vacantes y ofertas gestionadas por Centro Progresa E.P.E. con las empresas aliadas.",
    tools: [
      {
        label: "Generador de Cartas y Correos",
        description: "Redacción profesional para enviar tu hoja de vida a empresas.",
        status: "coming_soon"
      },
      {
        label: "Ofertas y Convocatorias",
        description: "Postulación a vacantes gestionadas con empresas aliadas.",
        status: "coming_soon"
      }
    ]
  },
  {
    number: 5,
    title: "Validación de Escenario y ARL",
    tag: "Punto de encuentro",
    isMergePoint: true,
    summary:
      "Presenta tu escenario de práctica entregando los documentos requeridos para validar la legalidad de la empresa, formalizar la vinculación y verificar el pago/afiliación de ARL.",
    tools: [
      {
        label: "Guía de Validación y ARL",
        description: "Revisa los documentos exigidos para avalar tu escenario.",
        status: "guide",
        guideKey: "validation_arl"
      },
      {
        label: "Validador Interactivo de Documentos",
        description: "Checklist personalizado según tu modalidad de práctica.",
        status: "coming_soon"
      }
    ]
  },
  {
    number: 6,
    title: "Inscripción de Materia y Asignación de Monitor",
    tag: "Gestión académica",
    summary:
      "Con los requisitos validados, se realiza la inscripción de la asignatura de práctica y se entrega el proceso a tu programa académico para la asignación del docente monitor.",
    tools: [
      {
        label: "Ruta con tu Programa Académico",
        description: "Pasos de inscripción de materia y asignación de monitor.",
        status: "guide",
        guideKey: "academic_enrollment"
      }
    ]
  },
  {
    number: 7,
    title: "Plan de Formación, Acompañamiento y Cierre",
    tag: "Ejecución y nota final",
    summary:
      "Elabora tu Plan de Formación para aprobación del tutor empresarial y del docente monitor, participa en los encuentros tripartitos de seguimiento y completa la evaluación final para el cargue de tu nota.",
    tools: [
      {
        label: "Generador de Plan de Formación y Bitácoras",
        description: "Formato estandarizado en PDF para aprobación y seguimiento.",
        status: "coming_soon"
      },
      {
        label: "Calculadora de Horas y Cronograma",
        description: "Proyecta tu fecha de cierre descontando festivos en Colombia.",
        status: "coming_soon"
      }
    ]
  }
];

const PROGRESS_STORAGE_KEY = "centro_progresa_portal_progress_v1";

export default function PortalHome() {
  const [routeFilter, setRouteFilter] = useState<RouteFilter>("all");
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [activeGuide, setActiveGuide] = useState<GuideModalContent | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompletedPhases(parsed);
        }
      }
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completedPhases));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, [completedPhases]);

  const togglePhaseCompleted = (phaseNum: number) => {
    setCompletedPhases((prev) =>
      prev.includes(phaseNum) ? prev.filter((n) => n !== phaseNum) : [...prev, phaseNum]
    );
  };

  const resetProgress = () => {
    setCompletedPhases([]);
    try {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } catch {
      // Ignorar
    }
  };

  const visiblePhases = PHASES.filter((p) => {
    if (routeFilter === "has_place" && p.onlyForSeeking) return false;
    return true;
  });

  const relevantCompletedCount = visiblePhases.filter((p) =>
    completedPhases.includes(p.number)
  ).length;
  const progressPercent = Math.round(
    (relevantCompletedCount / Math.max(1, visiblePhases.length)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-slate-100 flex flex-col">
      {/* Barra superior institucional */}
      <header className="bg-blue-950/90 backdrop-blur-md border-b border-blue-800/70 sticky top-0 z-30 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-sm shadow">
              CP
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-white">
                Centro Progresa E.P.E.
              </h1>
              <p className="text-[11px] text-amber-400 font-medium">
                Prácticas Profesionales • UNIMINUTO Rectoría Bogotá
              </p>
            </div>
          </div>

          {/* Indicador de progreso personal */}
          <div className="flex items-center gap-3 bg-blue-900/70 border border-blue-800 px-3.5 py-2 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold">
                Tu avance en la ruta
              </div>
              <div className="text-xs font-extrabold text-white">
                {relevantCompletedCount} de {visiblePhases.length} fases ({progressPercent}%)
              </div>
            </div>
            <div className="w-20 h-2 bg-blue-950 rounded-full overflow-hidden border border-blue-800">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {completedPhases.length > 0 && (
              <button
                onClick={resetProgress}
                className="text-blue-300 hover:text-amber-300 p-1 transition cursor-pointer"
                title="Reiniciar mi progreso"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero + Selector de Ruta */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 lg:py-10 space-y-8">
        <section className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Compass size={13} /> Portal de Herramientas y Ruta del Practicante
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Tu Camino hacia las <span className="text-amber-400">Prácticas Profesionales</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Conoce paso a paso las fases del proceso en UNIMINUTO Rectoría Bogotá y accede a las herramientas digitales gratuitas diseñadas para acompañarte en cada etapa.
          </p>
        </section>

        {/* Selector interactivo de situación del estudiante */}
        <section className="bg-blue-900/50 backdrop-blur-md border border-blue-700/70 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-white">
                ¿Cuál es tu situación actual?
              </h3>
              <p className="text-xs text-blue-200">
                Selecciona tu caso para adaptar las fases del recorrido a tu proceso.
              </p>
            </div>
            {routeFilter !== "all" && (
              <button
                onClick={() => setRouteFilter("all")}
                className="text-xs text-amber-300 hover:underline font-semibold self-start sm:self-auto cursor-pointer"
              >
                Ver las 7 fases completas
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <button
              onClick={() => setRouteFilter("seeking")}
              className={`p-4 rounded-xl border text-left transition flex items-start gap-3.5 cursor-pointer ${
                routeFilter === "seeking"
                  ? "bg-amber-400 text-blue-950 border-amber-300 shadow-lg shadow-amber-500/20"
                  : "bg-blue-950/70 hover:bg-blue-950 text-white border-blue-800"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  routeFilter === "seeking"
                    ? "bg-blue-950 text-amber-400"
                    : "bg-blue-900 text-amber-400"
                }`}
              >
                <Search size={20} />
              </div>
              <div>
                <div className="font-extrabold text-sm">
                  Aún NO tengo empresa / escenario
                </div>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    routeFilter === "seeking" ? "text-blue-900 font-medium" : "text-slate-300"
                  }`}
                >
                  Recorre las 7 fases: incluye talleres de alistamiento, hoja de vida, entrevistas y búsqueda de ofertas.
                </p>
              </div>
            </button>

            <button
              onClick={() => setRouteFilter("has_place")}
              className={`p-4 rounded-xl border text-left transition flex items-start gap-3.5 cursor-pointer ${
                routeFilter === "has_place"
                  ? "bg-amber-400 text-blue-950 border-amber-300 shadow-lg shadow-amber-500/20"
                  : "bg-blue-950/70 hover:bg-blue-950 text-white border-blue-800"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  routeFilter === "has_place"
                    ? "bg-blue-950 text-amber-400"
                    : "bg-blue-900 text-emerald-400"
                }`}
              >
                <Building2 size={20} />
              </div>
              <div>
                <div className="font-extrabold text-sm">
                  YA tengo empresa / escenario de práctica
                </div>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    routeFilter === "has_place" ? "text-blue-900 font-medium" : "text-slate-300"
                  }`}
                >
                  Ruta directa: tras la preinscripción (Fase 2), saltas directo a la validación de escenario y ARL (Fase 5).
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Línea de tiempo de Fases */}
        <section className="space-y-4">
          {visiblePhases.map((phase, idx) => {
            const isDone = completedPhases.includes(phase.number);
            const showJumpBanner = routeFilter === "has_place" && phase.number === 5;

            return (
              <div key={phase.number} className="space-y-4">
                {showJumpBanner && (
                  <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-xl px-4 py-3 text-xs text-emerald-200 flex items-center gap-2.5">
                    <Sparkles size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>
                      <strong>Salto inteligente aplicado:</strong> Como ya tienes escenario de práctica, omites las Fases 3 y 4 (alistamiento y búsqueda de vacantes) y continúas directamente aquí.
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-2xl border p-5 sm:p-6 transition shadow-lg ${
                    isDone
                      ? "bg-blue-950/60 border-emerald-500/50"
                      : "bg-blue-900/45 border-blue-800/80 hover:border-blue-700"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? "bg-emerald-500 text-blue-950"
                            : "bg-amber-400 text-blue-950"
                        }`}
                      >
                        {phase.number}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-extrabold text-white">
                            Fase {phase.number}: {phase.title}
                          </h3>
                          {phase.tag && (
