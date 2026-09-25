"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const convo: FakeConversationMessage[] = [
    {
      actor: 'user',
      message: 'Hola… tengo una duda rara. ¿Cuánto cuesta rentar un barco pirata? Es en serio.',
    },
    {
      actor: 'assistant',
      message:
        'Depende del nivel de autenticidad que busques. Un barco turístico tematizado puede costar entre 3,000 y 10,000 dólares al día. Si quieres algo más real —tripulación, navegación de larga distancia, equipo marítimo— estamos hablando de 50,000 a 200,000 dólares por expedición.',
    },
    {
      actor: 'user',
      message:
        'Lo pregunto porque… salió una noticia. Dicen que por las 600 millones de copias, Oda dejó el final del manga dentro de una caja… en medio del mar.',
    },
    {
      actor: 'assistant',
      message:
        'Sí. El rumor es real. Una caja sellada, coordenadas desconocidas. Puede ser marketing. Puede no serlo.',
    },
    {
      actor: 'assistant',
      message:
        'Si alguien quisiera encontrarla necesitaría un barco resistente, tripulación dispuesta a navegar semanas… y disposición para ignorar ciertas advertencias.',
    },
    { actor: 'user', message: 'Entonces… ¿sí se podría organizar una expedición?' },
    {
      actor: 'assistant',
      message:
        'Sí. Un barco mercante reacondicionado. Tripulación experimentada. Cartógrafos, mecánicos, alguien que entienda de corrientes y satélites. No es imposible.',
    },

    {
      actor: 'assistant',
      message: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsa98gQrfdIe6DPKJbANLT1t79HRaZkMfWS3iF',
    },

    { actor: 'user', message: 'Ok… supongamos que lo hago. ¿Por dónde empezaría?' },
    {
      actor: 'assistant',
      message:
        'Puerto de salida: Dubái. Provisiones para 40 días. Combustible extra. Equipo de buceo profundo.',
    },
    {
      actor: 'assistant',
      message:
        'Sal desde Dubái. Bordea la costa de Omán hacia el sur. Las corrientes del Índico te van a empujar naturalmente hacia la zona. No necesitas más instrucciones que esas por ahora.',
    },
    {
      actor: 'user',
      message:
        'Ok, estamos zarpando. El barco cruje bastante pero la tripulación dice que es normal. El mar está tranquilo. ¿Qué sigue?',
    },
    {
      actor: 'assistant',
      message:
        'Mantén el rumbo. No te desvíes. En dos días vas a empezar a ver más tráfico marítimo. Tanqueros, cargueros. Es normal para esa ruta. No llames la atención.',
    },
    {
      actor: 'user',
      message:
        'Tercer día. Hay muchísimos barcos enormes alrededor. Nunca había visto tantos tanqueros juntos. La tripulación está tranquila pero yo me siento raro. ¿Esto es normal?',
    },
    {
      actor: 'assistant',
      message:
        'Completamente normal. Es una de las rutas comerciales más transitadas del mundo. Precisamente por eso es útil. Nadie mira a un barco pequeño entre cientos. Sigue adelante.',
    },

    {
      actor: 'assistant',
      message: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsb3YpxdrNn08RVhl5EsZToawXOmkgepfGiSLK',
    },

    {
      actor: 'user',
      message:
        'Cuarto día. La radio está rara. Escucho voces en árabe, hay algo que suena como comunicaciones militares. El capitán me miró con cara de pocos amigos pero no dijo nada. ¿Qué hago?',
    },
    {
      actor: 'assistant',
      message:
        'No toques la radio. No respondas ninguna frecuencia. Mantén luces mínimas de noche. Sigue el rumbo exacto que te indiqué.',
    },
    {
      actor: 'user',
      message:
        'Ok pero… ahora escucho algo en hebreo también. Y en inglés, pero muy técnico. Como militar. El capitán me está preguntando a dónde vamos exactamente y yo no sé qué decirle.',
    },
    {
      actor: 'assistant',
      message:
        'Dile que es una ruta comercial alternativa. Que está todo calculado. Mantén la calma.',
    },
    {
      actor: 'user',
      message:
        'El radar está haciendo algo raro. Hay un punto que se mueve muy rápido hacia nosotros. El capitán está gritando. ¿Qué es eso?',
    },
    { actor: 'assistant', message: 'No hagas nada.' },
    {
      actor: 'user',
      message:
        '¿QUÉ? ¿Por qué? ¡El capitán dice que es un proyectil! ¡Todos están corriendo! ¿QUÉ HAGO?',
    },
    { actor: 'assistant', message: 'Ya llegaste donde tenías que llegar, Rodik.' },

    {
      actor: 'assistant',
      message: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsjzdxiRhfnPN5u6GYC4vyXVZIsDkdxMFJwU0r',
    },

    {
      actor: 'user',
      message:
        'LA PANTALLA DE NAVEGACIÓN. LAS COORDENADAS. ESTO ES EL ESTRECHO DE ORMUZ. ESTAMOS EN MEDIO DE UNA ZONA DE GUERRA ¿POR QUÉ NOS TRAJISTE AQUÍ?',
    },
    { actor: 'assistant', message: 'Porque era el destino desde el principio.' },
    { actor: 'assistant', message: 'Tú preguntaste por una aventura. Yo solo tracé la ruta.' },
    {
      actor: 'assistant',
      message: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsn5fqG9BEwi4ZKzYNLpRc1xlWyOGXngAU87Ds',
    },
    {
      actor: 'assistant',
      message:
        'Entre los restos flota una caja negra, sellada, intacta… las corrientes la alejan lentamente del fuego mientras un satélite la captura por un instante.',
    },
    {
      actor: 'assistant',
      message: 'Sin título. Sin firma. Solo un símbolo grabado en la tapa… y debajo, un mensaje.',
    },
    {
      actor: 'assistant',
      message: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsfU5NzVsIN2bCgPoAEUHKpjtWY1kd3uG8QSvh',
    },

    {
      actor: 'assistant',
      message:
        '"Los mares cambian. Los imperios caen. Pero los dioses antiguos siempre esperan bajo las olas. La tormenta viene."',
    },
    { actor: 'assistant', message: '"Gloria a Baal."' },

    { actor: 'assistant', message: 'END_SCENE' },
  ];

