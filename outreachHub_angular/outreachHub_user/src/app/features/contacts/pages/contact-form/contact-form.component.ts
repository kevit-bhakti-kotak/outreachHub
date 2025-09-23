import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContact } from '../../model/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() contact: IContact | null = null;
  @Output() save = new EventEmitter<IContact>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && !changes['contact'].firstChange) {
      this.buildForm();
    }
  }

  /** Build or rebuild form with provided contact data */
  private buildForm(): void {
    this.form = this.fb.group({
      name: [this.contact?.name ?? '', Validators.required],
      phoneNumber: [this.contact?.phoneNumber ?? ''],
      tags: this.fb.array(
        (this.contact?.tags ?? []).map(tag => this.fb.control(tag))
      ),
    });
  }

  /** Tags form array accessor */
  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  /** Add tag(s) from input */
  addTag(input: HTMLInputElement): void {
    const raw = (input.value || '').trim();
    if (!raw) return;

    const parts = raw.split(/[\s,]+/).filter(Boolean);

    for (const tag of parts) {
      if (!tag.includes(' ') && !this.tags.value.includes(tag)) {
        this.tags.push(this.fb.control(tag));
      }
    }

    input.value = '';
  }

  /** Handle Enter or comma key for tag input */
  onTagKeydown(event: KeyboardEvent, input: HTMLInputElement): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag(input);
    }
  }

  /** Remove tag by index */
  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  /** Save form and emit contact payload */
  onSubmit(): void {
    if (!this.form) {
      console.warn('Form not initialized');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: IContact = {
      ...this.form.value,
      tags: this.tags.value as string[],
    };

    console.log('[ContactForm] Submit payload:', payload);
    this.save.emit(payload);
  }

  /** Cancel form */
  onCancel(): void {
    this.cancel.emit();
  }
}
