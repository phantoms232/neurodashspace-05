import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Target, Calendar, Flame, Medal, Brain, Zap, Clock, BarChart3, Award, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserStats {
  brain_age: number | null;
  total_tests: number;
  current_streak: number;
  best_reaction_time: number | null;
  achievements_unlocked: string[];
}

interface TestPerformance {
  test_type: string;
  count: number;
  best_score: number;
  avg_score: number;
  best_reaction_time: number | null;
  improvement_trend: number;
}

export const StatsOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [testPerformance, setTestPerformance] = useState<TestPerformance[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [personalRecords, setPersonalRecords] = useState<any[]>([]);
  

  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      // Demo stats for non-authenticated users
      setDemoData();
      setLoading(false);
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchUserStats(),
      fetchRecentTests(),
      fetchTestPerformance(),
      fetchWeeklyProgress(),
      fetchPersonalRecords()
    ]);
    setLoading(false);
  };

  const setDemoData = () => {
    setStats({
      brain_age: 24,
      total_tests: 0,
      current_streak: 0,
      best_reaction_time: null,
      achievements_unlocked: []
    });
    setTestPerformance([
      { test_type: 'reaction-time', count: 0, best_score: 0, avg_score: 0, best_reaction_time: null, improvement_trend: 0 },
      { test_type: 'visual-memory', count: 0, best_score: 0, avg_score: 0, best_reaction_time: null, improvement_trend: 0 }
    ]);
  };

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user stats:', error);
        return;
      }

      setStats(data || {
        brain_age: 25,
        total_tests: 0,
        current_streak: 0,
        best_reaction_time: null,
        achievements_unlocked: []
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTests = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent tests:', error);
        return;
      }

      setRecentTests(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTestPerformance = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('test_type, score, reaction_time, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching test performance:', error);
        return;
      }

      // Process data to get performance metrics per test type
      const performanceMap = new Map<string, any>();
      
      data?.forEach(test => {
        const key = test.test_type;
        if (!performanceMap.has(key)) {
          performanceMap.set(key, {
            test_type: key,
            scores: [],
            reaction_times: [],
            count: 0
          });
        }
        
        const existing = performanceMap.get(key);
        existing.count += 1;
        if (test.score) existing.scores.push(test.score);
        if (test.reaction_time) existing.reaction_times.push(test.reaction_time);
      });

      const performance = Array.from(performanceMap.values()).map(item => ({
        test_type: item.test_type,
        count: item.count,
        best_score: item.scores.length > 0 ? Math.max(...item.scores) : 0,
        avg_score: item.scores.length > 0 ? Math.round(item.scores.reduce((a: number, b: number) => a + b, 0) / item.scores.length) : 0,
        best_reaction_time: item.reaction_times.length > 0 ? Math.min(...item.reaction_times) : null,
        improvement_trend: item.scores.length > 1 ? (item.scores[0] - item.scores[item.scores.length - 1]) : 0
      }));

      setTestPerformance(performance);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchWeeklyProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('created_at, score')
        .eq('user_id', user?.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly progress:', error);
        return;
      }

      setWeeklyProgress(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPersonalRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select('test_type, score, reaction_time, created_at')
        .eq('user_id', user?.id)
        .order('score', { ascending: false });

      if (error) {
        console.error('Error fetching personal records:', error);
        return;
      }

      // Get best scores per test type
      const recordsMap = new Map<string, any>();
      data?.forEach(test => {
        if (!recordsMap.has(test.test_type) || 
            (test.score && (!recordsMap.get(test.test_type).score || test.score > recordsMap.get(test.test_type).score))) {
          recordsMap.set(test.test_type, test);
        }
      });

      setPersonalRecords(Array.from(recordsMap.values()));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateGlobalRank = () => {
    // Simple calculation based on total tests and performance
    if (!stats) return 'N/A';
    const baseRank = Math.max(1, 50000 - (stats.total_tests * 100));
    return baseRank.toLocaleString();
  };

  const getTier = () => {
    if (!stats) return 'Beginner';
    if (stats.total_tests >= 100) return 'Master';
    if (stats.total_tests >= 50) return 'Expert';
    if (stats.total_tests >= 20) return 'Advanced';
    if (stats.total_tests >= 5) return 'Intermediate';
    return 'Beginner';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Your Neural Dashboard
          </h2>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">
          Your Neural Dashboard
        </h2>
        <p className="text-muted-foreground">
          Track your cognitive performance and brain training progress
        </p>
      </div>

      {/* Brain Age Card */}
      <Card className="card-glow text-center p-8">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              Brain Age: {stats?.brain_age || 25} years
            </h3>
            <p className="text-muted-foreground">
              {user ? 'Your cognitive performance suggests this brain age' : 'Complete tests to calculate your brain age'}
            </p>
          </div>
          <Button variant="neural" size="sm">
            {user ? 'Take More Tests' : 'Sign In to Track Progress'}
          </Button>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="card-neural text-center p-4">
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{stats?.total_tests || 0}</div>
          <div className="text-xs text-muted-foreground">Tests Taken</div>
        </Card>

        <Card className="card-neural text-center p-4">
          <Flame className="w-6 h-6 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{stats?.current_streak || 0}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </Card>

        <Card className="card-neural text-center p-4">
          <Zap className="w-6 h-6 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {stats?.best_reaction_time ? `${stats.best_reaction_time}ms` : 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">Best Reaction</div>
        </Card>

        <Card className="card-neural text-center p-4">
          <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">#{calculateGlobalRank()}</div>
          <div className="text-xs text-muted-foreground">Global Rank</div>
        </Card>

        <Card className="card-neural text-center p-4">
          <Medal className="w-6 h-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{stats?.achievements_unlocked?.length || 0}</div>
          <div className="text-xs text-muted-foreground">Achievements</div>
        </Card>

        <Card className="card-neural text-center p-4">
          <Trophy className="w-6 h-6 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{getTier()}</div>
          <div className="text-xs text-muted-foreground">Tier</div>
        </Card>
      </div>

      {/* Performance by Test Type */}
      {user && testPerformance.length > 0 && (
        <Card className="card-neural p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Test Performance</h3>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <BarChart3 className="w-3 h-3 mr-1" />
              Detailed Analytics
            </Badge>
          </div>
          <div className="grid gap-4">
            {testPerformance.slice(0, 6).map((performance, index) => (
              <div key={performance.test_type} className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground capitalize">
                    {performance.test_type.replace('-', ' ')}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {performance.count} attempts
                    </Badge>
                    {performance.improvement_trend > 0 && (
                      <Badge variant="default" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Improving
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Best Score</p>
                    <p className="font-semibold text-foreground">{performance.best_score}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average</p>
                    <p className="font-semibold text-foreground">{performance.avg_score}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Best Time</p>
                    <p className="font-semibold text-foreground">
                      {performance.best_reaction_time ? `${performance.best_reaction_time}ms` : 'N/A'}
                    </p>
                  </div>
                </div>
                <Progress 
                  value={Math.min(100, (performance.avg_score / (performance.best_score || 1)) * 100)} 
                  className="mt-2 h-2"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Personal Records */}
      {user && personalRecords.length > 0 && (
        <Card className="card-neural p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Personal Records</h3>
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
              <Award className="w-3 h-3 mr-1" />
              Best Performances
            </Badge>
          </div>
          <div className="grid gap-3">
            {personalRecords.slice(0, 5).map((record, index) => (
              <div key={record.test_type} className="flex items-center justify-between p-3 bg-gradient-to-r from-warning/5 to-accent/5 rounded-lg border border-warning/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground capitalize">
                      {record.test_type.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-warning">{record.score}</p>
                  {record.reaction_time && (
                    <p className="text-xs text-muted-foreground">{record.reaction_time}ms</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      {user && recentTests.length > 0 && (
        <Card className="card-neural p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              <Clock className="w-3 h-3 mr-1" />
              Last 5 Tests
            </Badge>
          </div>
          <div className="space-y-3">
            {recentTests.slice(0, 5).map((test, index) => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
                    <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground capitalize">
                      {test.test_type.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(test.created_at).toLocaleDateString()} • {new Date(test.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {test.reaction_time && (
                    <p className="text-sm font-medium text-foreground">{test.reaction_time}ms</p>
                  )}
                  {test.score && (
                    <p className="text-xs text-muted-foreground">Score: {test.score}</p>
                  )}
                  {test.level_reached && (
                    <p className="text-xs text-accent">Level: {test.level_reached}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Goals and Achievements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-neural p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Goals</h3>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Daily streak goal</span>
                <span>{stats?.current_streak || 0}/7 days</span>
              </div>
              <Progress value={((stats?.current_streak || 0) / 7) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Monthly tests goal</span>
                <span>{stats?.total_tests || 0}/30 tests</span>
              </div>
              <Progress value={Math.min(100, ((stats?.total_tests || 0) / 30) * 100)} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Brain age improvement</span>
                <span>{Math.max(0, 30 - (stats?.brain_age || 30))}/10 years</span>
              </div>
              <Progress value={Math.min(100, (Math.max(0, 30 - (stats?.brain_age || 30)) / 10) * 100)} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="card-neural p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Achievements</h3>
            <Trophy className="w-5 h-5 text-warning" />
          </div>
          <div className="space-y-3">
            {(stats?.total_tests || 0) >= 1 && (
              <div className="flex items-center gap-3 p-2 bg-warning/10 rounded-lg border border-warning/20">
                <Medal className="w-5 h-5 text-warning" />
                <div>
                  <p className="font-medium text-foreground">First Test</p>
                  <p className="text-xs text-muted-foreground">Completed your first cognitive test</p>
                </div>
              </div>
            )}
            {(stats?.total_tests || 0) >= 10 && (
              <div className="flex items-center gap-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Dedicated Trainee</p>
                  <p className="text-xs text-muted-foreground">Completed 10 tests</p>
                </div>
              </div>
            )}
            {(stats?.current_streak || 0) >= 7 && (
              <div className="flex items-center gap-3 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-foreground">Week Warrior</p>
                  <p className="text-xs text-muted-foreground">7-day training streak</p>
                </div>
              </div>
            )}
            {(stats?.achievements_unlocked?.length || 0) === 0 && (stats?.total_tests || 0) === 0 && (
              <p className="text-sm text-muted-foreground italic">Complete tests to unlock achievements</p>
            )}
          </div>
        </Card>
      </div>

      {/* Weekly Progress Chart Placeholder */}
      {user && weeklyProgress.length > 0 && (
        <Card className="card-neural p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Progress</h3>
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/10">
            <p className="text-sm text-muted-foreground mb-2">Tests this week: {weeklyProgress.length}</p>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({length: 7}, (_, i) => {
                const dayTests = weeklyProgress.filter(test => 
                  new Date(test.created_at).getDay() === i
                ).length;
                return (
                  <div key={i} className="text-center">
                    <div 
                      className="h-8 bg-primary/20 rounded flex items-end justify-center text-xs font-medium"
                      style={{ backgroundColor: dayTests > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}
                    >
                      {dayTests || ''}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {['S','M','T','W','T','F','S'][i]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Quick Actions */}
      <Card className="card-neural p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="brain" className="justify-start h-12">
            <TrendingUp className="w-4 h-4" />
            <div className="text-left ml-2">
              <p className="text-sm font-medium">View Detailed Stats</p>
              <p className="text-xs opacity-70">Deep dive into performance</p>
            </div>
          </Button>
          <Button variant="brain" className="justify-start h-12">
            <Trophy className="w-4 h-4" />
            <div className="text-left ml-2">
              <p className="text-sm font-medium">Compare Rankings</p>
              <p className="text-xs opacity-70">See how you rank globally</p>
            </div>
          </Button>
          <Button variant="brain" className="justify-start h-12">
            <Target className="w-4 h-4" />
            <div className="text-left ml-2">
              <p className="text-sm font-medium">Set Goals</p>
              <p className="text-xs opacity-70">Create training targets</p>
            </div>
          </Button>
        </div>
      </Card>

    </div>
  );
};