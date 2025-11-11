import { UserIdentity } from "@supabase/supabase-js";

declare module "@supabase/supabase-js" {
  interface UserIdentity {
    provider_token?: string;
  }
}
