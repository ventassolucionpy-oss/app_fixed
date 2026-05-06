'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

// ─── TIPOS ───────────────────────────────────────────────
type Rol = 'dueno' | 'media_buyer' | 'atencion_whatsapp' | 'operador_pedidos' | 'creador_ugc' | 'asistente'

type SOP = {
  id: string
  titulo: string
  frecuencia: string
  duracion_min: number
  herramienta: string
  pasos: string[]
  decision_limit?: string
  escalar_si?: string
  kpi_objetivo?: string
}

type RolConfig = {
  rol: Rol
  titulo: string
  icon: string
  descripcion: string
  sueldo_ref: string
  cuando_contratar: string
  sops: SOP[]
  accesos: string[]
  NO_puede: string[]
}

// ─── BASE DE CONOCIMIENTO ─────────────────────────────────
const ROLES: RolConfig[] = [
  {
    rol: 'dueno',
    titulo: 'Vos — El Operador',
    icon: '👑',
    descripcion: 'Tomás las decisiones de alto impacto. Todo lo demás se delega.',
    sueldo_ref: '—',
    cuando_contratar: 'Siempre — sos vos',
    accesos: ['Todo'],
    NO_puede: ['Nada'],
    sops: [
      {
        id: 'dueno-rutina-diaria',
        titulo: 'Rutina diaria de 15 minutos — 8:30am',
        frecuencia: 'Todos los días hábiles',
        duracion_min: 15,
        herramienta: 'War Room + Dashboard P&L',
        pasos: [
          'Abrir Dashboard P&L → verificar gasto total de ayer vs ROAS. Si ROAS < break-even → ir al War Room ahora.',
          'War Room → revisar estado de cada campaña activa. Ejecutar las acciones urgentes (escalar/pausar).',
          'Revisar tasa de entrega de los últimos 7 días en Logística COD. Si cayó más de 5 puntos → alertar a operador de pedidos.',
          'Ver A/B Tracker → ¿alguna variante lleva más de 14 días activa? Si sí → crear nueva variante esta semana.',
          'Revisar KPIs → ¿gasto del día proyectado vs presupuesto? Ajustar si es necesario.',
          'Leer los 3 mensajes más urgentes de WhatsApp de clientes escalados (el resto los resuelve atención).',
        ],
        kpi_objetivo: 'Menos de 15 minutos. Si tardás más, algo está mal estructurado.',
        decision_limit: 'Cualquier cambio de presupuesto mayor al 50% o pausa total de campaña: lo hacés vos.',
      },
      {
        id: 'dueno-lanzamiento',
        titulo: 'Protocolo de lanzamiento de producto nuevo',
        frecuencia: 'Cada vez que lanzás un producto',
        duracion_min: 45,
        herramienta: 'Flujo completo de la app',
        pasos: [
          'Dropi → buscar producto → calcular margen real con flete + tasa de entrega estimada.',
          'Validador COD → score mínimo 7/10 para proceder. Si es menos → otro producto.',
          'Campana Completa → generar copies (4 variantes), 2 guiones UGC, audiencias y estrategia Meta.',
          'Creadores → asignar guión a creador disponible con plazo máximo 5 días hábiles.',
          'Crear la estructura en Meta Ads Manager: ABO testing, 3 ad sets, USD 5-10/día c/u.',
          'Activar el Pixel y verificar con Meta Pixel Helper que el evento Purchase dispara.',
          'Registrar el producto en Portfolio con estado "Testeando" y presupuesto diario.',
          'Configurar alerta de ROAS en /alertas para este producto específico.',
        ],
        kpi_objetivo: 'Producto lanzado en menos de 48hs desde la decisión.',
        escalar_si: 'Después de 72hs: si ROAS ≥ break-even → escalar 25%. Si ROAS < 0.8x break-even → matar.',
      },
      {
        id: 'dueno-semanal',
        titulo: 'Revisión semanal — lunes 9am (45 min)',
        frecuencia: 'Cada lunes',
        duracion_min: 45,
        herramienta: 'Portfolio + Post-mortem + Presupuesto Escalado',
        pasos: [
          'Portfolio → revisar el estado de todos los productos. Mover de estado los que corresponda.',
          'Post-mortem → para cualquier campaña que murió en la semana. Registrar el aprendizaje.',
          'Presupuesto Escalado → para los productos en estado "Escalando", calcular el próximo step de escala.',
          'Revisar producción de creativos → ¿cuántos creativos nuevos entraron esta semana? Mínimo 3 por producto activo.',
          'Revisar tasa de entrega por país → ¿CO/MX/PY mejoraron o cayeron? Ajustar targeting si es necesario.',
          'Definir el producto nuevo a testear esta semana (si hay capital disponible).',
          'Decidir si escalar ad spend, mantener o reducir — basado en flujo de caja del mes.',
        ],
        kpi_objetivo: 'Decisión clara sobre qué escalar, qué matar y qué lanzar en la semana.',
      },
    ],
  },
  {
    rol: 'media_buyer',
    titulo: 'Media Buyer',
    icon: '📊',
    descripcion: 'Gestiona las campañas en Meta Ads. Optimiza sin tomar decisiones de presupuesto mayor.',
    sueldo_ref: '$300-600 USD/mes + % de performance',
    cuando_contratar: 'Cuando manejás 3+ productos activos simultáneos o $200+/día en ads',
    accesos: ['Meta Ads Manager (acceso estándar)', 'War Room', 'A/B Tracker', 'Meta Tracker', 'Portfolio (solo lectura)'],
    NO_puede: [
      'Aumentar presupuesto más del 20% sin aprobación',
      'Crear nuevas campañas sin briefing aprobado',
      'Pausar campañas con ROAS > 2x sin consultar',
      'Acceder al Dashboard P&L ni a los datos de pedidos',
    ],
    sops: [
      {
        id: 'mb-diario',
        titulo: 'Revisión diaria de campañas — 9am y 4pm',
        frecuencia: 'Dos veces al día',
        duracion_min: 20,
        herramienta: 'Meta Ads Manager + War Room',
        pasos: [
          'Descargar datos del día anterior en Meta Ads Manager (CSV o vista de campaña).',
          'Subir al Meta Tracker si hay cambios significativos. Revisar análisis de la IA.',
          'Para cada campaña activa: ROAS vs objetivo, frecuencia, CTR. Registrar en War Room.',
          'Aplicar reglas del Autopilot: campañas con ROAS < 1x por 2+ días → proponer pausa al dueño.',
          'Campañas con frecuencia > 3 en 7 días → alertar al dueño para refrescar creativo.',
          'Registrar las acciones del día en el comentario del Portfolio para ese producto.',
        ],
        decision_limit: 'Puede pausar ads individuales (no ad sets ni campañas) sin consultar.',
        escalar_si: 'ROAS ≥ objetivo por 3 días consecutivos → enviar propuesta de escala al dueño.',
        kpi_objetivo: 'ROAS objetivo cumplido en ≥ 70% de las campañas activas.',
      },
      {
        id: 'mb-creative-testing',
        titulo: 'Testing de creativos nuevos',
        frecuencia: 'Dos veces por semana (martes y viernes)',
        duracion_min: 30,
        herramienta: 'A/B Tracker + Meta Ads Manager',
        pasos: [
          'Revisar A/B Tracker → identificar variantes con más de 14 días activas (zona de fatiga).',
          'Recibir creativos nuevos del equipo de producción → subir a Meta como ads nuevos en el ad set existente (sin pausar el ganador).',
          'Registrar la nueva variante en A/B Tracker con hook, ángulo y fecha de inicio.',
          'Después de 72hs → comparar CTR y ROAS con el ganador anterior. Si supera → escalar. Si no → pausar.',
          'Actualizar la Biblioteca de Hooks con el resultado.',
        ],
        kpi_objetivo: 'Mínimo 1 creativo nuevo testeado por producto activo por semana.',
      },
    ],
  },
  {
    rol: 'atencion_whatsapp',
    titulo: 'Atención al Cliente / WhatsApp',
    icon: '💬',
    descripcion: 'Cierra ventas por WhatsApp, confirma pedidos y resuelve consultas post-venta.',
    sueldo_ref: '$200-350 USD/mes (puede ser part-time)',
    cuando_contratar: 'Cuando tenés más de 20 mensajes por día que atender',
    accesos: ['WhatsApp Business (dispositivo o API)', 'Pedidos (solo crear y actualizar estado)', 'Scripts WhatsApp (de la app)'],
    NO_puede: [
      'Hacer devoluciones o reembolsos sin autorización',
      'Acceder a datos de campañas ni ad spend',
      'Cambiar precios sin autorización',
      'Contactar proveedores directamente',
    ],
    sops: [
      {
        id: 'wa-lead-nuevo',
        titulo: 'Protocolo de lead nuevo — Primer contacto',
        frecuencia: 'Cada vez que llega un lead',
        duracion_min: 3,
        herramienta: 'WhatsApp Business + Flujos WhatsApp (app)',
        pasos: [
          'Lead nuevo recibido → responder en menos de 5 minutos. Pasados 15 min la conversión cae 60%.',
          'Usar el Mensaje 1 del Flujo de Nuevo Lead generado en /whatsapp-flows. Personalizar con el nombre si se ve.',
          'Si responde con interés → guiar hacia el pedido: nombre, dirección y teléfono de contacto.',
          'Si no responde en 3 horas → enviar seguimiento (Mensaje 2 del flujo).',
          'Si no responde en 24 horas → Mensaje 3. Si no responde en 48hs → archivar como "no interesado".',
          'LLAMAR al lead si el ticket supera Gs. 150.000 / $100.000 COP / $700 MXN. La llamada convierte 2x más.',
          'Una vez que confirma → crear el pedido en /pedidos con todos los datos correctos.',
        ],
        decision_limit: 'Puede ofrecer el precio del producto. No puede hacer descuentos sin autorización.',
        kpi_objetivo: 'Tasa de cierre de leads ≥ 25%. Si está por debajo, revisar el script.',
        escalar_si: 'Cliente enojado, pedido de devolución, o reclamo mayor → escalar al dueño inmediatamente.',
      },
      {
        id: 'wa-confirmacion-cod',
        titulo: 'Llamada de confirmación COD — Pre-envío',
        frecuencia: 'Cada pedido antes del envío',
        duracion_min: 3,
        herramienta: 'Teléfono + Pedidos (app)',
        pasos: [
          'Revisar la lista de pedidos en estado "pendiente" que aún no fueron enviados a Dropi.',
          'Llamar al cliente antes de hacer el pedido en Dropi. Mejor horario: 10-12hs o 15-18hs.',
          'SCRIPT DE APERTURA: "Hola [nombre], te llamo de [tu marca]. Querés confirmar tu pedido de [producto], ¿verdad? Solo quería asegurarme de que llegue bien a [ciudad]."',
          'Si confirma → hacer el pedido en Dropi inmediatamente. Actualizar estado a "confirmado".',
          'Si no atiende → dejar mensaje de WhatsApp: "Hola [nombre], te intenté llamar para confirmar tu pedido. ¿Podés confirmarme que sí querés recibirlo? 😊"',
          'Si no confirma en 6hs del intento → NO hacer el pedido en Dropi. Ahorrás el costo del flete.',
          'Registrar en notas del pedido: "Confirmado por llamada" o "Sin respuesta — en espera".',
        ],
        kpi_objetivo: 'Tasa de entrega ≥ 82%. Si está por debajo, hay problema en el targeting o el producto.',
        decision_limit: 'Si el cliente duda → puede ofrecer la garantía. No puede ofrecer descuento.',
      },
      {
        id: 'wa-post-entrega',
        titulo: 'Seguimiento post-entrega',
        frecuencia: '7-10 días después de cada entrega',
        duracion_min: 2,
        herramienta: 'WhatsApp + Flujos Post-Entrega',
        pasos: [
          'Revisar pedidos en estado "entregado" con más de 7 días. Usar el filtro en /pedidos.',
          'Enviar el Mensaje de Post-Entrega del flujo generado en /whatsapp-flows.',
          'Si el cliente responde positivamente → pedirle el video de reseña (script en /ugc-review).',
          'Si el cliente tuvo un problema → escalar inmediatamente al dueño.',
          'Registrar si dejó reseña → marcar upsell_aceptado en el pedido si compró de nuevo.',
        ],
        kpi_objetivo: '20%+ de clientes respondiendo al seguimiento post-entrega.',
      },
    ],
  },
  {
    rol: 'operador_pedidos',
    titulo: 'Operador de Pedidos / Logística',
    icon: '📦',
    descripcion: 'Procesa pedidos en Dropi, hace seguimiento de entregas y gestiona rechazos.',
    sueldo_ref: '$150-250 USD/mes (part-time)',
    cuando_contratar: 'Cuando tenés más de 15 pedidos por día',
    accesos: ['Dropi (cuenta de la empresa)', 'Pedidos (acceso completo)', 'Logística COD'],
    NO_puede: [
      'Contactar clientes directamente (eso es atención al cliente)',
      'Cancelar pedidos sin autorización del dueño',
      'Acceder a datos de campañas ni WhatsApp',
    ],
    sops: [
      {
        id: 'op-procesamiento',
        titulo: 'Procesamiento diario de pedidos — 10am',
        frecuencia: 'Todos los días hábiles',
        duracion_min: 30,
        herramienta: 'Dropi + Pedidos (app)',
        pasos: [
          'Abrir /pedidos → filtrar por estado "confirmado" (ya confirmados por atención al cliente).',
          'Para cada pedido confirmado → crear el pedido en Dropi con los datos exactos del cliente.',
          'Copiar el número de pedido de Dropi y pegarlo en el campo "notas" del pedido en la app.',
          'Actualizar el estado en la app a "en_proceso" o el que corresponda.',
          'Revisar los pedidos de días anteriores → ¿alguno cambió de estado en Dropi? Actualizar en la app.',
          'Registrar en la planilla diaria: pedidos procesados, rechazados, pendientes.',
        ],
        kpi_objetivo: 'Cero pedidos confirmados sin procesar al final del día.',
        escalar_si: 'Dropi tiene un problema de stock → avisar al dueño inmediatamente (no buscar alternativas solo).',
      },
      {
        id: 'op-rechazos',
        titulo: 'Gestión de rechazos y devoluciones',
        frecuencia: 'A medida que llegan notificaciones de Dropi',
        duracion_min: 10,
        herramienta: 'Dropi + Pedidos (app)',
        pasos: [
          'Dropi notifica un rechazo → actualizar estado del pedido a "rechazado" en la app.',
          'Registrar en notas la razón del rechazo (dirección incorrecta, cliente no estaba, rechazó el pago, etc.).',
          'Si la razón es "dirección incorrecta" → pasar a atención al cliente para que recontacte.',
          'Si la razón es "cliente rechazó" → registrar como pérdida. Calcular el costo total del fallo.',
          'Hacer el reporte semanal de rechazos: cuántos, por qué razón, ciudad, producto. Enviarlo al dueño.',
        ],
        kpi_objetivo: 'Tasa de rechazo < 25%. Si supera el 30% → hay un problema de targeting o producto.',
      },
    ],
  },
  {
    rol: 'creador_ugc',
    titulo: 'Creador de Contenido UGC',
    icon: '🎬',
    descripcion: 'Graba los videos de producto según los guiones generados por la app.',
    sueldo_ref: '$15-50 USD por video entregado',
    cuando_contratar: 'Desde el primer día — los creativos son el activo más importante',
    accesos: ['Solo recibe el guion y el briefing por WhatsApp'],
    NO_puede: [
      'Improvisar más allá del guion sin consultar',
      'Publicar el video en sus redes sin autorización',
      'Acceder a ningún módulo de la app',
    ],
    sops: [
      {
        id: 'ugc-entrega',
        titulo: 'Proceso de entrega de video UGC',
        frecuencia: 'Por cada video asignado',
        duracion_min: 5,
        herramienta: 'WhatsApp + Creadores (app)',
        pasos: [
          'El dueño genera el guion en /creativos/ugc-creator y lo envía al creador por WhatsApp con el briefing completo.',
          'El creador graba según las instrucciones (iluminación, ángulo, fondo especificado en el briefing).',
          'Plazo de entrega máximo: 5 días hábiles desde la asignación.',
          'El creador entrega el video por Google Drive o WeTransfer — nunca por WhatsApp (pierde calidad).',
          'El dueño o media buyer revisa: ¿sigue el guion? ¿se ve auténtico? ¿calidad de audio/video aceptable?',
          'Si pasa → subir a Meta Ads. Si no pasa → dar feedback específico y pedir una retoma (máx 1 retoma incluida).',
          'Actualizar en /creadores: guiones_entregados + 1 y fecha de última entrega.',
        ],
        kpi_objetivo: '≥ 80% de los videos entregados a tiempo y aprobados en el primer intento.',
      },
    ],
  },
]

