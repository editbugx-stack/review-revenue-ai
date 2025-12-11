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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          category: string
          contact_phone: string | null
          created_at: string
          default_tone: Database["public"]["Enums"]["tone_type"]
          facts: Json | null
          id: string
          name: string
          opening_hours: string | null
          owner_user_id: string
          primary_location: string | null
          refund_policy: string | null
          updated_at: string
        }
        Insert: {
          category: string
          contact_phone?: string | null
          created_at?: string
          default_tone?: Database["public"]["Enums"]["tone_type"]
          facts?: Json | null
          id?: string
          name: string
          opening_hours?: string | null
          owner_user_id: string
          primary_location?: string | null
          refund_policy?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          contact_phone?: string | null
          created_at?: string
          default_tone?: Database["public"]["Enums"]["tone_type"]
          facts?: Json | null
          id?: string
          name?: string
          opening_hours?: string | null
          owner_user_id?: string
          primary_location?: string | null
          refund_policy?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          onboarding_completed: boolean
          plan_type: Database["public"]["Enums"]["plan_type"]
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          onboarding_completed?: boolean
          plan_type?: Database["public"]["Enums"]["plan_type"]
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          onboarding_completed?: boolean
          plan_type?: Database["public"]["Enums"]["plan_type"]
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      replies: {
        Row: {
          created_at: string
          created_by: Database["public"]["Enums"]["reply_creator"]
          id: string
          is_approved: boolean
          review_id: string
          text: string
          tone: Database["public"]["Enums"]["tone_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: Database["public"]["Enums"]["reply_creator"]
          id?: string
          is_approved?: boolean
          review_id: string
          text: string
          tone: Database["public"]["Enums"]["tone_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: Database["public"]["Enums"]["reply_creator"]
          id?: string
          is_approved?: boolean
          review_id?: string
          text?: string
          tone?: Database["public"]["Enums"]["tone_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reply_templates: {
        Row: {
          business_id: string
          created_at: string
          id: string
          name: string
          template_text: string
          tone: Database["public"]["Enums"]["tone_type"]
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          name: string
          template_text: string
          tone: Database["public"]["Enums"]["tone_type"]
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          template_text?: string
          tone?: Database["public"]["Enums"]["tone_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_templates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          analysis_category: string | null
          analysis_summary: string | null
          analysis_urgency: Database["public"]["Enums"]["urgency_level"] | null
          approved_reply_id: string | null
          business_id: string
          created_at: string
          id: string
          missing_info_fields: Json | null
          missing_info_required: boolean
          rating: number
          replied_at: string | null
          review_date: string
          reviewer_name: string
          sentiment: Database["public"]["Enums"]["sentiment_type"] | null
          source: Database["public"]["Enums"]["review_source"]
          status: Database["public"]["Enums"]["review_status"]
          text: string
          updated_at: string
        }
        Insert: {
          analysis_category?: string | null
          analysis_summary?: string | null
          analysis_urgency?: Database["public"]["Enums"]["urgency_level"] | null
          approved_reply_id?: string | null
          business_id: string
          created_at?: string
          id?: string
          missing_info_fields?: Json | null
          missing_info_required?: boolean
          rating: number
          replied_at?: string | null
          review_date?: string
          reviewer_name: string
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          source?: Database["public"]["Enums"]["review_source"]
          status?: Database["public"]["Enums"]["review_status"]
          text: string
          updated_at?: string
        }
        Update: {
          analysis_category?: string | null
          analysis_summary?: string | null
          analysis_urgency?: Database["public"]["Enums"]["urgency_level"] | null
          approved_reply_id?: string | null
          business_id?: string
          created_at?: string
          id?: string
          missing_info_fields?: Json | null
          missing_info_required?: boolean
          rating?: number
          replied_at?: string | null
          review_date?: string
          reviewer_name?: string
          sentiment?: Database["public"]["Enums"]["sentiment_type"] | null
          source?: Database["public"]["Enums"]["review_source"]
          status?: Database["public"]["Enums"]["review_status"]
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_approved_reply_id_fkey"
            columns: ["approved_reply_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          ai_calls_used: number
          created_at: string
          id: string
          period_end: string
          period_start: string
          reviews_created: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_calls_used?: number
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          reviews_created?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_calls_used?: number
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          reviews_created?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_owns_business: { Args: { _business_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "agency" | "admin"
      plan_type: "trial" | "starter" | "pro" | "agency"
      reply_creator: "system_ai" | "user"
      review_source: "google" | "yelp" | "facebook" | "manual"
      review_status: "pending" | "replied" | "escalated"
      sentiment_type: "positive" | "neutral" | "negative"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
      tone_type: "friendly" | "formal" | "apologetic"
      urgency_level: "low" | "medium" | "high"
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
      app_role: ["owner", "agency", "admin"],
      plan_type: ["trial", "starter", "pro", "agency"],
      reply_creator: ["system_ai", "user"],
      review_source: ["google", "yelp", "facebook", "manual"],
      review_status: ["pending", "replied", "escalated"],
      sentiment_type: ["positive", "neutral", "negative"],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "incomplete",
      ],
      tone_type: ["friendly", "formal", "apologetic"],
      urgency_level: ["low", "medium", "high"],
    },
  },
} as const
