#!/usr/bin/env bash
# One-time setup for local narration (Kokoro-82M, Apache-2.0). Needs uv (https://docs.astral.sh/uv/) and Python 3.12.
set -euo pipefail
cd "$(dirname "$0")/.."
uv venv --python 3.12 .venv-tts
uv pip install --python .venv-tts/bin/python kokoro soundfile pip --extra-index-url https://download.pytorch.org/whl/cpu
.venv-tts/bin/python -m spacy download en_core_web_sm   # misaki (Kokoro's G2P) needs this model
