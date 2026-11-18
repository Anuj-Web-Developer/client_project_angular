import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

import { ReportService } from '../Service/report-service';
import { LoginInfo } from '../Model/login-info';
import { Userlist } from '../../user/Service/userlist';
import { UserListModel } from '../../user/Model/userlistmodel';
import { UserNameList } from '../Model/user-name-list';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-login-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-history.html',
  styleUrl: './login-history.css',
})
export class LoginHistory implements OnInit {

  // LOGIN HISTORY

  loginInfo: LoginInfo[] = [];

  // FILTER

  loginUsername: string = '';
  fromDate: string = '';
  toDate: string = '';

  // USERS

  username: UserNameList[] = [];

  // LOGIN USER

  role: string = '';
  user: string = '';
  local_user: any;

  // TABLE VISIBILITY

  isVisible: boolean = true;

  constructor(
    private service: ReportService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private userServ: Userlist
  ) { }

  // ON INIT

  ngOnInit(): void {

    // Get user list
    this.getUsernameList();

  }

  // FILTER

  filter(): void {

    // Username + both dates
    if (
      this.loginUsername &&
      this.fromDate &&
      this.toDate
    ) {

      this.searchFilteredLog();
    }

    // Username only
    else if (
      this.loginUsername &&
      !this.fromDate &&
      !this.toDate
    ) {

      this.searchFilteredLog();
    }

    // Both dates but no username
    else if (
      this.fromDate &&
      this.toDate &&
      !this.loginUsername
    ) {

      this.searchFilteredLog();
    }

    // Only one date selected
    else if (
      this.fromDate ||
      this.toDate
    ) {

      this.toast.info(
        'Please select both From Date and To Date'
      );
    }

    // Nothing selected
    else {

      this.toast.info(
        'Please select filter'
      );
    }
  }

  // SEARCH LOGIN HISTORY

  searchFilteredLog() {

    this.service
      .getFilteredLoginInfo(
        this.loginUsername,
        this.fromDate,
        this.toDate
      )
      .subscribe({

        next: (response) => {

          this.loginInfo = response ?? [];

          console.log(
            'Login History:',
            this.loginInfo
          );

          this.isVisible =
            this.loginInfo.length > 0;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(
            'Login history error:',
            err
          );

          this.loginInfo = [];

          this.isVisible = false;

          this.toast.error(
            'Unable to load login history'
          );

          this.cdr.detectChanges();
        }
      });
  }

  // GET USER LIST

  getUsernameList() {
    this.service.getListOfUserService().subscribe({

      next: (response) => {

        if (Array.isArray(response)) {
          this.username = response ?? [];
        } else {
          this.username = [response];
        }

        console.log(this.username);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(
          'User list error:', err);
        this.username = [];
        this.toast.error(err?.error || 'Unable to load users');
      }
    });
  }

