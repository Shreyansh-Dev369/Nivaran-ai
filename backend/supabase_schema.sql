-- ==============================================================================
-- NIVARAN INVESTMENT SIMULATION PLATFORM
-- Supabase PostgreSQL Schema & Row Level Security (RLS) Configuration
-- ==============================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users and Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Demo Investor',
    phone TEXT DEFAULT '+91 98765 43210',
    investor_tier TEXT DEFAULT 'Tier 1 Verified (Demo)',
    pan_masked TEXT DEFAULT 'ABCDE****F',
    bio TEXT DEFAULT 'Simulated Equity Investor exploring rules-based allocation.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Investment Preferences
CREATE TABLE IF NOT EXISTS public.investment_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    risk_tolerance TEXT DEFAULT 'BALANCED' CHECK (risk_tolerance IN ('CONSERVATIVE', 'BALANCED', 'GROWTH')),
    investment_horizon TEXT DEFAULT 'LONG' CHECK (investment_horizon IN ('SHORT', 'MEDIUM', 'LONG')),
    preferred_sectors JSONB DEFAULT '["Technology", "Banking & Finance", "Energy & Utilities"]'::jsonb,
    excluded_sectors JSONB DEFAULT '[]'::jsonb,
    max_single_stock_cap NUMERIC(5,2) DEFAULT 25.00 CHECK (max_single_stock_cap > 0 AND max_single_stock_cap <= 100),
    rebalance_threshold NUMERIC(5,2) DEFAULT 5.00 CHECK (rebalance_threshold > 0),
    simulated_amount NUMERIC(14,2) DEFAULT 25000.00 CHECK (simulated_amount > 0),
    frequency TEXT DEFAULT 'MONTHLY' CHECK (frequency IN ('MONTHLY', 'WEEKLY', 'ONE_TIME')),
    plan_name TEXT DEFAULT 'Core Indian Growth Plan',
    plan_status TEXT DEFAULT 'ACTIVE' CHECK (plan_status IN ('ACTIVE', 'PAUSED', 'STOPPED')),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Stocks Catalogue
CREATE TABLE IF NOT EXISTS public.stocks (
    symbol TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    exchange TEXT DEFAULT 'NSE' CHECK (exchange IN ('NSE', 'BSE')),
    sector TEXT NOT NULL,
    current_price NUMERIC(12,2) NOT NULL CHECK (current_price >= 0),
    previous_close NUMERIC(12,2) NOT NULL CHECK (previous_close >= 0),
    change NUMERIC(10,2) DEFAULT 0.00,
    change_percent NUMERIC(6,2) DEFAULT 0.00,
    market_cap_cr NUMERIC(14,2) DEFAULT 0.00,
    pe_ratio NUMERIC(8,2) DEFAULT 0.00,
    pb_ratio NUMERIC(8,2) DEFAULT 0.00,
    div_yield NUMERIC(6,2) DEFAULT 0.00,
    fifty_two_week_high NUMERIC(12,2) DEFAULT 0.00,
    fifty_two_week_low NUMERIC(12,2) DEFAULT 0.00,
    beta NUMERIC(6,2) DEFAULT 1.00,
    risk_level TEXT DEFAULT 'BALANCED' CHECK (risk_level IN ('CONSERVATIVE', 'BALANCED', 'GROWTH')),
    description TEXT,
    selection_rationale TEXT,
    key_risks JSONB DEFAULT '[]'::jsonb,
    history JSONB DEFAULT '[]'::jsonb,
    is_eligible BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Virtual Wallets
CREATE TABLE IF NOT EXISTS public.virtual_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance NUMERIC(14,2) NOT NULL DEFAULT 50000.00 CHECK (balance >= 0),
    currency TEXT DEFAULT 'INR',
    total_deposited NUMERIC(14,2) NOT NULL DEFAULT 150000.00 CHECK (total_deposited >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Virtual Deposits
CREATE TABLE IF NOT EXISTS public.virtual_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    wallet_id UUID REFERENCES public.virtual_wallets(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    reference_id TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Allocation Runs
CREATE TABLE IF NOT EXISTS public.allocation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_name TEXT NOT NULL,
    deployed_amount NUMERIC(14,2) NOT NULL CHECK (deployed_amount > 0),
    remaining_balance NUMERIC(14,2) NOT NULL CHECK (remaining_balance >= 0),
    reference_id TEXT NOT NULL,
    allocations_json JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Portfolio Holdings
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    symbol TEXT REFERENCES public.stocks(symbol) ON DELETE RESTRICT NOT NULL,
    shares INTEGER NOT NULL CHECK (shares >= 0),
    average_buy_price NUMERIC(12,2) NOT NULL CHECK (average_buy_price >= 0),
    invested_value NUMERIC(14,2) NOT NULL CHECK (invested_value >= 0),
    target_weight NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);

-- 9. Simulated Transactions
CREATE TABLE IF NOT EXISTS public.simulated_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('DEPOSIT', 'INVESTMENT', 'REBALANCE_BUY', 'REBALANCE_SELL', 'WITHDRAWAL', 'PLAN_TRIGGER')),
    amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    symbol TEXT,
    shares INTEGER,
    price NUMERIC(12,2),
    description TEXT NOT NULL,
    status TEXT DEFAULT 'COMPLETED',
    reference_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Indexes for Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_holdings_user ON public.portfolio_holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.simulated_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_allocations_user ON public.allocation_runs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON public.stocks(sector);

-- ==============================================================================
-- Row-Level Security (RLS) Isolation Policies
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulated_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

-- Stocks catalogue is readable by any authenticated or anon user
CREATE POLICY "Stocks are publicly readable" ON public.stocks
    FOR SELECT USING (true);

-- User Profiles: Users can only view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Preferences: Users can only manage their own preferences
CREATE POLICY "Users can view own preferences" ON public.investment_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Wallets: Users can only view and access their own wallet
CREATE POLICY "Users can access own wallet" ON public.virtual_wallets
    FOR ALL USING (auth.uid() = user_id);

-- Deposits: Users can only view own deposits
CREATE POLICY "Users can access own deposits" ON public.virtual_deposits
    FOR ALL USING (auth.uid() = user_id);

-- Allocations: Users can only view own allocation runs
CREATE POLICY "Users can access own allocations" ON public.allocation_runs
    FOR ALL USING (auth.uid() = user_id);

-- Holdings: Users can only access own holdings
CREATE POLICY "Users can access own holdings" ON public.portfolio_holdings
    FOR ALL USING (auth.uid() = user_id);

-- Transactions: Users can only access own transactions
CREATE POLICY "Users can access own transactions" ON public.simulated_transactions
    FOR ALL USING (auth.uid() = user_id);