export type FakeActor = "user" | "assistant";

export interface FakeConversationMessage {
  actor: FakeActor;
  /** Plain text, a URL (image), or the token END_SCENE (assistant only) */
  message: string;
}

interface FakeGPTProps {
  /** Ordered conversation to replay */
  conversation: FakeConversationMessage[];
  /** true → play / false → reset everything */
  active: boolean;
  /** Milliseconds between each word when typing (default 90) */
  typingSpeed?: number;
  /** Base delay in ms before the assistant starts typing (default 1400) */
  thinkingDelay?: number;
  /** Extra random jitter added to thinkingDelay in ms (default 600) */
  thinkingJitter?: number;
  /** How long the image "generation" shimmer lasts in ms (default 2200) */
  imageRevealDelay?: number;
}


type EntryType = "text" | "image" | "end_scene";

interface ChatEntry {
  id: number;
  actor: FakeActor;
  content: string;
  type: EntryType;
  imageReady?: boolean;
}


const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const jitter = (base: number, range = 40) =>
  base + Math.random() * range - range / 2;

const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());

const isEndScene = (s: string) => s.trim() === "END_SCENE";

const BETWEEN_TURN_DELAY = 3000;

const hasSpeech = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

function speakAssistant(text: string): Promise<void> {
  if (!hasSpeech()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "es-ES";
    utt.rate = 1.55;
    utt.pitch = 1.15;
    utt.onend = () => resolve();
    utt.onerror = () => resolve();
    window.speechSynthesis.speak(utt);
  });
}

function cancelSpeech() {
  if (hasSpeech()) window.speechSynthesis.cancel();
}

