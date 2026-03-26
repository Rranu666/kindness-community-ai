import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Heart, FileText } from "lucide-react";

export default function MetricsGrid({ metrics }) {
  const gridMetrics = [
    {
      title: "Total Users",
      value: metrics.totalUsers || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Volunteer Hours",
      value: (metrics.totalHours || 0).toFixed(1),
      icon: Heart,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Documents Shared",
      value: metrics.totalDocuments || 0,
      icon: FileText,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Growth Rate",
      value: `${(metrics.growthRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {gridMetrics.map((metric, idx) => {
        const IconComponent = metric.icon;
        return (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}