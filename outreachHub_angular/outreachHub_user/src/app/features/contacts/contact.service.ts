import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { debounceTime, switchMap, catchError, tap, map } from 'rxjs/operators';
import { AppConfig } from '../../config';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IContact, IPaginatedResponse } from './model/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl = `${AppConfig.apiUrl}/contacts`;

  // subjects for components to consume
  private contactsSubject = new BehaviorSubject<IContact[]>([]);
  public contacts$ = this.contactsSubject.asObservable();

  private metaSubject = new BehaviorSubject<{ total: number; page: number; limit: number }>({
    total: 0,
    page: 1,
    limit: 10,
  });
  public meta$ = this.metaSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<any>(null);
  public error$ = this.errorSubject.asObservable();

  // search + filter stream (debounced)
  private searchTrigger$ = new Subject<{ q?: string; tags?: string[]; page?: number; limit?: number }>();

  constructor(private http: HttpClient, private workspaceService: WorkspaceService) {
    // subscribe search stream, debounce then fetch
    this.searchTrigger$
      .pipe(
        debounceTime(300),
        switchMap((params) =>
          // switchMap -> cancel previous fetch if a new one comes in
          this.fetchContacts(params.page ?? 1, params.limit ?? 10, params.q ?? '', params.tags ?? [])
        )
      )
      .subscribe({
        next: () => {
          /* fetchContacts handles updating subjects */
        },
        error: (err) => {
          console.error('Search fetch error', err);
        },
      });
  }

  // ---------- helper: get workspace id or throw ----------
  private getWorkspaceIdOrThrow(): string {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId) {
      throw new Error('No workspace selected');
    }
    return wsId;
  }

  private checkWritable(): void {
    const ws = this.workspaceService.getWorkspace();
    if (ws?.role === 'Viewer') {
      throw new Error('Insufficient permissions: Viewer cannot modify contacts.');
    }
  }

  // ---------- fetch contacts (internal) ----------
  // returns an observable for use in components/test; also updates subjects
  fetchContacts(
  page = 1,
  limit = 10,
  q = '',
  tags: string[] = []
): Observable<IPaginatedResponse<IContact>> {
  const workspaceId = this.getWorkspaceIdOrThrow();
  this.loadingSubject.next(true);
  this.errorSubject.next(null);

  // 🔹 Build query params
  let params = new HttpParams()
    .set('page', String(page))
    .set('limit', String(limit));

  if (q?.trim()) params = params.set('q', q.trim());
  if (tags?.length) params = params.set('tags', tags.join(','));

  const url = `${this.baseUrl}/byWorkspace/${workspaceId}`;

  return this.http.get<any>(url, { params }).pipe(
    tap((res) => {
      if (Array.isArray(res)) {
        // backend returned plain array
        this.contactsSubject.next(res);
        this.metaSubject.next({ total: res.length, page, limit });
      } else {
        // backend returned paginated response
        this.contactsSubject.next(res.data || []);
        this.metaSubject.next({
          total: res.total ?? 0,
          page: res.page ?? page,
          limit: res.limit ?? limit,
        });
      }
      this.loadingSubject.next(false);
    }),
    catchError((err) => {
      this.loadingSubject.next(false);
      this.errorSubject.next(err);
      return throwError(() => err);
    })
  );
}

  // ---------- public load helper (invoked by UI) ----------
  // triggers the debounced fetch (good for user typing search)
  loadContacts(params: { page?: number; limit?: number; q?: string; tags?: string[] } = {}) {
    this.searchTrigger$.next(params);
  }

  // ---------- get by id ----------
  getContactById(id: string): Observable<IContact> {
    if (!id) return throwError(() => new Error('id required'));
    return this.http.get<IContact>(`${this.baseUrl}/${id}`).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  // ---------- create ----------
  createContact(contact: IContact): Observable<IContact> {
    this.checkWritable();
    const workspaceId = this.getWorkspaceIdOrThrow();
    const body = { ...contact, workspaceId };
    return this.http.post<IContact>(`${this.baseUrl}`, body).pipe(
      tap((created) => {
        // optimistic: push into current list front (or re-fetch)
        const current = this.contactsSubject.value.slice();
        current.unshift(created);
        this.contactsSubject.next(current);
        // update total
        const meta = this.metaSubject.value;
        this.metaSubject.next({ ...meta, total: meta.total + 1 });
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  // ---------- update ----------
  updateContact(id: string, contact: IContact): Observable<IContact> {
    this.checkWritable();
    const workspaceId = this.getWorkspaceIdOrThrow();
    const body = { ...contact, workspaceId };
    return this.http.patch<IContact>(`${this.baseUrl}/${id}`, body).pipe(
      tap((updated) => {
        // replace in current list if present
        const items = this.contactsSubject.value.slice();
        const idx = items.findIndex((c) => c._id === id);
        if (idx > -1) {
          items[idx] = updated;
          this.contactsSubject.next(items);
        }
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  // ---------- delete ----------
  deleteContact(id: string): Observable<void> {
    this.checkWritable();
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const items = this.contactsSubject.value.slice().filter((c) => c._id !== id);
        this.contactsSubject.next(items);
        // update meta total
        const meta = this.metaSubject.value;
        this.metaSubject.next({ ...meta, total: Math.max(0, meta.total - 1) });
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  // ---------- utility: refresh current page ----------
  refreshCurrentPage(): void {
    const meta = this.metaSubject.value;
    this.loadContacts({ page: meta.page, limit: meta.limit });
  }

}