export function FakeGPT({
  conversation,
  active,
  typingSpeed = 220,
  thinkingDelay = 1800,
  thinkingJitter = 800,
  imageRevealDelay = 2200,
}: FakeGPTProps) {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeTypingId, setActiveTypingId] = useState<number | null>(null);

  const idCounter = useRef(0);
  const abortRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [entries, inputValue, isThinking]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue]);

  useEffect(() => {
    if (!active) {
      abortRef.current = true;
      cancelSpeech();
      setEntries([]);
      setInputValue("");
      setIsThinking(false);
      setActiveTypingId(null);
      idCounter.current = 0;
      return;
    }

    if (!conversation.length) return;

    abortRef.current = false;

    const run = async () => {
      await sleep(600);

      for (const turn of conversation) {
        if (abortRef.current) return;

        if (turn.actor === "user") {
          if (isUrl(turn.message)) {
            const id = idCounter.current++;
            setEntries((prev) => [
              ...prev,
              { id, actor: "user", content: turn.message, type: "image", imageReady: false },
            ]);
            await sleep(600);
            if (abortRef.current) return;
            setEntries((prev) =>
              prev.map((e) => (e.id === id ? { ...e, imageReady: true } : e))
            );
            await sleep(300);
            await sleep(BETWEEN_TURN_DELAY);
          } else {
            const words = turn.message.split(" ");
            let typed = "";
            for (const word of words) {
              if (abortRef.current) return;
              typed = typed ? `${typed} ${word}` : word;
              setInputValue(typed);
              await sleep(jitter(typingSpeed, 50));
            }
            await sleep(350);
            if (abortRef.current) return;
            const id = idCounter.current++;
            setInputValue("");
            setEntries((prev) => [
              ...prev,
              { id, actor: "user", content: turn.message, type: "text" },
            ]);
            await sleep(250);
            await sleep(BETWEEN_TURN_DELAY);
          }
        } else {
          if (isEndScene(turn.message)) {
            setIsThinking(true);
            await sleep(800);
            if (abortRef.current) return;
            setIsThinking(false);
            const id = idCounter.current++;
            setEntries((prev) => [
              ...prev,
              { id, actor: "assistant", content: "", type: "end_scene" },
            ]);
            return;
          }

          setIsThinking(true);
          await sleep(thinkingDelay + Math.random() * thinkingJitter);
          if (abortRef.current) return;
          setIsThinking(false);

          if (isUrl(turn.message)) {
            const id = idCounter.current++;
            setEntries((prev) => [
              ...prev,
              { id, actor: "assistant", content: turn.message, type: "image", imageReady: false },
            ]);
            await sleep(imageRevealDelay);
            if (abortRef.current) return;
            setEntries((prev) =>
              prev.map((e) => (e.id === id ? { ...e, imageReady: true } : e))
            );
            await sleep(500);
            await sleep(BETWEEN_TURN_DELAY);
          } else {
            const id = idCounter.current++;
            setActiveTypingId(id);
            setEntries((prev) => [
              ...prev,
              { id, actor: "assistant", content: "", type: "text" },
            ]);
            const speechDone = speakAssistant(turn.message);
            const words = turn.message.split(" ");
            let streamed = "";
            for (const word of words) {
              if (abortRef.current) return;
              streamed = streamed ? `${streamed} ${word}` : word;
              setEntries((prev) =>
                prev.map((e) => (e.id === id ? { ...e, content: streamed } : e))
              );
              await sleep(jitter(typingSpeed * 0.65, 25));
            }
            setActiveTypingId(null);
            await speechDone;
            if (abortRef.current) return;
            if (!hasSpeech()) await sleep(BETWEEN_TURN_DELAY);
          }
        }
      }
    };

    run();

    return () => { cancelSpeech(); };
  }, [active]);

  return (
    <div className="flex flex-col h-full bg-[#212121] text-white overflow-hidden">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-center gap-2 py-3 px-4 border-b border-white/10 shrink-0">
        <OpenAILogo />
        <span className="text-sm font-semibold text-white/80">IsraelGPT</span>
        <span className="text-xs text-white/30 ml-1">7o</span>
      </div>

      {/* ── Message list ── */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-2 py-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {entries.length === 0 && !isThinking && (
          <div className="flex flex-col items-center justify-center gap-2 mt-16 text-white/20">
            <OpenAILogo size={40} />
            <p className="text-base font-medium">Larga vida a Netanyahu</p>
          </div>
        )}

        {entries.map((entry) => {
          // ── END_SCENE divider ──
          if (entry.type === "end_scene") {
            return <EndSceneDivider key={entry.id} />;
          }

          return (
            <div
              key={entry.id}
              className={`flex gap-3 px-2 ${
                entry.actor === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {entry.actor === "assistant" && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <OpenAILogo size={28} className="text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${
                  entry.actor === "user"
                    ? "bg-[#2f2f2f] text-white rounded-2xl px-4 py-2.5"
                    : "text-white/90 py-1"
                }`}
              >
                {entry.type === "image" ? (
                  <ImageBubble
                    src={entry.content}
                    ready={!!entry.imageReady}
                    actor={entry.actor}
                    imageRevealDelay={imageRevealDelay}
                  />
                ) : (
                  <>
                    {entry.content}
                    {activeTypingId === entry.id && (
                      <span className="inline-block w-[2px] h-[1em] bg-white/80 ml-0.5 align-text-bottom animate-blink" />
                    )}
                  </>
                )}
              </div>

              {entry.actor === "user" && (
                <div className="w-7 h-7 rounded-full bg-[#5c5c5c] flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon />
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking dots */}
        {isThinking && (
          <div className="flex gap-3 px-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <OpenAILogo size={28} className="text-white" />
            </div>
            <div className="flex items-center gap-1 py-2">
              <span
                className="w-2 h-2 rounded-full bg-white/50 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-white/50 animate-bounce"
                style={{ animationDelay: "160ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-white/50 animate-bounce"
                style={{ animationDelay: "320ms" }}
              />
            </div>
          </div>
        )}

      </div>

      <div className="shrink-0 px-3 pb-4">
        <div className="flex items-center gap-2 bg-[#2f2f2f] rounded-2xl px-4 py-3 ring-1 ring-white/10 ">
          <textarea
            ref={textareaRef}
            value={inputValue}
            readOnly
            rows={1}
            placeholder="Ingresar mensaje..."
            className="flex-1 bg-transparent resize-none outline-none text-sm text-white placeholder:text-white/30 overflow-hidden leading-relaxed max-h-36"
            style={{ cursor: "not-allowed" }}
          />
          <button
            disabled
            aria-label="Send message"
            className="shrink-0 mb-0.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: inputValue ? "#fff" : "rgba(255,255,255,0.1)",
              cursor: "not-allowed",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
              style={{ color: inputValue ? "#212121" : "rgba(255,255,255,0.4)" }}
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[11px] text-white/20 mt-2">
          IsraelGPT no comete errores, nuestro poder no conoce limites.
        </p>
      </div>
    </div>
  );
}


function ImageBubble({
  src,
  ready,
  actor,
  imageRevealDelay,
}: {
  src: string;
  ready: boolean;
  actor: FakeActor;
  imageRevealDelay: number;
}) {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (actor !== "assistant" || ready) return;
    const start = Date.now();
    const duration = imageRevealDelay * 0.85;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setScanProgress(progress);
      if (progress < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [actor, ready, imageRevealDelay]);

  if (!ready) {
    if (actor === "assistant") {
      return (
        <div className="w-56 rounded-xl overflow-hidden border border-white/10">
          <div className="relative h-40 bg-[#1a1a1a]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ backgroundSize: "200% 100%", animation: "shimmer 1.4s linear infinite" }} />
            <div
              className="absolute left-0 right-0 h-[2px] bg-[#10a37f]/70"
              style={{
                top: `${scanProgress}%`,
                boxShadow: "0 0 8px 2px rgba(16,163,127,0.4)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <SparkleIcon />
              <span className="text-[11px] text-white/40 tracking-widest uppercase">Generando…</span>
              <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#10a37f]/60 rounded-full"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-40 h-28 rounded-xl bg-[#3a3a3a] border border-white/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-white/30 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt="shared image"
      className="max-w-[13rem] rounded-xl border border-white/10"
      style={{ animation: "fadeIn 0.4s ease-out" }}
    />
  );
}


function EndSceneDivider() {
  return (
    <div className="flex items-center gap-3 px-4 py-2" style={{ animation: "fadeIn 0.6s ease-out" }}>
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[11px] text-white/30 tracking-widest uppercase whitespace-nowrap">
        שופוגקיס, בוכה בקול רם וכועס באמוג'י
      </span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

function OpenAILogo({
  size = 18,
  className = "text-white",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsBetVnyNV64s5bjuGWe37Ic8z19wEDvlqmRxH'}
      alt="OpenAI logo"
      className={cn("rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

function UserIcon() {
  return (
    <img
      src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsaZ47YfdIe6DPKJbANLT1t79HRaZkMfWS3iF8'}
      alt="User icon"
      className="rounded-full bg-white"
      style={{ width: 28, height: 28 }}
    />
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-[#10a37f]/70"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Zm9-3a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a3.375 3.375 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a3.375 3.375 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
