
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  test_date: string;
  responses: string; // JSON string of responses
  results: string; // JSON string of results
  created_at: string;
}

export interface Certificate {
  id: string;
  certificate_id: string;
  user_id: string;
  name_on_certificate: string;
  test_result_id: string;
  created_at: string;
  verified: boolean;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      test_results: {
        Row: TestResult;
        Insert: Omit<TestResult, 'id' | 'created_at'>;
        Update: Partial<Omit<TestResult, 'id' | 'created_at'>>;
      };
      certificates: {
        Row: Certificate;
        Insert: Omit<Certificate, 'id' | 'created_at'>;
        Update: Partial<Omit<Certificate, 'id' | 'created_at'>>;
      };
    };
  };
}
