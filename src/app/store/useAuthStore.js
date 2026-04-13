import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, 
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'sb-secure-vault', // Samarin namanya biar keren
      storage: createJSONStorage(() => ({
        // Fungsi rahasia pas NGE-SAVE data
        setItem: (name, value) => {
          const encoded = btoa(encodeURIComponent(value)); // Ubah JSON jadi teks acak
          localStorage.setItem(name, encoded);
        },
        // Fungsi rahasia pas NGAMBIL data
        getItem: (name) => {
          const value = localStorage.getItem(name);
          if (!value) return null;
          try {
            return decodeURIComponent(atob(value)); // Balikin lagi ke JSON
          } catch (e) {
            return null; // Kalau di-hack/dijailin, anggep kosong
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);