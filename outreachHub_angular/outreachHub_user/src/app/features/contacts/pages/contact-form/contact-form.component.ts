import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContact } from '../../model/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() contact: IContact | null = null;
  @Output() save = new EventEmitter<IContact>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && !changes['contact'].firstChange) {
      this.initForm();
    }
  }

  private initForm() {
  this.form = this.fb.group({
    name: [this.contact?.name || '', Validators.required],
    phoneNumber: [this.contact?.phoneNumber || ''], // not required
    tags: this.fb.array(this.contact?.tags?.map(tag => this.fb.control(tag)) || [])
  });
}


  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  addTag(input: HTMLInputElement) {
  const raw = (input.value || '').trim();
  if (raw) {
    // Split on comma and spaces
    const parts = raw.split(/[\s,]+/).filter(Boolean);
    for (const p of parts) {
       if (!p.includes(' ')){
      this.tags.push(this.fb.control(p));
       }
    }
    input.value = '';
  }
}
onTagKeydown(event: KeyboardEvent, input: HTMLInputElement) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    this.addTag(input);
  }
}



  removeTag(index: number) {
    this.tags.removeAt(index);
  }

 // called by form (ngSubmit) and also bound to Save button click as a fallback
  onSubmit() {
    if (!this.form) return console.warn('Form not initialized');
    if (this.form.invalid) {
      // optional: mark touched to show validation
      this.form.markAllAsTouched();
      return;
    }

    // build payload: ensure tags is string[]
    const payload: IContact = {
      ...this.form.value,
      tags: this.tags.controls.map(c => c.value)
    };

    console.log('[ContactForm] onSubmit payload:', payload);
    this.save.emit(payload);
  }

  onCancel() {
    this.cancel.emit();
  }
}
