import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDbService } from '../../services/indexeddb.service';
import { EditDialogComponent } from '../../components/edit-dialog/edit-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {

  constructor(
    private indexedDbService: IndexedDbService,
    public dialog: MatDialog,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  displayedColumns: string[] = ['id', 'name', 'position', 'actions'];
  dataSource = new MatTableDataSource<any>();
  isLoggedIn = false;

  async ngOnInit(): Promise<void> {
    const employees = await this.indexedDbService.getAllFromTable('employees');
    this.dataSource.data = employees;

    this.isLoggedIn = await this.authService.isLoggedIn$.pipe(first()).toPromise();
    this.cdr.detectChanges();
    console.log('Giriş durumu:', this.isLoggedIn);
  }

  async deleteEmployee(id: number): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      position: { left: '30%', top: '-30%'},

    });
    

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.indexedDbService.deleteData('employees', id);
          const employees = await this.indexedDbService.getAllFromTable('employees');
          this.dataSource.data = employees;
          console.log(`Employee with ID ${id} deleted successfully`);
        } catch (error) {
          console.error('Error deleting employee:', error);
        }
      } else {
        console.log('Silme işlemi iptal edildi');
      }
    });
  }

  editEmployee(employee: any): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      position: { left: '30%', top: '-30%'},
      data: { storeName: 'employees', value: { ...employee } }, 
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.indexedDbService.update('employees', result.id, result);
        const employees = await this.indexedDbService.getAllFromTable('employees');
        this.dataSource.data = employees;
      }
    });
  }
}
