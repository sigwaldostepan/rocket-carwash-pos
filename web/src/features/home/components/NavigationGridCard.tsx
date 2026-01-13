import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type NavigationItem = {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
};

export const NavigationGridCard = ({ item }: { item: NavigationItem }) => {
  return (
    <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-col items-center space-y-3 p-6 text-center">
        <div className="rounded-full p-3">
          <item.icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
    </Card>
  );
};
