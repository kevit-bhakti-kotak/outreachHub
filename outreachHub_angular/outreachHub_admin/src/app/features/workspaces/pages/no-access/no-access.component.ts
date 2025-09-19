import { Component } from '@angular/core';

@Component({
  selector: 'app-no-access',
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-[var(--oh-surface)] overflow-hidden">
      <div class="text-center p-10 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        <h1 class="text-3xl font-bold text-[var(--oh-primary-dark)] mb-4">
          Access Denied
        </h1>
        <p class="text-[var(--oh-text-2)] mb-6">
          You do not have rights to access this workspace.
        </p>
      </div>
    </div>
  `
})
export class NoAccessComponent {}
