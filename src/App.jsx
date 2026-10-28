import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import {
  GraduationCap, CalendarDays, Users, Sun, Sunrise, Heart, BookOpen, ChevronRight, ChevronDown,
  MapPin, MessageCircle, Mail, Clock, Send, User, Phone, Building2, Utensils, Gamepad2, ExternalLink,
  Volleyball, Smile, UtensilsCrossed,
} from 'lucide-react'
import { escola } from './config.js'
import { Plane, Pencil, Halftone, Instagram, Facebook } from './components/Decor.jsx'
import logo from './assets/logo.png'
import fundamental1 from './assets/fundamental1.jpeg'
import fachada from './assets/fachada.png'
import quadra from './assets/quadra.jpeg'
import parquinho1 from './assets/parquinho1.jpg'
import parquinho2 from './assets/parquinho2.png'
import sala2 from './assets/biblioteca.jpeg'
import salao from './assets/salao.jpg'
import cantina from './assets/cantina.jpg'
import pebolim from './assets/jogos.png'
import piscina from './assets/piscina.jpeg'
import refeitorio from './assets/refeitorio.jpg'

// Fotos dos cards de níveis: sala1, sala2 e sala3 (em src/assets, .png tem prioridade sobre .jpg)
const fotosNiveis = import.meta.glob('./assets/sala[1-3].{png,jpg,jpeg,webp}', { eager: true, import: 'default' })
const fotoNivel = (n) => {
  const achadas = Object.entries(fotosNiveis).filter(([caminho]) => caminho.includes(`/sala${n}.`))
  return (achadas.find(([caminho]) => caminho.endsWith('.png')) || achadas[0])?.[1]
}

const zap = `https://wa.me/${escola.whatsapp}`
const menu = [['sobre', 'Sobre'], ['niveis', 'Níveis de ensino'], ['estrutura', 'Estrutura'], ['contato', 'Contato']]

// Manhã = sol nascendo, Tarde = sol alto
const turnos = [
  [Sunrise, 'Manhã'],
  [Sun, 'Tarde'],
]

const valores = [
  [Heart, 'blue', 'Acolhimento', 'Cada criança é recebida com atenção e respeito ao seu ritmo.'],
  [GraduationCap, 'yellow', 'Ensino com compromisso', 'Aulas organizadas, rotina clara e foco no aprendizado.'],
  [Users, 'red', 'Parceria com as famílias', 'Comunicação aberta entre escola e casa.'],
]

const niveis = [
  { cor: 'yellow', icone: Users, etapa: 'Primeiros anos', titulo: 'Educação Infantil', img: fotoNivel(1), alt: 'Sala de aula da Educação Infantil', texto: 'Brincar, descobrir e começar a gostar de aprender, em salas coloridas e seguras.' },
  { cor: 'blue', icone: BookOpen, etapa: '1º ao 5º ano', titulo: 'Fundamental I', img: fundamental1, alt: 'Sala de aula do Fundamental I', texto: 'Leitura, escrita e matemática com acompanhamento de perto e rotina organizada.' },
  { cor: 'purple', icone: GraduationCap, etapa: '6º ao 9º ano', titulo: 'Fundamental II', img: fotoNivel(3), alt: 'Sala de aula do Fundamental II', texto: 'Mais autonomia e responsabilidade, com apoio da escola e da família em cada passo.' },
]

const galeria = [
  [quadra, 'Quadra poliesportiva', 'Quadra', Volleyball, 'big'],
  [parquinho2, 'Parquinho com escorregador', 'Parquinho', Smile],
  [sala2, 'Sala de aula colorida', 'biblioteca', BookOpen],
  [salao, 'Salão de eventos decorado', 'Salão de eventos', CalendarDays],
  [cantina, 'Cantina do colégio', 'Cantina', Utensils],
  [refeitorio, 'Refeitório', 'Refeitório', UtensilsCrossed],
  [piscina, 'Piscina', 'Piscina', Users],
  [pebolim, 'Mesa de pebolim', 'Jogos', Gamepad2], // a última foto da lista ocupa 2 colunas (ver .gal figure:last-child no CSS)
]

