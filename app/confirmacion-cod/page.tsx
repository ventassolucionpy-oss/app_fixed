'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { usePais } from '@/components/providers/PaisProvider'
import { PAISES, type Pais } from '@/lib/constants'

type Situacion = {
  id: string
  titulo: string
  icono: string
  contexto: string
  scripts: Record<Pais, { apertura: string; desarrollo: string; cierre: string; si_duda: string }>
  tips: string[]
  kpi: string
}

const SITUACIONES: Situacion[] = [
  {
    id: 'confirmacion_estandar',
    titulo: 'Confirmación estándar — Pedido nuevo',
    icono: '✅',
    contexto: 'Llamar ANTES de hacer el pedido en Dropi. Objetivo: confirmar que el cliente sigue interesado y los datos son correctos.',
    scripts: {
      PY: {
        apertura: 'Hola, ¿habló con [nombre]? Buenos días, le llamo de [tu marca]. Le llamo porque acabamos de recibir su pedido del [producto]. ¿Podría confirmarme unos datos para coordinarnos con el envío?',
        desarrollo: 'Perfecto. Le confirmo: su pedido es [producto] por Gs. [precio], y le llega directamente a [ciudad/barrio]. ¿Los datos de entrega son correctos? [dirección y teléfono]. El pago es al recibir, no paga nada ahora. Entrega en [2-3 días hábiles].',
        cierre: '¡Genial! Confirmamos su pedido y en cuanto salga el envío le avisamos por WhatsApp con el número de seguimiento. ¿Le parece bien?',
        si_duda: 'Entiendo, no hay ningún problema. El pedido no sale hasta que usted me confirme. ¿Quiere que le envíe más información por WhatsApp sobre el producto antes de decidir?',
      },
      CO: {
        apertura: '¿Hola, con [nombre]? Buenos días, le llamo de [tu marca]. Le contactamos porque recibimos su solicitud del [producto]. ¿Tiene un minutico para confirmar el envío?',
        desarrollo: 'Listo, le cuento: su pedido es [producto] por $[precio] pesos, y llega a [ciudad/barrio]. El pago es contraentrega, usted paga cuando recibe el producto en sus manos. ¿Los datos de envío están correctos?',
        cierre: '¡Perfecto! Queda confirmado su pedido. Le escribimos al WhatsApp cuando salga el envío con el número de seguimiento. ¿Tiene alguna duda?',
        si_duda: 'Claro, con mucho gusto. No le hacemos el pedido hasta que usted confirme. ¿Le puedo enviar más información del producto al WhatsApp para que tenga más claridad?',
      },
      MX: {
        apertura: '¡Hola! ¿Es [nombre]? Qué tal, le habla [nombre] de [tu marca]. Le llamamos porque recibimos su pedido del [producto]. ¿Me puede dar un momento para confirmar los datos del envío?',
        desarrollo: 'Muy bien. Su pedido es [producto] por $[precio] pesos, con envío a [ciudad/colonia]. Lo mejor es que el pago es contra entrega, o sea que paga cuando le llega a su casa. ¿Sus datos están correctos?',
        cierre: '¡Excelente! Quedó confirmado su pedido. Le mandamos un WhatsApp cuando salga con su número de seguimiento. ¿Tiene alguna duda?',
        si_duda: 'No hay ningún problema. No hacemos el pedido hasta que usted confirme. ¿Le envío más información del producto al WhatsApp ahorita?',
      },
    },
    tips: [
      'Llamar entre 10-12hs y 15-18hs. Evitar lunes a primera hora y viernes a la tarde.',
      'Si no atiende: dejar WhatsApp, NO llamar 3 veces seguidas (molesta y genera reporte de spam).',
      'Si suena ocupado: colgar, esperar 2 horas, y llamar de nuevo una sola vez.',
      'Hablar pausado y claro — muchos clientes no saben a qué empresa perteneces al principio.',
      'Nunca leer el script en voz alta — memorizá la estructura, no el texto exacto.',
    ],
    kpi: 'Tasa de confirmación telefónica objetivo: 70-80% de los llamados. Si está por debajo del 60%, revisar el targeting (el cliente no recuerda haber pedido nada).',
  },
  {
    id: 'cliente_no_atiende',
    titulo: 'Cliente no atiende — WhatsApp de seguimiento',
    icono: '📵',
    contexto: 'Después de 1-2 intentos fallidos de llamada. No insistir por teléfono — ir por WhatsApp.',
    scripts: {
      PY: {
        apertura: 'Hola [nombre] 😊 Le escribo de [tu marca]. Le intenté llamar para coordinar el envío de su [producto]. ¿Podría confirmarme que sigue interesado/a?',
        desarrollo: 'El pedido queda reservado a su nombre. Solo necesito su confirmación para proceder con el envío a [ciudad]. El pago sigue siendo al recibir, no paga nada hasta que lo tenga en sus manos.',
        cierre: 'Solo responda "Sí, confirmo" y coordino el envío para mañana. ¿Le parece bien?',
        si_duda: 'Si tiene alguna duda sobre el producto, con gusto le envío más información o puede llamarme al [número].',
      },
      CO: {
        apertura: 'Hola [nombre] 😊 Le escribo de [tu marca]. Le intenté llamar para coordinar su pedido del [producto]. ¿Tiene un momento para confirmar?',
        desarrollo: 'Tenemos reservado su pedido. Solo necesitamos su confirmación para enviarlo a [ciudad]. Recuerde que el pago es contraentrega.',
        cierre: 'Responda "Confirmo" y coordinamos el envío hoy mismo. 🙌',
        si_duda: '¿Tiene alguna duda? Con gusto le ayudo por acá o puede llamarnos al [número].',
      },
      MX: {
        apertura: '¡Hola [nombre]! Le escribe [tu marca]. Le hablé para confirmar su pedido del [producto] pero no pude comunicarme. ¿Ahorita tiene un momento?',
        desarrollo: 'Su pedido está reservado. Nada más necesitamos su OK para mandarlo a [ciudad]. El pago es contra entrega, o sea que paga cuando le llega.',
        cierre: 'Mándeme un "Sí, lo quiero" y lo enviamos hoy. 😊',
        si_duda: '¿Tiene alguna duda del producto? Le puedo mandar más info o puede marcarme al [número].',
      },
    },
    tips: [
      'Máximo 2 mensajes de WhatsApp si no responde (el tercero es spam).',
      'Si no responde en 24hs → archivar el pedido. No enviarlo a Dropi.',
      'Mejor tiempo para el WhatsApp de seguimiento: 2-3hs después del intento de llamada fallido.',
      'El mensaje tiene que ser corto — máximo 4 líneas. Si es muy largo, no lo leen.',
    ],
    kpi: 'Si menos del 50% de los que no atienden confirman por WhatsApp → el targeting está trayendo gente que no recuerda haber pedido nada.',
  },
  {
    id: 'cliente_duda',
    titulo: 'Cliente duda o quiere pensarlo',
    icono: '🤔',
    contexto: 'El cliente atendió la llamada pero no confirma de inmediato. Tácticas para cierre sin presión.',
    scripts: {
      PY: {
        apertura: '(Ya en la llamada, el cliente duda) Entiendo perfectamente, no hay ningún apuro. ¿Qué es lo que le genera duda sobre el producto?',
        desarrollo: 'ESCUCHAR. Después: "Tiene razón en preguntar eso. Lo que muchos clientes nos dicen es que [respuesta a la objeción específica]. Y además, si lo recibe y no está satisfecho, puede devolverlo sin costo."',
        cierre: 'Mire, le propongo algo: hacemos el pedido, lo recibe, y si no le convence en absoluto, nos lo devuelve y no paga nada. ¿Le parece justo?',
        si_duda: 'Por supuesto, sin problema. ¿Le parece si le envío la información por WhatsApp y me contesta cuando se sienta cómodo/a?',
      },
      CO: {
        apertura: 'Claro, lo entiendo. ¿Me puede contar qué es lo que le genera duda?',
        desarrollo: 'ESCUCHAR. Luego: "Es normal tener esa inquietud. Muchos de nuestros clientes en [ciudad] tenían la misma duda y después de recibirlo nos cuentan que [beneficio real]. Además, el pago es contraentrega, sin ningún riesgo para usted."',
        cierre: 'Le propongo que lo reciba, lo prueba, y si no le funciona me avisa. ¿Qué le parece?',
        si_duda: 'Con gucho gusto. Le envío la información al WhatsApp. Cuando quiera confirmar, me escribe.',
      },
      MX: {
        apertura: 'Claro, no hay prisa. ¿Me puede decir qué es lo que no le termina de convencer?',
        desarrollo: 'ESCUCHAR. Luego: "Entiendo perfectamente. Lo que le puedo decir es que [respuesta a objeción]. Y como el pago es contra entrega, usted no arriesga nada."',
        cierre: 'Le propongo que lo reciba y lo prueba. Si no le gusta, no paga. ¿Le parece bien así?',
        si_duda: 'Ahorita le mando la info al WhatsApp. Cuando quiera confirmar me avisa, ¿sale?',
      },
    },
    tips: [
      'La objeción más común: "¿es original?" → Responder con certeza y garantía de devolución.',
      'Segunda objeción más común: "¿cuánto tarda?" → Dar fecha específica, no "depende".',
      'NO bajar el precio en la llamada — devalúa el producto y crea el hábito de pedir descuento.',
      'El silencio después de la propuesta de cierre es normal — no lo rompas vos.',
    ],
    kpi: 'De los que dudan, al menos el 40% debería confirmar si manejás bien las objeciones.',
  },
  {
    id: 'rechazado_recuperar',
    titulo: 'Recuperar pedido rechazado en la entrega',
    icono: '🔁',
    contexto: 'El cliente recibió el intento de entrega pero rechazó el pedido. Llamar dentro de las 24hs.',
    scripts: {
      PY: {
        apertura: 'Hola [nombre], le llamo de [tu marca]. Veo que el producto no pudo ser entregado hoy. ¿Hubo algún inconveniente?',
        desarrollo: 'ESCUCHAR sin interrumpir. Si fue por ausencia: "Sin problema, ¿cuál sería el mejor momento para una nueva entrega? Podemos coordinar para que alguien esté en casa." Si fue rechazo: "¿Hubo algún problema con el pedido que pueda resolver?"',
        cierre: 'Perfecto, coordino una nueva entrega para [fecha]. ¿Sigue siendo la misma dirección?',
        si_duda: 'Entiendo. Si en algún momento desea retomarlo, con gusto le hago llegar el producto. Que tenga un buen día.',
      },
      CO: {
        apertura: 'Hola [nombre], habla [tu marca]. Vi que el mensajero no pudo entregarle el pedido hoy. ¿Todo bien?',
        desarrollo: 'ESCUCHAR. Si fue ausencia: "¿Podemos coordinar una nueva entrega? ¿A qué hora suele estar en casa?" Si fue rechazo: "¿Qué pasó con el pedido? ¿Puedo ayudarle en algo?"',
        cierre: 'Listo, coordino el reenvío para [fecha]. ¿Le parece bien?',
        si_duda: 'Con mucho gusto, si cambia de opinión me avisa. ¡Que esté muy bien!',
      },
      MX: {
        apertura: '¡Hola [nombre]! Le llama [tu marca]. Vi que no pudieron entregarle su pedido hoy. ¿Pasó algo?',
        desarrollo: 'ESCUCHAR. Si fue ausencia: "¿Le conviene que volvamos a pasar mañana? ¿A qué hora está en casa?" Si fue rechazo: "¿Qué fue lo que pasó? ¿Puedo ayudarle?"',
        cierre: 'Perfecto, agendan la reentrega para [fecha]. ¿Sale?',
        si_duda: 'Claro, sin problema. Si ahorita no es el momento, con gusto lo intentamos otro día. ¡Que tenga un buen día!',
      },
    },
    tips: [
      'El 30-40% de los rechazados se pueden recuperar con UNA llamada bien hecha.',
      'Llamar siempre el mismo día del rechazo — después de 24hs la probabilidad baja mucho.',
      'No acusar al cliente ni ponerse defensivo — escuchar primero siempre.',
      'Si el rechazo fue "cambié de opinión" — no insistir. Agradecer y cerrar limpiamente.',
    ],
    kpi: 'Tasa de recuperación de rechazos objetivo: 25-35%. Cada pedido recuperado es margen neto directo.',
  },
]

