# Pantheon

**An interactive 3D map of the cultural evolution of world religion.**

Explore 115 religious traditions, 209 shared figures, and 158 historical connections in a navigable three-dimensional space. Trace how deities, prophets, and mythological motifs traveled across cultures — from Sumerian temples to Polynesian voyaging canoes, from the Proto-Indo-European sky father to the Eleusinian Mysteries.

**[Launch the explorer →](https://omniharmonic.github.io/pantheon/)**

---

## What you can do

- **Navigate in 3D** — WASD keys to fly through the graph, mouse to orbit and zoom
- **Explore traditions** — Click any glowing node to see its key figures, concepts, branches, and historical connections
- **Toggle the figure layer** — Reveal 209 shared figures (deities, prophets, patriarchs, heroes) as smaller nodes orbiting their traditions
- **Walk the graph** — Click a figure, then follow "fly to →" links to trace connection chains across religions (e.g. Inanna → Ishtar → Astarte → Aphrodite)
- **Track your journey** — Breadcrumb trail records your path; click any past step to jump back
- **Filter by time** — Drag the timeline slider to focus on specific eras (Bronze Age, Axial Age, Medieval, Modern)
- **Search** — Find traditions, figures, or concepts by name

## What's in the data

### 115 Religious Traditions spanning:
- **Indigenous Americas** — Navajo, Lakota, Hopi, Inuit, Mapuche, Guarani, Olmec, Mississippian, Pacific Northwest, Taíno
- **Africa & Oceania** — Dogon, Zulu, Maasai, Igbo, Kongo, San/Bushman, Kushite, Oromo, Aboriginal Australian, Māori, Hawaiian, Polynesian
- **Asia** — Tengrism, Bon, Siberian shamanism, Balinese Hinduism, Vietnamese Đạo Mẫu, Kejawen, Caodaism
- **Ancient Mediterranean** — Sumerian, Babylonian, Egyptian, Canaanite, Phoenician, Minoan, Mycenaean, Etruscan, Greek, Roman
- **Mystery & Esoteric** — Eleusinian Mysteries, Orphic religion, Mithraic Mysteries, Kabbalah, Gnosticism, Hermeticism, Mandaeism, Yazidism, Druze
- **World religions** — Hinduism, Buddhism, Jainism, Sikhism, Judaism, Christianity, Islam, Zoroastrianism, Taoism, Confucianism, Shinto, Bahá'í
- **Modern movements** — LDS, Rastafari, Wicca, Tenrikyo, Falun Gong, Ásatrú, Kemetic reconstruction, and more

### 209 Shared Figures including:
- Cross-Abrahamic prophets (Abraham, Moses, Jesus, Mary across Judaism, Christianity, Islam)
- Indo-European cognate deities (the Dyeus Pater → Zeus → Jupiter → Dyaus Pita chain)
- Goddess evolution chains (Inanna → Ishtar → Astarte → Aphrodite)
- Buddhist figures across cultures (Avalokiteshvara → Guanyin → Kannon)
- African diaspora syncretisms (Ogun → Saint Peter, Yemoja → Virgin Mary)
- Dying-and-rising gods, flood heroes, dragon slayers, trickster figures

### 158 Historical Connections mapping:
- Parent-child lineages
- Cultural exchange and trade routes
- Syncretic fusions
- Shared substrates
- Influence relationships

## Tech stack

- **Next.js** — React framework with static export
- **Three.js / react-three-fiber** — 3D rendering
- **drei** — Three.js helpers (Html labels, Lines, Stars, OrbitControls)
- **Zustand** — State management
- **Tailwind CSS** — Styling
- **GitHub Pages** — Hosting

## Running locally

```bash
git clone https://github.com/omniharmonic/pantheon.git
cd pantheon
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Controls

| Input | Action |
|-------|--------|
| **W/A/S/D** | Move forward/left/back/right |
| **Q/E** | Move down/up |
| **Shift** | Sprint (2.5x speed) |
| **Mouse drag** | Orbit camera |
| **Scroll** | Zoom |
| **Click node** | Select tradition or figure |
| **?** | Toggle help overlay |

## Data methodology

The tradition and figure data was compiled from scholarly sources including archaeological evidence and dating, ethnographic field research, comparative mythology and religious studies, and historical primary texts. All dates distinguish between traditional/mythological dating and archaeological evidence where applicable.

## Contributing

Contributions welcome — especially:
- Corrections to dates, relationships, or descriptions
- Additional traditions or figures with scholarly sourcing
- UI/UX improvements
- Accessibility enhancements

## License

MIT
