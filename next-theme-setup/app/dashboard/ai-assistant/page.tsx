"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIAssistantRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Rediriger vers l'éditeur de dashboard avec l'assistant IA activé
    router.push("/dashboard/editor?ai=true");
  }, [router]);
  
  // Afficher un état de chargement pendant la redirection
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 col-span-4" />
        ))}
      </div>
    </div>
  );
} 