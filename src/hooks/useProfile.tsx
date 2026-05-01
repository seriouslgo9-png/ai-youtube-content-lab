import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Plan = "free" | "pro" | "business";

export interface Profile {
  id: string;
  email: string | null;
  plan: Plan;
  credits: number;
  referral_code: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id,email,plan,credits,referral_code")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(data as Profile | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const useCredit = async (amount = 1): Promise<boolean> => {
    if (!user) return false;
    const { data, error } = await supabase.rpc("use_credit", { _amount: amount });
    if (error) return false;
    setProfile((p) => (p ? { ...p, credits: data as number } : p));
    return true;
  };

  return { profile, loading, refresh, useCredit };
}