  // ============================================================
  // DOWNLOAD EXCEL
  // ============================================================




async downloadExcel(): Promise<void> {

  // ============================================
  // CHECK DATA
  // ============================================

  if (!this.loginInfo || this.loginInfo.length === 0) {
    this.toast.info('No login history available to download.');
    return;
  }

  // ============================================
  // CREATE WORKBOOK
  // ============================================

  const workbook = new Workbook();

  workbook.creator = 'Billing Application';
  workbook.lastModifiedBy = 'Billing Application';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Login History', {
    properties: { tabColor: { argb: '2F75B5' }, defaultRowHeight: 20 },
    views: [{ showGridLines: false, zoomScale: 100 }]
  });

  // ============================================
  // PAGE SETTINGS
  // ============================================

  worksheet.pageSetup = {
    orientation: 'landscape',
    paperSize: 9,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalDpi: 300,
    verticalDpi: 300,
    margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 }
  };

  // ============================================
  // COLUMN DEFINITIONS
  // ============================================

  worksheet.columns = [
    { key: 'srNo', width: 8 },
    { key: 'username', width: 24 },
    { key: 'loginLogs', width: 50 },
    { key: 'loginTime', width: 22 },
    { key: 'role', width: 16 },
    { key: 'ipAddress', width: 18 },
    { key: 'browser', width: 20 },
    { key: 'os', width: 16 },
    { key: 'hostName', width: 24 }
  ];

  // ============================================
  // TITLE BANNER (no emoji — plain text only)
  // ============================================

  worksheet.mergeCells('A1:I1');
  const title = worksheet.getCell('A1');
  title.value = 'LOGIN HISTORY REPORT';
  title.font = { name: 'Calibri', size: 22, bold: true, color: { argb: 'FFFFFFFF' } };
  title.alignment = { horizontal: 'center', vertical: 'middle' };
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2A4A' } };
  worksheet.getRow(1).height = 46;

  worksheet.mergeCells('A2:I2');
  const subtitle = worksheet.getCell('A2');
  subtitle.value = 'Billing Application - Security & Access Audit';
  subtitle.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'FFD9E8F5' } };
  subtitle.alignment = { horizontal: 'center', vertical: 'middle' };
  subtitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF17365D' } };
  worksheet.getRow(2).height = 22;

  // Thin accent strip under the banner
  worksheet.mergeCells('A3:I3');
  worksheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F75B5' } };
  worksheet.getRow(3).height = 6;

  // ============================================
  // KPI SUMMARY CARDS (label row + value row —
  // plain cells, no richText, no "as any" cast)
  // ============================================

  const uniqueUsers = new Set(this.loginInfo.map((l: any) => l.loginUserName)).size;
  const adminCount = this.loginInfo.filter((l: any) => l.role === 3 || l.role === 0).length;

  const kpis: [string, string, string][] = [
    ['TOTAL RECORDS', String(this.loginInfo.length), 'FFD9EAF7'],
    ['UNIQUE USERS', String(uniqueUsers), 'FFE2F0D9'],
    ['ADMIN LOGINS', String(adminCount), 'FFFCE4D6'],
    ['LAST GENERATED', new Date().toLocaleString(), 'FFFFF2CC']
  ];

  const kpiLabelRanges = ['A4:B4', 'C4:D4', 'E4:F4', 'G4:I4'];
  const kpiValueRanges = ['A5:B5', 'C5:D5', 'E5:F5', 'G5:I5'];

  kpis.forEach(([label, value, color], i) => {

    // Label cell
    worksheet.mergeCells(kpiLabelRanges[i]);
    const labelCell = worksheet.getCell(kpiLabelRanges[i].split(':')[0]);
    labelCell.value = label;
    labelCell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF595959' } };
    labelCell.alignment = { horizontal: 'center', vertical: 'middle' };
    labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    labelCell.border = {
      top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
      left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
      right: { style: 'thin', color: { argb: 'FFBFBFBF' } }
    };

    // Value cell
    worksheet.mergeCells(kpiValueRanges[i]);
    const valueCell = worksheet.getCell(kpiValueRanges[i].split(':')[0]);
    valueCell.value = value;
    valueCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF17365D' } };
    valueCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    valueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    valueCell.border = {
      bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
      left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
      right: { style: 'thin', color: { argb: 'FFBFBFBF' } }
    };
  });

  worksheet.getRow(4).height = 16;
  worksheet.getRow(5).height = 24;
  worksheet.addRow([]); // spacer row 6

  // ============================================
  // TABLE HEADER (row 7)
  // ============================================

  const headerRow = worksheet.addRow([
    'Sr.No', 'Username', 'Login Logs', 'Login Time',
    'Role', 'IP Address', 'Browser Name', 'OS Name', 'Host Name'
  ]);
  headerRow.height = 30;

  headerRow.eachCell((cell) => {
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF17365D' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F2A4A' } },
      bottom: { style: 'medium', color: { argb: 'FF0F2A4A' } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
    };
  });

  const headerRowNum = headerRow.number;

  // ============================================
  // ADD DATA
  // ============================================

  this.loginInfo.forEach((logs: any, index: number) => {

    const role = logs.role === 1 ? 'ROLE_USER' : logs.role === 2 ? 'ROLE_PM' : 'ROLE_ADMIN';

    const row = worksheet.addRow([
      index + 1, logs.loginUserName, logs.loginLogs, logs.loginTime,
      role, logs.loginIpAddress, logs.browserName, logs.osName, logs.hostName
    ]);

    row.height = 28;

    row.eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF333333' } };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE3E9F2' } },
        bottom: { style: 'thin', color: { argb: 'FFE3E9F2' } },
        left: { style: 'thin', color: { argb: 'FFE3E9F2' } },
        right: { style: 'thin', color: { argb: 'FFE3E9F2' } }
      };
    });

    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F9FD' } };
      });
    }

    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF2F75B5' } };

    row.getCell(2).font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF333333' } };

    const loginTime = logs.loginTime;
    if (loginTime) {
      const date = new Date(loginTime);
      if (!isNaN(date.getTime())) {
        row.getCell(4).value = date;
        row.getCell(4).numFmt = 'dd-mm-yyyy hh:mm:ss';
      }
    }
    row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

    // ---- Role badge styling (text label, no emoji icon) ----
    const roleCell = row.getCell(5);
    roleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const roleStyles: Record<string, { fg: string; fc: string }> = {
      ROLE_ADMIN: { fg: 'FFFCE4D6', fc: 'FFC00000' },
      ROLE_PM:    { fg: 'FFFFF2CC', fc: 'FF7F6000' },
      ROLE_USER:  { fg: 'FFE2F0D9', fc: 'FF548235' }
    };
    const rs = roleStyles[role];
    roleCell.value = role.replace('ROLE_', '');
    roleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rs.fg } };
    roleCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: rs.fc } };
    roleCell.border = {
      top: { style: 'thin', color: { argb: rs.fc } },
      bottom: { style: 'thin', color: { argb: rs.fc } },
      left: { style: 'thin', color: { argb: rs.fc } },
      right: { style: 'thin', color: { argb: rs.fc } }
    };

    row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    row.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(9).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
  });

  const lastRowNum = worksheet.lastRow!.number;

  // ============================================
  // OUTER BORDER AROUND WHOLE TABLE
  // ============================================

  for (let col = 1; col <= 9; col++) {
    worksheet.getCell(headerRowNum, col).border = {
      ...worksheet.getCell(headerRowNum, col).border,
      top: { style: 'thick', color: { argb: 'FF0F2A4A' } }
    };
    worksheet.getCell(lastRowNum, col).border = {
      ...worksheet.getCell(lastRowNum, col).border,
      bottom: { style: 'thick', color: { argb: 'FF0F2A4A' } }
    };
  }
  for (let r = headerRowNum; r <= lastRowNum; r++) {
    worksheet.getCell(r, 1).border = { ...worksheet.getCell(r, 1).border, left: { style: 'thick', color: { argb: 'FF0F2A4A' } } };
    worksheet.getCell(r, 9).border = { ...worksheet.getCell(r, 9).border, right: { style: 'thick', color: { argb: 'FF0F2A4A' } } };
  }

  // ============================================
  // FREEZE HEADER + FILTER
  // ============================================

  worksheet.views = [
    { showGridLines: false, state: 'frozen', ySplit: headerRowNum }
  ];

  worksheet.autoFilter = { from: `A${headerRowNum}`, to: `I${headerRowNum}` };

  // ============================================
  // FOOTER
  // ============================================

  worksheet.headerFooter.oddFooter =
    '&LBilling Application&CLogin History Report&RPage &P of &N';

  // ============================================
  // GENERATE + DOWNLOAD
  // ============================================

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(blob, `Login-History-${new Date().toISOString().slice(0, 10)}.xlsx`);
}























}


