export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          location: string;
          curricula: string[];
          enable_844: boolean | null;
          motto: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string;
          location?: string;
          curricula?: string[];
          enable_844?: boolean | null;
          motto?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          curricula?: string[];
          enable_844?: boolean | null;
          motto?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          role: "admin" | "bursar" | "teacher" | "parent" | "student";
          avatar_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role: "admin" | "bursar" | "teacher" | "parent" | "student";
          avatar_url?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: "admin" | "bursar" | "teacher" | "parent" | "student";
          avatar_url?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      students: {
        Row: {
          id: string;
          admission_number: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          gender: "male" | "female";
          curriculum: "CBC" | "8-4-4";
          grade_level: string;
          stream: string | null;
          day_or_boarding: "day" | "boarding";
          parent_id: string | null;
          class_teacher_id: string | null;
          photo_url: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          enrollment_date: string | null;
          status: "active" | "transferred" | "graduated" | "withdrawn";
          created_at: string | null;
        };
        Insert: {
          id?: string;
          admission_number: string;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          gender: "male" | "female";
          curriculum: "CBC" | "8-4-4";
          grade_level: string;
          stream?: string | null;
          day_or_boarding: "day" | "boarding";
          parent_id?: string | null;
          class_teacher_id?: string | null;
          photo_url?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          enrollment_date?: string | null;
          status?: "active" | "transferred" | "graduated" | "withdrawn";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          admission_number?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string | null;
          gender?: "male" | "female";
          curriculum?: "CBC" | "8-4-4";
          grade_level?: string;
          stream?: string | null;
          day_or_boarding?: "day" | "boarding";
          parent_id?: string | null;
          class_teacher_id?: string | null;
          photo_url?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          enrollment_date?: string | null;
          status?: "active" | "transferred" | "graduated" | "withdrawn";
          created_at?: string | null;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          grade_level: string;
          stream: string | null;
          curriculum: "CBC" | "8-4-4";
          class_teacher_id: string | null;
          year: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          grade_level: string;
          stream?: string | null;
          curriculum: "CBC" | "8-4-4";
          class_teacher_id?: string | null;
          year: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          grade_level?: string;
          stream?: string | null;
          curriculum?: "CBC" | "8-4-4";
          class_teacher_id?: string | null;
          year?: number;
          created_at?: string | null;
        };
        Relationships: [];
      };
      teacher_assignments: {
        Row: {
          id: string;
          teacher_id: string;
          class_id: string;
          subject: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          class_id: string;
          subject: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          class_id?: string;
          subject?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          status: "present" | "absent" | "late" | "excused";
          marked_by: string | null;
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          date: string;
          status: "present" | "absent" | "late" | "excused";
          marked_by?: string | null;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          date?: string;
          status?: "present" | "absent" | "late" | "excused";
          marked_by?: string | null;
          notes?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      homework: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          subject: string;
          grade_level: string;
          stream: string | null;
          due_date: string | null;
          attachments: string[] | null;
          created_by: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          subject: string;
          grade_level: string;
          stream?: string | null;
          due_date?: string | null;
          attachments?: string[] | null;
          created_by: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          subject?: string;
          grade_level?: string;
          stream?: string | null;
          due_date?: string | null;
          attachments?: string[] | null;
          created_by?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      homework_completions: {
        Row: {
          id: string;
          homework_id: string;
          student_id: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          homework_id: string;
          student_id: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          homework_id?: string;
          student_id?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          competency: string;
          rating: "Exceeding" | "Meeting" | "Approaching" | "Below";
          evidence_urls: string[] | null;
          teacher_notes: string | null;
          assessed_by: string;
          assessed_at: string | null;
          term: string;
          year: number;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          competency: string;
          rating: "Exceeding" | "Meeting" | "Approaching" | "Below";
          evidence_urls?: string[] | null;
          teacher_notes?: string | null;
          assessed_by: string;
          assessed_at?: string | null;
          term: string;
          year: number;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          competency?: string;
          rating?: "Exceeding" | "Meeting" | "Approaching" | "Below";
          evidence_urls?: string[] | null;
          teacher_notes?: string | null;
          assessed_by?: string;
          assessed_at?: string | null;
          term?: string;
          year?: number;
        };
        Relationships: [];
      };
      results_844: {
        Row: {
          id: string;
          student_id: string;
          subject: string;
          score: number;
          grade: string;
          term: string;
          year: number;
          created_by: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject: string;
          score: number;
          grade: string;
          term: string;
          year: number;
          created_by: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject?: string;
          score?: number;
          grade?: string;
          term?: string;
          year?: number;
          created_by?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      fee_structures: {
        Row: {
          id: string;
          grade_level: string;
          day_or_boarding: "day" | "boarding";
          amount: number;
          year: number;
          term: string;
          created_by: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          grade_level: string;
          day_or_boarding: "day" | "boarding";
          amount: number;
          year: number;
          term: string;
          created_by: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          grade_level?: string;
          day_or_boarding?: "day" | "boarding";
          amount?: number;
          year?: number;
          term?: string;
          created_by?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          due_date: string | null;
          description: string | null;
          status: "pending" | "partial" | "paid" | "overdue";
          created_by: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          amount: number;
          due_date?: string | null;
          description?: string | null;
          status?: "pending" | "partial" | "paid" | "overdue";
          created_by: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          amount?: number;
          due_date?: string | null;
          description?: string | null;
          status?: "pending" | "partial" | "paid" | "overdue";
          created_by?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          amount: number;
          method: "cash" | "bank_transfer" | "mpesa" | "cheque";
          reference_number: string | null;
          paid_by: string | null;
          recorded_by: string;
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          amount: number;
          method: "cash" | "bank_transfer" | "mpesa" | "cheque";
          reference_number?: string | null;
          paid_by?: string | null;
          recorded_by: string;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          amount?: number;
          method?: "cash" | "bank_transfer" | "mpesa" | "cheque";
          reference_number?: string | null;
          paid_by?: string | null;
          recorded_by?: string;
          notes?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          target_roles: string[] | null;
          target_grades: string[] | null;
          priority: "low" | "normal" | "high" | "urgent";
          posted_by: string;
          expires_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          target_roles?: string[] | null;
          target_grades?: string[] | null;
          priority?: "low" | "normal" | "high" | "urgent";
          posted_by: string;
          expires_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          target_roles?: string[] | null;
          target_grades?: string[] | null;
          priority?: "low" | "normal" | "high" | "urgent";
          posted_by?: string;
          expires_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      announcement_reads: {
        Row: {
          id: string;
          announcement_id: string;
          user_id: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          announcement_id: string;
          user_id: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          announcement_id?: string;
          user_id?: string;
          read_at?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          subject: string | null;
          body: string;
          read_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          subject?: string | null;
          body: string;
          read_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          subject?: string | null;
          body?: string;
          read_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
