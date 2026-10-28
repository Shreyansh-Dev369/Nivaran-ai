/**
 * Centralized API Client for Nivaran Full-Stack Investment Simulation Platform
 * Communicates with FastAPI backend (http://127.0.0.1:8000)
 */

const API_BASE =
  typeof window !== "undefined" && window.location.port === "3000"
    ? "/api/backend"
    : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000") + "/api";

const TOKEN_KEY = "nivaran_jwt_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Construct URL
  const base = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8000/api`
    : "http://127.0.0.1:8000/api";

  const url = `${base}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const status = res.status;
    let data = null;
    let error = null;

    try {
      const json = await res.json();
      if (!res.ok) {
        error = json.detail || json.message || `Request failed with status ${status}`;
      } else {
        data = json as T;
      }
    } catch {
      if (!res.ok) {
        error = `Request failed with status ${status}`;
      }
    }

    return { data, error, status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error or backend unreachable";
    return { data: null, error: message, status: 0 };
  }
}

export const api = {
  // System Health
  async checkHealth() {
    try {
      const res = await fetch("http://127.0.0.1:8000/health");
      return await res.json();
    } catch {
      return { status: "offline", service: "Nivaran Backend", database: "disconnected" };
    }
  },

  // Auth
  auth: {
    async register(name: string, email: string, password: string) {
      const res = await request<{ access_token: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      if (res.data?.access_token) {
        setAuthToken(res.data.access_token);
      }
      return res;
    },

    async login(email: string, password: string) {
      const res = await request<{ access_token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.data?.access_token) {
        setAuthToken(res.data.access_token);
      }
      return res;
    },

    async demoLogin() {
      const res = await request<{ access_token: string; user: any }>("/auth/demo-login", {
        method: "POST",
      });
      if (res.data?.access_token) {
        setAuthToken(res.data.access_token);
      }
      return res;
    },

    async me() {
      return request<any>("/auth/me");
    },

    logout() {
      removeAuthToken();
    },
  },

  // Profile
  profile: {
    async get() {
      return request<any>("/profile");
    },
    async update(updates: { full_name?: string; phone?: string; bio?: string }) {
      return request<any>("/profile", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },
  },

  // Preferences
  preferences: {
    async get() {
      return request<any>("/preferences");
    },
    async update(updates: any) {
      return request<any>("/preferences", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
    },
  },

  // Stocks
  stocks: {
    async list(params: { search?: string; sector?: string; exchange?: string; risk_level?: string } = {}) {
      const q = new URLSearchParams();
      if (params.search) q.append("search", params.search);
      if (params.sector) q.append("sector", params.sector);
      if (params.exchange) q.append("exchange", params.exchange);
      if (params.risk_level) q.append("risk_level", params.risk_level);
      const queryStr = q.toString() ? `?${q.toString()}` : "";
      return request<any[]>(`/stocks${queryStr}`);
    },
    async getBySymbol(symbol: string) {
      return request<any>(`/stocks/${symbol.toUpperCase()}`);
    },
  },

  // Recommendations
  recommendations: {
    async get(amount?: number) {
      const queryStr = amount ? `?amount=${amount}` : "";
      return request<any>(`/recommendations${queryStr}`);
    },
    async calculateCustom(params: { amount?: number; risk_tolerance?: string; preferred_sectors?: string[] }) {
      return request<any>("/recommendations", {
        method: "POST",
        body: JSON.stringify(params),
      });
    },
  },

  // Automatic Allocations
  allocations: {
    async execute(amount?: number, planName?: string) {
      return request<any>("/allocations", {
        method: "POST",
        body: JSON.stringify({ amount, plan_name: planName }),
      });
    },
    async list() {
      return request<any[]>("/allocations");
    },
    async getById(id: string) {
      return request<any>(`/allocations/${id}`);
    },
  },

  // Virtual Wallet
  wallet: {
    async get() {
      return request<{ id: string; user_id: string; balance: number; currency: string; total_deposited: number }>("/wallet");
    },
    async deposit(amount: number, note?: string) {
      return request<{
        deposit_id: string;
        amount: number;
        reference_id: string;
        new_balance: number;
        status: string;
        message: string;
      }>("/wallet/deposits", {
        method: "POST",
        body: JSON.stringify({ amount, note }),
      });
    },
  },

  // Portfolio
  portfolio: {
    async get() {
      return request<{
        cash_balance: number;
        total_invested: number;
        total_holdings_value: number;
        total_portfolio_value: number;
        total_unrealized_pnl: number;
        total_unrealized_pnl_percent: number;
        holdings_count: number;
        sector_distribution: any[];
        diversification_score: number;
        diversification_label: string;
        holdings: any[];
      }>("/portfolio");
    },
    async rebalance() {
      return request<{
        success: boolean;
        message: string;
        trades_count: number;
        adjustments: any[];
      }>("/portfolio/rebalance", {
        method: "POST",
      });
    },
  },

  // Transactions
  transactions: {
    async list(txType?: string, limit: number = 50) {
      const q = new URLSearchParams();
      if (txType) q.append("tx_type", txType);
      q.append("limit", limit.toString());
      return request<any[]>(`/transactions?${q.toString()}`);
    },
  },

  // Demo Controls
  demo: {
    async reset() {
      return request<any>("/demo/reset", { method: "POST" });
    },
    async resetUser() {
      return request<any>("/demo/reset-user", { method: "POST" });
    },
  },
};
