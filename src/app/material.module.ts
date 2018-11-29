import {NgModule} from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatGridListModule, MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule, MatSidenavModule, MatTabsModule, MatToolbarModule,
    MatAutocompleteModule, MatChipsModule, MatFormFieldModule
} from '@angular/material';

@NgModule({
    imports: [MatMenuModule, MatSidenavModule, MatToolbarModule, MatTabsModule, MatDialogModule, MatListModule,
        MatButtonModule, MatIconModule, MatCardModule, MatDatepickerModule, MatInputModule, MatProgressSpinnerModule, MatCheckboxModule,
        MatGridListModule, MatAutocompleteModule, MatChipsModule, MatFormFieldModule],
    exports: [MatMenuModule, MatSidenavModule, MatToolbarModule, MatTabsModule, MatDialogModule, MatListModule,
        MatButtonModule, MatIconModule, MatCardModule, MatDatepickerModule, MatInputModule, MatProgressSpinnerModule, MatCheckboxModule,
        MatGridListModule, MatAutocompleteModule, MatChipsModule, MatFormFieldModule],
})

export class MaterialModule {
}
