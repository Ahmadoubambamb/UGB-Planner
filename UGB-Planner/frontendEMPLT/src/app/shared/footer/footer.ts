// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-footer',
//   imports: [],
//   templateUrl: './footer.html',
//   styleUrl: './footer.css',
// })
// export class Footer {

// }
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.html'
})
export class Footer {
  anneeActuelle = new Date().getFullYear();
}