const PAIS_LABELS: Record<Pais, string> = { PY: '🇵🇾 Paraguay', CO: '🇨🇴 Colombia', MX: '🇲🇽 México' }

export default function ConfirmacionCODPage() {
  const { pais: paisGlobal } = usePais()
  const [pais, setPais] = useState<Pais>(paisGlobal || 'PY')
  // Sync with global on mount
  useEffect(() => { if (paisGlobal) setPais(paisGlobal) }, [paisGlobal])
  const [activeSit, setActiveSit] = useState<string | null>('confirmacion_estandar')
  const [copied, setCopied] = useState<string | null>(null)

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-5">
          <Link href="/aprender" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Aprender</Link>
          <h1 className="text-2xl font-bold text-white mt-2">📞 Scripts de Llamada COD</h1>
          <p className="text-white/40 text-sm mt-1">Confirmación telefónica pre-envío — sube la tasa de entrega 10-15%</p>
        </div>

        {/* Impacto */}
        <div className="card border border-emerald-500/25 bg-emerald-500/5 p-3 rounded-xl mb-5">
          <p className="text-emerald-400 text-xs font-bold mb-1">💰 Por qué importa este módulo</p>
          <p className="text-white/50 text-xs leading-relaxed">
            Sin llamada de confirmación: tasa de entrega ~70%. <strong className="text-white/70">Con llamada: 82-88%.</strong> En 100 pedidos/mes con ticket de Gs. 150.000, esa diferencia vale <strong className="text-emerald-400">Gs. 1.800.000+ de margen adicional por mes</strong> solo en flete recuperado de rechazos.
          </p>
        </div>

        {/* Selector de país */}
        <div className="flex gap-2 mb-5">
          {(Object.keys(PAISES) as Pais[]).map(p => (
            <button key={p} onClick={() => setPais(p)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${pais === p ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/40 hover:text-white/70'}`}>
              {PAIS_LABELS[p]}
            </button>
          ))}
        </div>

        {/* Situaciones */}
        <div className="space-y-3">
          {SITUACIONES.map(sit => (
            <div key={sit.id} className={`card border rounded-2xl overflow-hidden ${activeSit === sit.id ? 'border-violet-500/30' : 'border-white/8'}`}>
              <button onClick={() => setActiveSit(activeSit === sit.id ? null : sit.id)}
                className="w-full p-4 flex items-start gap-3 text-left">
                <span className="text-xl flex-shrink-0">{sit.icono}</span>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{sit.titulo}</p>
                  <p className="text-white/35 text-[11px] mt-0.5 leading-relaxed">{sit.contexto}</p>
                </div>
                <span className="text-white/20 text-xs flex-shrink-0 mt-1">{activeSit === sit.id ? '▲' : '▼'}</span>
              </button>

              {activeSit === sit.id && (
                <div className="border-t border-white/8 p-4 space-y-4">
                  {/* Scripts */}
                  {(['apertura', 'desarrollo', 'cierre', 'si_duda'] as const).map(parte => {
                    const labels = { apertura: '🎤 Apertura', desarrollo: '💬 Desarrollo', cierre: '🤝 Cierre', si_duda: '🤔 Si duda' }
                    const text = sit.scripts[pais][parte]
                    const cid = `${sit.id}-${parte}`
                    return (
                      <div key={parte} className="bg-white/3 rounded-xl border border-white/8 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wide">{labels[parte]}</p>
                          <button onClick={() => copyText(text, cid)}
                            className="text-[10px] px-2 py-1 rounded-lg bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-colors">
                            {copied === cid ? '✓ Copiado' : 'Copiar'}
                          </button>
                        </div>
                        <p className="text-white/70 text-xs leading-relaxed">{text}</p>
                      </div>
                    )
                  })}

                  {/* Tips */}
                  <div className="bg-amber-500/8 rounded-xl p-3 border border-amber-500/15">
                    <p className="text-[10px] text-amber-400/70 uppercase tracking-wide mb-2">💡 Tips de ejecución</p>
                    <ul className="space-y-1">
                      {sit.tips.map((t, i) => (
                        <li key={i} className="flex gap-2 text-[11px] text-white/55 leading-relaxed">
                          <span className="text-amber-400 flex-shrink-0">•</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-500/8 rounded-lg p-2.5 border border-emerald-500/15">
                    <p className="text-[10px] text-emerald-400/70 mb-0.5">🎯 KPI objetivo</p>
                    <p className="text-xs text-white/60">{sit.kpi}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Protocolo quick reference */}
        <div className="mt-5 card border border-white/8 p-4 rounded-2xl">
          <p className="text-white font-bold text-xs mb-3">⚡ Protocolo rápido de confirmación</p>
          <div className="space-y-2">
            {[
              { paso: '1', texto: 'Recibís el pedido → NO lo subás a Dropi todavía', color: 'text-amber-400' },
              { paso: '2', texto: 'Llamar al cliente entre 10-12hs o 15-18hs', color: 'text-white/60' },
              { paso: '3', texto: 'Si atiende y confirma → hacer pedido en Dropi inmediatamente', color: 'text-emerald-400' },
              { paso: '4', texto: 'Si no atiende → WhatsApp de seguimiento (1 solo mensaje)', color: 'text-white/60' },
              { paso: '5', texto: 'Sin respuesta en 6hs → NO hacer el pedido. Ahorraste el flete', color: 'text-blue-400' },
            ].map(p => (
              <div key={p.paso} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center text-[9px] font-bold text-white/40 flex-shrink-0">{p.paso}</span>
                <p className={`text-xs ${p.color} leading-relaxed`}>{p.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href="/pedidos" className="card p-3 flex items-center gap-2 border border-white/8 hover:border-teal-500/30 transition-all">
            <span>📦</span><div><p className="text-white text-xs font-bold">Pedidos</p><p className="text-white/30 text-[10px]">Ver pendientes de confirmar</p></div>
          </Link>
          <Link href="/whatsapp-flows" className="card p-3 flex items-center gap-2 border border-white/8 hover:border-green-500/30 transition-all">
            <span>📲</span><div><p className="text-white text-xs font-bold">Flujos WhatsApp</p><p className="text-white/30 text-[10px]">Seguimiento post-llamada</p></div>
          </Link>
        </div>
      </main>
    </div>
  )
}
