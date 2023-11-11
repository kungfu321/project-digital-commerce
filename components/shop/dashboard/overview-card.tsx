'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface OverviewCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  icon,
  value,
  description,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {
          description &&
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        }
      </CardContent>
    </Card>
  )
}

export default OverviewCard;
