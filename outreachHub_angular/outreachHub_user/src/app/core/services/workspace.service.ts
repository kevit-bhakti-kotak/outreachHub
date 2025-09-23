import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface NormalizedWorkspace {
  workspaceId: string;
  name?: string;
  role?: 'Editor' | 'Viewer' | string;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private selectedWorkspaceSubject = new BehaviorSubject<NormalizedWorkspace | null>(null);
  selectedWorkspace$ = this.selectedWorkspaceSubject.asObservable();

  constructor() {
    const raw = localStorage.getItem('selectedWorkspace');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.selectedWorkspaceSubject.next(this.normalize(parsed));
      } catch {
        localStorage.removeItem('selectedWorkspace');
      }
    }
  }

  // Normalize many possible shapes into a simple object
  private normalize(input: any): NormalizedWorkspace | null {
    if (!input) return null;

    // If it's already normalized
    if (input.workspaceId && typeof input.workspaceId === 'string') {
      return {
        workspaceId: input.workspaceId,
        name: input.name ?? undefined,
        role: input.role ?? undefined
      };
    }

    // If workspaceId is an object { _id, name }
    if (input.workspaceId && typeof input.workspaceId === 'object') {
      return {
        workspaceId: (input.workspaceId._id || input.workspaceId.id).toString(),
        name: input.workspaceId.name ?? input.name ?? undefined,
        role: input.role ?? undefined
      };
    }

    // If the input itself looks like a workspace doc { _id, name }
    if (input._id) {
      return {
        workspaceId: input._id.toString(),
        name: input.name ?? undefined,
        role: input.role ?? undefined
      };
    }

    // If input is a raw id string
    if (typeof input === 'string') {
      return { workspaceId: input };
    }

    return null;
  }

  setWorkspace(raw: any) {
    const ws = this.normalize(raw);
    if (!ws) return;
    localStorage.setItem('selectedWorkspace', JSON.stringify(ws));
    this.selectedWorkspaceSubject.next(ws);
  }

  getWorkspace(): NormalizedWorkspace | null {
    return this.selectedWorkspaceSubject.value;
  }

  getWorkspaceId(): string | null {
    return this.getWorkspace()?.workspaceId ?? null;
  }

  getWorkspaceName(): string | null {
    return this.getWorkspace()?.name ?? null;
  }

  getRole(): string | null {
    return this.getWorkspace()?.role ?? null;
  }

  clearWorkspace() {
    localStorage.removeItem('selectedWorkspace');
    this.selectedWorkspaceSubject.next(null);
  }
}