import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }
  onSignup() {
    this.loading = true;

    let successMsg = ''; // ✅ AJOUT OBLIGATOIRE (cause de ton erreur)

    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;

    this.auth
      .createUser(email, password)
      .pipe(
        tap((res: any) => {
          // Ici, res.message contient "Utilisateur créé !"
          successMsg = res.message || 'Inscription réussie !';
        }),
        switchMap(() => this.auth.loginUser(email, password)),
        tap(() => {
          this.loading = false;
          this.router.navigate(['/sauces']);
        }),
        catchError((error) => {
          this.loading = false;

          if (error.status === 400) {
            // 1️⃣ Message clair envoyé par le backend
            if (error.error?.message) {
              this.errorMsg = error.error.message;

              // 2️⃣ Email déjà utilisé (mongoose-unique-validator – cas 1)
            } else if (error.error?.errors?.email) {
              this.errorMsg = 'Adresse email déjà utilisée';

              // 3️⃣ Email déjà utilisé (mongoose-unique-validator – cas 2)
            } else if (error.error?.error?.errors?.email) {
              this.errorMsg = 'Adresse email déjà utilisée';

              // 4️⃣ Fallback
            } else {
              this.errorMsg = 'Erreur lors de l’inscription';
            }
          } else {
            this.errorMsg = 'Une erreur est survenue';
          }

          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          if (successMsg) {
            alert(successMsg);
          }
        },
      });
  }
}
