import { useEffect } from 'react';
import toast from 'react-hot-toast';

export type Flash = { message: string; type: string } | null | undefined;

export default function useCustomToast(flash: Flash) {
  useEffect(() => {
    if (!flash) return;
    if (flash.type === 'success') toast.success(flash.message);
    if (flash.type === 'error') toast.error(flash.message);
  }, [flash]);
}
