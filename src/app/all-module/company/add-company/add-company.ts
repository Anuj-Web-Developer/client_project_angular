import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../Service/company-service';
import { CompanyModel } from '../Model/company-model';
import { ToastrService } from 'ngx-toastr';
import { Route, Router, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { ProjectService } from '../../project/Service/project-service';
import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { forkJoin, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-company',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './add-company.html',
  styleUrl: './add-company.css',
})
export class AddCompany implements OnInit, AfterViewInit {

  basicInfo: boolean = true;
  billingInfo: boolean = false;

  companyData: CompanyModel = {
    userName: '',
    mobile: '',
    email: '',
    designation: '',
    companyName: '',
    companyAddress: '',
    billingAddress: '',
    gstno: '',
    companyPhone: '',
    website: '',
    // signature: null,
    // logo: null
  };

  companyLogo!: File;
  signature!: File;
  logoUrl!: string;
  signatureUrl!: string;

  @ViewChild('signatureCanvas')
  signatureCanvas!: ElementRef<HTMLCanvasElement>;

  signaturePad!: SignaturePad;

  backendErrors: { [key: string]: string } = {};

  ngAfterViewInit(): void {
    // Try immediately; if the canvas is inside a hidden tab, retry shortly after.
    this.initSignaturePad();
  }

  ngOnInit(): void {
    this.getCompany();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private companyService: CompanyService,
    private toast: ToastrService,
    private router: Router,
    private projectServ: ProjectService
  ) { }

  // ********************** Initialize Signature Pad *************************************
  private initSignaturePad(): void {
    if (this.signaturePad) {
      return; // already initialized
    }
    if (!this.signatureCanvas) {
      // Canvas not in DOM yet (e.g. hidden tab) — retry on next tick.
      setTimeout(() => this.initSignaturePad(), 0);
      return;
    }

    const canvas = this.signatureCanvas.nativeElement;
    this.resizeCanvas(canvas);
    this.signaturePad = new SignaturePad(canvas);
  }

  private resizeCanvas(canvas: HTMLCanvasElement): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();

    // Fallback in case the canvas isn't visible yet and has zero size
    const width = rect.width || canvas.width || 500;
    const height = rect.height || canvas.height || 180;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(ratio, ratio);
    }
  }

  private getSignatureToUpload(): File | null {
    if (this.signature) {
      return this.signature;                              // 1. uploaded file wins
    }
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      return this.getSignatureFile();                     // 2. otherwise the drawn pad
    }
    return null;                                          // 3. otherwise upload nothing
  }

  addCompany() {

    this.companyService.saveCompanyService(this.companyData).subscribe({
      next: (response) => {
        const companyId = response.id;
        if (this.companyLogo) {
          this.saveFile(this.companyLogo, companyId, "logoName");
        }
        const signatureFile = this.getSignatureToUpload();
        if (signatureFile) {
          this.saveFile(signatureFile, companyId, "singnatureName");
        }
        

        this.router.navigate(["/company"]);
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 400) {
          this.billingInfo = true;
          this.basicInfo = false;
          this.backendErrors = JSON.parse(err.error);
          console.log('backendErrors:', this.backendErrors);

          this.cdr.detectChanges();
        } else if (err.status === 403) {
          console.log(err);
          this.toast.error(err.error);
          this.cdr.detectChanges();
        }
      }
    });
  }



  // ******************************** Add File ******************************************
  public saveFile(file: File, companyId: number, attachmentType: string) {
    this.companyService.saveFile(file, companyId, attachmentType).subscribe({
      next: (response) => {
        console.log(response);
        this.toast.success(response);
      },
      error: (err) => {
        console.log(err);
        this.toast.error("Something went wrong");
      }
    });
  }



  getCompany() {
    this.companyService.getFirstCompanyInfoService().subscribe({
      next: (response) => {
        this.companyData = response;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          this.toast.error(err.error);
        }
        console.log(err);
      }
    });
  }

  // ******************* Select Logo *****************************
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.companyLogo = input.files[0];
    }
  }

  // ******************* Select Signature *****************************
  onSignatureFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.signature = input.files[0];
    }
  }

  // ********************** Clear Signature *************************************
  clearSignature(): void {
    this.signaturePad?.clear();
  }

  // ********************** Convert Signature to File *************************************
  getSignatureFile(): File {
    const dataUrl = this.signaturePad.toDataURL('image/png');
    const byteString = atob(dataUrl.split(',')[1]);
    const array = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      array[i] = byteString.charCodeAt(i);
    }
    return new File(
      [array],
      'signature.png',
      {
        type: 'image/png'
      }
    );
  }


  showBasicInfo() {
    this.basicInfo = true;
    this.billingInfo = false;
    this.cdr.detectChanges();
    this.initSignaturePad();
  }

  showBillingInfo() {
    this.billingInfo = true;
    this.basicInfo = false;
    this.cdr.detectChanges();
    this.initSignaturePad();
  }

}
