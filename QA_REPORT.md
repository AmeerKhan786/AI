# v5 Roadmap Alignment QA Report

## Scope
Aligned the Command Centre to the user's selected direction: integrate improvements into the existing 100 lessons, with balanced Data Engineering + AI Engineering emphasis.

## Preservation checks
- Exactly 100 lessons remain.
- Exactly 7 original phases remain.
- Original day numbers, lesson titles, phase labels, Learn, Build, Done and checkpoint values are unchanged.
- Original roadmap dates are not changed.
- Added learning content is explicitly labelled optional and does not count as a new lesson.
- No new daily hours or mandatory lessons were added.

## Enhancements added
- Python engineering: type hints, Ruff, pytest, PR workflow, CI.
- API engineering: FastAPI, Pydantic, streaming, retries, rate limits, structured tool calling, cost/latency tracking.
- ML/deep-learning literacy: tensors, PyTorch basics, neural networks, backpropagation, transformer internals.
- RAG engineering: metadata permissions, hybrid retrieval, reranking, versioning, retrieval metrics, citations and regression testing.
- Agents/production: human approval, least privilege, threat testing, traces, trajectory evaluation, deployment health and rollback.
- Portfolio: AI data analysis API, ML prediction pipeline, governed enterprise RAG; capstone reframed as production AI data platform.

## Automated checks executed
- `node --check app.js` — passed.
- `node test-app.cjs` — passed (15 assertions).
- Lesson-array comparison against v4 — passed for all original fields.
- Lesson count and phase count — passed.

## Not claimed
No interactive real-device Android/browser test was performed in this environment. The user should retain a JSON backup before replacing the live app and verify on the installed PWA.


## v5.1 maintenance QA
- Updated README cache documentation to match `ai-data-command-centre-v5-1`.
- Added `.github/workflows/quality-checks.yml` to validate required PWA files, JavaScript syntax, regression tests, JSON parsing, and roadmap structure on pushes / pull requests to `main`.
- Expanded `test-app.cjs` to cover schedule boundaries, unique lesson dates, render side effects, lesson status validation, malformed backup data, date validation, numeric clamping, unsafe URL filtering, streaks, averages and leap-year month calculations.
- This workflow is a quality gate for the test suite; GitHub Pages branch-based publishing may still deploy independently. To strictly block publishing on failed checks, Pages must be migrated to a workflow-based deployment pipeline.
- No interactive Android device test was performed.
