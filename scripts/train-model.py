#!/usr/bin/env python3
"""
Train baseline prediction model for Refill Reminder Analytics.

This script:
1. Loads synthetic order data
2. Calculates consumption rates and median refill intervals per customer-medicine
3. Generates predictions with confidence scores
4. Evaluates on holdout set

Run: python scripts/train-model.py
Output: public/data/prediction-accuracy.json, public/data/reminder-eligibility.json, public/data/cohort-analysis.json, public/data/customer-summary.json
"""

import pandas as pd
import numpy as np
import json
import os
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Set seed
np.random.seed(42)

def load_data():
    """Load raw data."""
    print("Loading raw data...")
    customers = pd.read_csv('data/raw/customers.csv')
    medicines = pd.read_csv('data/raw/medicines.csv')
    orders = pd.read_csv('data/raw/orders.csv')
    
    orders['order_date'] = pd.to_datetime(orders['order_date'])
    customers['signup_date'] = pd.to_datetime(customers['signup_date'])
    
    print(f"  Customers: {len(customers)}")
    print(f"  Medicines: {len(medicines)}")
    print(f"  Orders: {len(orders)}")
    
    return customers, medicines, orders


def compute_customer_medicine_features(customers, medicines, orders):
    """Compute features per customer-medicine pair."""
    print("Computing customer-medicine features...")
    
    # Merge orders with customer and medicine info
    orders_enriched = orders.merge(customers[['customer_id', 'segment', 'signup_date']], on='customer_id')
    orders_enriched = orders_enriched.merge(medicines[['medicine_id', 'category', 'avg_days_supply', 'unit_price', 'standard_dosage', 'unit']], on='medicine_id')
    
    # Sort by customer, medicine, date
    orders_enriched = orders_enriched.sort_values(['customer_id', 'medicine_id', 'order_date'])
    
    # Compute features per customer-medicine pair
    features = []
    
    for (cust_id, med_id), group in orders_enriched.groupby(['customer_id', 'medicine_id']):
        group = group.sort_values('order_date')
        n_orders = len(group)
        
        if n_orders < 1:
            continue
        
        # Days between consecutive orders
        group = group.copy()
        group['days_since_prev'] = group['order_date'].diff().dt.days
        intervals = group['days_since_prev'].dropna()
        
        # Median interval (robust to outliers)
        median_interval = intervals.median() if len(intervals) > 0 else group['avg_days_supply'].iloc[0]
        mean_interval = intervals.mean() if len(intervals) > 0 else group['avg_days_supply'].iloc[0]
        std_interval = intervals.std() if len(intervals) > 1 else 0
        cv = std_interval / mean_interval if mean_interval > 0 else 1.0
        
        # Consumption rate: quantity / days_supply (per day)
        group['consumption_per_day'] = group['quantity'] / group['days_supply'].clip(lower=1)
        median_consumption = group['consumption_per_day'].median()
        mean_consumption = group['consumption_per_day'].mean()
        
        # Last order info
        last_order = group.iloc[-1]
        last_order_date = last_order['order_date']
        last_quantity = last_order['quantity']
        last_days_supply = last_order['days_supply']
        
        # Customer tenure
        cust_info = customers[customers['customer_id'] == cust_id].iloc[0]
        tenure_days = (datetime(2024, 12, 31) - cust_info['signup_date']).days
        
        # Total spend
        total_spent = group['price'].sum()
        avg_order_value = group['price'].mean()
        
        # Confidence score based on order count and consistency
        if n_orders >= 5 and cv < 0.3:
            confidence = 0.95
        elif n_orders >= 3 and cv < 0.5:
            confidence = 0.75
        elif n_orders >= 2:
            confidence = 0.50
        else:
            confidence = 0.30
        
        # Adjust for consistency
        confidence *= max(0.3, 1.0 - cv)
        confidence = min(0.99, max(0.1, confidence))
        
        features.append({
            'customer_id': cust_id,
            'medicine_id': med_id,
            'segment': group['segment'].iloc[0],
            'category': group['category'].iloc[0],
            'n_orders': n_orders,
            'median_interval': median_interval,
            'mean_interval': mean_interval,
            'cv_interval': cv,
            'median_consumption': median_consumption,
            'mean_consumption': mean_consumption,
            'last_order_date': last_order_date,
            'last_quantity': last_quantity,
            'last_days_supply': last_days_supply,
            'tenure_days': tenure_days,
            'total_spent': total_spent,
            'avg_order_value': avg_order_value,
            'confidence': confidence,
            'avg_days_supply': group['avg_days_supply'].iloc[0],
            'standard_dosage': group['standard_dosage'].iloc[0],
            'unit_price': group['unit_price'].iloc[0],
            'unit': group['unit'].iloc[0],
        })
    
    features_df = pd.DataFrame(features)
    print(f"  Computed features for {len(features_df)} customer-medicine pairs")
    
    return features_df


