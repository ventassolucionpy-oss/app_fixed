'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'
import { usePais } from '@/components/providers/PaisProvider'

type Item = {
  href: string
  icon: string
  bg: string
  titulo: string
  desc: string
  badge?: string
}

export default function CrearPage() {
  const { cfg } = usePais()
  const [busqueda, setBusqueda] = useState('')

  const SECCIONES = [
    {
      titulo: '⭐ Lo más importante — empezá acá',
      desc: 'Si no sabés por dónde empezar, usá esto primero',
      items: [
        {
          href: '/campana',
          icon: '⚡',
          bg: 'bg-gradient-to-br from-violet-600 to-indigo-600',
          titulo: 'Crear campaña completa de anuncios',
          desc: `La IA escribe todos tus textos de venta en ${cfg.nombre}: el anuncio de Facebook, los mensajes de WhatsApp, los emails y más. Todo en un solo lugar.`,
          badge: '⭐ Empezá acá',
        },
        {
          href: '/lanzar',
          icon: '🚀',
          bg: 'bg-gradient-to-br from-emerald-600 to-teal-600',
          titulo: 'Lanzar un producto nuevo hoy',
          desc: `Tenés un producto de Dropi ${cfg.nombre} y querés empezar a venderlo hoy. En 10 minutos tenés todo listo.`,
          badge: '🚀 Rápido',
        },
      ] as Item[],
    },
    {
      titulo: '📣 Anuncios para Facebook e Instagram',
      desc: 'Los textos que van dentro de tus anuncios de Meta Ads',
      items: [
        { href: '/creativos/ugc/anuncios', icon: '✦', bg: 'bg-violet-600', titulo: 'Textos de anuncio con video (UGC)', desc: '5 textos listos para Facebook e Instagram, escritos para que la gente se detenga y compre.' },
        { href: '/creativos/meta-ads', icon: '⊞', bg: 'bg-blue-600', titulo: 'Estrategia de anuncio completa', desc: `A quién mostrarle el anuncio en ${cfg.nombre}, qué escribir y cuánto gastar.` },
        { href: '/creativos/tiktok', icon: '◈', bg: 'bg-pink-600', titulo: 'Guiones para TikTok', desc: 'Lo que hay que decir en el video de TikTok para que la gente compre.' },
        { href: '/oferta-flash', icon: '⚡', bg: 'bg-gradient-to-br from-red-600 to-orange-500', titulo: 'Crear una oferta especial de 48-72 horas', desc: 'Para cuando querés vender mucho en poco tiempo: el texto del anuncio, los mensajes y el script de llamada.', badge: '🆕 Nuevo' },
        { href: '/copy-scorer', icon: '📊', bg: 'bg-gradient-to-br from-cyan-600 to-blue-600', titulo: 'Revisar si mi texto vende bien', desc: 'Pegás el texto de tu anuncio y la IA te dice qué nota tiene y cómo mejorarlo.', badge: '🆕 Nuevo' },
        { href: '/spy', icon: '🕵️', bg: 'bg-red-600', titulo: 'Analizar un anuncio que vi', desc: 'Pegás el texto de un anuncio que viste corriendo y la IA te dice por qué funciona y te da 3 versiones mejores.' },
      ] as Item[],
    },
    {
      titulo: '🎬 Videos y contenido',
      desc: 'Guiones para que tus creadores o vos mismos graben',
      items: [
        { href: '/creativos/ugc-creator', icon: '🎬', bg: 'bg-rose-600', titulo: 'Guión para grabar un video de producto', desc: 'Lo que tiene que decir la persona en el video. Listo para enviar al creador.' },
        { href: '/ugc-review', icon: '🌟', bg: 'bg-gradient-to-br from-rose-600 to-pink-600', titulo: 'Guión para que un cliente cuente su experiencia', desc: 'El script para pedirle a un cliente que ya compró que grabe un video corto hablando del producto.', badge: '🆕 Nuevo' },
        { href: '/creadores', icon: '🎭', bg: 'bg-gradient-to-br from-violet-600 to-rose-600', titulo: 'Gestionar a mis creadores de video', desc: 'La lista de personas que graban videos para vos: sus datos, cuánto cobran y los guiones asignados.', badge: '🆕 Nuevo' },
        { href: '/pipeline-creativos', icon: '📋', bg: 'bg-gradient-to-br from-amber-600 to-orange-600', titulo: 'Planilla de videos de esta semana', desc: 'Cuáles videos tengo que crear esta semana, quién los graba y en qué estado están.', badge: '🆕 Nuevo' },
        { href: '/organico', icon: '🌱', bg: 'bg-green-600', titulo: 'Publicaciones para redes sociales (gratis)', desc: 'Ideas y textos para publicar en Instagram y Facebook sin pagar anuncios.' },
        { href: '/tiktok-shop', icon: '🛍️', bg: 'bg-gradient-to-br from-pink-600 to-red-500', titulo: 'TikTok Shop completo', desc: 'Todo para vender en TikTok: videos orgánicos, anuncios y transmisiones en vivo.' },
      ] as Item[],
    },
    {
      titulo: '💬 WhatsApp y atención al cliente',
      desc: 'Los mensajes para cerrar ventas y atender a tus compradores',
      items: [
        { href: '/confirmacion-cod', icon: '📞', bg: 'bg-gradient-to-br from-teal-600 to-cyan-700', titulo: `Scripts para llamar a confirmar pedidos en ${cfg.nombre}`, desc: `Qué decir cuando llamás al cliente antes de enviar el pedido a Dropi ${cfg.nombre}. Esto sube la tasa de entrega.`, badge: '💰 Importante' },
        { href: '/whatsapp-flows', icon: '📲', bg: 'bg-gradient-to-br from-green-600 to-teal-600', titulo: '6 flujos de mensajes de WhatsApp listos', desc: 'Los mensajes para cuando llega un cliente nuevo, cuando no responde, cuando confirma, y más. Todos listos para copiar.', badge: '🆕 Nuevo' },
        { href: '/whatsapp-ventas', icon: '💬', bg: 'bg-green-700', titulo: 'Respuestas a las preguntas más comunes', desc: '¿Es original? ¿Cuánto tarda? ¿Puedo devolver? Las respuestas listas para las 10 preguntas que más te van a hacer.' },
        { href: '/whatsapp-biz', icon: '🤖', bg: 'bg-green-600', titulo: 'Configurar respuestas automáticas en WhatsApp', desc: 'Cómo hacer que WhatsApp responda solo cuando estás ocupado o dormido.' },
        { href: '/email-flows', icon: '📧', bg: 'bg-emerald-600', titulo: 'Emails automáticos post-compra', desc: 'Los emails que se mandan solos después de cada compra: confirmación, seguimiento y pedido de reseña.' },
        { href: '/customer-service', icon: '🎧', bg: 'bg-teal-600', titulo: 'Cómo resolver quejas y problemas', desc: 'Qué decir cuando un cliente está enojado, quiere devolver el producto o tiene un problema con el envío.' },
        { href: '/retencion', icon: '🔄', bg: 'bg-gradient-to-br from-teal-600 to-emerald-700', titulo: 'Hacer que los clientes vuelvan a comprar', desc: 'Mensajes para contactar a clientes que ya compraron y ofrecerles otro producto.' },
      ] as Item[],
    },
    {
      titulo: '🛒 Página de venta y checkout',
      desc: 'Para cuando tenés tu propia página de ventas',
      items: [
        { href: '/landing', icon: '🏠', bg: 'bg-gradient-to-br from-violet-600 to-indigo-600', titulo: 'Crear página de venta', desc: 'Toda la estructura y el texto de una página de venta profesional.' },
        { href: '/cro', icon: '🔬', bg: 'bg-gradient-to-br from-blue-600 to-cyan-600', titulo: 'Revisar por qué mi página no convierte', desc: 'La IA analiza tu página y te dice exactamente qué cambiar para que más gente compre.', badge: '🆕 Nuevo' },
        { href: '/checkout-dropi', icon: '🛒', bg: 'bg-gradient-to-br from-violet-600 to-purple-700', titulo: 'Ficha completa del producto en Dropi', desc: 'El título, la descripción y las preguntas frecuentes para cargar tu producto en Dropi.' },
        { href: '/oferta', icon: '💎', bg: 'bg-gradient-to-br from-amber-500 to-orange-600', titulo: 'Construir una oferta irresistible', desc: 'Cómo presentar el producto para que sea muy difícil decir que no. Precio, garantía, bonos y urgencia.' },
        { href: '/upsell', icon: '💎', bg: 'bg-gradient-to-br from-emerald-600 to-teal-600', titulo: 'Vender algo más con cada pedido', desc: `Cómo ofrecerle al cliente de ${cfg.nombre} un producto complementario para aumentar lo que gana cada venta.` },
        { href: '/temporadas', icon: '📅', bg: 'bg-orange-500', titulo: 'Campañas para fechas especiales', desc: `Las fechas más importantes del año en ${cfg.nombre} para hacer promociones especiales.` },
      ] as Item[],
    },
    {
      titulo: '📋 Guías y aprendizaje',
      desc: 'Para entender mejor cómo vender',
      items: [
        { href: '/flujo', icon: '🗺️', bg: 'bg-gradient-to-br from-violet-600 to-indigo-600', titulo: 'El camino completo de cero a escalar', desc: 'Todos los pasos en orden para alguien que está empezando.', badge: '⭐ Empezá acá' },
        { href: '/testimonios', icon: '⭐', bg: 'bg-amber-600', titulo: 'Crear testimonios de clientes', desc: 'Cómo mostrar lo que dicen tus clientes satisfechos para que más gente compre.' },
        { href: '/contenido-imagen', icon: '🎨', bg: 'bg-gradient-to-br from-pink-600 to-rose-600', titulo: 'Ideas para las imágenes del anuncio', desc: 'Qué mostrar en la foto o imagen de tu anuncio para que llame la atención.' },
        { href: '/creativo-visual', icon: '🎨', bg: 'bg-gradient-to-br from-rose-600 to-pink-600', titulo: 'Estrategia visual del anuncio', desc: 'El formato de imagen que funciona mejor en Meta Ads en 2025.' },
      ] as Item[],
    },
  ]

  const todasItems = SECCIONES.flatMap(s => s.items)
  const filtradas = busqueda
    ? todasItems.filter(i =>
        i.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        i.desc.toLowerCase().includes(busqueda.toLowerCase())
      )
    : null

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-5">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-white">Crear contenido</h1>
          <p className="text-white/40 text-sm mt-1">
            Todo adaptado para vender en <span className="text-white/70">{cfg.nombre}</span> {cfg.bandera}
          </p>
        </div>

        {/* Buscador */}
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar... ej: WhatsApp, video, anuncio"
            className="w-full bg-white/6 border border-white/12 rounded-xl pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 placeholder:text-white/25"
          />
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">✕</button>
          )}
        </div>

        {/* Resultados de búsqueda */}
        {filtradas ? (
          <div className="space-y-2">
            {filtradas.length === 0 ? (
              <p className="text-center text-white/30 text-sm py-8">No encontramos esa herramienta</p>
            ) : filtradas.map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-start gap-3 p-3.5 card rounded-xl border border-white/10 hover:border-white/25 transition-all">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-white text-sm font-semibold">{item.titulo}</p>
                    {item.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{item.badge}</span>}
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
                <span className="text-white/20 text-xs flex-shrink-0 mt-1">→</span>
              </Link>
            ))}
          </div>
        ) : (
          /* Secciones normales */
          <div className="space-y-7">
            {SECCIONES.map(s => (
              <div key={s.titulo}>
                <div className="mb-3">
                  <p className="text-white font-bold text-sm">{s.titulo}</p>
                  <p className="text-white/30 text-xs">{s.desc}</p>
                </div>
                <div className="space-y-2">
                  {s.items.map(item => (
                    <Link key={item.href} href={item.href}
                      className="flex items-start gap-3 p-3.5 card rounded-xl border border-white/8 hover:border-white/20 transition-all">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-white text-sm font-semibold leading-tight">{item.titulo}</p>
                          {item.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{item.badge}</span>}
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                      <span className="text-white/20 text-xs flex-shrink-0 mt-1">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
