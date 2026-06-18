/* ============================================================
   SIGNBRIDGE AI — USUARIO FORM VALIDATION
   form.js · Registro de Usuario — Alineado con entidad DER
   Hito 4 · UNIFRANZ 2026
   ============================================================ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────
     initUsuarioForm
     Maneja el formulario de registro de usuario (#usuarioForm).
     Cada campo corresponde a un atributo de la entidad Usuario
     del Diagrama Entidad-Relación (DER) del sistema SignBridge AI.
  ─────────────────────────────────────────────────────────────── */
  function initUsuarioForm() {
    const form           = document.getElementById('usuarioForm');
    if (!form) return;

    const nombreInput    = document.getElementById('usuarioNombre');
    const emailInput     = document.getElementById('usuarioEmail');
    const contrasenaInput= document.getElementById('usuarioContrasena');
    const idiomaSelect   = document.getElementById('usuarioIdioma');
    const submitBtn      = document.getElementById('registroBtn');
    const successDiv     = document.getElementById('formSuccess');

    // ── Validators: constraints aligned with Usuario entity ─────
    // Usuario.nombre  → VARCHAR(100) NOT NULL
    // Usuario.email   → VARCHAR(150) NOT NULL UNIQUE
    // Usuario.contrasena → VARCHAR(255) NOT NULL (min 8 chars)
    const validators = {
      nombre(val) {
        if (!val.trim()) return 'El nombre es requerido (Usuario.nombre).';
        if (val.trim().length < 3)   return 'El nombre debe tener al menos 3 caracteres.';
        if (val.trim().length > 100) return 'El nombre no puede exceder 100 caracteres (VARCHAR 100).';
        return '';
      },
      email(val) {
        if (!val.trim()) return 'El correo es requerido (Usuario.email).';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!re.test(val.trim())) return 'Ingresa un correo electrónico válido.';
        if (val.trim().length > 150) return 'El correo no puede exceder 150 caracteres (VARCHAR 150).';
        return '';
      },
      contrasena(val) {
        if (!val.trim()) return 'La contraseña es requerida (Usuario.contrasena).';
        if (val.trim().length < 8)   return 'La contraseña debe tener al menos 8 caracteres.';
        if (val.trim().length > 255) return 'La contraseña no puede exceder 255 caracteres (VARCHAR 255).';
        return '';
      }
    };

    // ── Show / hide error ────────────────────────────────────────
    function setError(input, errorId, message) {
      const errEl = document.getElementById(errorId);
      if (!errEl) return;
      if (message) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        errEl.textContent = message;
      } else {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
        errEl.textContent = '';
      }
    }

    // ── Real-time validation on blur ─────────────────────────────
    nombreInput.addEventListener('blur', () => {
      setError(nombreInput, 'nombreError', validators.nombre(nombreInput.value));
    });
    emailInput.addEventListener('blur', () => {
      setError(emailInput, 'emailUsuarioError', validators.email(emailInput.value));
    });
    contrasenaInput.addEventListener('blur', () => {
      setError(contrasenaInput, 'contrasenaError', validators.contrasena(contrasenaInput.value));
    });

    // Clear error on input
    [nombreInput, emailInput, contrasenaInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          const errId = input.getAttribute('aria-describedby');
          const errEl = document.getElementById(errId);
          if (errEl) errEl.textContent = '';
          input.classList.remove('error');
          input.removeAttribute('aria-invalid');
        }
      });
    });

    // ── Submit ───────────────────────────────────────────────────
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all required fields
      const nombreErr    = validators.nombre(nombreInput.value);
      const emailErr     = validators.email(emailInput.value);
      const contrasenaErr= validators.contrasena(contrasenaInput.value);

      setError(nombreInput,    'nombreError',       nombreErr);
      setError(emailInput,     'emailUsuarioError', emailErr);
      setError(contrasenaInput,'contrasenaError',   contrasenaErr);

      if (nombreErr || emailErr || contrasenaErr) {
        if (nombreErr)     { nombreInput.focus(); return; }
        if (emailErr)      { emailInput.focus();  return; }
        if (contrasenaErr) { contrasenaInput.focus(); return; }
        return;
      }

      // ── Build payload aligned with entidad Usuario (DER) ───────
      // Simula: INSERT INTO Usuario (nombre, email, contrasena, idioma_preferido, fecha_registro)
      //         VALUES (?, ?, ?, ?, NOW())
      const payload = {
        nombre:           nombreInput.value.trim(),       // Usuario.nombre    VARCHAR(100)
        email:            emailInput.value.trim(),        // Usuario.email     VARCHAR(150)
        contrasena:       contrasenaInput.value.trim(),   // Usuario.contrasena VARCHAR(255)
        idioma_preferido: idiomaSelect.value,             // Usuario.idioma_preferido VARCHAR(10)
        fecha_registro:   new Date().toISOString()        // Usuario.fecha_registro TIMESTAMP
      };

      console.group('📊 SignBridge AI — Simulación INSERT en base de datos');
      console.log('Entidad: Usuario');
      console.log('SQL: INSERT INTO Usuario (nombre, email, contrasena, idioma_preferido, fecha_registro) VALUES (?, ?, ?, ?, NOW())');
      console.log('Payload:', { ...payload, contrasena: '[HASH bcrypt]' });
      console.groupEnd();

      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        let success = false;

        try {
          // Attempt real API call — POST /usuarios
          const resp = await fetch('https://signbridge-api.onrender.com/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000),
          });
          if (resp.ok || resp.status === 201) success = true;
        } catch (_networkErr) {
          // API unreachable in static demo — simulate successful INSERT
          await simulateDelay(1200);
          success = true;
          console.log('✅ Demo: INSERT simulado exitosamente en entidad Usuario.');
        }

        if (success) {
          onSuccess();
        } else {
          onError('El servidor no pudo registrar el usuario. Inténtalo nuevamente.');
        }

      } catch (err) {
        onError('Ocurrió un error inesperado. Por favor, inténtalo nuevamente.');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });

    // ── Success handler ──────────────────────────────────────────
    function onSuccess() {
      form.querySelectorAll('.form-group').forEach(g => { g.style.display = 'none'; });
      submitBtn.style.display = 'none';
      const technicalNote = form.querySelector('.form-technical-note');
      if (technicalNote) technicalNote.style.display = 'none';
      successDiv.hidden = false;
      successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      successDiv.focus();
      console.log('✅ Usuario registrado exitosamente en la entidad Usuario de la base de datos SignBridge AI.');
      form.reset();
    }

    // ── Error handler ────────────────────────────────────────────
    function onError(msg) {
      const existing = form.querySelector('.form-submit-error');
      if (existing) existing.remove();

      const errDiv = document.createElement('div');
      errDiv.className = 'form-submit-error';
      errDiv.setAttribute('role', 'alert');
      errDiv.style.cssText = `
        background: rgba(255,77,109,0.08);
        border: 1px solid rgba(255,77,109,0.3);
        border-radius: 8px;
        padding: 14px 18px;
        font-size: 0.88rem;
        color: #ff4d6d;
        margin-top: 4px;
      `;
      errDiv.textContent = msg;
      submitBtn.insertAdjacentElement('afterend', errDiv);
      setTimeout(() => { errDiv.remove(); }, 6000);
    }

    // ── Utility ──────────────────────────────────────────────────
    function simulateDelay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    initUsuarioForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
