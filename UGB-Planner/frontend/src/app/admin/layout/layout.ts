import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet , RouterLink , RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
private auth = inject(AuthService);
private router = inject(Router);

goVisitor(){
 this.router.navigate(['/']);
}

logout(){
  this.auth.logout();
}


}