def generate_predictions(features_df):
    """Generate reorder predictions using median interval heuristic."""
    print("Generating predictions...")
    
    predictions = []
    
    for _, row in features_df.iterrows():
        # Predicted reorder date = last_order_date + median_interval
        # Use median_interval, fall back to avg_days_supply if NaN
        interval = row['median_interval']
        if pd.isna(interval) or interval < 7:
            interval = row['avg_days_supply']
        
        # Ensure reasonable bounds
        interval = max(7, min(180, interval))
        
        last_order_date = pd.to_datetime(row['last_order_date'])
        predicted_reorder_date = last_order_date + timedelta(days=int(interval))
        
        # Days remaining from today (2024-12-31 for demo)
        today = pd.Timestamp('2024-12-31')
        days_remaining = (predicted_reorder_date - today).days
        
        # Reminder eligibility
        if days_remaining < 0:
            reminder_status = 'Overdue'
        elif days_remaining <= 7:
            reminder_status = 'Due Soon'
        else:
            reminder_status = 'Not Due'
        
        # Priority based on segment and days remaining
        if row['segment'] == 'High Value' and days_remaining <= 7:
            priority = 'High'
        elif row['segment'] == 'At Risk' and days_remaining <= 14:
            priority = 'High'
        elif days_remaining <= 3:
            priority = 'High'
        elif days_remaining <= 7:
            priority = 'Medium'
        else:
            priority = 'Low'
        
        # Contact method by segment
        contact_method = {
            'High Value': 'Call',
            'Regular': 'SMS',
            'Occasional': 'Email',
            'At Risk': 'Call',
        }.get(row['segment'], 'SMS')
        
        predictions.append({
            'customer_id': row['customer_id'],
            'medicine_id': row['medicine_id'],
            'medicine_name': '',  # Will fill from medicines
            'category': row['category'],
            'n_orders': int(row['n_orders']),
            'median_interval': float(row['median_interval']) if not pd.isna(row['median_interval']) else float(row['avg_days_supply']),
            'last_order_date': row['last_order_date'].strftime('%Y-%m-%d'),
            'last_quantity': int(row['last_quantity']),
            'last_days_supply': int(row['last_days_supply']),
            'predicted_reorder_date': predicted_reorder_date.strftime('%Y-%m-%d'),
            'days_remaining': int(days_remaining),
            'reminder_status': reminder_status,
            'priority': priority,
            'contact_method': contact_method,
            'confidence_score': float(row['confidence']),
            'avg_days_supply': int(row['avg_days_supply']),
            'standard_dosage': int(row['standard_dosage']),
            'unit_price': float(row['unit_price']),
            'estimated_consumption_per_day': float(row['median_consumption']) if not pd.isna(row['median_consumption']) else 0,
        })
    
    return pd.DataFrame(predictions)


def evaluate_model(features_df, orders):
    """Evaluate model on holdout set (last order per customer-medicine)."""
    print("Evaluating model on holdout set...")
    
    # For each customer-medicine with >=2 orders, hold out last order
    holdout_data = []
    
    for (cust_id, med_id), group in orders.groupby(['customer_id', 'medicine_id']):
        group = group.sort_values('order_date')
        if len(group) < 2:
            continue
        
        # Hold out last order
        train = group.iloc[:-1]
        test = group.iloc[-1]
        
        # Compute median interval from training data
        train = train.copy()
        train['days_since_prev'] = train['order_date'].diff().dt.days
        intervals = train['days_since_prev'].dropna()
        
        if len(intervals) == 0:
            continue
        
        median_interval = intervals.median()
        median_interval = max(7, min(180, median_interval))
        
        # Predict
        last_train_date = train['order_date'].iloc[-1]
        predicted_date = last_train_date + timedelta(days=int(median_interval))
        actual_date = test['order_date']
        
        # Error in days
        error_days = (predicted_date - actual_date).days
        abs_error = abs(error_days)
        
        holdout_data.append({
            'customer_id': cust_id,
            'medicine_id': med_id,
            'n_train_orders': len(train),
            'median_interval': median_interval,
            'predicted_date': predicted_date,
            'actual_date': actual_date,
            'error_days': error_days,
            'abs_error': abs_error,
        })
    
    holdout_df = pd.DataFrame(holdout_data)
    
    if len(holdout_df) == 0:
        print("  No holdout data available")
        return None
    
    # Metrics
    mae = mean_absolute_error(holdout_df['actual_date'].astype('int64'), holdout_df['predicted_date'].astype('int64')) / (1e9 * 86400)
    rmse = np.sqrt(mean_squared_error(holdout_df['actual_date'].astype('int64'), holdout_df['predicted_date'].astype('int64'))) / (1e9 * 86400)
    
    # Within 7/14 days
    within_7 = (holdout_df['abs_error'] <= 7).mean() * 100
    within_14 = (holdout_df['abs_error'] <= 14).mean() * 100
    
    print(f"  Holdout samples: {len(holdout_df)}")
    print(f"  MAE: {mae:.2f} days")
    print(f"  RMSE: {rmse:.2f} days")
    print(f"  Within 7 days: {within_7:.1f}%")
    print(f"  Within 14 days: {within_14:.1f}%")
    
    return {
        'mae': float(mae),
        'rmse': float(rmse),
        'within_7_days_pct': float(within_7),
        'within_14_days_pct': float(within_14),
        'total_predictions': int(len(holdout_df)),
        'model_type': 'Baseline: Median Refill Interval',
        'training_samples': int(len(features_df)),
        'test_samples': int(len(holdout_df)),
    }


