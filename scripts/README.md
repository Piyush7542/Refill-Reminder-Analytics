# Data Generation & Model Training Scripts

These scripts create synthetic data and train the baseline prediction model for the Refill Reminder Analytics dashboard.

## Prerequisites

```bash
# Install Python dependencies
pip install pandas numpy scikit-learn
```

## Usage

### 1. Generate Raw Synthetic Data
```bash
python scripts/generate-data.py
```
Creates (in `data/raw/`):
- `customers.csv` - 2,000 synthetic customers with segments
- `medicines.csv` - 500 synthetic medicines across 8 categories
- `orders.csv` - ~50,000 synthetic orders with realistic refill patterns
- `metadata.json` - Generation metadata

### 2. Train Baseline Model & Evaluate
```bash
python scripts/train-model.py
```
- Computes features per customer-medicine pair
- Trains median refill interval model
- Evaluates on holdout set (last order per pair)
- Creates dashboard-ready JSON in `public/data/`:
  - `customer-summary.json` - Aggregated customer KPIs
  - `reminder-eligibility.json` - All predictions with reminder status
  - `cohort-analysis.json` - RFM-style segment metrics
  - `prediction-accuracy.json` - MAE, RMSE, within-7/14-days accuracy

### 3. Aggregate for Dashboard (if needed)
```bash
python scripts/aggregate-data.py
```
Re-creates dashboard JSON files from raw data + model outputs.

### 4. Run All (via npm)
```bash
npm run generate-data
npm run train-model
npm run aggregate-data
```

## Data Privacy

- **Raw data** (`data/raw/`) is **gitignored** - never committed to GitHub
- **Aggregated data** (`public/data/`) is **committed** - safe for browser consumption
- All data is **synthetic** - no real Zeno Health data used

## Model Details

**Algorithm**: Customer-specific median refill interval (baseline heuristic)

**Why not XGBoost?**
- For portfolio demo: baseline is transparent, requires no hyperparameter tuning
- Matches clinical workflow (pharmacists use similar heuristics)
- Achieves competitive accuracy for chronic medications with regular refill patterns
- Model training is trivial once features are engineered

**Features Engineered**:
- Median days between orders (primary predictor)
- Order count & consistency (CV)
- Quantity per order & consumption rate
- Customer tenure & segment
- Medicine category

**Confidence Scoring**:
- ≥5 orders, low CV: 90%+ (auto-remind)
- 3-4 orders: 75% (review queue)
- 2 orders: 50% (review queue)
- 1 order: 30% (pharmacist verify)

## Regenerating Data

To regenerate with different random seed:
1. Edit `scripts/generate-data.py` and change `np.random.seed(42)`
2. Run all three scripts again
3. Commit updated `public/data/` files