'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  createMunicipalityLogin,
  type MunicipalityActionState,
} from '@/app/biblioteca/admin/(dashboard)/municipios/actions';

const initialState: MunicipalityActionState = { error: null, success: false };

const fieldClasses =
  'w-full px-4 py-2.5 rounded-bib-md text-sm bg-white border border-bib-border-light text-bib-text-light-primary placeholder:text-bib-text-light-muted focus:outline-none focus:ring-2 focus:ring-bib-blue/30 focus:border-transparent transition-shadow';

export function CreateMunicipalityForm() {
  const [state, formAction, pending] = useActionState(createMunicipalityLogin, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white rounded-bib-lg border border-bib-border-light p-6 space-y-4 max-w-xl"
    >
      <h2 className="text-sm font-semibold text-bib-text-light-secondary">Novo login de município</h2>

      <div>
        <label htmlFor="municipality-name" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Nome do município
        </label>
        <div className="relative">
          <Building2 size={16} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-bib-text-light-muted" />
          <input id="municipality-name" name="municipality_name" required className={`${fieldClasses} pl-11`} />
        </div>
      </div>

      <div>
        <label htmlFor="municipality-email" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          E-mail de acesso
        </label>
        <div className="relative">
          <Mail size={16} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-bib-text-light-muted" />
          <input id="municipality-email" name="email" type="email" required className={`${fieldClasses} pl-11`} />
        </div>
      </div>

      <div>
        <label htmlFor="municipality-password" className="block text-sm font-medium text-bib-text-light-secondary mb-1.5">
          Senha inicial
        </label>
        <div className="relative">
          <Lock size={16} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-bib-text-light-muted" />
          <input
            id="municipality-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className={`${fieldClasses} pl-11 pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-bib-text-light-muted hover:text-bib-text-light-primary transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {state.error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-bib-md text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.success && !state.error && (
        <div className="px-4 py-3 bg-bib-teal/10 border border-bib-teal/30 rounded-bib-md text-sm text-bib-teal">
          Login criado com sucesso.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-bib-md transition-colors text-sm disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #FE6509, #FF8A3D)' }}
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        {pending ? 'Criando...' : 'Criar login'}
      </button>
    </form>
  );
}
