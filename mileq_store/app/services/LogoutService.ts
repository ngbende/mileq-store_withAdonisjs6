// app/services/LogoutService.ts
// app/services/logout_service.ts
export default class LogoutService {
  /**
   * Génère la modal HTML complète avec script
   */
  static getLogoutModal(): string {
    return `
<!-- Logout Confirmation Modal -->
<div id="logoutModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
    <div class="p-6">
      <div class="flex items-center justify-center mb-4">
        <div class="bg-red-100 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.874-.833-2.644 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>
      
      <h3 class="text-xl font-semibold text-gray-900 text-center mb-2">Confirmer la déconnexion</h3>
      <p class="text-gray-600 text-center mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
      
      <div class="flex space-x-3">
        <button type="button" id="logoutModalCancel" class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
          Annuler
        </button>
        <form id="logoutForm" method="POST" action="/admin/logout" class="flex-1">
          <input type="hidden" name="_csrf" value="">
          <button type="submit" id="logoutModalConfirm" class="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

<script>
// Logout Modal Module
const LogoutModal = {
  init() {
    this.modal = document.getElementById('logoutModal');
    this.cancelBtn = document.getElementById('logoutModalCancel');
    this.confirmBtn = document.getElementById('logoutModalConfirm');
    this.form = document.getElementById('logoutForm');
    
    if (!this.modal) {
      console.warn('Logout modal not found');
      return;
    }
    
    // Récupérer le token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken && this.form) {
      this.form.querySelector('input[name="_csrf"]').value = csrfToken;
    }
    
    // Événements
    this.cancelBtn.addEventListener('click', () => this.hide());
    
    // Fermer avec Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.hide();
      }
    });
    
    // Fermer en cliquant à l'extérieur
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
    
    // Prévenir la double soumission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        this.confirmBtn.disabled = true;
        this.confirmBtn.textContent = 'Déconnexion...';
      });
    }
  },
  
  show() {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.cancelBtn.focus();
  },
  
  hide() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
};

// Initialiser quand le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LogoutModal.init());
} else {
  LogoutModal.init();
}

// Exposer globalement
window.LogoutModal = LogoutModal;
</script>
`
  }
}