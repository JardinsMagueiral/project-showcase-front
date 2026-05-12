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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      classificado_fotos: {
        Row: {
          classificado_id: string
          created_at: string | null
          id: string
          ordem: number | null
          url: string
        }
        Insert: {
          classificado_id: string
          created_at?: string | null
          id?: string
          ordem?: number | null
          url: string
        }
        Update: {
          classificado_id?: string
          created_at?: string | null
          id?: string
          ordem?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "classificado_fotos_classificado_id_fkey"
            columns: ["classificado_id"]
            isOneToOne: false
            referencedRelation: "classificados"
            referencedColumns: ["id"]
          },
        ]
      }
      classificados: {
        Row: {
          categoria: string
          contato_whatsapp: string
          created_at: string | null
          descricao: string | null
          id: string
          preco: number
          status: string | null
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          categoria: string
          contato_whatsapp: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          preco: number
          status?: string | null
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          categoria?: string
          contato_whatsapp?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          preco?: number
          status?: string | null
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crm_agenda: {
        Row: {
          concluido: boolean | null
          created_at: string
          data: string
          hora: string | null
          id: string
          lead_id: string | null
          observacoes: string | null
          responsavel_id: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          concluido?: boolean | null
          created_at?: string
          data: string
          hora?: string | null
          id?: string
          lead_id?: string | null
          observacoes?: string | null
          responsavel_id?: string | null
          tipo?: string
          titulo: string
        }
        Update: {
          concluido?: boolean | null
          created_at?: string
          data?: string
          hora?: string | null
          id?: string
          lead_id?: string | null
          observacoes?: string | null
          responsavel_id?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_agenda_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_automation_logs: {
        Row: {
          automation_id: string | null
          created_at: string
          id: string
          lead_id: string | null
          resultado: string | null
        }
        Insert: {
          automation_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          resultado?: string | null
        }
        Update: {
          automation_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          resultado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_automation_logs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "crm_automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_automation_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_automations: {
        Row: {
          ativa: boolean | null
          created_at: string
          delay_dias: number | null
          execucoes: number | null
          id: string
          nome: string
          template_id: string | null
          trigger: Database["public"]["Enums"]["crm_automation_trigger"]
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string
          delay_dias?: number | null
          execucoes?: number | null
          id?: string
          nome: string
          template_id?: string | null
          trigger: Database["public"]["Enums"]["crm_automation_trigger"]
        }
        Update: {
          ativa?: boolean | null
          created_at?: string
          delay_dias?: number | null
          execucoes?: number | null
          id?: string
          nome?: string
          template_id?: string | null
          trigger?: Database["public"]["Enums"]["crm_automation_trigger"]
        }
        Relationships: [
          {
            foreignKeyName: "crm_automations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "crm_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_imoveis_enviados: {
        Row: {
          enviado_em: string
          enviado_por: string | null
          id: string
          imovel_id: string
          lead_id: string
        }
        Insert: {
          enviado_em?: string
          enviado_por?: string | null
          id?: string
          imovel_id: string
          lead_id: string
        }
        Update: {
          enviado_em?: string
          enviado_por?: string | null
          id?: string
          imovel_id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_imoveis_enviados_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_interactions: {
        Row: {
          created_at: string
          criado_por: string | null
          data: string
          id: string
          lead_id: string
          resumo: string | null
          tipo: Database["public"]["Enums"]["crm_interaction_type"]
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          data?: string
          id?: string
          lead_id: string
          resumo?: string | null
          tipo: Database["public"]["Enums"]["crm_interaction_type"]
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          data?: string
          id?: string
          lead_id?: string
          resumo?: string | null
          tipo?: Database["public"]["Enums"]["crm_interaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "crm_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          bairro_pref: string | null
          created_at: string
          email: string | null
          id: string
          interesse: Database["public"]["Enums"]["crm_interesse"] | null
          localizacao: string | null
          metragem_max: number | null
          metragem_min: number | null
          nome: string
          observacoes: string | null
          origem: Database["public"]["Enums"]["crm_origem"]
          proximo_followup: string | null
          quartos_pref: number | null
          responsavel_id: string | null
          score: number
          status: Database["public"]["Enums"]["crm_lead_status"]
          tags: string[] | null
          telefone: string | null
          tipo_imovel: string | null
          ultimo_contato: string | null
          updated_at: string
          user_id: string | null
          valor_aproximado_imovel: number | null
          valor_max: number | null
          valor_min: number | null
        }
        Insert: {
          bairro_pref?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interesse?: Database["public"]["Enums"]["crm_interesse"] | null
          localizacao?: string | null
          metragem_max?: number | null
          metragem_min?: number | null
          nome: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["crm_origem"]
          proximo_followup?: string | null
          quartos_pref?: number | null
          responsavel_id?: string | null
          score?: number
          status?: Database["public"]["Enums"]["crm_lead_status"]
          tags?: string[] | null
          telefone?: string | null
          tipo_imovel?: string | null
          ultimo_contato?: string | null
          updated_at?: string
          user_id?: string | null
          valor_aproximado_imovel?: number | null
          valor_max?: number | null
          valor_min?: number | null
        }
        Update: {
          bairro_pref?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interesse?: Database["public"]["Enums"]["crm_interesse"] | null
          localizacao?: string | null
          metragem_max?: number | null
          metragem_min?: number | null
          nome?: string
          observacoes?: string | null
          origem?: Database["public"]["Enums"]["crm_origem"]
          proximo_followup?: string | null
          quartos_pref?: number | null
          responsavel_id?: string | null
          score?: number
          status?: Database["public"]["Enums"]["crm_lead_status"]
          tags?: string[] | null
          telefone?: string | null
          tipo_imovel?: string | null
          ultimo_contato?: string | null
          updated_at?: string
          user_id?: string | null
          valor_aproximado_imovel?: number | null
          valor_max?: number | null
          valor_min?: number | null
        }
        Relationships: []
      }
      crm_templates: {
        Row: {
          anexos: Json | null
          ativo: boolean | null
          canal: string
          created_at: string
          id: string
          incluir_fotos_imovel: boolean | null
          mensagem: string
          nome: string
          updated_at: string
        }
        Insert: {
          anexos?: Json | null
          ativo?: boolean | null
          canal?: string
          created_at?: string
          id?: string
          incluir_fotos_imovel?: boolean | null
          mensagem: string
          nome: string
          updated_at?: string
        }
        Update: {
          anexos?: Json | null
          ativo?: boolean | null
          canal?: string
          created_at?: string
          id?: string
          incluir_fotos_imovel?: boolean | null
          mensagem?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string | null
          data: string
          descricao: string | null
          id: string
          status: string | null
          titulo: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          descricao?: string | null
          id?: string
          status?: string | null
          titulo: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          descricao?: string | null
          id?: string
          status?: string | null
          titulo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      imoveis: {
        Row: {
          aceita_pets: boolean | null
          area_m2: number | null
          bairro: string | null
          banheiros: number | null
          cep: string | null
          complemento: string | null
          condominio: number | null
          created_at: string | null
          descricao: string | null
          destaque: boolean | null
          endereco: string
          id: string
          iptu: number | null
          mobiliado: boolean | null
          numero: string | null
          operacao: string
          preco: number
          quartos: number | null
          status: string | null
          tipo: string
          updated_at: string | null
          user_id: string
          vagas: number | null
        }
        Insert: {
          aceita_pets?: boolean | null
          area_m2?: number | null
          bairro?: string | null
          banheiros?: number | null
          cep?: string | null
          complemento?: string | null
          condominio?: number | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          endereco: string
          id?: string
          iptu?: number | null
          mobiliado?: boolean | null
          numero?: string | null
          operacao: string
          preco: number
          quartos?: number | null
          status?: string | null
          tipo: string
          updated_at?: string | null
          user_id: string
          vagas?: number | null
        }
        Update: {
          aceita_pets?: boolean | null
          area_m2?: number | null
          bairro?: string | null
          banheiros?: number | null
          cep?: string | null
          complemento?: string | null
          condominio?: number | null
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          endereco?: string
          id?: string
          iptu?: number | null
          mobiliado?: boolean | null
          numero?: string | null
          operacao?: string
          preco?: number
          quartos?: number | null
          status?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
          vagas?: number | null
        }
        Relationships: []
      }
      imovel_fotos: {
        Row: {
          created_at: string | null
          id: string
          imovel_id: string
          ordem: number | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          imovel_id: string
          ordem?: number | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          imovel_id?: string
          ordem?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "imovel_fotos_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      noticias: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          imagem_url: string | null
          link: string | null
          status: string | null
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          link?: string | null
          status?: string | null
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          link?: string | null
          status?: string | null
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      parceiro_fotos: {
        Row: {
          created_at: string | null
          id: string
          ordem: number | null
          parceiro_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ordem?: number | null
          parceiro_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ordem?: number | null
          parceiro_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "parceiro_fotos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiros: {
        Row: {
          categoria: string
          created_at: string | null
          descricao: string | null
          destaque: boolean | null
          email: string | null
          endereco: string | null
          id: string
          instagram: string | null
          logo_url: string | null
          nome: string
          site: string | null
          status: string | null
          telefone: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          categoria: string
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          email?: string | null
          endereco?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          nome: string
          site?: string | null
          status?: string | null
          telefone: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          email?: string | null
          endereco?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          nome?: string
          site?: string | null
          status?: string | null
          telefone?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email: string
          id: string
          nome: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quadra_fotos: {
        Row: {
          created_at: string | null
          id: string
          ordem: number | null
          quadra_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ordem?: number | null
          quadra_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ordem?: number | null
          quadra_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "quadra_fotos_quadra_id_fkey"
            columns: ["quadra_id"]
            isOneToOne: false
            referencedRelation: "quadras"
            referencedColumns: ["id"]
          },
        ]
      }
      quadras: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          numero: number
          taxa_condominio: number
          telefone: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome: string
          numero: number
          taxa_condominio: number
          telefone: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          numero?: number
          taxa_condominio?: number
          telefone?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_grupos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          link: string
          ordem: number | null
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          link: string
          ordem?: number | null
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          link?: string
          ordem?: number | null
          titulo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_crm_access: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "gestor"
      crm_automation_trigger:
        | "lead_novo"
        | "inativo_7d"
        | "imovel_novo"
        | "pos_visita"
        | "proposta_enviada"
      crm_interaction_type:
        | "ligacao"
        | "whatsapp"
        | "email"
        | "visita"
        | "proposta"
        | "nota"
      crm_interesse: "comprar" | "alugar" | "investir"
      crm_lead_status:
        | "novo"
        | "atendimento"
        | "proposta"
        | "fechado"
        | "perdido"
      crm_origem:
        | "cadastro_site"
        | "manual"
        | "classificado"
        | "contato"
        | "importado"
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
      app_role: ["admin", "user", "gestor"],
      crm_automation_trigger: [
        "lead_novo",
        "inativo_7d",
        "imovel_novo",
        "pos_visita",
        "proposta_enviada",
      ],
      crm_interaction_type: [
        "ligacao",
        "whatsapp",
        "email",
        "visita",
        "proposta",
        "nota",
      ],
      crm_interesse: ["comprar", "alugar", "investir"],
      crm_lead_status: [
        "novo",
        "atendimento",
        "proposta",
        "fechado",
        "perdido",
      ],
      crm_origem: [
        "cadastro_site",
        "manual",
        "classificado",
        "contato",
        "importado",
      ],
    },
  },
} as const
