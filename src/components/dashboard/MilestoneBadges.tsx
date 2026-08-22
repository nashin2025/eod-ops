"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, MapPin, Waves, Star } from "@phosphor-icons/react";

interface UserMilestone {
  id: string;
  userId: string;
  milestoneName: string;
  milestoneType: string;
  milestoneLevel: number;
  targetValue: number;
  progress: number;
  badgeIcon: string;
  badgeColor: string;
  description: string;
  achievedAt?: string;
}

interface MilestoneStats {
  totalIslands: number;
  totalVisits: number;
  uniqueAtolls: number;
}

interface MilestoneBadgesProps {
  stats?: MilestoneStats;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "island_visits":
      return <MapPin className="w-4 h-4" />;
    case "atolls_visited":
      return <Waves className="w-4 h-4" />;
    case "total_visits":
      return <Star className="w-4 h-4" />;
    default:
      return <Target className="w-4 h-4" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "island_visits":
      return "Islands";
    case "atolls_visited":
      return "Atolls";
    case "total_visits":
      return "Visits";
    default:
      return "Progress";
  }
};

export function MilestoneBadges({ stats }: MilestoneBadgesProps) {
  // Mock milestone data - in production this would come from API
  const milestones: UserMilestone[] = [
    {
      id: "1",
      userId: "user1",
      milestoneName: "First Steps",
      milestoneType: "island_visits",
      milestoneLevel: 1,
      targetValue: 1,
      progress: 1,
      badgeIcon: "🏝️",
      badgeColor: "#10B981",
      description: "Check in to your first island",
      achievedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      userId: "user1",
      milestoneName: "Island Hopper",
      milestoneType: "island_visits",
      milestoneLevel: 2,
      targetValue: 5,
      progress: 3,
      badgeIcon: "🏝️🏝️",
      badgeColor: "#3B82F6",
      description: "Visit 5 different islands",
      achievedAt: undefined,
    },
    {
      id: "3",
      userId: "user1",
      milestoneName: "Explorer",
      milestoneType: "island_visits",
      milestoneLevel: 3,
      targetValue: 10,
      progress: 3,
      badgeIcon: "🏝️🏝️🏝️",
      badgeColor: "#8B5CF6",
      description: "Visit 10 different islands",
      achievedAt: undefined,
    },
    {
      id: "4",
      userId: "user1",
      milestoneName: "Atoll Pioneer",
      milestoneType: "atolls_visited",
      milestoneLevel: 1,
      targetValue: 1,
      progress: 1,
      badgeIcon: "🌊",
      badgeColor: "#06B6D4",
      description: "Visit your first atoll",
      achievedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "5",
      userId: "user1",
      milestoneName: "Atoll Navigator",
      milestoneType: "atolls_visited",
      milestoneLevel: 2,
      targetValue: 3,
      progress: 2,
      badgeIcon: "🌊🌊",
      badgeColor: "#0EA5E9",
      description: "Visit 3 different atolls",
      achievedAt: undefined,
    },
    {
      id: "6",
      userId: "user1",
      milestoneName: "Atoll Master",
      milestoneType: "atolls_visited",
      milestoneLevel: 3,
      targetValue: 5,
      progress: 2,
      badgeIcon: "🌊🌊🌊",
      badgeColor: "#3B82F6",
      description: "Visit 5 different atolls",
      achievedAt: undefined,
    },
    {
      id: "7",
      userId: "user1",
      milestoneName: "Frequent Visitor",
      milestoneType: "total_visits",
      milestoneLevel: 1,
      targetValue: 5,
      progress: 5,
      badgeIcon: "⭐",
      badgeColor: "#F59E0B",
      description: "Complete 5 total check-ins",
      achievedAt: "2024-02-20T14:00:00Z",
    },
    {
      id: "8",
      userId: "user1",
      milestoneName: "Dedicated Explorer",
      milestoneType: "total_visits",
      milestoneLevel: 2,
      targetValue: 20,
      progress: 8,
      badgeIcon: "⭐⭐",
      badgeColor: "#F97316",
      description: "Complete 20 total check-ins",
      achievedAt: undefined,
    },
    {
      id: "9",
      userId: "user1",
      milestoneName: "Legendary Voyager",
      milestoneType: "total_visits",
      milestoneLevel: 3,
      targetValue: 50,
      progress: 8,
      badgeIcon: "⭐⭐⭐",
      badgeColor: "#EF4444",
      description: "Complete 50 total check-ins",
      achievedAt: undefined,
    },
  ];

  // Defensive deduplication: Remove duplicates by milestone name, keep highest level
  const uniqueMilestones = milestones.reduce((acc, current) => {
    const existing = acc.find(m => m.milestoneName === current.milestoneName && m.milestoneType === current.milestoneType);

    if (!existing) {
      acc.push(current);
    } else {
      if (current.milestoneLevel > existing.milestoneLevel) {
        const index = acc.findIndex(m => m.milestoneName === existing.milestoneName && m.milestoneType === existing.milestoneType);
        acc[index] = current;
      }
    }
    return acc;
  }, [] as UserMilestone[]);

  // Separate achieved and in-progress milestones, sorted by target value (low to high)
  const achievedMilestones = uniqueMilestones
    .filter(m => m.progress >= m.targetValue)
    .sort((a, b) => a.targetValue - b.targetValue);
  const inProgressMilestones = uniqueMilestones
    .filter(m => m.progress < m.targetValue)
    .sort((a, b) => a.targetValue - b.targetValue);

  return (
    <Card className="card-auth">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" style={{ color: "var(--warning)" }} />
          Milestones & Achievements
        </CardTitle>
        <CardDescription>
          Your exploration progress and badges
          {stats && (
            <span className="ml-2 text-sm">
              • {stats.totalIslands} islands • {stats.uniqueAtolls} atolls • {stats.totalVisits} visits
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Achieved Milestones */}
        {achievedMilestones.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" style={{ color: "var(--warning)" }} />
              Earned Badges ({achievedMilestones.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievedMilestones.map((milestone) => (
                <MilestoneBadge
                  key={milestone.id}
                  milestone={milestone}
                  isAchieved={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* In Progress Milestones */}
        {inProgressMilestones.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: "var(--accent)" }} />
              Next Goals ({inProgressMilestones.length})
            </h4>
            <div className="space-y-3">
              {inProgressMilestones.slice(0, 5).map((milestone) => (
                <MilestoneBadge
                  key={milestone.id}
                  milestone={milestone}
                  isAchieved={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* No milestones message */}
        {milestones.length === 0 && (
          <div className="text-center py-8" style={{ color: "var(--text-tertiary)" }}>
            <MapPin className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.3 }} />
            <p className="text-lg font-medium">Start Your Journey!</p>
            <p className="text-sm">Check in to your first island to earn your first milestone badge.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MilestoneBadgeProps {
  milestone: UserMilestone;
  isAchieved: boolean;
}

function MilestoneBadge({ milestone, isAchieved }: MilestoneBadgeProps) {
  const progressPercentage = Math.min((milestone.progress / milestone.targetValue) * 100, 100);

  if (isAchieved) {
    return (
      <div
        className="relative p-4 rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow"
        style={{ borderColor: milestone.badgeColor, background: `linear-gradient(135deg, ${milestone.badgeColor}15, ${milestone.badgeColor}05)` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
            style={{ backgroundColor: milestone.badgeColor }}
          >
            {milestone.badgeIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-semibold text-sm truncate">{milestone.milestoneName}</h5>
              <Badge variant="default" className="text-xs px-2 py-0.5" style={{ backgroundColor: milestone.badgeColor, color: "white" }}>
                ✓ Level {milestone.milestoneLevel}
              </Badge>
            </div>
            <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>{milestone.description}</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
              {getTypeIcon(milestone.milestoneType)}
              <span className="font-medium">{milestone.progress}/{milestone.targetValue}</span>
              <span style={{ color: "var(--success)" }}>Completed!</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors" style={{ borderColor: "var(--border-subtle)", background: "var(--card-bg)" }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--hover-bg)", color: "var(--text-tertiary)" }}>
          {milestone.badgeIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-semibold text-sm text-gray-700 truncate" style={{ color: "var(--text-primary)" }}>{milestone.milestoneName}</h5>
            <Badge variant="default" className="text-xs px-2 py-0.5" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
              Level {milestone.milestoneLevel}
            </Badge>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>{milestone.description}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                {getTypeIcon(milestone.milestoneType)}
                <span>{milestone.progress}/{milestone.targetValue}</span>
              </div>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" style={{ backgroundColor: milestone.badgeColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MilestoneQuickStats({ stats, achievedCount }: { stats?: MilestoneStats; achievedCount?: number }) {
  if (!stats) {
    return (
      <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl font-bold" style={{ color: "var(--text-tertiary)" }}>-</div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Islands</div>
        </div>
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl font-bold" style={{ color: "var(--text-tertiary)" }}>-</div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Atolls</div>
        </div>
        <div className="text-center flex-1 min-w-[80px]">
          <div className="text-2xl font-bold" style={{ color: "var(--text-tertiary)" }}>-</div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Badges</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
      <div className="text-center flex-1 min-w-[80px]">
        <div className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{stats.totalIslands}</div>
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Islands</div>
      </div>
      <div className="text-center flex-1 min-w-[80px]">
        <div className="text-2xl font-bold" style={{ color: "var(--success)" }}>{stats.uniqueAtolls}</div>
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Atolls</div>
      </div>
      <div className="text-center flex-1 min-w-[80px]">
        <div className="text-2xl font-bold" style={{ color: "var(--warning)" }}>{achievedCount || 0}</div>
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Badges</div>
      </div>
    </div>
  );
}