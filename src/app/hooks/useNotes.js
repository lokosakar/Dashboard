// src/hooks/useNotes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../lib/axiosInstance'; // pastikan path ini bener sesuai struktur lu
import { useAuthStore } from '../store/useAuthStore';
import { message } from 'antd';

export const useNotes = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // 1. GET: Ambil semua notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await axiosInstance.get(`/notes?userId=${user.id}`);
      return res.data.data;
    },
    enabled: !!user?.id, 
  });

  // 2. POST: Tambah Note Baru
  const createNote = useMutation({
    mutationFn: async (newNote) => {
      const res = await axiosInstance.post('/notes', { ...newNote, userId: user.id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']); // Refresh list otomatis
      message.success('Note berhasil dibuat!');
    },
  });

  // 3. PUT: Update Note
  const updateNote = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosInstance.put(`/notes/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']); 
      message.success('Note berhasil diupdate!');
    },
  });

  // 4. DELETE: Hapus Note
  const deleteNote = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/notes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']); 
      message.success('Note berhasil dihapus!');
    },
  });

  return {
    notes,
    isLoading,
    createNote: createNote.mutateAsync,
    updateNote: updateNote.mutateAsync, // Export fungsi update
    deleteNote: deleteNote.mutateAsync, // Export fungsi delete
  };
};