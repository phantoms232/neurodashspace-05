export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      discount_codes: {
        Row: {
          code: string
          coupon_id: string
          created_at: string
          id: string
          issued_at: string | null
          issued_to_email: string | null
          promotion_code_id: string
          redeemed_at: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          coupon_id: string
          created_at?: string
          id?: string
          issued_at?: string | null
          issued_to_email?: string | null
          promotion_code_id: string
          redeemed_at?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          coupon_id?: string
          created_at?: string
          id?: string
          issued_at?: string | null
          issued_to_email?: string | null
          promotion_code_id?: string
          redeemed_at?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      edge_function_rate_limits: {
        Row: {
          created_at: string | null
          function_name: string
          id: string
          identifier: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          function_name: string
          id?: string
          identifier: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          function_name?: string
          id?: string
          identifier?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          id: string
          player1_id: string | null
          player1_reaction_time: number | null
          player1_ready: boolean | null
          player2_id: string | null
          player2_reaction_time: number | null
          player2_ready: boolean | null
          room_code: string
          start_timestamp: string | null
          status: string
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          player1_id?: string | null
          player1_reaction_time?: number | null
          player1_ready?: boolean | null
          player2_id?: string | null
          player2_reaction_time?: number | null
          player2_ready?: boolean | null
          room_code: string
          start_timestamp?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          player1_id?: string | null
          player1_reaction_time?: number | null
          player1_ready?: boolean | null
          player2_id?: string | null
          player2_reaction_time?: number | null
          player2_ready?: boolean | null
          room_code?: string
          start_timestamp?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      multiplayer_games: {
        Row: {
          created_at: string
          end_time: string | null
          game_code: string | null
          game_data: Json | null
          game_type: string
          id: string
          player1_id: string
          player2_id: string | null
          start_time: string | null
          state: Database["public"]["Enums"]["game_state"]
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          game_code?: string | null
          game_data?: Json | null
          game_type?: string
          id?: string
          player1_id: string
          player2_id?: string | null
          start_time?: string | null
          state?: Database["public"]["Enums"]["game_state"]
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          game_code?: string | null
          game_data?: Json | null
          game_type?: string
          id?: string
          player1_id?: string
          player2_id?: string | null
          start_time?: string | null
          state?: Database["public"]["Enums"]["game_state"]
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      multiplayer_results: {
        Row: {
          created_at: string
          finished_at: string | null
          game_id: string
          id: string
          reaction_time: number | null
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          finished_at?: string | null
          game_id: string
          id?: string
          reaction_time?: number | null
          score?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          finished_at?: string | null
          game_id?: string
          id?: string
          reaction_time?: number | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiplayer_results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "multiplayer_games"
            referencedColumns: ["id"]
          },
        ]
      }
      multiplayer_stats: {
        Row: {
          best_reaction_time: number | null
          best_streak: number | null
          created_at: string
          current_streak: number | null
          id: string
          losses: number | null
          total_games: number | null
          total_reaction_time: number | null
          updated_at: string
          user_id: string
          wins: number | null
        }
        Insert: {
          best_reaction_time?: number | null
          best_streak?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          losses?: number | null
          total_games?: number | null
          total_reaction_time?: number | null
          updated_at?: string
          user_id: string
          wins?: number | null
        }
        Update: {
          best_reaction_time?: number | null
          best_streak?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          losses?: number | null
          total_games?: number | null
          total_reaction_time?: number | null
          updated_at?: string
          user_id?: string
          wins?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          average_reaction_time: number | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          average_reaction_time?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          average_reaction_time?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          free_trial_granted: boolean | null
          id: string
          referral_code: string
          referrer_user_id: string | null
          used_at: string | null
          used_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          free_trial_granted?: boolean | null
          id?: string
          referral_code: string
          referrer_user_id?: string | null
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          free_trial_granted?: boolean | null
          id?: string
          referral_code?: string
          referrer_user_id?: string | null
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          free_trial_end: string | null
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          free_trial_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          free_trial_end?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          accuracy: number | null
          created_at: string
          duration: number | null
          id: string
          level_reached: number | null
          reaction_time: number | null
          score: number | null
          test_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          duration?: number | null
          id?: string
          level_reached?: number | null
          reaction_time?: number | null
          score?: number | null
          test_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          duration?: number | null
          id?: string
          level_reached?: number | null
          reaction_time?: number | null
          score?: number | null
          test_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          achievements_unlocked: string[] | null
          best_reaction_time: number | null
          brain_age: number | null
          created_at: string
          current_streak: number | null
          id: string
          last_test_date: string | null
          total_tests: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements_unlocked?: string[] | null
          best_reaction_time?: number | null
          brain_age?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          last_test_date?: string | null
          total_tests?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements_unlocked?: string[] | null
          best_reaction_time?: number | null
          brain_age?: number | null
          created_at?: string
          current_streak?: number | null
          id?: string
          last_test_date?: string | null
          total_tests?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_edge_function_rate_limit: {
        Args: {
          function_name_param: string
          identifier_param: string
          max_requests?: number
          window_minutes?: number
        }
        Returns: boolean
      }
      check_test_rate_limit: {
        Args: { test_type: string; user_id: string }
        Returns: boolean
      }
      generate_game_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_referral_code: {
        Args: { user_id: string }
        Returns: string
      }
      generate_room_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_multiplayer_leaderboard: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_reaction_time: number
          best_reaction_time: number
          best_streak: number
          current_streak: number
          full_name: string
          losses: number
          total_games: number
          user_id: string
          username: string
          win_rate: number
          wins: number
        }[]
      }
      grant_free_trial: {
        Args: { referral_code_used: string; user_email: string }
        Returns: boolean
      }
      handle_stripe_webhook: {
        Args: {
          customer_id: string
          event_type: string
          subscription_data?: Json
        }
        Returns: undefined
      }
      log_security_event: {
        Args: { details?: Json; event_type: string; target_user_id?: string }
        Returns: undefined
      }
      validate_email_format: {
        Args: { email: string }
        Returns: boolean
      }
      validate_game_code: {
        Args: { code: string }
        Returns: boolean
      }
      validate_referral_code: {
        Args: { code: string }
        Returns: boolean
      }
      validate_string_input: {
        Args: { allow_empty?: boolean; input_text: string; max_length?: number }
        Returns: boolean
      }
    }
    Enums: {
      game_state: "waiting" | "starting" | "active" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      game_state: ["waiting", "starting", "active", "finished"],
    },
  },
} as const
