import { Card, CardDescription, CardTitle } from "@/app/components/ui/card";

export function QuickActionCard({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <Card className="p-5 border-purple-200 hover:shadow-md transition cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </Card>
    );
  }