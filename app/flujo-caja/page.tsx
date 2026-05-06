'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { usePais } from '@/components/providers/PaisProvider'
import { PAISES, getPaisConfig, formatPrecio, type Pais } from '@/lib/constants'

type Semana = {
  num: number
  ad_spend_usd: number
  pedidos: number
  tasa_entrega: number
  precio_venta_local: number
  costo_producto_local: number
  pago_dropi_semana: number // en qué semana llega el pago
}

function calcSemana(s: Semana, pais: Pais) {
  const cfg = getPaisConfig(pais)
  const entregados = Math.round(s.pedidos * (s.tasa_entrega / 100))
  const rechazados = s.pedidos - entregados
  const ingresos_brutos = entregados * s.precio_venta_local
  const costo_productos = s.pedidos * s.costo_producto_local // paga por todos los enviados
  const costo_fletes = s.pedidos * cfg.flete_dropi           // flete en todos
  const ad_spend_local = s.ad_spend_usd * cfg.fx_usd
  const costos_totales = costo_productos + costo_fletes + ad_spend_local
  const ganancia_bruta = ingresos_brutos - costos_totales
  const roas = s.ad_spend_usd > 0 ? (ingresos_brutos / cfg.fx_usd) / s.ad_spend_usd : 0
  return { entregados, rechazados, ingresos_brutos, costo_productos, costo_fletes, ad_spend_local, costos_totales, ganancia_bruta, roas }
}

function fmtM(n: number, pais: Pais) {
  if (Math.abs(n) >= 1_000_000) return formatPrecio(Math.round(n / 1000) * 1000, pais).replace(/\.\d+/, '') + ''
  return formatPrecio(Math.round(n), pais)
}
function fmtU(n: number) { return `$${n.toFixed(0)}` }

const DROPI_PAGO_DIAS: Record<Pais, string> = {
  PY: 'Dropi Paraguay paga cada 15 días hábiles después de la entrega confirmada.',
  CO: 'Dropi Colombia paga cada 8-10 días hábiles después de la entrega confirmada.',
  MX: 'Dropi México paga cada 7-10 días hábiles después de la entrega confirmada.',
}

