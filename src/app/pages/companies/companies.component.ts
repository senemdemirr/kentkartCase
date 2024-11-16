import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDbService } from '../../services/indexeddb.service';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {

  constructor(
    private indexedDbService: IndexedDbService,
    public dialog: MatDialog,
    private authService: AuthService ,
    private cdr: ChangeDetectorRef 
    ) {}

  displayedColumns: string[] = ['id', 'name', 'location', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoggedIn = false;

  async ngOnInit(): Promise<void> {
    const companies = await this.indexedDbService.getAllFromTable('companies');
    this.dataSource.data = companies;
  
    this.isLoggedIn = await this.authService.isLoggedIn$.pipe(first()).toPromise();
    this.cdr.detectChanges();
    console.log('Giriş durumu:', this.isLoggedIn); 

  }
  async deleteCompany(id: number): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      position: { left: '30%', top: '-30%'},
    });
  
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.indexedDbService.deleteData('companies', id);
          const companies = await this.indexedDbService.getAllFromTable('companies');
          this.dataSource.data = companies;
          console.log(`Company with ID ${id} deleted successfully`);
        } catch (error) {
          console.error('Error deleting company:', error);
        }
      } else {
        console.log('Silme işlemi iptal edildi');
      }
    });
  }
  
  

  editCompany(company: any): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      position: { left: '30%', top: '-30%'},

      data: { storeName: 'companies', value: { ...company } },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.indexedDbService.update('companies', result.id, result);
        const companies = await this.indexedDbService.getAllFromTable('companies');
        this.dataSource.data = companies;
      }
    });
  }
}
