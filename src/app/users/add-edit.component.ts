import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { first, map, startWith } from 'rxjs/operators';

import { AccountService, RoleService } from '@app/_services';
import { Status } from '@app/_helpers/enums/status';
import { AlertService } from '@app/_components/alert/alert.service';
import { Observable } from 'rxjs';
import { Role } from '@app/_models/role';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({ 
    templateUrl: 'add-edit.component.html',
    styleUrls: ['add-edit.component.css'],
    standalone: true,
    imports: [
        NgIf, ReactiveFormsModule, NgClass, CommonModule, RouterLink,
        MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
        MatSelectModule, MatAutocompleteModule
    ]
})
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;
    username = '';

    roles!:Role[];
    filteredOptionsRole!: Observable<Role[]>;

    options = {
        autoClose: true,
        keepAfterRouteChange: true
    };

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private RoleService: RoleService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            status: [Status.ENABLED, Validators.required],
            // password only required in add mode
            password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]]
        });
        this.loadRoles();
        this.title = 'Add User';
        if (this.id) {
            // edit mode
            this.title = 'Edit User';
            this.loading = true;
            this.username = this.form.get('username')?.value;
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
       /** Role filter */
       this.filteredOptionsRole = this.form.get('role')!.valueChanges.pipe(
        startWith(''),
        map(value => {
            const role = typeof value === 'string' ? value : value?.role;
            return role ? this._listfilterRole(role as string) : this.roles?.slice();
        }),
    );
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        
        this.submitting = true;
        this.saveUser()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User saved', this.options);
                    this.router.navigateByUrl('/users');
                },
                error: error => {
                    this.alertService.error(error, this.options);
                    this.submitting = false;
                }
            })
    }

    private saveUser() {
        // create or update user based on id param
        return this.id
            ? this.accountService.update(this.id!, this.form.value)
            : this.accountService.register(this.form.value);
    }
    /** Roles */
    loadRoles(){
        this.RoleService.getAllEnabled().subscribe(roles => {
            this.roles = roles;
        })
    }

    private _listfilterRole(role: string): Role[] {
        const filterValue = role.toLowerCase();
        return this.roles?.filter(option => option.role?.toLowerCase().includes(filterValue));
    }

    displayFnRole(role: Role): string {
        return role && role.role ? role.role : '';
    }

    //restrick the number
    onKeypressnumber(event: KeyboardEvent) {
        const charCode = event.charCode;
        if (/[0-9]/.test(String.fromCharCode(charCode))) {
          event.preventDefault();
        }
      }

}