import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import {
  NgForm,
  ValidationErrors,
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray
} from '@angular/forms';
import { Inspection } from '../models/inspection';

export class Product {
  id: string;
  text: string;
  expanded?: boolean;
  items?: Product[];
}

@Component({
  selector: 'app-book-inspection',
  templateUrl: './book-inspection.component.html',
  styleUrls: ['./book-inspection.component.scss']
})
export class BookInspectionComponent implements OnInit {
  @ViewChild('inspectionForm') form: NgForm;

  private productForm: NgForm;

  @ViewChild('productForm') set content(content: NgForm) {
    if (content) { // initially setter gets called with undefined
      this.productForm = content;
    }
  }

  current = 0;
  inspection: Inspection = new Inspection();
  products = [];
  submitted = false;
  dateFormat = 'dd-MM-yyyy';
  valid;
  isProductFormValid;
  currentItem;
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.products()
      .subscribe(res => {
        this.products = res.data;
        this.products.map(p => {
          p.title = p.name;
          p.expanded = true;
          p.key = p.id;
          delete p.name;
          for (let i = 0; i < p.sub_categories.length; i++) {
            p.sub_categories[i].title = p.sub_categories[i].name;
            p.sub_categories[i].key = p.sub_categories[i];
            delete p.sub_categories[i].name;

            for (let j = 0; j < p.sub_categories[i].products.length; j++) {
              p.sub_categories[i].products[j].title = p.sub_categories[i].products[j].name;
              p.sub_categories[i].products[j].key = {
                category_id: p.id,
                product_id: p.sub_categories[i].products[j].id,
                sub_category_id: p.sub_categories[i].id,
              };
              p.sub_categories[i].products[j].isLeaf = true;
              delete p.sub_categories[i].products[j].name;

            }
            p.sub_categories[i].children = p.sub_categories[i].products;
            delete p.sub_categories[i].products;
          }
          p.children = p.sub_categories;
          delete p.sub_categories;
          return p;
        });
      });
  }

  checkForm(): void {
    this.valid = this.form.valid;
    this.checkControls(Object.keys(this.form.controls).map(k => this.form.controls[k]));
  }

  checkProductForm(): void {
    this.submitted = true;
    this.isProductFormValid = this.productForm.valid;
    this.checkControls(Object.keys(this.productForm.controls).map(k => this.productForm.controls[k]));
  }

  checkControls(controls: AbstractControl[]): void {
    controls.forEach(c => {
      if (c instanceof FormControl) {
        c.markAsTouched();
        c.updateValueAndValidity();
      } else if (c instanceof FormGroup) {
        this.checkControls(Object.keys(c.controls).map(k => c.controls[k]));
      } else if (c instanceof FormArray) {
        this.checkControls(c.controls);
      }
    });
  }

  public submitInfo(): void {
    this.checkForm();
    if (this.valid) {
      this.current++;
    }
  }
  submitProduct() {
    this.checkProductForm();
    this.submitted = true;
    if (this.isProductFormValid && this.isProductTypeValid) {
      this.inspection.inspection_date = this.formatDate(this.inspection.inspection_date);
      this.inspection.shipment_date = this.formatDate(this.inspection.shipment_date);
      this.productService.createProduct(this.inspection)
        .subscribe(res => {
          this.current++;
        });
    }
  }

  goto(step) {
    if (this.current > step) {
      this.current = step;
      if (step === 1) {
        this.inspection.inspection_date = new Date(this.inspection.inspection_date);
        this.inspection.shipment_date = new Date(this.inspection.shipment_date);
      }
    }

  }
  back() {
    this.current--;
    this.inspection.inspection_date = new Date(this.inspection.inspection_date);
    this.inspection.shipment_date = new Date(this.inspection.shipment_date);
  }

  onChange(e) {
    this.inspection.product_id = e.product_id;
    this.inspection.category_id = e.category_id;
    this.inspection.sub_category_id = e.sub_category_id;
  }

  formatDate(date) {
    let newDate: any = new Date(date);
    let dd: any = newDate.getDate();

    let mm: any = newDate.getMonth() + 1;
    const yyyy = newDate.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    newDate = dd + '-' + mm + '-' + yyyy;
    return newDate;
  }

  get isProductTypeValid(): boolean {
    return !!this.inspection.product_id && !!this.inspection.category_id && !!this.inspection.sub_category_id;
  }

}
