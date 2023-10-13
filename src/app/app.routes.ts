import { Routes } from "@angular/router";

import { HomeComponent } from './home';
import { LoginComponent } from './account';
import { authGuard } from './_helpers';

const usersRoutes = () => import('./users/users.routes').then(x => x.USERS_ROUTES);
const booksRoutes = () => import('./book/books.routes').then(x => x.BOOKS_ROUTES);
const studentsRoutes = () => import('./student/students.routes').then(x => x.STUDENTS_ROUTES);
const categorysRoutes = () => import('./category/categorys.routes').then(x => x.CATEGORYS_ROUTES);
const authorsRoutes = () => import('./author/authors.routes').then(x => x.AUTHORS_ROUTES);
const publishersRoutes = () => import('./publisher/publishers.routes').then(x => x.PUBLISHERS_ROUTES);
const courseRoutes = () => import('./course/course.routes').then(x => x.COURSE_ROUTES);
const employeeRoutes = () => import('./employee/employee.routes').then(x => x.EMPLOYEE_ROUTES);
const borrow_recordRoutes = () => import('./borrow_record/borrow_record.routes').then(x => x.BORROW_RECORD_ROUTES);

export const APP_ROUTES: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'users', loadChildren: usersRoutes, canActivate: [authGuard] },
    { path: 'account/login', component: LoginComponent },

    { path: 'categorys', loadChildren: categorysRoutes, canActivate: [authGuard] },

    { path: 'authors', loadChildren: authorsRoutes, canActivate: [authGuard] },

    { path: 'publishers', loadChildren: publishersRoutes, canActivate: [authGuard] },

    { path: 'course', loadChildren: courseRoutes, canActivate: [authGuard] },

    { path: 'books', loadChildren: booksRoutes, canActivate: [authGuard] },

    { path: 'students', loadChildren: studentsRoutes, canActivate: [authGuard] },

   { path: 'employee', loadChildren: employeeRoutes, canActivate: [authGuard] },

   { path: 'borrow_record', loadChildren: borrow_recordRoutes, canActivate: [authGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];