def create_aggregated_outputs(customers, medicines, orders, features_df, predictions_df, accuracy):
    """Create aggregated JSON files for dashboard."""
    print("Creating aggregated outputs...")
    
    os.makedirs('public/data', exist_ok=True)
    
    # 1. Customer Summary
    customer_summary = []
    for _, cust in customers.iterrows():
        cust_meds = predictions_df[predictions_df['customer_id'] == cust['customer_id']]
        customer_summary.append({
            'customer_id': cust['customer_id'],
            'customer_name': cust['customer_name'],
            'age': int(cust['age']),
            'gender': cust['gender'],
            'city': cust['city'],
            'state': cust['state'],
            'signup_date': cust['signup_date'].strftime('%Y-%m-%d') if hasattr(cust['signup_date'], 'strftime') else str(cust['signup_date']),
            'segment': cust['segment'],
            'total_orders': int(cust_meds['n_orders'].sum()),
            'total_spent': float(cust_meds.apply(lambda r: r['n_orders'] * r['unit_price'] * r['avg_days_supply'] * r['standard_dosage'] / 30, axis=1).sum()) if len(cust_meds) > 0 else 0,
            'active_medicines': int(len(cust_meds)),
            'reminders_due': int(len(cust_meds[(cust_meds['reminder_status'] == 'Due Soon') | (cust_meds['reminder_status'] == 'Overdue')])),
        })
    
    with open('public/data/customer-summary.json', 'w') as f:
        json.dump(customer_summary, f, indent=2)
    print(f"  Saved: public/data/customer-summary.json ({len(customer_summary)} customers)")
    
    # 2. Reminder Eligibility (with customer names)
    # Merge predictions with customer names
    pred_with_names = predictions_df.merge(customers[['customer_id', 'customer_name']], on='customer_id')
    pred_with_names = pred_with_names.merge(medicines[['medicine_id', 'medicine_name']], on='medicine_id')
    
    reminder_data = pred_with_names.to_dict('records')
    with open('public/data/reminder-eligibility.json', 'w') as f:
        json.dump(reminder_data, f, indent=2)
    print(f"  Saved: public/data/reminder-eligibility.json ({len(reminder_data)} predictions)")
    
    # 3. Cohort Analysis (Segment metrics)
    segment_metrics = []
    for segment in ['High Value', 'Regular', 'Occasional', 'At Risk']:
        seg_customers = customers[customers['segment'] == segment]
        seg_preds = predictions_df[predictions_df['customer_id'].isin(seg_customers['customer_id'])]
        
        segment_metrics.append({
            'segment': segment,
            'customer_count': int(len(seg_customers)),
            'avg_age': float(seg_customers['age'].mean()),
            'avg_orders_per_customer': float(seg_preds['n_orders'].mean()) if len(seg_preds) > 0 else 0,
            'avg_spent_per_customer': float(seg_preds.apply(lambda r: r['n_orders'] * r['unit_price'] * r['avg_days_supply'] * r['standard_dosage'] / 30, axis=1).mean()) if len(seg_preds) > 0 else 0,
            'avg_days_between_orders': float(seg_preds['median_interval'].mean()) if len(seg_preds) > 0 else 0,
            'reminder_eligible_count': int(len(seg_preds[(seg_preds['reminder_status'] == 'Due Soon') | (seg_preds['reminder_status'] == 'Overdue')])),
            'reminder_eligible_pct': float(len(seg_preds[(seg_preds['reminder_status'] == 'Due Soon') | (seg_preds['reminder_status'] == 'Overdue')]) / len(seg_preds) * 100) if len(seg_preds) > 0 else 0,
        })
    
    with open('public/data/cohort-analysis.json', 'w') as f:
        json.dump(segment_metrics, f, indent=2)
    print(f"  Saved: public/data/cohort-analysis.json ({len(segment_metrics)} segments)")
    
    # 4. Prediction Accuracy
    if accuracy:
        with open('public/data/prediction-accuracy.json', 'w') as f:
            json.dump(accuracy, f, indent=2)
        print(f"  Saved: public/data/prediction-accuracy.json")
    
    print("All aggregated outputs created!")


def main():
    print("Training baseline model for Refill Reminder Analytics...\n")
    
    # Load data
    customers, medicines, orders = load_data()
    
    # Compute features
    features_df = compute_customer_medicine_features(customers, medicines, orders)
    
    # Generate predictions
    predictions_df = generate_predictions(features_df)
    
    # Evaluate
    accuracy = evaluate_model(features_df, orders)
    
    # Create outputs
    create_aggregated_outputs(customers, medicines, orders, features_df, predictions_df, accuracy)
    
    print("\nModel training and evaluation complete!")
    print("Dashboard data ready in public/data/")


if __name__ == '__main__':
    main()