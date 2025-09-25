// src/components/icons.ts
import {
  Library,
  LineChart,
  PieChart,
  Settings2,
  Settings,
  UserRoundCog,
  List,
  Plus,
  BarChart3,
  type LucideIcon
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  library: Library,
  lineChart: LineChart,
  pieChart: PieChart,
  settings2: Settings2,
  settings: Settings,
  userRoundCog: UserRoundCog,
  list: List,
  plus: Plus,           
  barChart: BarChart3    
} as const;

export type IconName = keyof typeof Icons;
