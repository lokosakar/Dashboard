// src/store/useUIStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  
  // Kalau nanti mau nambahin fitur ganti tema (walau default dark mode)
  theme: 'dark',
  setTheme: (newTheme) => set({ theme: newTheme }),
}));