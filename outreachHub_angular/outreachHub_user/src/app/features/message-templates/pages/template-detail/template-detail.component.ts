// template-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageTemplate } from '../../model/message-template.model';
import { MessageTemplateService } from '../../message-template.service';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
})
export class TemplateDetailComponent implements OnInit {
  template?: MessageTemplate;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MessageTemplateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.get(id).subscribe((res: any) => (this.template = res));
  }

  goBack() {
    this.router.navigate(['/message-templates']);
  }
}
