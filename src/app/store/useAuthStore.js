import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // INI KUNCI RAHASIANYA

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Defaultnya kosong
      
      // Fungsi buat masukin data user pas login
      login: (userData) => set({ user: userData }),
      
      // Fungsi buat ngapus data pas logout
      logout: () => set({ user: null }),
    }),
    {
      name: 'secondbrain-auth', // Nama folder di dalam browser buat nyimpen data lu
    }
  )
);