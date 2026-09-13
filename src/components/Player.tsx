import { ExternalLink, Headphones, Music2 } from 'lucide-react'

// Troque somente este ID para carregar outra playlist pública do Spotify.
// Exemplo: o trecho depois de /playlist/ em uma URL do Spotify.
const SPOTIFY_PLAYLIST_ID = '37i9dQZF1DWWQRwui0ExPn'

const spotifyUrl = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`
const spotifyEmbedUrl = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`

export function Player() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#b87842]/15 bg-[#211815]/70 shadow-[0_16px_40px_rgba(0,0,0,0.12)] backdrop-blur-sm animate-rise-in" style={{ animationDelay: '280ms' }}>
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8a4e2b]/15 text-[#d9994d]">
            <Music2 size={16} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a48b79]">trilha de fundo</p>
            <p className="mt-0.5 text-xs text-[#d8c1ae]">jazz & lo-fi para acompanhar</p>
          </div>
        </div>
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir playlist no Spotify"
          className="rounded-lg p-1.5 text-[#8c7462] transition-colors hover:bg-[#8a4e2b]/15 hover:text-[#e5a45a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5a45a]"
        >
          <ExternalLink size={15} />
        </a>
      </div>
      <div className="relative aspect-[16/9] border-t border-[#b87842]/10 bg-[#181211]">
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-[#755f50]">
          <Headphones size={22} strokeWidth={1.4} />
          <span className="text-[10px] uppercase tracking-[0.18em]">carregando sua trilha</span>
        </div>
        <iframe
          title="Playlist de jazz e lo-fi do Spotify"
          src={spotifyEmbedUrl}
          loading="lazy"
          className="relative z-10 h-full w-full border-0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>
    </section>
  )
}
