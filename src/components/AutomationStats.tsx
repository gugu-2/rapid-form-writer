import { Card } from '@/components/ui/card';
import { FileText, Clock, Zap, Target } from 'lucide-react';

interface AutomationStatsProps {
  textLength: number;
  estimatedTime: number;
  speed: number;
}

const AutomationStats = ({ textLength, estimatedTime, speed }: AutomationStatsProps) => {
  const stats = [
    {
      label: 'Characters',
      value: textLength,
      icon: FileText,
      color: 'text-primary'
    },
    {
      label: 'Est. Time',
      value: `${(estimatedTime / 1000).toFixed(1)}s`,
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      label: 'Speed',
      value: `${speed}ms`,
      icon: Zap,
      color: 'text-yellow-400'
    },
    {
      label: 'Status',
      value: textLength > 0 ? 'Ready' : 'Empty',
      icon: Target,
      color: textLength > 0 ? 'text-primary' : 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 bg-gradient-card border border-primary/20">
          <div className="flex items-center space-x-3">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <div>
              <p className="text-sm font-medium text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AutomationStats;