
// Simple mock Supabase client for compatibility

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: null }),
    signInWithOAuth: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ 
      data: { subscription: { unsubscribe: () => {} } }
    }),
  },
  functions: {
    invoke: async () => ({ data: null, error: null }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    })
  },
};

// Initialize mock data
const initMockData = () => {
  // Check if we need to initialize localStorage for first time use
  if (!localStorage.getItem('dms_installed')) {
    localStorage.setItem('dms_installed', 'true');
  }
};

// Run initialization
initMockData();
