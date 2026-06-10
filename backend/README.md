# IC Education API

Minimal hosted API for the GitHub Pages `iceducation` frontend.

## Endpoints

- `GET /api/health`
- `GET /api/worksheets/options`
- `GET /api/study-pack/recommend`
- `POST /api/study-pack/generate`

## Local Run

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:DEEPSEEK_API_KEY="your_key_here"
python app.py
```

## Render

This repo includes a root `render.yaml` for deploying this backend as a Render web service.

Required environment variable:

- `DEEPSEEK_API_KEY`

Optional environment variables:

- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_MODEL`
