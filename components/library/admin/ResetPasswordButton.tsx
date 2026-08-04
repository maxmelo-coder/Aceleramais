'use client';

import { useActionState, useState } from 'react';
import { KeyRound, Loader2, X, Check } from 'lucide-react';
import {
  resetMunicipalityPassword,
  type MunicipalityActionState,
} from '@/app/biblioteca/admin/(dashboard)/municipios/actions';

const initialState: MunicipalityActionState = { error: null, success: false };

export function ResetPasswordButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const boundAction = resetMunicipalityPassword.bind(null, userId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-bib-teal hover:text-bib-blue font-medium text-sm transition-colors"
      >
        <KeyRound size={13} aria-hidden="true" />
        Resetar senha
      </button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-2 justify-end">
      <input
        name="password"
        type="text"
        required
        minLength={8}
        placeholder="Nova senha (mín. 8)"
        aria-label="Nova senha"
        className="px-3 py-1.5 rounded-bib-sm text-xs bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-blue/30 focus:border-transparent transition-shadow"
      />
      <button
        type="submit"
        disabled={pending}
        aria-label="Salvar nova senha"
        className="flex items-center justify-center w-7 h-7 rounded-bib-sm text-white disabled:opacity-60 transition-colors"
        style={{ background: 'linear-gradient(135deg, #FE6509, #FF8A3D)' }}
      >
        {pending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Cancelar"
        className="flex items-center justify-center w-7 h-7 rounded-bib-sm text-bib-text-light-muted hover:text-bib-text-light-primary hover:bg-bib-gray-bg transition-colors"
      >
        <X size={13} />
      </button>
      {state.error && <span className="text-xs text-red-500">{state.error}</span>}
      {state.success && !state.error && <span className="text-xs text-bib-teal">Senha atualizada.</span>}
    </form>
  );
}