function useSecaoAtiva(ids) {
  const [ativa, setAtiva] = useState('')
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setAtiva(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return ativa
}

// Header some ao rolar para baixo e só volta depois de uma puxada maior para cima
const SUBIDA_PARA_MOSTRAR = 220 // px rolados para cima (seguidos) para o header reaparecer
const DESCIDA_PARA_ESCONDER = 12 // px rolados para baixo (seguidos) para o header sumir

function useHeaderOculto() {
  const [oculto, setOculto] = useState(false)
  useEffect(() => {
    let ultimo = window.scrollY
    let subida = 0
    let descida = 0
    let aguardando = false
    const aoRolar = () => {
      if (aguardando) return
      aguardando = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - ultimo
        ultimo = y
        if (y < 80) {
          setOculto(false)
          subida = 0
          descida = 0
        } else if (delta > 0) {
          descida += delta
          subida = 0
          if (descida >= DESCIDA_PARA_ESCONDER) setOculto(true)
        } else if (delta < 0) {
          subida += -delta
          descida = 0
          if (subida >= SUBIDA_PARA_MOSTRAR) setOculto(false)
        }
        aguardando = false
      })
    }
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])
  return oculto
}

// Rolagem suave (inércia) com a biblioteca Lenis. Os links de âncora (#contato etc.)
// também deslizam suavemente e param 48px abaixo do topo, como o scroll-padding-top do CSS.
function useRolagemSuave() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const aoClicar = (e) => {
      const link = e.target.closest && e.target.closest('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.length < 2) return
      const alvo = document.querySelector(href)
      if (!alvo) return
      e.preventDefault()
      lenis.scrollTo(alvo, { offset: -48, duration: 1.2 })
    }
    document.addEventListener('click', aoClicar)

    return () => {
      document.removeEventListener('click', aoClicar)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}

function Pill({ icon: Icon, children, className = '', style }) {
  return <span className={`pill ${className}`} style={style}><Icon size={18} />{children}</span>
}

// Máscara de telefone brasileiro: (81) 99999-0000 ou (81) 3333-0000
function mascaraTelefone(valor) {
  const d = valor.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function enviarWhatsApp(e) {
  e.preventDefault()
  const d = new FormData(e.currentTarget)
  const texto = `Olá! Meu nome é ${d.get('nome')} (${d.get('tel')}). Tenho interesse em: ${d.get('nivel')}. ${d.get('msg') || ''}`
  window.open(`${zap}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
}

export default function App() {
  const ativa = useSecaoAtiva(['inicio', ...menu.map((m) => m[0])])
  const headerOculto = useHeaderOculto()
  useRolagemSuave()
  const [tel, setTel] = useState('')

  // Sempre abre a página no topo
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const resetScroll = () => window.scrollTo(0, 0)
    setTimeout(resetScroll, 0)
    return () => {
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  // Animação de entrada ao rolar: .animate-on-scroll ganha .section-visible na primeira vez que aparece
  useEffect(() => {
    const sections = document.querySelectorAll('.animate-on-scroll')
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -45% 0px' }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return (
    <>
      <header className={headerOculto ? 'oculto' : ''}>
        <div className="wrap bar">
          <a className="brand" href="#inicio">
            <img className="brand-logo" src={logo} alt="Logo do Colégio Dimensão" />
          </a>
          <nav aria-label="Principal">
            {menu.map(([id, nome]) => (
              <a key={id} href={`#${id}`} className={ativa === id ? 'on' : ''}>{nome}</a>
            ))}
            <a className="btn" href="#contato"><CalendarDays size={18} />Agendar visita</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="inicio" className="sec hero">
          <Halftone side="left" opacity={0.14} />
          <div className="wrap hero-grid">
            <div>
              <h1>
                <span className="rise" style={{ '--d': '.2s' }}>Educar é cuidar</span>
                <span className="acc-yellow rise" style={{ '--d': '.35s' }}>de cada detalhe.</span>
              </h1>
              <p className="sub rise" style={{ '--d': '.5s' }}><strong>Desde 1983</strong> educando crianças no coração de Ouro Preto, em Olinda. Da educação infantil ao fundamental II, com acompanhamento de perto, rotina organizada e uma escola onde seu filho é conhecido pelo nome.</p>
              <div className="cta rise" style={{ '--d': '.65s' }}>
                <a className="btn big-btn" href="#contato"><CalendarDays size={22} />Agendar visita<ChevronRight size={20} className="arrow" /></a>
                <a className="btn ghost big-btn" href="#estrutura">Conhecer a estrutura<ChevronRight size={20} className="arrow" /></a>
              </div>
              <ul className="turnos rise" style={{ '--d': '.8s' }}>
                {turnos.map(([Icon, t]) => (
                  <li key={t}><span className="ico-round"><Icon size={22} /></span><strong>{t}</strong></li>
                ))}
              </ul>
            </div>
            <div className="mosaic enter-right">
              <div className="big"><img src={fachada} alt={`Fachada do ${escola.nome}`} /></div>
              <img src={quadra} alt="Quadra poliesportiva do colégio" />
              <img src={parquinho1} alt="Parquinho colorido" />
            </div>
          </div>
        </section>

        <section id="sobre" className="sec dark animate-on-scroll">
          <div className="wrap sobre-grid">
            <div>
              <Pill icon={Users}>Sobre o colégio</Pill>
              <h2>Uma escola do bairro, <span className="acc-blue">feita para as famílias do bairro</span></h2>
              <p>O {escola.nome} nasceu para oferecer às famílias de Ouro Preto uma escola perto de casa, séria no ensino e acolhedora no dia a dia. Aqui, a criança aprende com método e com carinho.</p>
              <p><strong>Nossa missão:</strong> formar crianças seguras, curiosas e responsáveis, com uma base sólida de aprendizado e valores que levam para a vida.</p>
              <p className="soft">Trabalhamos lado a lado com a família: você acompanha, conversa com a equipe e participa da vida escolar do seu filho.</p>
            </div>
            <div className="feats">
              {valores.map(([Icon, cor, t, s]) => (
                <div className={`feat ${cor}`} key={t}>
                  <span className="tile"><Icon size={32} /></span>
                  <div><h3>{t}</h3><p>{s}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="niveis" className="sec dark animate-on-scroll">
          <div className="wrap">
            <div className="head-row">
              <div>
                <Pill icon={GraduationCap}>Nossos níveis de ensino</Pill>
                <h2 className="wide">Acompanhamento próximo <span className="acc-blue">do aluno em cada etapa.</span></h2>
                <p>Da educação infantil ao fundamental II, cada fase é um passo importante para o futuro. No {escola.nome}, o aprendizado acontece com cuidado, atenção e muito propósito.</p>
              </div>
              <div className="script-box">
                <span className="script">Aqui, cada fase importa.</span>
                <Plane className="plane" />
              </div>
            </div>
            <div className="lvls">
              {niveis.map((n) => (
                <article className="lvl" key={n.titulo}>
                  <img src={n.img} alt={n.alt} />
                  <div className="lvl-body">
                    <span className={`tag ${n.cor}`}><n.icone size={18} />{n.etapa}</span>
                    <h3>{n.titulo}</h3>
                    <p>{n.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="estrutura" className="sec dark animate-on-scroll">
          <div className="wrap">
            <div className="head-row">
              <div>
                <Pill icon={Building2}>Estrutura completa</Pill>
                <h2>Espaços pensados para <span className="acc-cyan">crescer</span></h2>
                <p>Quadra, parquinho, cantina e salas coloridas: um ambiente para aprender e brincar.</p>
              </div>
              <div className="script-box"><span className="script s2">Mais que uma escola, uma segunda casa!</span></div>
            </div>
            <div className="gal">
              {galeria.map(([src, alt, nome, Icon, cls]) => (
                <figure className={cls} key={nome}>
                  <img loading="lazy" src={src} alt={alt} />
                  <figcaption><Icon size={18} />{nome}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="sec dark animate-on-scroll">
          <Plane className="plane left-plane" />
          <div className="wrap contato-grid">
            <div>
              <Pill icon={Mail}>Fale conosco</Pill>
              <h2>Venha conhecer o <span className="acc-blue">Colégio Dimensão</span></h2>
              <p>Estamos prontos para receber você e sua família. Tire suas dúvidas, agende uma visita e conheça de perto tudo o que o {escola.nome} tem a oferecer.</p>
              <ul className="info">
                <li><span className="ibox"><MapPin size={22} /></span><div><b>Endereço</b>{escola.endereco[0]}<br />{escola.endereco[1]}<br /><a href={escola.mapa} target="_blank" rel="noopener noreferrer">Ver no mapa <ExternalLink size={13} /></a></div></li>
                <li><span className="ibox"><Phone size={22} /></span><div><b>Telefone e WhatsApp</b><a href={zap}>{escola.telefoneExibido}</a></div></li>
                <li><span className="ibox"><Mail size={22} /></span><div><b>E-mail</b><a href={`mailto:${escola.email}`}>{escola.email}</a></div></li>
                <li><span className="ibox"><Clock size={22} /></span><div><b>Atendimento</b>{escola.horario}</div></li>
                <li className="social"><a className="ibox" href={escola.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram do colégio"><Instagram size={22} /></a><a className="ibox" href={escola.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook do colégio"><Facebook size={22} /></a></li>
              </ul>
          
            </div>
            <form onSubmit={enviarWhatsApp} className="fcard">
              <div className="fhead"><span className="tile"><MessageCircle size={30} /></span><div><h3>Envie sua mensagem</h3><p>Preencha os campos abaixo e nossa equipe entrará em contato o mais breve possível.</p></div></div>
              <label>Seu nome<span className="fld"><User size={20} /><input name="nome" required autoComplete="name" placeholder="Digite seu nome completo" /></span></label>
              <label>Telefone<span className="fld"><Phone size={20} /><input name="tel" type="tel" inputMode="tel" required autoComplete="tel" placeholder="(00) 00000-0000" value={tel} onChange={(e) => setTel(mascaraTelefone(e.target.value))} maxLength={15} pattern="\(\d{2}\) \d{4,5}-\d{4}" title="Digite o telefone com DDD, por exemplo (81) 99999-0000" /></span></label>
              <label>Interesse<span className="fld"><GraduationCap size={20} /><select name="nivel"><option>Educação Infantil</option><option>Fundamental I</option><option>Fundamental II</option></select><ChevronDown size={18} className="chev" /></span></label>
              <label>Mensagem<span className="fld"><MessageCircle size={20} /><textarea name="msg" data-lenis-prevent placeholder="Conte um pouco sobre seu filho e o turno desejado..." /></span></label>
              <button className="btn wide" type="submit"><Send size={20} />Falar com a secretaria</button>
              <p className="fnote">Ao enviar, você será levado ao WhatsApp da secretaria com a mensagem já pronta.</p>
            </form>
          </div>
          <span className="script s3">Estamos à disposição!</span>
          <Pencil className="pencil" />
        </section>
      </main>

      <footer>
        <div className="wrap"><img className="brand-logo" src={logo} alt="Colégio Dimensão" /><p>{escola.nome}. Educação infantil e ensino fundamental I e II em Ouro Preto, Olinda-PE.</p></div>
      </footer>
    </>
  )
}