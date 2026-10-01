// Ganti dengan ID spreadsheet "ucapan pernikahan" (salin dari URL, jangan diketik ulang)
const SHEET_ID = "TEMPEL_ID_SPREADSHEET_DI_SINI";

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

// Mengembalikan 50 ucapan terbaru (nama + isi saja) untuk ditampilkan di undangan
function doGet() {
  try {
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Ucapan");
    let wishes = [];
    if (sh && sh.getLastRow() > 1) {
      const last = sh.getLastRow();
      const start = Math.max(2, last - 49);
      wishes = sh.getRange(start, 2, last - start + 1, 2).getValues()
        .map(r => ({ name: String(r[0]), text: String(r[1]) }))
        .filter(w => w.name && w.text)
        .reverse(); // terbaru di atas
    }
    return json_({ ok: true, wishes: wishes });
  } catch (err) {
    console.error("doGet gagal: " + err);
    return json_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const isWish = data.type === "wish";
    const name = isWish ? "Ucapan" : "RSVP";
    const sh = ss.getSheetByName(name) || ss.insertSheet(name);

    if (sh.getLastRow() === 0) {
      sh.appendRow(isWish ? ["Waktu", "Nama", "Ucapan"]
                          : ["Waktu", "Nama", "Kehadiran", "Jumlah Tamu", "Pesan"]);
    }

    if (isWish) {
      const nama = String(data.name || "").trim().slice(0, 60);
      const teks = String(data.text || "").trim().slice(0, 500);
      if (!nama || !teks) return json_({ ok: false, error: "kosong" });

      // Cegah dobel: nama + isi sama dengan baris terakhir dalam 60 detik
      const last = sh.getLastRow();
      if (last > 1) {
        const r = sh.getRange(last, 1, 1, 3).getValues()[0];
        if (r[1] === nama && r[2] === teks && (new Date() - new Date(r[0])) < 60000) {
          return json_({ ok: true, duplicate: true });
        }
      }
      sh.appendRow([new Date(), nama, teks]);
    } else {
      sh.appendRow([new Date(), data.name, data.status, data.guests, data.message]);
    }

    return json_({ ok: true });
  } catch (err) {
    console.error("doPost gagal: " + err);
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