export default function FlujoCajaPage() {
  const { pais: paisGlobal } = usePais()
  const [pais, setPais] = useState<Pais>(paisGlobal || 'PY')
  // Sync with global on mount
  useEffect(() => { if (paisGlobal) setPais(paisGlobal) }, [paisGlobal])
  const [semanas, setSemanas] = useState(8)
  const [adSpendDiario, setAdSpendDiario] = useState(50)
  const [pedidosPorDia, setPedidosPorDia] = useState(8)
  const [tasaEntrega, setTasaEntrega] = useState(getPaisConfig('PY').tasa_entrega_default)
  const [precioVenta, setPrecioVenta] = useState(147000)
  const [costoProducto, setCostoProducto] = useState(45000)
  const [capitalInicial, setCapitalInicial] = useState(500)
  const [escala, setEscala] = useState(0) // % de escala semanal
  // Default días pago según país
  const diasDefault: Record<string,number> = { PY: 15, CO: 10, MX: 8 }
  const [diasPagoDropi, setDiasPagoDropi] = useState(diasDefault[paisGlobal || 'PY'] || 15)

  const cfg = getPaisConfig(pais)

  // Actualizar defaults al cambiar país
  const handlePaisChange = (p: Pais) => {
    setPais(p)
    const c = getPaisConfig(p)
    setTasaEntrega(c.tasa_entrega_default)
    setPrecioVenta(c.precio_min + Math.round((c.precio_max - c.precio_min) / 2))
    setCostoProducto(Math.round(c.precio_min * 0.3))
  }

  const proyeccion = useMemo(() => {
    const semanasArr: (Semana & ReturnType<typeof calcSemana> & { capital_inicio: number; capital_fin: number; cobros_semana: number })[] = []
    let capital = capitalInicial * cfg.fx_usd
    let adSpend = adSpendDiario

    for (let w = 1; w <= semanas; w++) {
      const pedidos_semana = Math.round(pedidosPorDia * 7 * (1 + escala / 100 * (w - 1)))
      const ad_spend_semana_usd = adSpend * 7

      const s: Semana = {
        num: w,
        ad_spend_usd: ad_spend_semana_usd,
        pedidos: pedidos_semana,
        tasa_entrega: tasaEntrega,
        precio_venta_local: precioVenta,
        costo_producto_local: costoProducto,
        pago_dropi_semana: w + Math.ceil(diasPagoDropi / 7),
      }

      const calc = calcSemana(s, pais)

      // Capital: sale el gasto en ads + costo de productos + fletes
      // Entra: el pago de Dropi de la semana (w - ciclo_pago)
      const semanas_atras = Math.ceil(diasPagoDropi / 7)
      const cobroSemanaAnterior = w > semanas_atras ? semanasArr[w - semanas_atras - 1]?.ingresos_brutos || 0 : 0

      const capital_inicio = capital
      capital = capital - calc.ad_spend_local - calc.costo_productos - calc.costo_fletes + cobroSemanaAnterior
      const capital_fin = capital

      semanasArr.push({ ...s, ...calc, capital_inicio, capital_fin, cobros_semana: cobroSemanaAnterior })

      if (escala > 0) adSpend = adSpend * (1 + escala / 100)
    }
    return semanasArr
  }, [pais, semanas, adSpendDiario, pedidosPorDia, tasaEntrega, precioVenta, costoProducto, capitalInicial, escala, diasPagoDropi, cfg.fx_usd])

  const capitalMinimo = Math.min(...proyeccion.map(s => s.capital_fin))
  const capitalMaximo = Math.max(...proyeccion.map(s => s.capital_fin))
  const semanaQuebrada = proyeccion.find(s => s.capital_fin < 0)
  const gananciaTotal = proyeccion.reduce((sum, s) => sum + s.ganancia_bruta, 0)
  const roasPromedio = proyeccion.reduce((sum, s) => sum + s.roas, 0) / proyeccion.length

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500'
  const labelCls = 'text-[11px] text-white/40 mb-1 block font-medium'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-5">
          <Link href="/dashboard-pl" className="text-white/30 hover:text-white/60 text-sm transition-colors">← Dashboard P&L</Link>
          <h1 className="text-2xl font-bold text-white mt-2">💸 Flujo de Caja</h1>
          <p className="text-white/40 text-sm mt-1">Modelá cuánto capital necesitás para escalar sin quedarte sin fondos</p>
        </div>

        {/* Alert: Dropi payment cycle */}
        <div className="card border border-amber-500/25 bg-amber-500/5 p-3 rounded-xl mb-5">
          <p className="text-amber-300 text-xs font-bold mb-0.5">⚠️ El problema real a escala</p>
          <p className="text-white/50 text-xs leading-relaxed">{DROPI_PAGO_DIAS[pais]} Meta cobra tus ads <strong className="text-white/70">diariamente</strong>. Este gap de timing es donde más operadores se quedan sin capital.</p>
        </div>

        {/* Config */}
        <div className="card border border-white/8 p-4 rounded-2xl mb-5 space-y-3">
          <p className="text-white font-bold text-xs mb-1">⚙️ Parámetros</p>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>País</label>
              <select value={pais} onChange={e => handlePaisChange(e.target.value as Pais)} className={inputCls}>
                {Object.values(PAISES).map(p => <option key={p.codigo} value={p.codigo} className="bg-zinc-900">{p.bandera} {p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Semanas a proyectar</label>
              <select value={semanas} onChange={e => setSemanas(+e.target.value)} className={inputCls}>
                {[4, 8, 12, 16, 24].map(v => <option key={v} value={v} className="bg-zinc-900">{v} semanas</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Ad spend diario (USD)</label>
              <input type="number" value={adSpendDiario} onChange={e => setAdSpendDiario(+e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Pedidos por día</label>
              <input type="number" value={pedidosPorDia} onChange={e => setPedidosPorDia(+e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Precio venta ({cfg.simbolo})</label>
              <input type="number" value={precioVenta} onChange={e => setPrecioVenta(+e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Costo producto ({cfg.simbolo})</label>
              <input type="number" value={costoProducto} onChange={e => setCostoProducto(+e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Tasa de entrega (%)</label>
              <input type="number" value={tasaEntrega} min={50} max={95} onChange={e => setTasaEntrega(+e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Días de pago Dropi</label>
              <input type="number" value={diasPagoDropi} min={7} max={30} onChange={e => setDiasPagoDropi(+e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Capital inicial (USD)</label>
              <input type="number" value={capitalInicial} onChange={e => setCapitalInicial(+e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Escala semanal (%)</label>
              <input type="number" value={escala} min={0} max={50} onChange={e => setEscala(+e.target.value)} className={inputCls} placeholder="0 = sin escala" />
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="card p-3 rounded-xl text-center">
            <p className={`text-lg font-bold ${capitalMinimo < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {capitalMinimo < 0 ? '⚠️ NEGATIVO' : fmtM(capitalMinimo, pais)}
            </p>
            <p className="text-[10px] text-white/30">Capital mínimo</p>
          </div>
          <div className="card p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-violet-400">{fmtU(capitalInicial * (capitalMinimo < 0 ? Math.abs(capitalMinimo / cfg.fx_usd) + capitalInicial : 0) / capitalInicial)} USD</p>
            <p className="text-[10px] text-white/30">Capital necesario real</p>
          </div>
          <div className="card p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-emerald-400">{fmtM(gananciaTotal, pais)}</p>
            <p className="text-[10px] text-white/30">Ganancia {semanas}w</p>
          </div>
          <div className="card p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-blue-400">{roasPromedio.toFixed(1)}x</p>
            <p className="text-[10px] text-white/30">ROAS promedio</p>
          </div>
        </div>

        {semanaQuebrada && (
          <div className="card border border-red-500/30 bg-red-500/5 p-3 rounded-xl mb-4">
            <p className="text-red-400 text-xs font-bold">⛔ Te quedás sin capital en la semana {semanaQuebrada.num}</p>
            <p className="text-white/50 text-xs mt-0.5">Necesitás más capital inicial o bajar el ad spend hasta que entre el primer pago de Dropi.</p>
          </div>
        )}

        {/* Proyección semanal */}
        <div className="card border border-white/8 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/8">
            <p className="text-white font-bold text-xs">📅 Proyección semana a semana</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8">
                  {['Sem', 'Ad Spend', 'Pedidos', 'Ingresos', 'Ganancia', 'Capital'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-[10px] text-white/30 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {proyeccion.map(s => (
                  <tr key={s.num} className={`border-b border-white/5 ${s.capital_fin < 0 ? 'bg-red-500/8' : ''}`}>
                    <td className="px-3 py-2 text-white/50">{s.num}</td>
                    <td className="px-3 py-2 text-white/70">{fmtU(s.ad_spend_usd)}</td>
                    <td className="px-3 py-2 text-white/70">{s.pedidos}</td>
                    <td className="px-3 py-2 text-emerald-400">{fmtM(s.ingresos_brutos, pais)}</td>
                    <td className={`px-3 py-2 font-medium ${s.ganancia_bruta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtM(s.ganancia_bruta, pais)}</td>
                    <td className={`px-3 py-2 font-medium ${s.capital_fin < 0 ? 'text-red-400' : 'text-white/70'}`}>{fmtM(s.capital_fin, pais)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tip pro */}
        <div className="card border border-violet-500/20 bg-violet-500/5 p-4 rounded-2xl mt-4">
          <p className="text-violet-300 text-xs font-bold mb-1">💡 Estrategia de capital de trabajo</p>
          <ul className="space-y-1.5 text-xs text-white/50 leading-relaxed">
            <li>• <strong className="text-white/70">Semana 1-2:</strong> No escalés nada. Esperá el primer pago de Dropi para confirmar que el sistema funciona.</li>
            <li>• <strong className="text-white/70">Capital mínimo recomendado:</strong> 3 semanas de ad spend + costos de productos antes de ver ingresos.</li>
            <li>• <strong className="text-white/70">Regla de reinversión:</strong> El primer mes reinvertí el 80% de la ganancia. Desde el mes 2 podés retirar el 30-40%.</li>
            <li>• <strong className="text-white/70">Si escalás:</strong> Cada vez que doblás el presupuesto, necesitás tener el doble de capital de respaldo esperando el ciclo de pago.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
