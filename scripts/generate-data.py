#!/usr/bin/env python3
"""
Generate synthetic data for Refill Reminder Analytics portfolio project.

This script creates:
1. customers.csv - 2,000 synthetic customers
2. medicines.csv - 500 synthetic medicines
3. orders.csv - 50,000 synthetic orders

Run: python scripts/generate-data.py
Output: data/raw/customers.csv, data/raw/medicines.csv, data/raw/orders.csv
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import json

# Set seed for reproducibility
np.random.seed(42)

# Configuration
N_CUSTOMERS = 2000
N_MEDICINES = 500
N_ORDERS = 50000

# Segments with realistic distributions
SEGMENTS = ['High Value', 'Regular', 'Occasional', 'At Risk']
SEGMENT_WEIGHTS = [0.15, 0.40, 0.30, 0.15]  # 15%, 40%, 30%, 15%

CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
CITY_WEIGHTS = [0.20, 0.18, 0.15, 0.12, 0.10, 0.08, 0.10, 0.07]

STATES = {
    'Mumbai': 'Maharashtra',
    'Delhi': 'Delhi',
    'Bangalore': 'Karnataka',
    'Hyderabad': 'Telangana',
    'Chennai': 'Tamil Nadu',
    'Kolkata': 'West Bengal',
    'Pune': 'Maharashtra',
    'Ahmedabad': 'Gujarat',
}

# Medicine categories with realistic distributions
CATEGORIES = ['Diabetes', 'Hypertension', 'Cardiac', 'Thyroid', 'Respiratory', 'Neurology', 'Gastroenterology', 'Vitamins']
CATEGORY_WEIGHTS = [0.25, 0.22, 0.12, 0.10, 0.08, 0.07, 0.06, 0.10]

# Units
UNITS = ['tablet', 'capsule', 'ml', 'injection']
UNIT_WEIGHTS = [0.70, 0.20, 0.05, 0.05]

# Standard dosages per category
CATEGORY_DOSAGE = {
    'Diabetes': (1, 2),      # 1-2 tablets
    'Hypertension': (1, 1),  # 1 tablet
    'Cardiac': (1, 2),       # 1-2 tablets
    'Thyroid': (1, 1),       # 1 tablet
    'Respiratory': (1, 2),   # 1-2 tablets/inhaler
    'Neurology': (1, 2),     # 1-2 tablets
    'Gastroenterology': (1, 2),
    'Vitamins': (1, 1),      # 1 tablet
}

# Days supply per category (chronic meds typically 30, 60, 90)
CATEGORY_DAYS_SUPPLY = {
    'Diabetes': [30, 60, 90],
    'Hypertension': [30, 60, 90],
    'Cardiac': [30, 60, 90],
    'Thyroid': [30, 90],
    'Respiratory': [30, 60],
    'Neurology': [30, 60, 90],
    'Gastroenterology': [14, 30],
    'Vitamins': [30, 60, 90],
}

# Price ranges per category (INR per unit)
CATEGORY_PRICE = {
    'Diabetes': (5, 50),
    'Hypertension': (3, 30),
    'Cardiac': (10, 100),
    'Thyroid': (2, 20),
    'Respiratory': (5, 80),
    'Neurology': (10, 150),
    'Gastroenterology': (3, 40),
    'Vitamins': (1, 15),
}

# Medicine names by category (simplified)
MEDICINE_NAMES = {
    'Diabetes': [
        'Metformin 500mg', 'Metformin 1000mg', 'Glimepiride 1mg', 'Glimepiride 2mg',
        'Sitagliptin 50mg', 'Sitagliptin 100mg', 'Empagliflozin 10mg', 'Empagliflozin 25mg',
        'Dapagliflozin 5mg', 'Dapagliflozin 10mg', 'Linagliptin 5mg', 'Vildagliptin 50mg',
        'Pioglitazone 15mg', 'Pioglitazone 30mg', 'Gliclazide 80mg', 'Gliclazide 60mg MR',
    ],
    'Hypertension': [
        'Amlodipine 5mg', 'Amlodipine 10mg', 'Telmisartan 40mg', 'Telmisartan 80mg',
        'Losartan 50mg', 'Losartan 100mg', 'Olmesartan 20mg', 'Olmesartan 40mg',
        'Hydrochlorothiazide 12.5mg', 'Hydrochlorothiazide 25mg', 'Chlorthalidone 6.25mg',
        'Metoprolol 25mg', 'Metoprolol 50mg', 'Bisoprolol 2.5mg', 'Bisoprolol 5mg',
        'Enalapril 5mg', 'Enalapril 10mg', 'Ramipril 2.5mg', 'Ramipril 5mg',
    ],
    'Cardiac': [
        'Atorvastatin 10mg', 'Atorvastatin 20mg', 'Atorvastatin 40mg', 'Rosuvastatin 10mg',
        'Rosuvastatin 20mg', 'Clopidogrel 75mg', 'Aspirin 75mg', 'Aspirin 150mg',
        'Ticagrelor 90mg', 'Rivaroxaban 10mg', 'Rivaroxaban 20mg', 'Apixaban 2.5mg',
        'Apixaban 5mg', 'Dabigatran 110mg', 'Dabigatran 150mg', 'Warfarin 2mg',
        'Warfarin 5mg', 'Isosorbide 10mg', 'Isosorbide 20mg', 'Nicorandil 5mg',
    ],
    'Thyroid': [
        'Thyroxine 25mcg', 'Thyroxine 50mcg', 'Thyroxine 75mcg', 'Thyroxine 100mcg',
        'Thyroxine 125mcg', 'Thyroxine 150mcg', 'Carbimazole 5mg', 'Carbimazole 10mg',
        'Propylthiouracil 50mg', 'Methimazole 5mg', 'Methimazole 10mg',
    ],
    'Respiratory': [
        'Salbutamol 100mcg Inhaler', 'Budesonide 200mcg Inhaler', 'Formoterol 6mcg Inhaler',
        'Fluticasone 125mcg Inhaler', 'Salmeterol 25mcg Inhaler', 'Tiotropium 18mcg Inhaler',
        'Montelukast 10mg', 'Theophylline 200mg', 'Theophylline 400mg', 'Acebrophylline 100mg',
    ],
    'Neurology': [
        'Levetiracetam 500mg', 'Levetiracetam 1000mg', 'Valproate 500mg', 'Valproate 1000mg',
        'Lamotrigine 50mg', 'Lamotrigine 100mg', 'Topiramate 50mg', 'Topiramate 100mg',
        'Pregabalin 75mg', 'Pregabalin 150mg', 'Gabapentin 300mg', 'Carbamazepine 200mg',
        'Oxcarbazepine 300mg', 'Clonazepam 0.5mg', 'Clonazepam 1mg',
    ],
    'Gastroenterology': [
        'Pantoprazole 40mg', 'Omeprazole 20mg', 'Esomeprazole 40mg', 'Rabeprazole 20mg',
        'Domperidone 10mg', 'Ondansetron 4mg', 'Ondansetron 8mg', 'Ranitidine 150mg',
        'Famotidine 20mg', 'Sucralfate 1g', 'Itopride 50mg', 'Mosapride 5mg',
    ],
    'Vitamins': [
        'Vitamin D3 60000 IU', 'Vitamin D3 1000 IU', 'Vitamin B12 1500mcg', 'Vitamin B12 500mcg',
        'Folic Acid 5mg', 'Calcium 500mg', 'Calcium 1000mg', 'Calcium + D3 500mg',
        'Multivitamin', 'Zinc 50mg', 'Iron 100mg', 'Omega-3 1000mg',
        'B-Complex', 'Vitamin C 500mg', 'Vitamin E 400 IU',
    ],
}

def generate_customers(n: int) -> pd.DataFrame:
    """Generate synthetic customer data."""
    
    segments = np.random.choice(SEGMENTS, size=n, p=SEGMENT_WEIGHTS)
    
    customers = []
    for i, segment in enumerate(segments):
        cust_id = f'CUST_{i+1:04d}'
        
        # Age distribution varies by segment
        if segment == 'High Value':
            age = np.random.randint(35, 70)
        elif segment == 'Regular':
            age = np.random.randint(30, 65)
        elif segment == 'Occasional':
            age = np.random.randint(25, 60)
        else:  # At Risk
            age = np.random.randint(40, 75)
        
        gender = np.random.choice(['Male', 'Female'], p=[0.52, 0.48])
        city = np.random.choice(CITIES, p=CITY_WEIGHTS)
        state = STATES[city]
        
        # Signup date: between 2022-01 and 2024-12
        signup_start = datetime(2022, 1, 1)
        signup_end = datetime(2024, 12, 31)
        signup_date = signup_start + timedelta(
            days=np.random.randint(0, (signup_end - signup_start).days)
        )
        
        # Indian names
        first_names_m = ['Rajesh', 'Amit', 'Suresh', 'Ramesh', 'Mahesh', 'Naresh', 'Dinesh', 'Mukesh', 'Rakesh', 'Sanjay',
                         'Vikram', 'Arjun', 'Rahul', 'Rohit', 'Sachin', 'Anil', 'Sunil', 'Manoj', 'Deepak', 'Pankaj']
        first_names_f = ['Priya', 'Sunita', 'Anita', 'Rekha', 'Pooja', 'Neha', 'Shilpa', 'Kavita', 'Sangeeta', 'Meena',
                         'Deepa', 'Rita', 'Geeta', 'Seema', 'Usha', 'Asha', 'Lata', 'Maya', 'Jaya', 'Rani']
        last_names = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Agarwal', 'Jain', 'Shah', 'Patel', 'Reddy',
                      'Rao', 'Iyer', 'Nair', 'Menon', 'Das', 'Roy', 'Chatterjee', 'Banerjee', 'Mukherjee', 'Ghosh']
        
        first_name = np.random.choice(first_names_m if gender == 'Male' else first_names_f)
        last_name = np.random.choice(last_names)
        customer_name = f'{first_name} {last_name}'
        
        customers.append({
            'customer_id': cust_id,
            'customer_name': customer_name,
            'age': age,
            'gender': gender,
            'city': city,
            'state': state,
            'signup_date': signup_date.strftime('%Y-%m-%d'),
            'segment': segment,
        })
    
    return pd.DataFrame(customers)


def generate_medicines(n: int) -> pd.DataFrame:
    """Generate synthetic medicine data."""
    
    categories = np.random.choice(CATEGORIES, size=n, p=CATEGORY_WEIGHTS)
    
    medicines = []
    for i, category in enumerate(categories):
        med_id = f'MED_{i+1:03d}'
        
        # Pick name from category list
        name = np.random.choice(MEDICINE_NAMES[category])
        if f'{name}_{category}' in [f'{m["medicine_name"]}_{m["category"]}' for m in medicines]:
            # Add suffix if duplicate
            name = f'{name} ({i+1})'
        
        dosage_min, dosage_max = CATEGORY_DOSAGE[category]
        standard_dosage = np.random.randint(dosage_min, dosage_max + 1)
        
        unit = np.random.choice(UNITS, p=UNIT_WEIGHTS)
        if unit == 'injection':
            standard_dosage = 1  # injections typically 1 vial
        
        avg_days_supply = np.random.choice(CATEGORY_DAYS_SUPPLY[category])
        
        price_min, price_max = CATEGORY_PRICE[category]
        unit_price = round(np.random.uniform(price_min, price_max), 2)
        
        medicines.append({
            'medicine_id': med_id,
            'medicine_name': name,
            'category': category,
            'standard_dosage': standard_dosage,
            'unit': unit,
            'avg_days_supply': avg_days_supply,
            'unit_price': unit_price,
        })
    
    return pd.DataFrame(medicines)


def generate_orders(customers_df: pd.DataFrame, medicines_df: pd.DataFrame, n: int) -> pd.DataFrame:
    """Generate synthetic order data with realistic refill patterns."""
    
    # Create customer-medicine pairs with preferences
    # Each customer has 1-5 medicines
    cust_med_pairs = []
    for _, cust in customers_df.iterrows():
        n_meds = np.random.randint(1, 6)
        # Higher segment = more medicines typically
        if cust['segment'] == 'High Value':
            n_meds = np.random.randint(2, 6)
        elif cust['segment'] == 'Regular':
            n_meds = np.random.randint(1, 5)
        elif cust['segment'] == 'Occasional':
            n_meds = np.random.randint(1, 3)
        else:  # At Risk
            n_meds = np.random.randint(1, 3)
        
        # Sample medicines - prefer chronic categories
        chronic_cats = ['Diabetes', 'Hypertension', 'Cardiac', 'Thyroid']
        meds = medicines_df[medicines_df['category'].isin(chronic_cats)]
        if len(meds) < n_meds:
            meds = medicines_df
        
        selected = meds.sample(n=min(n_meds, len(meds)), replace=False)
        for _, med in selected.iterrows():
            cust_med_pairs.append({
                'customer_id': cust['customer_id'],
                'medicine_id': med['medicine_id'],
                'category': med['category'],
                'avg_days_supply': med['avg_days_supply'],
                'unit_price': med['unit_price'],
                'standard_dosage': med['standard_dosage'],
                'unit': med['unit'],
            })
    
    cust_med_df = pd.DataFrame(cust_med_pairs)
    
    # Generate orders for each pair
    all_orders = []
    order_id = 1
    
    for _, pair in cust_med_df.iterrows():
        # Determine number of orders based on segment and tenure
        cust = customers_df[customers_df['customer_id'] == pair['customer_id']].iloc[0]
        signup_date = pd.to_datetime(cust['signup_date'])
        end_date = datetime(2024, 12, 31)
        tenure_days = (end_date - signup_date).days
        
        # Orders per year by segment
        orders_per_year = {
            'High Value': np.random.uniform(6, 12),
            'Regular': np.random.uniform(3, 7),
            'Occasional': np.random.uniform(1, 3),
            'At Risk': np.random.uniform(0.5, 2),
        }[cust['segment']]
        
        expected_orders = max(1, int(orders_per_year * tenure_days / 365))
        
        # Add noise
        n_orders = max(1, int(np.random.poisson(expected_orders)))
        n_orders = min(n_orders, 24)  # Cap at 24 orders per pair
        
        # Generate order dates with realistic intervals
        # Start from signup + some delay
        first_order_delay = np.random.randint(0, 30)
        current_date = signup_date + timedelta(days=first_order_delay)
        
        # Base interval from medicine
        base_interval = pair['avg_days_supply']
        
        for order_num in range(n_orders):
            if current_date > end_date:
                break
            
            # Add variation to interval (CV ~ 0.2-0.3)
            cv = np.random.uniform(0.15, 0.30)
            interval = max(7, int(np.random.normal(base_interval, base_interval * cv)))
            
            # Quantity based on days supply and dosage
            days_supply = max(7, int(np.random.normal(base_interval, base_interval * 0.1)))
            quantity = (days_supply / 30) * 30 * pair['standard_dosage']  # monthly dosage
            quantity = max(1, int(round(quantity)))
            
            # Round to common pack sizes
            if pair['unit'] in ['tablet', 'capsule']:
                quantity = int(round(quantity / 10) * 10)  # multiples of 10
                if quantity < 10:
                    quantity = 10
            
            price = round(quantity * pair['unit_price'] * np.random.uniform(0.95, 1.05), 2)
            
            all_orders.append({
                'order_id': f'ORD_{order_id:05d}',
                'customer_id': pair['customer_id'],
                'medicine_id': pair['medicine_id'],
                'order_date': current_date.strftime('%Y-%m-%d'),
                'quantity': quantity,
                'days_supply': days_supply,
                'price': price,
            })
            
            order_id += 1
            current_date += timedelta(days=interval)
    
    orders_df = pd.DataFrame(all_orders)
    
    # If we have too many orders, sample down
    if len(orders_df) > N_ORDERS:
        orders_df = orders_df.sample(n=N_ORDERS, random_state=42)
    
    # Sort by date
    orders_df = orders_df.sort_values('order_date').reset_index(drop=True)
    orders_df['order_id'] = [f'ORD_{i+1:05d}' for i in range(len(orders_df))]
    
    return orders_df


def main():
    print("Generating synthetic Refill Reminder Analytics data...")
    
    # Create output directory
    os.makedirs('data/raw', exist_ok=True)
    
    # Generate customers
    print(f"Generating {N_CUSTOMERS} customers...")
    customers_df = generate_customers(N_CUSTOMERS)
    customers_df.to_csv('data/raw/customers.csv', index=False)
    print(f"  Saved: data/raw/customers.csv ({len(customers_df)} rows)")
    
    # Print segment distribution
    segment_counts = customers_df['segment'].value_counts()
    print("\nSegment Distribution:")
    for segment, count in segment_counts.items():
        print(f"  {segment}: {count} ({count/len(customers_df)*100:.1f}%)")
    
    # Generate medicines
    print(f"\nGenerating {N_MEDICINES} medicines...")
    medicines_df = generate_medicines(N_MEDICINES)
    medicines_df.to_csv('data/raw/medicines.csv', index=False)
    print(f"  Saved: data/raw/medicines.csv ({len(medicines_df)} rows)")
    
    # Print category distribution
    cat_counts = medicines_df['category'].value_counts()
    print("\nCategory Distribution:")
    for cat, count in cat_counts.items():
        print(f"  {cat}: {count}")
    
    # Generate orders
    print(f"\nGenerating ~{N_ORDERS} orders...")
    orders_df = generate_orders(customers_df, medicines_df, N_ORDERS)
    orders_df.to_csv('data/raw/orders.csv', index=False)
    print(f"  Saved: data/raw/orders.csv ({len(orders_df)} rows)")
    
    # Save metadata
    metadata = {
        'generated_at': datetime.now().isoformat(),
        'n_customers': N_CUSTOMERS,
        'n_medicines': N_MEDICINES,
        'n_orders': len(orders_df),
        'segments': SEGMENTS,
        'segment_weights': SEGMENT_WEIGHTS,
        'categories': CATEGORIES,
        'note': 'SYNTHETIC DATA - Portfolio demo only. Not real Zeno Health data.'
    }
    with open('data/raw/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    print("  Saved: data/raw/metadata.json")
    
    print("\nData generation complete!")
    print("Next step: Run 'python scripts/train-model.py' to train baseline model")


if __name__ == '__main__':
    main()