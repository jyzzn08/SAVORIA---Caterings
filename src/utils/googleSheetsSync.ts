import { CustomerOrder, BahanBaku, Resep, Product } from '../types';

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================
 * SAVORIA CATERING MANAGEMENT SYSTEM — GOOGLE APPS SCRIPT
 * ==============================================================
 * Script ini otomatis mengelola database catering Anda di Google Sheets:
 * - Tab "Pesanan" : Menyimpan seluruh pesanan pelanggan
 * - Tab "Bahan_Baku": Menyimpan inventaris & status stok bahan
 * - Tab "Resep"   : Menyimpan resep masakan & HPP per porsi
 * - Tab "Menu"    : Menyimpan katalog menu catering & harga jual
 * 
 * CARA DEPLOY UNTUK PEMULA:
 * 1. Di Google Sheets, klik menu: Extensions > Apps Script
 * 2. Hapus semua teks di editor, lalu Tempel (Paste) seluruh kode ini.
 * 3. Klik ikon Simpan (Save).
 * 4. Klik tombol "Deploy" di kanan atas > "New deployment"
 * 5. Klik ikon gear (Select type) > pilih "Web app"
 * 6. Isi:
 *    - Description: "Savoria Catering API v1"
 *    - Execute as: "Me (<email-anda>)"
 *    - Who has access: "Anyone" (PENTING agar aplikasi web bisa mengirim data)
 * 7. Klik "Deploy", lalu klik "Authorize access" dan pilih akun Google Anda.
 * 8. Salin "Web app URL" (akhiran /exec) dan tempel ke Aplikasi Savoria!
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Koneksi Savoria Catering ke Google Sheets Berhasil Aktif!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action || 'sync_all';

    // 1. Simpan / Perbarui Pesanan
    if (postData.orders && postData.orders.length > 0) {
      syncPesananSheet(ss, postData.orders);
    }

    // 2. Simpan / Perbarui Bahan Baku
    if (postData.bahanBaku && postData.bahanBaku.length > 0) {
      syncBahanBakuSheet(ss, postData.bahanBaku);
    }

    // 3. Simpan / Perbarui Resep
    if (postData.resep && postData.resep.length > 0) {
      syncResepSheet(ss, postData.resep);
    }

    // 4. Simpan / Perbarui Menu
    if (postData.products && postData.products.length > 0) {
      syncMenuSheet(ss, postData.products);
    }

    // 5. Simpan / Perbarui Pengguna (Akun Login & Register)
    if (postData.users && postData.users.length > 0) {
      syncPenggunaSheet(ss, postData.users);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Seluruh data berhasil disinkronkan ke Google Sheets!',
      syncedAt: new Date().toLocaleString('id-ID')
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// ---------------- Helper Tab: Pesanan ----------------
function syncPesananSheet(ss, orders) {
  var sheet = ss.getSheetByName('Pesanan') || ss.insertSheet('Pesanan');
  
  // Format Header jika masih kosong
  if (sheet.getLastRow() === 0) {
    var headers = ['No Order', 'Nama Acara', 'Klien', 'Kontak', 'Tanggal Acara', 'Jam', 'Pax', 'Status', 'Total Biaya', 'Alamat Venue', 'Kota', 'Metode Bayar', 'Menu Dipesan'];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#EFEBE9');
    sheet.setFrozenRows(1);
  }

  // Tambah baris pesanan
  orders.forEach(function(o) {
    var menuSummary = o.items.map(function(i) {
      return i.product.name + ' (' + i.quantity + ' ' + i.product.unit + ')';
    }).join('; ');

    sheet.appendRow([
      o.orderNumber,
      o.eventTitle,
      o.contactName,
      o.contactPhone,
      o.eventDate,
      o.eventTime,
      o.guestCount,
      o.statusLabel || o.status,
      o.total,
      o.deliveryAddress,
      o.deliveryCity,
      o.paymentMethod,
      menuSummary
    ]);
  });
}

// ---------------- Helper Tab: Bahan Baku ----------------
function syncBahanBakuSheet(ss, bahanList) {
  var sheet = ss.getSheetByName('Bahan_Baku') || ss.insertSheet('Bahan_Baku');
  sheet.clear();

  var headers = ['Kode Bahan', 'Nama Bahan', 'Kategori', 'Stok Saat Ini', 'Satuan', 'Batas Min Stok', 'Harga Beli/Satuan', 'Status Stok', 'Lokasi Gudang', 'Supplier'];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#EFEBE9');
  sheet.setFrozenRows(1);

  bahanList.forEach(function(b) {
    sheet.appendRow([
      b.kodeBahan,
      b.nama,
      b.kategori,
      b.stokSaatIni,
      b.satuan,
      b.stokMinimum,
      b.hargaSatuan,
      b.status.toUpperCase(),
      b.lokasiPenyimpanan,
      b.supplier
    ]);
  });
}

// ---------------- Helper Tab: Resep ----------------
function syncResepSheet(ss, resepList) {
  var sheet = ss.getSheetByName('Resep') || ss.insertSheet('Resep');
  sheet.clear();

  var headers = ['Kode Resep', 'Nama Menu', 'Kategori', 'Batch Porsi', 'HPP Total Batch', 'HPP / Porsi', 'Harga Jual', 'Margin %', 'Waktu Masak (Mnt)', 'Komposisi Bahan', 'Tips Chef'];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#EFEBE9');
  sheet.setFrozenRows(1);

  resepList.forEach(function(r) {
    var bahanSummary = r.bahanList.map(function(bi) {
      return bi.namaBahan + ': ' + bi.jumlah + ' ' + bi.satuan;
    }).join(' | ');

    sheet.appendRow([
      r.kodeResep,
      r.namaMenu,
      r.kategori,
      r.porsiStandar + ' ' + r.satuanPorsi,
      r.totalBiayaBahan,
      r.biayaPerPorsi,
      r.hargaJualPerPorsi,
      r.marginPersen + '%',
      r.waktuPersiapanMenit,
      bahanSummary,
      r.tipsChef
    ]);
  });
}

// ---------------- Helper Tab: Menu ----------------
function syncMenuSheet(ss, products) {
  var sheet = ss.getSheetByName('Menu') || ss.insertSheet('Menu');
  sheet.clear();

  var headers = ['ID', 'Nama Menu', 'Kategori', 'Harga', 'Satuan', 'Min Order', 'Lead Time', 'Rating'];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#EFEBE9');
  sheet.setFrozenRows(1);

  products.forEach(function(p) {
    sheet.appendRow([
      p.id,
      p.name,
      p.categoryLabel,
      p.price,
      p.unit,
      p.minOrder,
      p.preparationTime,
      p.rating
    ]);
  });
}

// ---------------- Helper Tab: Pengguna ----------------
function syncPenggunaSheet(ss, users) {
  var sheet = ss.getSheetByName('Pengguna') || ss.insertSheet('Pengguna');
  sheet.clear();

  var headers = ['ID Pengguna', 'Nama Lengkap', 'Email', 'Role Akun', 'Nomor WhatsApp', 'Perusahaan / Instansi', 'Tanggal Daftar', 'Status'];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#EFEBE9');
  sheet.setFrozenRows(1);

  users.forEach(function(u) {
    sheet.appendRow([
      u.id,
      u.name,
      u.email,
      u.role ? u.role.toUpperCase() : 'CUSTOMER',
      u.phone || '-',
      u.companyOrEvent || '-',
      u.createdAt || new Date().toLocaleDateString('id-ID'),
      u.status ? u.status.toUpperCase() : 'ACTIVE'
    ]);
  });
}
`;

export interface SyncPayload {
  action: 'sync_all' | 'sync_orders' | 'sync_inventory' | 'sync_users' | 'sync_menu';
  orders?: CustomerOrder[];
  bahanBaku?: BahanBaku[];
  resep?: Resep[];
  products?: Product[];
  users?: any[];
}

export async function sendDataToGoogleSheets(
  webAppUrl: string,
  payload: SyncPayload
): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('https://script.google.com')) {
    return {
      success: false,
      message: 'URL Google Apps Script tidak valid. Pastikan dimulai dengan https://script.google.com/macros/s/...',
    };
  }

  try {
    // In Google Apps Script Web Apps, standard cross-origin POST with redirect
    // can be sent using mode: 'no-cors' or text/plain body to prevent CORS preflight blockage.
    await fetch(webAppUrl.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Data berhasil dikirimkan ke Google Sheets Anda!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal terhubung ke Google Apps Script Web App.',
    };
  }
}
