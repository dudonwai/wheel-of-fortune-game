import { Plane } from "lucide-react";

export const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <Plane className="w-12 h-12 text-slate-400" strokeWidth={1} />
        <p className="text-slate-500">Nothing here yet</p>
      </div>
    </div>
  );
};
