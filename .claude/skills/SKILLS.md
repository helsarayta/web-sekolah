# SKILLS.md — Panduan Pemakaian Skill untuk Proyek Market-Agent

> Arahan untuk Claude di setiap sesi: proyek ini adalah **engine digital marketing
> multi-tenant berbahasa RUST** (axum + tokio + **NusaDB** + ort/ONNX).
> NusaDB = database buatan user sendiri (Rust; dialek SQL setara PostgreSQL;
> akses via driver & wire protocol NATIVE NusaDB — bukan sqlx/psycopg; via `nusa-cli`).
> Gunakan skill di bawah sesuai konteks pekerjaan. Detail proyek: `info/plan/`,
> pecahan kerja: `tasks/`, status klaim research: `info/research/10`.

## Aturan umum

1. **Saat ragu skill Rust mana yang cocok → mulai dari `rust-router`** (dia mengarahkan ke modul m01–m15 yang tepat).
2. Error compiler Rust SELALU lewat skill modul m\* yang sesuai kode errornya — jangan tebak dari ingatan.
3. Skill `backend-check`, `implement-get-api`, `implement-post-api`, `query-backend`, `java-optimizer` adalah milik **proyek lain (Spring Boot/PhIS)** — JANGAN dipakai di proyek ini.
4. Sebelum commit/PR: `code-review` (atau `adversarial-reviewer` untuk review kritis); rapikan dengan `simplify`; validasi perilaku dengan `verify`.

## A. Rust inti (dipakai sepanjang Fase 1–9)

| Situasi | Skill |
|---|---|
| Gaya kode, naming, clippy, rustfmt, konvensi | `coding-guidelines` |
| Error ownership/borrow/lifetime (E0382, E0597, E0506…) | `m01-ownership` |
| Box/Rc/Arc/RefCell, RAII, Drop (AppState, share model ONNX) | `m02-resource` |
| Error mutability (E0596/E0499/E0502), interior mutability, Mutex/RwLock | `m03-mutability` |
| Generic, trait, dyn, trait bound (trait PlatformConnector!) | `m04-zero-cost` |
| **Typed ID, newtype, Money, type-state, "invalid states unrepresentable"** — pola inti crate `domain` | `m05-type-driven` |
| Result/Option/thiserror/anyhow, kapan panic — aturan error proyek | `m06-error-handling` |
| Async/tokio, channel, Semaphore, konkurensi scheduler/worker | `m07-concurrency` |
| Performa, alokasi, profiling (target RSS <100MB) | `m10-performance` |
| Pemilihan crate/ekosistem | `m11-ecosystem` |
| Anti-pattern Rust | `m15-anti-pattern` |
| Mental model Rust (penjelasan konsep) | `m14-mental-model` |
| Ada blok `unsafe` (semoga tidak perlu) | `unsafe-checker` |

## B. Domain spesifik proyek ini

| Bagian engine | Skill |
|---|---|
| API axum, middleware, auth, router, extractor (crate `engine`) | `domain-web` |
| Subcommand CLI `engine serve/worker/migrate`, config, env | `domain-cli` |
| **Money, currency, presisi, rounding, ledger** (crate `domain`, multi-currency) | `domain-fintech` |
| **ML inference, ort/ONNX, tensor** (crate `agent`) | `domain-ml` |
| Docker, observability/tracing, deploy, health check | `domain-cloud-native` |
| TDD & strategi test (golden test, contract test, property test) | `tdd-guide` |

## C. Database (NusaDB — warehouse & queue; kompatibel PostgreSQL)

| Situasi | Skill |
|---|---|
| Desain skema, query kompleks, window function, CTE, EXPLAIN | `sql-pro` (tulis dialek PostgreSQL — NusaDB kompatibel; fitur spesifik cek matriks `info/research/13-nusadb-kompatibilitas.md` hasil gerbang F1-DB) |
| Query lambat, index, partisi bulanan, lock contention (SKIP LOCKED) | `database-optimizer` (saran berbasis PostgreSQL — validasi terhadap kemampuan NusaDB sebelum diterapkan) |

Catatan: NusaDB adalah proyek user sendiri yang masih tahap testing — bug yang ditemukan saat integrasi dilaporkan/dicatat untuk backlog NusaDB, jangan di-workaround diam-diam.

## D. Navigasi & refactor codebase (saat kode sudah besar)

`rust-code-navigator` (cari simbol/struktur), `rust-call-graph`, `rust-trait-explorer` (implementor PlatformConnector), `rust-deps-visualizer` (jaga grafik dependensi sesuai plan 10), `rust-refactor-helper`, `rust-symbol-analyzer`.

## E. Kualitas & keamanan

| Situasi | Skill |
|---|---|
| Review diff sebelum commit | `code-review` |
| Review kritis/adversarial (kode sensitif: guardrail, billing, crypto token) | `adversarial-reviewer` |
| Penyederhanaan setelah fitur jalan | `simplify` |
| Verifikasi perubahan dengan menjalankan app | `verify` / `run` |
| Review keamanan perubahan (OAuth, enkripsi token, multi-tenant isolation) | `security-review` |

## F. Fase bisnis/go-to-market (Fase 9 — bukan kode)

`pricing-strategy` (tier free/paid), `copywriting` + `page-cro` (landing page beta), `launch-strategy` (beta launch), `competitive-teardown` (update intel Madgicx dkk.), `campaign-analytics` (analisis kampanye sendiri), `email-sequence` (email transaksional/onboarding — konten, bukan infra).

## G. Catatan khusus

- Skill `claude-api` hanya relevan untuk tooling pengembangan — **engine TIDAK memanggil LLM API eksternal** (keputusan tercatat: LLM milik sendiri, Fase 7).
- Pertanyaan "skill mana untuk X?" yang tidak terjawab di sini → `rust-router` untuk Rust, atau cari berdasarkan deskripsi skill.
