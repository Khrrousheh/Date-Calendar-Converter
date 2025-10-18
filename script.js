function calculateResults(event) {
  event.preventDefault();
  const birthDateInput = document.getElementById("birthdate").value;

  if (!birthDateInput) return;

  const birthDate = new Date(birthDateInput);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  gregorianDates(birthDate);
  hijriDates(birthDate);
  hebrewDates(birthDate);
}

function gregorianDates(date) {
  const p = document.createElement("p");
  p.textContent = `Gregorian: ${date.toDateString()}`;
  document.getElementById("results").appendChild(p);
}

function hijriDates(date) {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const hijri = jdToHijri(jd);

  const p = document.createElement("p");
  p.textContent = `Hijri (approx.): ${hijri.day} / ${hijri.month} / ${hijri.year} AH`;
  document.getElementById("results").appendChild(p);
}

function hebrewDates(date) {
  const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const hebrew = jdToHebrew(jd);

  const p = document.createElement("p");
  p.textContent = `Hebrew (approx.): ${hebrew.day} / ${hebrew.month} / ${hebrew.year}`;
  document.getElementById("results").appendChild(p);
}

// ========== Calendar Conversion Helpers ==========

// Convert Gregorian date to Julian Day
function gregorianToJD(y, m, d) {
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) +
         Math.floor(30.6001 * (m + 1)) +
         d + B - 1524.5;
}

// Approximate Hijri date from JD
function jdToHijri(jd) {
  const islamicEpoch = 1948439.5;
  const days = Math.floor(jd - islamicEpoch);
  const year = Math.floor((30 * days + 10646) / 10631);
  const firstDayOfYear = hijriToJD(year, 1, 1);
  const month = Math.ceil((jd - firstDayOfYear + 1) / 29.5);
  const day = Math.floor(jd - hijriToJD(year, month, 1) + 1);
  return { day, month, year };
}

function hijriToJD(year, month, day) {
  return 354 * (year - 1) +
         Math.floor((3 + 11 * year) / 30) +
         29.5 * (month - 1) +
         day + 1948439.5 - 1;
}

// Simplified Hebrew conversion
function jdToHebrew(jd) {
  const gregDate = new Date((jd - 2440587.5) * 86400000);
  const gYear = gregDate.getUTCFullYear();
  const hYear = gYear + 3760;

  const approxMonth = ((jd % 354) / 29.5) | 0;
  const approxDay = Math.floor((jd % 29.5) + 1);

  return {
    year: hYear,
    month: approxMonth || 1,
    day: approxDay || 1
  };
}