// ─── COMPONENTES ─────────────────────────────────────────

function SOPCard({ sop }: { sop: SOP }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white/3 rounded-xl border border-white/8 overflow-hidden mb-2">
      <button onClick={() => setOpen(o => !o)} className="w-full p-3 text-left flex items-center gap-3">
        <span className="text-white/30 text-xs flex-shrink-0">📋</span>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 font-medium text-xs">{sop.titulo}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-white/30 text-[10px]">{sop.frecuencia}</span>
            <span className="text-white/30 text-[10px]">⏱ {sop.duracion_min} min</span>
            <span className="text-white/30 text-[10px] truncate">{sop.herramienta}</span>
          </div>
        </div>
        <span className="text-white/20 text-xs flex-shrink-0">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-white/8 pt-3 space-y-3">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-wide mb-2">Pasos</p>
            <ol className="space-y-2">
              {sop.pasos.map((p, i) => (
                <li key={i} className="flex gap-2 text-xs text-white/65 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold text-white/40 flex-shrink-0 mt-0.5">{i+1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>
          {sop.kpi_objetivo && (
            <div className="bg-emerald-500/8 rounded-lg p-2 border border-emerald-500/15">
              <p className="text-[10px] text-emerald-400/60 mb-0.5">🎯 KPI objetivo</p>
              <p className="text-xs text-white/65">{sop.kpi_objetivo}</p>
            </div>
          )}
          {sop.decision_limit && (
            <div className="bg-amber-500/8 rounded-lg p-2 border border-amber-500/15">
              <p className="text-[10px] text-amber-400/60 mb-0.5">⚠️ Límite de decisión</p>
              <p className="text-xs text-white/65">{sop.decision_limit}</p>
            </div>
          )}
          {sop.escalar_si && (
            <div className="bg-red-500/8 rounded-lg p-2 border border-red-500/15">
              <p className="text-[10px] text-red-400/60 mb-0.5">🔴 Escalar si</p>
              <p className="text-xs text-white/65">{sop.escalar_si}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RolCard({ rol }: { rol: RolConfig }) {
  const [open, setOpen] = useState(rol.rol === 'dueno')
  const [tab, setTab] = useState<'sops' | 'accesos'>('sops')
  return (
    <div className={`card border rounded-2xl overflow-hidden mb-3 ${open ? 'border-violet-500/25' : 'border-white/8'}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full p-4 text-left flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{rol.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-white font-bold text-sm">{rol.titulo}</p>
            {rol.sueldo_ref !== '—' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">{rol.sueldo_ref}</span>
            )}
          </div>
          <p className="text-white/40 text-xs leading-relaxed">{rol.descripcion}</p>
          {open && <p className="text-white/25 text-[10px] mt-1">Contratar cuando: {rol.cuando_contratar}</p>}
        </div>
        <span className="text-white/20 text-xs flex-shrink-0 mt-1">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-white/8">
          <div className="flex border-b border-white/8">
            {(['sops', 'accesos'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === t ? 'text-violet-300 border-b border-violet-500' : 'text-white/30 hover:text-white/60'}`}>
                {t === 'sops' ? `📋 SOPs (${rol.sops.length})` : '🔐 Accesos y límites'}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === 'sops' && (
              <div>
                {rol.sops.map(s => <SOPCard key={s.id} sop={s} />)}
              </div>
            )}
            {tab === 'accesos' && (
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wide mb-2">✅ Tiene acceso a</p>
                  <ul className="space-y-1">
                    {rol.accesos.map((a, i) => (
                      <li key={i} className="flex gap-2 text-xs text-white/65">
                        <span className="text-emerald-400 flex-shrink-0">✓</span>{a}
                      </li>
                    ))}
                  </ul>
                </div>
                {rol.NO_puede.length > 0 && (
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wide mb-2">🚫 NO puede</p>
                    <ul className="space-y-1">
                      {rol.NO_puede.map((a, i) => (
                        <li key={i} className="flex gap-2 text-xs text-white/65">
                          <span className="text-red-400 flex-shrink-0">✗</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────
export default function EquipoPage() {
  const [filtroRol, setFiltroRol] = useState<Rol | 'todos'>('todos')

  const ESCALA = [
    { rango: '$0 - $500/día ad spend', equipo: 'Solo vos. Hacés todo.', color: 'border-white/15' },
    { rango: '$500 - $1.500/día', equipo: 'Vos + 1 persona de atención WhatsApp part-time.', color: 'border-amber-500/25' },
    { rango: '$1.500 - $3.000/día', equipo: 'Vos + atención WhatsApp + operador de pedidos.', color: 'border-violet-500/25' },
    { rango: '$3.000+/día', equipo: 'Vos + media buyer + atención + pedidos + 2 creadores UGC.', color: 'border-emerald-500/25' },
  ]

  const filtrados = filtroRol === 'todos' ? ROLES : ROLES.filter(r => r.rol === filtroRol)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-5">
          <Link href="/gestionar" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Gestionar</Link>
          <h1 className="text-2xl font-bold text-white mt-2">👥 Equipo y SOPs</h1>
          <p className="text-white/40 text-sm mt-1">Roles, accesos y protocolos operativos para escalar</p>
        </div>

        {/* Escala de equipo */}
        <div className="card border border-white/8 p-4 rounded-2xl mb-5">
          <p className="text-white font-bold text-xs mb-3">📈 ¿Cuándo contratar a cada rol?</p>
          <div className="space-y-2">
            {ESCALA.map((e, i) => (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl border ${e.color} bg-white/2`}>
                <span className="text-white/30 text-xs font-mono flex-shrink-0 mt-0.5">{i+1}</span>
                <div>
                  <p className="text-white/70 text-xs font-bold">{e.rango}</p>
                  <p className="text-white/40 text-[11px] mt-0.5">{e.equipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {[
            { val: 'todos', label: 'Todos' },
            { val: 'dueno', label: '👑 Vos' },
            { val: 'media_buyer', label: '📊 Media Buyer' },
            { val: 'atencion_whatsapp', label: '💬 Atención' },
            { val: 'operador_pedidos', label: '📦 Pedidos' },
            { val: 'creador_ugc', label: '🎬 Creador' },
          ].map(f => (
            <button key={f.val} onClick={() => setFiltroRol(f.val as Rol | 'todos')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filtroRol === f.val ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-white/40 hover:text-white/60 border border-transparent'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Roles */}
        <div>
          {filtrados.map(rol => <RolCard key={rol.rol} rol={rol} />)}
        </div>

        {/* Quick nav */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/creadores" className="card p-3 flex items-center gap-2 border border-white/8 hover:border-violet-500/30 transition-all">
            <span>🎭</span><div><p className="text-white text-xs font-bold">Creadores UGC</p><p className="text-white/30 text-[10px]">CRM de creadores</p></div>
          </Link>
          <Link href="/flujo" className="card p-3 flex items-center gap-2 border border-white/8 hover:border-teal-500/30 transition-all">
            <span>🗺️</span><div><p className="text-white text-xs font-bold">Flujo completo</p><p className="text-white/30 text-[10px]">Ver el proceso total</p></div>
          </Link>
        </div>
      </main>
    </div>
  )
}
