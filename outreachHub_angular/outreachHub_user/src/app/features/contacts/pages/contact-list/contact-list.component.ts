import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from '../../contact.service';
import { IContact } from '../../model/contact.model';

import { WorkspaceService } from '../../../../core/services/workspace.service'; 
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: IContact[] = [];
  loading = false;
  error: string | null = null;
  Math = Math;

  // pagination
  page = 1;
  limit = 5;
  total = 0;

  
  // search
  searchText = '';

  private subs = new Subscription();

  selectedContact: IContact | null = null;
  showForm = false;
  currentUserId: string | null = null;

  constructor(
    private contactService: ContactService,
    private workspaceService: WorkspaceService,
     private authService: AuthService   // 👈 inject here
  ) {}
  ngOnInit(): void {
    // subscribe to current user (if your authService exposes currentUser$)
    this.subs.add(
      this.authService.currentUser$.subscribe(u => {
        // u might be null or an object; try to extract id
        this.currentUserId = this.normalizeId(u?._id ?? u?.id ?? u?.userId ?? u);
        // console.debug('currentUserId set to', this.currentUserId);
      })
    );

    // fallback if currentUser$ is not yet populated - also try localStorage (safe)
    if (!this.currentUserId) {
      const raw = localStorage.getItem('user');
      if (raw) {
        try {
          const u = JSON.parse(raw);
          this.currentUserId = this.normalizeId(u?._id ?? u?.id ?? u?.userId ?? u);
        } catch {}
      }
    }

    // existing data subscriptions
    this.subs.add(this.contactService.contacts$.subscribe(c => (this.contacts = c)));
    this.subs.add(this.contactService.loading$.subscribe(l => (this.loading = l)));
    this.subs.add(this.contactService.error$.subscribe(e => (this.error = e ? e.message || 'Error' : null)));
    this.subs.add(this.contactService.meta$.subscribe(m => {
      this.page = m.page;
      this.limit = m.limit;
      this.total = m.total;
    }));


    // 🔹 Watch workspace changes
    this.subs.add(
      this.workspaceService.selectedWorkspace$.subscribe(ws => {
        if (ws) {
          console.log('🔄 Workspace switched:', ws.workspaceId);
          this.page = 1; // reset to first page
          this.contactService.loadContacts({ page: this.page, limit: this.limit });
        } else {
          this.contacts = [];
          this.total = 0;
        }
      })
    );

    // Initial load
    this.contactService.loadContacts({ page: this.page, limit: this.limit });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  private normalizeId(val: any): string | null {
  if (!val) return null;

  if (typeof val === 'string') {
    return val;
  }

  if (typeof val === 'object') {
    // If it's already populated { _id: '...' }
    if ('_id' in val) return String((val as any)._id);

    // If it's a Mongoose ObjectId
    if (typeof (val as any).toHexString === 'function') {
      return (val as any).toHexString();
    }

    // Fallback (rare)
    return String(val);
  }

  return String(val);
}


 //Returns true if the logged-in user owns the contact

isOwner(contact: any): boolean {
  if (!contact) return false;

  const createdBy = this.normalizeId(contact.createdBy);
  const me = this.normalizeId(this.currentUserId);

  return !!(createdBy && me && createdBy === me);
}
  onSearch(q: string) {
    this.searchText = q;
    this.contactService.loadContacts({ page: 1, limit: this.limit, q });
  }

  onPageChange(next: boolean) {
    const newPage = next ? this.page + 1 : this.page - 1;
    if (newPage < 1 || newPage > Math.ceil(this.total / this.limit)) return;
    this.contactService.loadContacts({ page: newPage, limit: this.limit, q: this.searchText });
  }

 onCreate() {
  console.log('Create clicked');
  this.selectedContact = null;
  this.showForm = true;
}

onEdit(contact: IContact) {
   console.log('Edit clicked:', contact);
  this.selectedContact = contact;
  this.showForm = true;
}

onFormSave(payload: IContact) {
  console.log('[ContactsList] onFormSave payload:', payload, 'selectedContact:', this.selectedContact);

  if (this.selectedContact && this.selectedContact._id) {
    // update
    this.contactService.updateContact(this.selectedContact._id, payload).subscribe({
      next: (updated) => {
        console.log('Contact updated', updated);
        this.showForm = false;
        this.contactService.refreshCurrentPage();
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Update failed: ' + (err?.message ?? err?.statusText ?? 'Unknown'));
      }
    });
  } else {
    // create
    this.contactService.createContact(payload).subscribe({
      next: (created) => {
        console.log('Contact created', created);
        this.showForm = false;
        // either refresh or optimistic add handled by service
        this.contactService.refreshCurrentPage();
      },
      error: (err) => {
        console.error('Create failed', err);
        alert('Create failed: ' + (err?.message ?? err?.statusText ?? 'Unknown'));
      }
    });
  }
}

onFormCancel() {
  this.showForm = false;
}

  onDelete(contact: IContact) {
    if (!confirm(`Delete ${contact.name}?`)) return;
    this.contactService.deleteContact(contact._id!).subscribe({
      next: () => this.contactService.refreshCurrentPage(),
      error: (err) => alert('Delete failed: ' + err?.message)
    });
  }
}
