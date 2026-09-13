# Cozy Companion

Painel de foco amplo para organizar o dia, preparar uma sessão e trabalhar com calma. Em telas grandes, o timer e a fila de foco ocupam a área principal enquanto checklist, meta, meditação e trilha ficam acessíveis ao lado; em telas pequenas, o conteúdo se reorganiza em uma coluna confortável. O projeto é 100% local: não possui backend nem autenticação, e preferências, meta, tarefas, ritual e sessões são persistidos em `localStorage`.

## Rodar localmente

```bash
pnpm install --ignore-workspace
pnpm dev
```

O `--ignore-workspace` é necessário neste checkout porque ele fica dentro de outro workspace pnpm na máquina. Em uma cópia standalone do projeto, `pnpm install` também funciona.

Depois, abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

Para validar a versão de produção:

```bash
pnpm lint
pnpm build
```

## Onde personalizar

- **Cores, tipografia e animações:** `src/index.css` e as classes Tailwind nos componentes.
- **Tempos do pomodoro:** os padrões estão em `src/hooks/usePomodoro.ts`, em `DEFAULT_SETTINGS`. Também podem ser alterados pela engrenagem do timer.
- **Playlist do Spotify:** altere `SPOTIFY_PLAYLIST_ID` no topo de `src/components/Player.tsx`.
- **Meta padrão:** altere `DEFAULT_META` em `src/components/MetaFixa.tsx`.
- **Layout geral:** `src/App.tsx` e `src/index.css`.

## Organização

- `src/components/Timer.tsx`: timer, controles, progresso e configurações.
- `src/components/TodoList.tsx`: fila de foco com criação, filtros, prioridades, estimativas, seleção para a sessão e conclusão.
- `src/components/SessionChecklist.tsx`: ritual persistente que libera o timer depois de três preparações.
- `src/components/Meditation.tsx`: prática guiada com ciclos respiratórios e duração ajustável.
- `src/components/Streak.tsx`: contador de dias consecutivos.
- `src/components/MetaFixa.tsx`: objetivo editável e persistido.
- `src/components/TarefaAtual.tsx`: âncora da sessão atual.
- `src/components/Player.tsx`: iframe oficial do Spotify.
- `src/hooks/usePomodoro.ts`: fases, sessões diárias, meia-noite e beep via Web Audio API.
- `src/hooks/useStreak.ts`: regra de continuidade do streak.
- `src/hooks/usePersistentState.ts`: camada reutilizável de `localStorage`.
- `src/types.ts`: tipos compartilhados das tarefas e do checklist.
