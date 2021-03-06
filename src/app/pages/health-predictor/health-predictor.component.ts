import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HealthPredictorService } from '../../services/health-predictor/health-predictor.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-health-predictor',
  templateUrl: './health-predictor.component.html',
  styleUrls: ['./health-predictor.component.scss']
})
export class HealthPredictorComponent implements OnInit {
  items;
  checkoutForm; 
  submitted = false;
  isHeartOK: Boolean;
  loading = false;

  @ViewChild('dialog', {static: false}) resultDialog;

  constructor(private dialogService: NbDialogService, private formBuilder: FormBuilder,
     private healthPredictor: HealthPredictorService, private toastrService: NbToastrService) {
    this.checkoutForm = this.formBuilder.group({
      age: ['', Validators.required],
      sex: ['', Validators.required],
      cp: ['', Validators.required],
      trestbps: ['', Validators.required],
      chol: ['', Validators.required],
      fbs: ['', Validators.required],
      restecg: ['', Validators.required],
      thalach: ['', Validators.required],
      exang: ['', Validators.required],
      oldpeak: ['', [Validators.required, Validators.pattern('([0-9]|10)')]],
      slope: ['', [Validators.required, Validators.pattern('[0-1]')]],
      ca: ['', [Validators.required, Validators.pattern('([1-9]|10)')]],
      thal: ['', [Validators.required, Validators.pattern('(3|7|6)')]],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if (this.checkoutForm.invalid) {
      return;
    }
     this.loading = true;
     this.healthPredictor.getHeartPredictorResult(this.checkoutForm.value).
     subscribe((response: any) => {
      if (response.Status === 200) {
        this.dialogService.open(this.resultDialog, { hasScroll: true });
        this.isHeartOK = !!response.Result;
        this.checkoutForm.reset();
        this.submitted = false;
        }
    }, error => {
      this.toastrService.show('Some Error occurred please try after sometime', 'Error!', { status: 'danger' }); 
      }).add(() => {  this.loading = false; });
  }

  // convenience getter for easy access to form fields
  get f() { return this.checkoutForm.controls; }
}
