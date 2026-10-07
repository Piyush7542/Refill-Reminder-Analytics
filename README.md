# Refill Reminder Analytics

**Predictive Analytics Portfolio Project** — Medicine reorder prediction dashboard with ETL pipeline, customer segmentation, and proactive reminder system.

---

## 🎯 Project Overview

This portfolio project recreates the **Refill Reminder** system from Zeno Health (2023–2025), demonstrating end-to-end predictive analytics for medicine reorder prediction.

---

## 🏗️ Architecture

```
Data Layer          → customers.csv, medicines.csv, orders.csv
Pipeline (Python)   → Validation → Cleaning → Standardization → Feature Engineering → Train → Predict → Deduplicate → Quality Check
Dashboard (React)   → 10 pages: Executive Summary, Customer Orders, Consumption, Prediction Model, Reorder Predictions, Reminder Eligibility, Accuracy Metrics, Customer Segmentation, Workflow, About
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/Piyush7542/Refill-Reminder-Analytics.git
cd Refill-Reminder-Analytics
npm install
pip install pandas numpy rapidfuzz faker
npm run generate-data
npm run train-model
npm run dev
```

Open http://localhost:3004

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| Total Customers | 2,000 |
| Active Prescriptions | 4,374 |
| Accuracy (7 days) | 72% |
| Accuracy (14 days) | 88% |
| MAE | 3.5 days |
| RMSE | 5.2 days |

---

## 🎯 Key Features

### 1. Predictive Model (Baseline Median Heuristic)
- Customer-specific median refill interval per medicine
- Confidence scoring based on order count & consistency
- **Why not XGBoost?** Simple heuristic captures 85-90% of signal for chronic meds

### 2. ETL Pipeline (10 Stages)

| Stage | Input | Output | Time |
|-------|-------|--------|------|
| Validation | 10,000 orders | 9,500 valid | ~1.2s |
| Cleaning | 9,500 | 9,500 | ~2.5s |
| Standardization | 9,500 | 9,500 | ~3.0s |
| Deduplication | 9,500 | 9,100 | ~2.0s |
| Quality Check | 9,100 | 9,100 | ~0.5s |
| **Total** | **10,000** | **9,100 clean** | **< 30s** |

### Customer Segmentation (RFM)

| Segment | Recency | Frequency | Monetary | Strategy |
|---------|---------|-----------|----------|----------|
| High Value | 15 days | 8/yr | ₹15K | Personal calls, VIP |
| Regular | 30 days | 4/yr | ₹6K | SMS automation |
| Occasional | 60 days | 2/yr | ₹2K | Email nurture |
| At Risk | 120+ days | <1/yr | ₹800 | Win-back campaigns |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Backend (Data) | Python 3.11, pandas, numpy, rapidfuzz, faker |
| ML | Baseline median heuristic |
| Deployment | Netlify (static) |

---

## 📁 Project Structure

```
refill-reminder-analytics/
├── public/data/                    # Aggregated JSON for dashboard
├── src/
│   ├── components/
│   │   ├── charts/          # BarChart, LineChart, DonutChart, ScatterChart, ProgressChart
│   │   ├── dashboard/       # KPICard, CustomerTable, PredictionCard, etc.
│   │   ├── layout/          # Header, Sidebar, Footer
│   │   ├── pipeline/        # PipelineFlow, StageIndicator
│   │   └── ui/              # Badge, FilterBar, Tabs, Tooltip, ErrorBoundary
│   ├── hooks/               # useFilters, useCustomerData, usePredictionData
│   ├── pages/               # 10 page components
│   ├── types/               # TypeScript interfaces
│   └── utils/               # formatters, constants, cn helper
├── scripts/
│   ├── generate-data.py     # Synthetic data generation
│   ├── train-model.py       # Pipeline execution + ML
│   └── aggregate-data.py    # Dashboard JSON generation
└── public/data/             # Gitignored raw CSV files
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Data Pipeline
npm run generate-data    # Generate synthetic CSV data
npm run train-model      # Run full pipeline
npm run aggregate-data   # Create dashboard JSON
```

---

## 🚀 Deployment

### Netlify
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Node version: 20

---

## ⚠️ Disclaimer

> **SYNTHETIC DATA — PORTFOLIO DEMO**
> 
> This project uses **100% synthetic data** for portfolio demonstration. No real Zeno Health data, patient information, or proprietary metrics are used.

---

## 👤 Author

**Piyush Anand**  
Senior Data & Visualization Analyst  
[LinkedIn](https://linkedin.com/in/piyush-anand) • [GitHub](https://github.com/Piyush7542)