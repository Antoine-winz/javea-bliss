import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, TrendingUp, Calendar, Activity, Globe, ExternalLink } from 'lucide-react';

// Country flag mapping
const getCountryFlag = (countryCode: string): string => {
  const flags: Record<string, string> = {
    'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'NL': '🇳🇱',
    'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪', 'DK': '🇩🇰', 'NO': '🇳🇴', 'FI': '🇫🇮',
    'CA': '🇨🇦', 'AU': '🇦🇺', 'NZ': '🇳🇿', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳', 'IN': '🇮🇳',
    'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷', 'RU': '🇷🇺', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'HU': '🇭🇺',
    'PT': '🇵🇹', 'GR': '🇬🇷', 'TR': '🇹🇷', 'IL': '🇮🇱', 'SA': '🇸🇦', 'AE': '🇦🇪', 'ZA': '🇿🇦',
    'XX': '🏳️', 'Unknown': '🏳️'
  };
  return flags[countryCode] || '🏳️';
};

interface VisitorStatsData {
  totalVisits: number;
  currentWeekVisits: number;
  averageWeeklyVisits: number;
  weeklyData: Array<{
    week: string;
    visits: number;
  }>;
  countryStats: Array<{
    country: string;
    countryCode: string;
    visits: number;
    percentage: number;
  }>;
  referrerStats: Array<{
    referrer: string;
    domain: string;
    visits: number;
    percentage: number;
  }>;
}

export default function VisitorStats() {
  const [stats, setStats] = useState<VisitorStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/visitor-stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Visitor Statistics
          </CardTitle>
          <CardDescription>Loading visitor data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Visitor Statistics
          </CardTitle>
          <CardDescription>Unable to load visitor data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Please try refreshing the page</p>
        </CardContent>
      </Card>
    );
  }

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentWeekVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current week visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">3-Week Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWeeklyVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Average weekly visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Country and Referrer Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Visitor Countries (All Time)
            </CardTitle>
            <CardDescription>
              Countries of origin for all recorded visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.countryStats && stats.countryStats.length > 0 ? (
              <div className="space-y-3">
                {stats.countryStats.slice(0, 8).map((country, index) => (
                  <div key={country.countryCode} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCountryFlag(country.countryCode)}</span>
                      <span className="text-sm font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{country.visits} visits</span>
                      <span className="text-sm font-bold">{country.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No country data available yet</p>
            )}
          </CardContent>
        </Card>

        {/* Referrer Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Traffic Sources (All Time)
            </CardTitle>
            <CardDescription>
              Where visitors are coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.referrerStats && stats.referrerStats.length > 0 ? (
              <div className="space-y-3">
                {stats.referrerStats.slice(0, 8).map((referrer, index) => (
                  <div key={`${referrer.domain}-${index}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-sm font-medium">{referrer.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{referrer.visits} visits</span>
                      <span className="text-sm font-bold">{referrer.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No referrer data available yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Visitors
          </CardTitle>
          <CardDescription>
            Visitor trends over the last 12 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} visits`, 'Visits']}
                  labelFormatter={(label) => `Week: ${label}`}
                />
                <Bar 
                  dataKey="visits" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current vs Average:</span>
              <span className={`text-sm font-bold ${
                stats.currentWeekVisits > stats.averageWeeklyVisits 
                  ? 'text-green-600' 
                  : stats.currentWeekVisits < stats.averageWeeklyVisits 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`}>
                {stats.currentWeekVisits > stats.averageWeeklyVisits ? '+' : ''}
                {stats.currentWeekVisits - stats.averageWeeklyVisits} visits
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Growth Rate:</span>
              <span className={`text-sm font-bold ${
                stats.currentWeekVisits > stats.averageWeeklyVisits 
                  ? 'text-green-600' 
                  : stats.currentWeekVisits < stats.averageWeeklyVisits 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`}>
                {stats.averageWeeklyVisits > 0 
                  ? `${Math.round(((stats.currentWeekVisits - stats.averageWeeklyVisits) / stats.averageWeeklyVisits) * 100)}%`
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Daily Average (This Week):</span>
              <span className="text-sm font-bold text-blue-600">
                {Math.round(stats.currentWeekVisits / 7)} visits/day
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}