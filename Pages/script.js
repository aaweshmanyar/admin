const params = new URLSearchParams(window.location.search);
const userParam = params.get("user");

if (userParam) {
  // Replace "-" back to spaces
  const userName = userParam.replace(/-/g, " ");

  // Set name in DOM
  document.getElementById("user-name").textContent = userName;

  // Update avatar with first letter
  const firstLetter = userName.charAt(0).toUpperCase();
  document.getElementById(
    "user-avatar"
  ).src = `https://placehold.co/40x40/eff6e0/124559?text=${firstLetter}`;
}

// View , Add and Edit , delete fatawa end here
// document.addEventListener("DOMContentLoaded", async () => {
//   // DOM elements
//   const form = document.getElementById("ms-fatwa-form");
//   const tableBody = document.getElementById("ms-fatawa-table-body");
//   const manageFatawaPage = document.getElementById("ms-page-manage-fatawa");
//   const mozuwatSelect = document.getElementById("ms-fatwa-mozuwat");

//   // === Loader ===
//   const loader = document.createElement("div");
//   loader.id = "form-loader";
//   loader.className =
//     "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50";
//   loader.innerHTML = `
//     <div class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
//       <span class="loader border-4 border-midnight_green border-t-transparent rounded-full w-8 h-8 animate-spin"></span>
//       <p class="text-lg font-bold text-midnight_green">براہ کرم انتظار کریں...</p>
//     </div>
//   `;
//   document.body.appendChild(loader);
//   const showLoader = () => loader.classList.remove("hidden");
//   const hideLoader = () => loader.classList.add("hidden");

//   // === Pagination setup ===
//   const loadMoreBtn = document.createElement("button");
//   loadMoreBtn.textContent = "آگے دیکھیں";
//   loadMoreBtn.className =
//     "mt-4 bg-midnight_green text-white py-2 px-6 rounded-lg text-lg hover:bg-midnight_green-400 transition w-full md:w-auto";
//   loadMoreBtn.style.display = "none";
//   if (manageFatawaPage) manageFatawaPage.appendChild(loadMoreBtn);

//   let offset = 0;
//   const limit = 2;
//   let hasMore = true;

//   // === Mozuwat dropdown loader ===
//   const MOZUWAT_API = "https://masailworld.onrender.com/api/tags";
//   async function loadMozuwatDropdown() {
//     if (!mozuwatSelect) return;
//     mozuwatSelect.innerHTML = `<option value="">لوڈ ہو رہا ہے...</option>`;
//     try {
//       const res = await fetch(MOZUWAT_API);
//       if (!res.ok) throw new Error("Failed to fetch tags: " + res.status);
//       const data = await res.json();

//       mozuwatSelect.innerHTML = `<option value="">-- موزوٰع منتخب کریں --</option>`;

//       if (!Array.isArray(data) || data.length === 0) {
//         mozuwatSelect.innerHTML = `<option value="">(کوئی موزوٰعات دستیاب نہیں)</option>`;
//         return;
//       }

//       data.forEach((tag) => {
//         const opt = document.createElement("option");
//         // store tag.id by default. Change to tag.slug if you prefer slug.
//         opt.value = String(tag.id ?? tag.slug ?? tag.Name ?? "");
//         opt.textContent = tag.Name ?? tag.slug ?? String(tag.id ?? "");
//         mozuwatSelect.appendChild(opt);
//       });
//     } catch (err) {
//       console.error("Error loading Mozuwat tags:", err);
//       mozuwatSelect.innerHTML = `<option value="">(لوڈ کرنے میں ناکامی)</option>`;
//     }
//   }

//   // load tags first — ensures edit-prefill can set the select value reliably
//   await loadMozuwatDropdown();

//   // === Load fatawa into table ===
//   async function loadFatawa() {
//     try {
//       const res = await fetch(
//         `https://masailworld.onrender.com/api/fatwa?limit=${limit}&offset=${offset}`
//       );
//       const fatawa = await res.json();

//       if (!res.ok) {
//         console.error("❌ Error loading fatawa:", fatawa.error || fatawa);
//         return;
//       }

//       if (!Array.isArray(fatawa) || fatawa.length === 0) {
//         hasMore = false;
//         loadMoreBtn.style.display = "none";
//         return;
//       }

//       fatawa.forEach((fatwa) => {
//         const row = document.createElement("tr");
//         row.className = "border-b border-gray-200";

//         row.innerHTML = `
//           <td class="py-3 px-4">${fatwa.id}</td>
//           <td class="py-3 px-4">${fatwa.Title || "—"}</td>
//           <td class="py-3 px-4">${fatwa.muftisahab || "—"}</td>
//           <td class="py-3 px-4">${fatwa.mozuwat || "—"}</td>
//           <td class="py-3 px-4">${fatwa.tags || "—"}</td>
//           <td class="py-3 px-4">${fatwa.tafseel || "—"}</td>
//           <td class="py-3 px-4">${new Date(
//             fatwa.created_at || fatwa.createdAt || Date.now()
//           ).toLocaleDateString("ur-PK")}</td>
//           <td class="py-3 px-4 flex space-x-2 justify-end">
//             <button class="edit-btn text-green-600 hover:underline" data-id="${
//               fatwa.id
//             }">✏️</button>
//             <button class="delete-btn text-red-600 hover:underline" data-id="${
//               fatwa.id
//             }">🗑️</button>
//           </td>
//         `;
//         if (tableBody) tableBody.appendChild(row);
//       });

//       offset += fatawa.length;

//       if (fatawa.length < limit) {
//         hasMore = false;
//         loadMoreBtn.style.display = "none";
//       } else {
//         loadMoreBtn.style.display = "block";
//       }
//     } catch (err) {
//       console.error("❌ Network error:", err);
//     }
//   }

//   if (tableBody) loadFatawa();

//   loadMoreBtn.addEventListener("click", () => {
//     if (hasMore) loadFatawa();
//   });

//   // === Edit / Delete handlers ===
//   if (tableBody) {
//     tableBody.addEventListener("click", async (e) => {
//       const target = e.target;

//       // Delete
//       if (target.classList.contains("delete-btn")) {
//         const id = target.dataset.id;
//         if (!id) return;
//         if (confirm("کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟")) {
//           try {
//             const res = await fetch(
//               `https://masailworld.onrender.com/api/fatwa/${id}`,
//               {
//                 method: "DELETE",
//               }
//             );
//             const data = await res.json();

//             if (res.ok) {
//               alert("✅ فتویٰ حذف کر دیا گیا!");
//               const row = target.closest("tr");
//               if (row) row.remove();
//             } else {
//               alert("❌ Error: " + (data.error || "Failed to delete"));
//             }
//           } catch (err) {
//             console.error(err);
//             alert("❌ Network error. Please try again.");
//           }
//         }
//       }

//       // Edit
//       if (target.classList.contains("edit-btn")) {
//         const id = target.dataset.id;
//         if (!id) return;
//         try {
//           const res = await fetch(
//             `https://masailworld.onrender.com/api/fatwa/${id}`
//           );
//           const fatwa = await res.json();

//           if (!res.ok) {
//             alert("❌ Error fetching fatwa for edit");
//             return;
//           }

//           // Fill form fields
//           document.getElementById("ms-fatwa-id").value = fatwa.id ?? "";
//           document.getElementById("ms-fatwa-title").value = fatwa.Title ?? "";
//           document.getElementById("ms-fatwa-slug").value = fatwa.slug ?? "";
//           document.getElementById("ms-fatwa-keywords-input").value =
//             fatwa.tags ?? "";
//           document.getElementById("ms-fatwa-meta-description").value =
//             fatwa.tafseel ?? "";
//           document.getElementById("ms-fatwa-question").innerHTML =
//             fatwa.detailquestion ?? "";
//           document.getElementById("ms-fatwa-answer").innerHTML =
//             fatwa.Answer ?? "";
//           document.getElementById("ms-fatwa-mufti").value =
//             fatwa.muftisahab ?? "";

//           // === Prefill mozuwat ===
//           // fatwa may include mozuwat (id), mozuwat_id, mozuwatSlug, or mozuwat_name.
//           // We'll try to find the right option; if it's missing, create a temporary option.
//           if (mozuwatSelect) {
//             const valCandidates = [
//               fatwa.mozuwat,
//               fatwa.mozuwat_id,
//               fatwa.mozuwatSlug,
//               fatwa.mozuwatId, // extra fallback
//             ].filter(Boolean);

//             const candidate = valCandidates.length
//               ? String(valCandidates[0])
//               : "";

//             const setMozuwatValue = (value) => {
//               if (!value) return;
//               const exists = Array.from(mozuwatSelect.options).some(
//                 (o) => String(o.value) === String(value)
//               );
//               if (exists) {
//                 mozuwatSelect.value = String(value);
//                 return;
//               }
//               // not present in options: add temp option (show name if available)
//               const tempOpt = document.createElement("option");
//               tempOpt.value = String(value);
//               tempOpt.textContent =
//                 fatwa.mozuwat_name ??
//                 fatwa.mozuwatName ??
//                 fatwa.mozuwatDisplay ??
//                 `Tag ${value}`;
//               mozuwatSelect.appendChild(tempOpt);
//               mozuwatSelect.value = String(value);
//             };

//             // try immediately and again after a short delay in case options are still populating
//             setMozuwatValue(candidate);
//             setTimeout(() => setMozuwatValue(candidate), 200);
//           }

//           // switch to add/edit page
//           window.location.hash = "add-fatwa";
//         } catch (err) {
//           console.error(err);
//           alert("❌ Network error while fetching fatwa.");
//         }
//       }
//     });
//   }

//   // === Form submission (create or update) ===
//   if (form) {
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       showLoader();

//       const id = document.getElementById("ms-fatwa-id").value;

//       const fatwaData = {
//         Title: document.getElementById("ms-fatwa-title").value.trim(),
//         slug: document.getElementById("ms-fatwa-slug").value.trim(),
//         tags:
//           document.getElementById("ms-fatwa-keywords-input").value.trim() ||
//           null,
//         tafseel:
//           document.getElementById("ms-fatwa-meta-description").value.trim() ||
//           null,
//         detailquestion:
//           document.getElementById("ms-fatwa-question").innerHTML.trim() || null,
//         Answer:
//           document.getElementById("ms-fatwa-answer").innerHTML.trim() || null,
//         muftisahab:
//           document.getElementById("ms-fatwa-mufti").value.trim() || null,
//         // mozuwat: selected tag id OR null if none selected
//         mozuwat: (() => {
//           if (!mozuwatSelect) return null;
//           const v = mozuwatSelect.value;
//           return v === "" ? null : v;
//         })(),
//       };

//       try {
//         let res;
//         if (id) {
//           // Update existing fatwa
//           res = await fetch(
//             `https://masailworld.onrender.com/api/fatwa/${id}`,
//             {
//               method: "PUT",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(fatwaData),
//             }
//           );
//         } else {
//           // Create new fatwa
//           res = await fetch(
//             "https://masailworld.onrender.com/api/fatwa/dashboard",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(fatwaData),
//             }
//           );
//         }

//         const data = await res.json();
//         hideLoader();

//         if (res.ok) {
//           alert(
//             id
//               ? "✅ فتویٰ کامیابی سے اپڈیٹ کر دیا گیا!"
//               : "✅ فتویٰ کامیابی سے شامل کر دیا گیا!"
//           );
//           form.reset();
//           document.getElementById("ms-fatwa-id").value = "";

//           // Refresh table after a short delay
//           setTimeout(() => {
//             window.location.hash = "manage-fatawa";
//             if (tableBody) tableBody.innerHTML = "";
//             offset = 0;
//             hasMore = true;
//             loadFatawa();
//           }, 1000);
//         } else {
//           alert("❌ Error: " + (data.error || "Failed to save fatwa"));
//         }
//       } catch (err) {
//         console.error(err);
//         hideLoader();
//         alert("❌ Network error. Please try again.");
//       }
//     });
//   }
// });

document.addEventListener("DOMContentLoaded", async () => {
  // ===== DOM elements =====
  const form = document.getElementById("ms-fatwa-form"); // existing add/edit form on your other screen
  const tableBody = document.getElementById("ms-fatawa-table-body");
  const manageFatawaPage = document.getElementById("ms-page-manage-fatawa");
  const mozuwatSelect = document.getElementById("ms-fatwa-mozuwat");

  const searchInput = document.getElementById("ms-fatawa-search");
  const searchBtn = document.getElementById("ms-fatawa-search-btn");
  const suggestions = document.getElementById("ms-fatawa-suggestions");

  const paginationEl = document.getElementById("ms-fatawa-pagination");
  const bulkDeleteBtn = document.getElementById("ms-bulk-delete-btn");
  const selectAllCheckbox = document.getElementById("ms-select-all");

  // ===== API base =====
  const API_BASE = "https://masailworld.onrender.com/api";

  // ===== Loader =====
  const loader = document.createElement("div");
  loader.id = "form-loader";
  loader.className =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50";
  loader.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
      <span class="loader border-4 border-midnight_green border-t-transparent rounded-full w-8 h-8 animate-spin"></span>
      <p class="text-lg font-bold text-midnight_green">براہ کرم انتظار کریں...</p>
    </div>
  `;
  document.body.appendChild(loader);
  const showLoader = () => loader.classList.remove("hidden");
  const hideLoader = () => loader.classList.add("hidden");

  // ===== Pagination state =====
  const PAGE_SIZE = 10; // change page size here if you like
  let currentPage = 1;
  let totalItems = null; // unknown initially
  let totalPages = 1;

  // ===== Selection state (for bulk delete) =====
  const selectedIds = new Set();

  // ===== Query/search state =====
  let currentQuery = ""; // simple keyword search (applied client-side or sent to server if you wire it)

  // ===== Mozuwat dropdown loader =====
  const MOZUWAT_API = `${API_BASE}/tags`;
  async function loadMozuwatDropdown() {
    if (!mozuwatSelect) return;
    mozuwatSelect.innerHTML = `<option value="">لوڈ ہو رہا ہے...</option>`;
    try {
      const res = await fetch(MOZUWAT_API);
      if (!res.ok) throw new Error("Failed to fetch tags: " + res.status);
      const data = await res.json();

      mozuwatSelect.innerHTML = `<option value="">-- موزوٰع منتخب کریں --</option>`;

      if (!Array.isArray(data) || data.length === 0) {
        mozuwatSelect.innerHTML = `<option value="">(کوئی موزوٰعات دستیاب نہیں)</option>`;
        return;
      }

      data.forEach((tag) => {
        const opt = document.createElement("option");
        opt.value = String(tag.id ?? tag.slug ?? tag.Name ?? "");
        opt.textContent = tag.Name ?? tag.slug ?? String(tag.id ?? "");
        mozuwatSelect.appendChild(opt);
      });
    } catch (err) {
      console.error("Error loading Mozuwat tags:", err);
      mozuwatSelect.innerHTML = `<option value="">(لوڈ کرنے میں ناکامی)</option>`;
    }
  }

  await loadMozuwatDropdown();

  // ===== Try to fetch total count (optional endpoint). Fallback if missing. =====
  async function tryFetchCount() {
    try {
      const res = await fetch(`${API_BASE}/fatwa/count`);
      if (!res.ok) return null;
      const data = await res.json();
      // accept common shapes: {count: N} or a number
      const count = typeof data === "number" ? data : data?.count;
      return Number.isFinite(count) ? count : null;
    } catch {
      return null;
    }
  }

  // ===== Helpers =====
  function formatDate(value) {
    const d = new Date(value || Date.now());
    // Urdu Pakistan locale
    return d.toLocaleDateString("ur-PK", { year: "numeric", month: "short", day: "numeric" });
  }

  function resolveStatus(fatwa) {
    // handle a bunch of likely field names
    const raw =
      fatwa.status ??
      fatwa.Status ??
      fatwa.state ??
      (typeof fatwa.published !== "undefined" ? (fatwa.published ? "published" : "draft") : null) ??
      (typeof fatwa.is_published !== "undefined" ? (fatwa.is_published ? "published" : "draft") : null) ??
      null;

    const val = String(raw ?? "").toLowerCase();
    if (!val) return { text: "نامکمل", color: "bg-gray-200 text-gray-700" };
    if (["published", "active", "approved", "1", "true"].includes(val))
      return { text: "شائع", color: "bg-green-100 text-green-800" };
    if (["pending", "review", "under_review"].includes(val))
      return { text: "زیر جائزہ", color: "bg-amber-100 text-amber-800" };
    if (["rejected", "inactive"].includes(val))
      return { text: "مسترد", color: "bg-red-100 text-red-800" };
    if (["draft", "0", "false"].includes(val))
      return { text: "مسودہ", color: "bg-gray-100 text-gray-800" };

    // fallback: show the raw text
    return { text: fatwa.status ?? fatwa.Status ?? "نامعلوم", color: "bg-gray-100 text-gray-800" };
    }

  function renderPagination() {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";

    const makeBtn = (label, page, disabled = false, active = false) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className =
        "min-w-[2.5rem] px-3 py-2 rounded-md border text-sm " +
        (active
          ? "bg-midnight_green text-white border-midnight_green"
          : "bg-white border-gray-300 hover:bg-gray-50") +
        (disabled ? " opacity-50 cursor-not-allowed" : "");
      btn.disabled = disabled;
      if (!disabled) {
        btn.addEventListener("click", () => {
          if (page !== currentPage) {
            currentPage = page;
            refreshTable();
          }
        });
      }
      return btn;
    };

    // if we know total pages, build full number list; otherwise show prev/next only
    const haveTotals = Number.isFinite(totalItems) && Number.isFinite(totalPages);

    const first = makeBtn("اول", 1, currentPage === 1);
    const prev = makeBtn("پچھلا", Math.max(1, currentPage - 1), currentPage === 1);
    paginationEl.appendChild(first);
    paginationEl.appendChild(prev);

    if (haveTotals) {
      const MAX_SHOWN = 7; // compact window
      let start = Math.max(1, currentPage - 3);
      let end = Math.min(totalPages, start + MAX_SHOWN - 1);
      if (end - start < MAX_SHOWN - 1) start = Math.max(1, end - (MAX_SHOWN - 1));

      if (start > 1) {
        paginationEl.appendChild(makeBtn("1", 1, false, currentPage === 1));
        if (start > 2) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          paginationEl.appendChild(ell);
        }
      }

      for (let p = start; p <= end; p++) {
        paginationEl.appendChild(makeBtn(String(p), p, false, p === currentPage));
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          paginationEl.appendChild(ell);
        }
        paginationEl.appendChild(makeBtn(String(totalPages), totalPages, false, currentPage === totalPages));
      }
    } else {
      // If totals unknown, show a small hint
      const hint = document.createElement("span");
      hint.textContent = "مزید صفحات معلوم کیے جا رہے ہیں…";
      hint.className = "px-2 text-gray-500";
      paginationEl.appendChild(hint);
    }

    const next = makeBtn("اگلا", currentPage + 1, haveTotals ? currentPage >= totalPages : false);
    const last = makeBtn("آخری", haveTotals ? totalPages : currentPage, haveTotals ? currentPage >= totalPages : true);
    paginationEl.appendChild(next);
    paginationEl.appendChild(last);
  }

  function renderRows(fatawa) {
    tableBody.innerHTML = "";
    selectedIds.clear();
    selectAllCheckbox.checked = false;
    bulkDeleteBtn.disabled = true;

    fatawa.forEach((fatwa) => {
      const status = resolveStatus(fatwa);
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-200";

      tr.innerHTML = `
        <td class="py-3 px-4 align-middle">
          <input type="checkbox" class="ms-row-check w-5 h-5 accent-midnight_green" data-id="${fatwa.id}" />
        </td>
        <td class="py-3 px-4 align-middle">${fatwa.id}</td>
        <td class="py-3 px-4 align-middle">${fatwa.Title ?? "—"}</td>
        <td class="py-3 px-4 align-middle">${fatwa.muftisahab ?? "—"}</td>
        <td class="py-3 px-4 align-middle">
          <span class="inline-block text-sm px-2 py-1 rounded ${status.color}">${status.text}</span>
        </td>
        <td class="py-3 px-4 align-middle">${formatDate(fatwa.created_at || fatwa.createdAt)}</td>
        <td class="py-3 px-4 align-middle">
          <div class="flex items-center gap-3 justify-end">
            <button class="edit-btn text-green-700 hover:underline" data-id="${fatwa.id}" title="ترمیم">✏️</button>
            <button class="delete-btn text-red-700 hover:underline" data-id="${fatwa.id}" title="حذف">🗑️</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  async function fetchPage(page) {
    const offset = (page - 1) * PAGE_SIZE;
    const url = new URL(`${API_BASE}/fatwa`);
    url.searchParams.set("limit", PAGE_SIZE);
    url.searchParams.set("offset", offset);

    // if you have server-side search, forward the term here as well:
    if (currentQuery.trim()) url.searchParams.set("q", currentQuery.trim());

    const res = await fetch(url.toString());
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load fatawa");
    if (!Array.isArray(data)) throw new Error("Unexpected response format");
    return data;
  }

  async function refreshTotalsIfNeeded(firstPageLength) {
    if (Number.isFinite(totalItems)) return; // already known

    // Try the count endpoint first
    const count = await tryFetchCount();
    if (Number.isFinite(count)) {
      totalItems = count;
      totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      return;
    }

    // Fallback: if we got a "short" first page, we know totals
    if (firstPageLength < PAGE_SIZE) {
      totalItems = firstPageLength;
      totalPages = 1;
    } else {
      // We still don't know total. We'll do a quick probe:
      // fetch next page; if empty => total is PAGE_SIZE; if not, assume at least two pages
      try {
        const probe = await fetchPage(2);
        if (probe.length === 0) {
          totalItems = PAGE_SIZE;
          totalPages = 1; // exactly one full page
        } else {
          // Still unknown, but we can at least say there are >=2 pages.
          // We'll mark totals unknown and keep Prev/Next enabled until we hit an empty page.
          totalItems = null;
          totalPages = NaN;
        }
      } catch {
        // ignore; keep unknown
        totalItems = null;
        totalPages = NaN;
      }
    }
  }

  async function refreshTable() {
    try {
      showLoader();
      const fatawa = await fetchPage(currentPage);

      // If totals are unknown, and we navigate beyond last page, bounce back.
      if (Array.isArray(fatawa) && fatawa.length === 0 && currentPage > 1) {
        // We've gone too far; move to previous page and reload
        currentPage = currentPage - 1;
        const previous = await fetchPage(currentPage);
        await refreshTotalsIfNeeded(previous.length);
        renderRows(previous);
        renderPagination();
        hideLoader();
        return;
      }

      await refreshTotalsIfNeeded(fatawa.length);

      // If we now know totals, recompute totalPages
      if (Number.isFinite(totalItems)) {
        totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;
      }

      renderRows(fatawa);
      renderPagination();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ فتاویٰ لوڈ کرنے میں مسئلہ پیش آیا۔");
    } finally {
      hideLoader();
    }
  }

  // ===== Initial load =====
  await refreshTable();

  // ===== Row actions: edit / delete / select =====
  tableBody?.addEventListener("click", async (e) => {
    const target = e.target;

    // Delete single
    if (target.closest(".delete-btn")) {
      const id = target.closest(".delete-btn").dataset.id;
      if (!id) return;
      if (!confirm("کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟")) return;

      try {
        showLoader();
        const res = await fetch(`${API_BASE}/fatwa/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) {
          alert("❌ Error: " + (data.error || "Failed to delete"));
          return;
        }
        alert("✅ فتویٰ حذف کر دیا گیا!");
        await refreshTable();
      } catch (err) {
        console.error(err);
        alert("❌ نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
      } finally {
        hideLoader();
      }
    }

    // Edit single
    if (target.closest(".edit-btn")) {
      const id = target.closest(".edit-btn").dataset.id;
      if (!id) return;

      try {
        showLoader();
        const res = await fetch(`${API_BASE}/fatwa/${id}`);
        const fatwa = await res.json();

        if (!res.ok) {
          alert("❌ ترمیم کے لیے فتویٰ لاتے ہوئے مسئلہ ہوا۔");
          return;
        }

        // Fill form fields (existing form on add/edit page)
        document.getElementById("ms-fatwa-id").value = fatwa.id ?? "";
        document.getElementById("ms-fatwa-title").value = fatwa.Title ?? "";
        document.getElementById("ms-fatwa-slug").value = fatwa.slug ?? "";
        document.getElementById("ms-fatwa-keywords-input").value = fatwa.tags ?? "";
        document.getElementById("ms-fatwa-meta-description").value = fatwa.tafseel ?? "";
        document.getElementById("ms-fatwa-question").innerHTML = fatwa.detailquestion ?? "";
        document.getElementById("ms-fatwa-answer").innerHTML = fatwa.Answer ?? "";
        document.getElementById("ms-fatwa-mufti").value = fatwa.muftisahab ?? "";

        // Prefill mozuwat
        if (mozuwatSelect) {
          const valCandidates = [
            fatwa.mozuwat,
            fatwa.mozuwat_id,
            fatwa.mozuwatSlug,
            fatwa.mozuwatId,
          ].filter(Boolean);

          const candidate = valCandidates.length ? String(valCandidates[0]) : "";

          const setMozuwatValue = (value) => {
            if (!value) return;
            const exists = Array.from(mozuwatSelect.options).some(
              (o) => String(o.value) === String(value)
            );
            if (exists) {
              mozuwatSelect.value = String(value);
              return;
            }
            const tempOpt = document.createElement("option");
            tempOpt.value = String(value);
            tempOpt.textContent =
              fatwa.mozuwat_name ?? fatwa.mozuwatName ?? fatwa.mozuwatDisplay ?? `Tag ${value}`;
            mozuwatSelect.appendChild(tempOpt);
            mozuwatSelect.value = String(value);
          };

          setMozuwatValue(candidate);
          setTimeout(() => setMozuwatValue(candidate), 200);
        }

        // Switch to add/edit page
        window.location.hash = "add-fatwa";
      } catch (err) {
        console.error(err);
        alert("❌ نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
      } finally {
        hideLoader();
      }
    }

    // Row checkbox toggle
    if (target.classList?.contains("ms-row-check")) {
      const id = target.dataset.id;
      if (target.checked) selectedIds.add(id);
      else selectedIds.delete(id);

      bulkDeleteBtn.disabled = selectedIds.size === 0;

      // If any unchecked, uncheck header. If all checked, check header.
      const checkboxes = tableBody.querySelectorAll(".ms-row-check");
      const allChecked = Array.from(checkboxes).every((c) => c.checked);
      selectAllCheckbox.checked = allChecked;
    }
  });

  // Header Select All
  selectAllCheckbox?.addEventListener("change", () => {
    const checks = tableBody.querySelectorAll(".ms-row-check");
    const check = selectAllCheckbox.checked;
    checks.forEach((c) => {
      c.checked = check;
      const id = c.dataset.id;
      if (check) selectedIds.add(id);
      else selectedIds.delete(id);
    });
    bulkDeleteBtn.disabled = selectedIds.size === 0;
  });

  // Bulk Delete
  bulkDeleteBtn?.addEventListener("click", async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`کیا آپ واقعی ${selectedIds.size} فتاویٰ حذف کرنا چاہتے ہیں؟`)) return;

    try {
      showLoader();
      const ids = Array.from(selectedIds);
      const results = await Promise.allSettled(
        ids.map((id) => fetch(`${API_BASE}/fatwa/${id}`, { method: "DELETE" }))
      );

      const failed = [];
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.status === "fulfilled") {
          if (!r.value.ok) failed.push(ids[i]);
        } else {
          failed.push(ids[i]);
        }
      }

      if (failed.length) {
        alert(`⚠️ کچھ حذف نہ ہو سکے: ${failed.join(", ")}`);
      } else {
        alert("✅ منتخب فتاویٰ حذف کر دیے گئے!");
      }

      await refreshTable();
    } catch (err) {
      console.error(err);
      alert("❌ نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
    } finally {
      hideLoader();
    }
  });

  // ===== Form submission (create or update) =====
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoader();

      const id = document.getElementById("ms-fatwa-id").value;

      const fatwaData = {
        Title: document.getElementById("ms-fatwa-title").value.trim(),
        slug: document.getElementById("ms-fatwa-slug").value.trim(),
        tags: document.getElementById("ms-fatwa-keywords-input").value.trim() || null,
        tafseel: document.getElementById("ms-fatwa-meta-description").value.trim() || null,
        detailquestion: document.getElementById("ms-fatwa-question").innerHTML.trim() || null,
        Answer: document.getElementById("ms-fatwa-answer").innerHTML.trim() || null,
        muftisahab: document.getElementById("ms-fatwa-mufti").value.trim() || null,
        mozuwat: (() => {
          if (!mozuwatSelect) return null;
          const v = mozuwatSelect.value;
          return v === "" ? null : v;
        })(),
      };

      try {
        let res;
        if (id) {
          res = await fetch(`${API_BASE}/fatwa/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fatwaData),
          });
        } else {
          res = await fetch(`${API_BASE}/fatwa/dashboard`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fatwaData),
          });
        }

        const data = await res.json();
        if (res.ok) {
          alert(id ? "✅ فتویٰ کامیابی سے اپڈیٹ کر دیا گیا!" : "✅ فتویٰ کامیابی سے شامل کر دیا گیا!");
          form.reset();
          document.getElementById("ms-fatwa-id").value = "";

          // Go back to list and refresh current page
          window.location.hash = "manage-fatawa";
          await refreshTable();
        } else {
          alert("❌ Error: " + (data.error || "Failed to save fatwa"));
        }
      } catch (err) {
        console.error(err);
        alert("❌ نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
      } finally {
        hideLoader();
      }
    });
  }

  // ===== Basic search wiring (client-side trigger; server param 'q' added if backend supports it) =====
  searchBtn?.addEventListener("click", async () => {
    currentQuery = (searchInput?.value || "").trim();
    currentPage = 1;
    await refreshTable();
  });

  searchInput?.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      currentQuery = (searchInput?.value || "").trim();
      currentPage = 1;
      await refreshTable();
    }
  });

  // Optional: suggestions dropdown (hide by default, you can wire to your API later)
  searchInput?.addEventListener("input", () => {
    suggestions?.classList.add("hidden");
  });
});


// View , Add and Edit , delete Article start here


// document.addEventListener("DOMContentLoaded", () => {
//   const apiBase = "https://masailworld.onrender.com/api/article"; // API endpoint

//   // DOM references
//   const tableBody = document.getElementById("ms-articles-table-body");
//   const articleForm = document.getElementById("ms-article-form");
//   const articleIdInput = document.getElementById("ms-article-id");
//   const titleInput = document.getElementById("ms-article-title");
//   const slugInput = document.getElementById("ms-article-slug");
//   const tagsInput = document.getElementById("ms-article-keywords"); // ✅ single field for tags
//   const seoInput = document.getElementById("ms-article-meta-description");
//   const authorInput = document.getElementById("ms-article-author");
//   const imageInput = document.getElementById("ms-article-image");
//   const imagePreview = document.getElementById("ms-article-image-preview");
//   const contentContainer = document.getElementById("ms-article-content");
//   const formTitle = document.getElementById("ms-article-form-title");
//   const submitButton = document.getElementById("ms-article-submit");

//   // Loader helpers
//   function showLoader(btn) {
//     if (!btn) return;
//     btn.dataset.oldText = btn.innerHTML;
//     btn.disabled = true;
//     btn.innerHTML = `<span class="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span> Processing...`;
//   }
//   function hideLoader(btn) {
//     if (!btn) return;
//     btn.disabled = false;
//     btn.innerHTML = btn.dataset.oldText || "Submit";
//   }

//   // Quill
//   let quillInstance = null;
//   if (window.Quill) {
//     try {
//       quillInstance = new Quill("#ms-article-content", {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ script: "sub" }, { script: "super" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ direction: "rtl" }],
//             [{ color: [] }, { background: [] }],
//             [{ font: [] }],
//             [{ align: [] }],
//             ["link", "image", "video"],
//             ["clean"],
//           ],
//         },
//       });
//       window.quillInstances = window.quillInstances || {};
//       window.quillInstances["ms-article-content"] = quillInstance;
//     } catch (e) {
//       console.warn("Quill init failed:", e);
//       if (contentContainer) contentContainer.contentEditable = true;
//     }
//   } else {
//     if (contentContainer) contentContainer.contentEditable = true;
//   }

//   // Image preview
//   if (imageInput && imagePreview) {
//     imageInput.addEventListener("change", function () {
//       const file = this.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//           imagePreview.src = e.target.result;
//           imagePreview.classList.remove("hidden");
//         };
//         reader.readAsDataURL(file);
//       } else {
//         imagePreview.src = "";
//         imagePreview.classList.add("hidden");
//       }
//     });
//   }

//   // Tag UI (use same input for pills + storage)
//   function addTagPill(text) {
//     if (!tagsInput || !text) return;
//     const pill = document.createElement("div");
//     pill.className =
//       "qalam-tag-pill inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100";
//     pill.innerHTML = `<span class="tag-text">${escapeHtml(
//       text
//     )}</span><button type="button" class="qalam-tag-remove-btn ml-2 text-red-500">&times;</button>`;
//     tagsInput.parentNode.insertBefore(pill, tagsInput);
//     updateTagsField();
//   }

//   function updateTagsField() {
//     if (!tagsInput) return;
//     const tags = Array.from(
//       document.querySelectorAll(".qalam-tag-pill .tag-text")
//     )
//       .map((el) => el.textContent.trim())
//       .filter(Boolean);
//     tagsInput.value = tags.join(",");
//   }

//   if (tagsInput) {
//     tagsInput.addEventListener("keydown", (e) => {
//       if (e.key === "Enter" || e.key === ",") {
//         e.preventDefault();
//         const text = tagsInput.value.trim();
//         if (text) addTagPill(text);
//         tagsInput.value = "";
//       } else if (e.key === "Backspace" && tagsInput.value === "") {
//         const last = document.querySelector(".qalam-tag-pill:last-of-type");
//         if (last) {
//           last.remove();
//           updateTagsField();
//         }
//       }
//     });

//     tagsInput.parentNode.addEventListener("click", (e) => {
//       if (e.target.classList.contains("qalam-tag-remove-btn")) {
//         e.target.closest(".qalam-tag-pill").remove();
//         updateTagsField();
//       } else {
//         tagsInput.focus();
//       }
//     });
//   }

//   function escapeHtml(s) {
//     return String(s || "")
//       .replace(/&/g, "&amp;")
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;");
//   }

//   // Load articles
//   async function loadArticles() {
//     if (!tableBody) return;
//     tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Loading...</td></tr>`;
//     try {
//       const res = await fetch(apiBase);
//       if (!res.ok) {
//         tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-600">Server returned ${res.status}</td></tr>`;
//         return;
//       }
//       const articles = await res.json();
//       if (!Array.isArray(articles) || articles.length === 0) {
//         tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No articles found</td></tr>`;
//         return;
//       }
//       tableBody.innerHTML = "";
//       articles.forEach((article) => {
//         const id = article.id ?? article.ID ?? article.Id;
//         const title = article.Title ?? article.title ?? "";
//         const writer = article.writer ?? article.author ?? "-";
//         const created = article.created_at ?? article.createdAt ?? Date.now();
//         const tr = document.createElement("tr");
//         tr.innerHTML = `
//           <td class="py-3 px-4">${escapeHtml(title)}</td>
//           <td class="py-3 px-4">${escapeHtml(writer)}</td>
//           <td class="py-3 px-4">${new Date(created).toLocaleDateString()}</td>
//           <td class="py-3 px-4 flex gap-3">
//             <button class="text-blue-600 hover:text-blue-800" data-action="edit" data-id="${id}">
//               <i class="bi bi-pencil-square"></i>
//             </button>
//             <button class="text-red-600 hover:text-red-800" data-action="delete" data-id="${id}">
//               <i class="bi bi-trash"></i>
//             </button>
//           </td>
//         `;
//         tableBody.appendChild(tr);
//       });
//     } catch (err) {
//       console.error("loadArticles error:", err);
//       tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-600">Failed to load</td></tr>`;
//     }
//   }
//   window.renderArticles = loadArticles;

//   // Reset form
//   function resetForm() {
//     if (articleForm) articleForm.reset();
//     if (articleIdInput) articleIdInput.value = "";
//     document.querySelectorAll(".qalam-tag-pill").forEach((p) => p.remove());
//     updateTagsField();
//     if (quillInstance) quillInstance.root.innerHTML = "";
//     if (imagePreview) {
//       imagePreview.src = "";
//       imagePreview.classList.add("hidden");
//     }
//     if (formTitle) formTitle.textContent = "نیا مضمون شامل کریں";
//   }

//   // Populate form for editing
//   async function populateForm(id) {
//     try {
//       const res = await fetch(`${apiBase}/${id}`);
//       if (!res.ok) throw new Error(`Server returned ${res.status}`);
//       const article = await res.json();

//       resetForm();

//       articleIdInput.value = article.id || article.ID || article.Id || "";
//       titleInput.value = article.Title || "";
//       slugInput.value = article.slug || "";
//       seoInput.value = article.seo || "";
//       authorInput.value = article.writer || article.author || "";

//       // Tags
//       if (article.tags) {
//         article.tags.split(",").forEach((tag) => addTagPill(tag.trim()));
//       }

//       // Content
//       if (quillInstance) {
//         quillInstance.root.innerHTML = article.ArticleText || "";
//       } else {
//         contentContainer.innerHTML = article.ArticleText || "";
//       }

//       // Image
//       if (article.coverImageUrl) {
//         imagePreview.src = article.coverImageUrl;
//         imagePreview.classList.remove("hidden");
//       }

//       if (formTitle) formTitle.textContent = "مضمون میں ترمیم کریں";
//       document.querySelector('[data-target="add-article"]').click();
//     } catch (err) {
//       console.error("populateForm error:", err);
//       alert("❌ Failed to load article for editing.");
//     }
//   }

//   // Handle table actions
//   if (tableBody) {
//     tableBody.addEventListener("click", async (e) => {
//       const btn = e.target.closest("button");
//       if (!btn) return;
//       const id = btn.dataset.id;
//       const action = btn.dataset.action;

//       if (action === "edit") {
//         window.location.href = `./Editarticle.html?id=${id}`;
//       } else if (action === "delete") {
//         if (confirm("⚠️ Are you sure you want to delete this article?")) {
//           try {
//             const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
//             if (!res.ok) throw new Error(`HTTP ${res.status}`);
//             alert("🗑️ Article deleted!");
//             loadArticles();
//           } catch (err) {
//             console.error("delete error:", err);
//             alert("❌ Failed to delete article.");
//           }
//         }
//       }
//     });
//   }

//   // Submit
//   if (articleForm) {
//     articleForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       showLoader(submitButton);

//       try {
//         updateTagsField();

//         const fd = new FormData();
//         const titleVal = titleInput?.value.trim() || "";
//         const slugVal =
//           slugInput?.value.trim() ||
//           titleVal.toLowerCase().replace(/\s+/g, "-");
//         const tagsVal = tagsInput?.value || "";
//         const seoVal = seoInput?.value || "";
//         const writerVal = authorInput?.value || "";

//         let articleHtml = "";
//         if (quillInstance && quillInstance.root) {
//           articleHtml = quillInstance.root.innerHTML;
//         } else if (contentContainer) {
//           articleHtml = contentContainer.innerHTML;
//         }

//         fd.append("Title", titleVal);
//         fd.append("slug", slugVal);
//         fd.append("tags", tagsVal);
//         fd.append("seo", seoVal);
//         fd.append("writer", writerVal);
//         fd.append("ArticleText", articleHtml);

//         if (imageInput?.files[0]) {
//           fd.append("coverImage", imageInput.files[0]);
//         }

//         const id = articleIdInput?.value || "";
//         const method = id ? "PUT" : "POST";
//         const url = id ? `${apiBase}/${id}` : apiBase;

//         const res = await fetch(url, { method, body: fd });
//         if (!res.ok) {
//           const errBody = await res.json().catch(() => ({}));
//           throw new Error(errBody.error || `HTTP ${res.status}`);
//         }
//         await res.json();
//         alert(id ? "✅ Article updated!" : "✅ Article created!");

//         resetForm();
//         if (typeof loadArticles === "function") loadArticles();

//         const backBtn = document.querySelector(
//           '[data-target="manage-articles"]'
//         );
//         if (backBtn) backBtn.click();
//       } catch (err) {
//         console.error("submit error:", err);
//         alert("❌ Error saving article. See console.");
//       } finally {
//         hideLoader(submitButton);
//       }
//     });
//   }

//   // Slug auto-generate
//   if (titleInput && slugInput) {
//     titleInput.addEventListener("blur", () => {
//       if (!slugInput.value) {
//         const title = titleInput.value;
//         const generatedSlug = title
//           .toLowerCase()
//           .replace(/\s+/g, "-")
//           .replace(/[^\w\-]+/g, "")
//           .replace(/\-\-+/g, "-")
//           .replace(/^-+/, "")
//           .replace(/-+$/, "");
//         slugInput.value = generatedSlug;
//       }
//     });
//   }

//   // Initial load
//   loadArticles();
// });

document.addEventListener("DOMContentLoaded", () => {
  const apiBase = "https://api.masailworld.com/api/article"; // API endpoint

  // DOM references
  const tableBody = document.getElementById("ms-articles-table-body");
  const paginationEl = document.getElementById("ms-articles-pagination");
  const selectAllCheckbox = document.getElementById("ms-articles-select-all");
  const bulkDeleteBtn = document.getElementById("ms-articles-bulk-delete-btn");

  const articleForm = document.getElementById("ms-article-form");
  const articleIdInput = document.getElementById("ms-article-id");
  const titleInput = document.getElementById("ms-article-title");
  const slugInput = document.getElementById("ms-article-slug");
  const tagsInput = document.getElementById("ms-article-keywords"); // single field for tags
  const seoInput = document.getElementById("ms-article-meta-description");
  const authorInput = document.getElementById("ms-article-author");
  const imageInput = document.getElementById("ms-article-image");
  const imagePreview = document.getElementById("ms-article-image-preview");
  const contentContainer = document.getElementById("ms-article-content");
  const formTitle = document.getElementById("ms-article-form-title");
  const submitButton = document.getElementById("ms-article-submit");

  const searchInput = document.getElementById("ms-articles-search");
  const searchBtn = document.getElementById("ms-articles-search-btn");
  const suggestions = document.getElementById("ms-articles-suggestions");

  // ===== Loader helpers =====
  function showLoader(btn) {
    if (!btn) return;
    btn.dataset.oldText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span> Processing...`;
  }
  function hideLoader(btn) {
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = btn.dataset.oldText || "Submit";
  }

  // ===== Quill =====
  let quillInstance = null;
  if (window.Quill) {
    try {
      quillInstance = new Quill("#ms-article-content", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });
      window.quillInstances = window.quillInstances || {};
      window.quillInstances["ms-article-content"] = quillInstance;
    } catch (e) {
      console.warn("Quill init failed:", e);
      if (contentContainer) contentContainer.contentEditable = true;
    }
  } else {
    if (contentContainer) contentContainer.contentEditable = true;
  }

  // ===== Image preview =====
  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
          imagePreview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.src = "";
        imagePreview.classList.add("hidden");
      }
    });
  }

  // ===== Tag UI (same input for pills + storage) =====
  function addTagPill(text) {
    if (!tagsInput || !text) return;
    const pill = document.createElement("div");
    pill.className =
      "qalam-tag-pill inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100";
    pill.innerHTML = `<span class="tag-text">${escapeHtml(
      text
    )}</span><button type="button" class="qalam-tag-remove-btn ml-2 text-red-500">&times;</button>`;
    tagsInput.parentNode.insertBefore(pill, tagsInput);
    updateTagsField();
  }

  function updateTagsField() {
    if (!tagsInput) return;
    const tags = Array.from(
      document.querySelectorAll(".qalam-tag-pill .tag-text")
    )
      .map((el) => el.textContent.trim())
      .filter(Boolean);
    tagsInput.value = tags.join(",");
  }

  if (tagsInput) {
    tagsInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const text = tagsInput.value.trim();
        if (text) addTagPill(text);
        tagsInput.value = "";
      } else if (e.key === "Backspace" && tagsInput.value === "") {
        const last = document.querySelector(".qalam-tag-pill:last-of-type");
        if (last) {
          last.remove();
          updateTagsField();
        }
      }
    });

    tagsInput.parentNode.addEventListener("click", (e) => {
      if (e.target.classList.contains("qalam-tag-remove-btn")) {
        e.target.closest(".qalam-tag-pill").remove();
        updateTagsField();
      } else {
        tagsInput.focus();
      }
    });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ===== Pagination state =====
  const PAGE_SIZE = 10; // tweak if needed
  let currentPage = 1;
  let totalItems = null; // try to discover; stays null if API has no count
  let totalPages = 1;
  const selectedIds = new Set();
  let currentQuery = "";

  function formatDate(value) {
    const d = value ? new Date(value) : new Date();
    return d.toLocaleDateString("ur-PK", { year: "numeric", month: "short", day: "numeric" });
  }

  // ===== helpers to unwrap API shapes =====
  function unwrapArray(payload) {
    // Accept: [ ... ] OR { data: [ ... ] } OR { success: true, data: [ ... ] }
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return null;
  }
  function unwrapObject(payload) {
    // Accept: { ... } OR { data: { ... } }
    if (payload && payload.data && typeof payload.data === "object") return payload.data;
    if (payload && typeof payload === "object") return payload;
    return null;
  }
  function extractTotal(payload) {
    // Try a few common spots
    if (payload == null) return null;
    if (Number.isFinite(payload.total)) return payload.total;
    if (Number.isFinite(payload.count)) return payload.count;
    if (payload.meta && Number.isFinite(payload.meta.total)) return payload.meta.total;
    if (payload.data && Number.isFinite(payload.data.total)) return payload.data.total;
    return null;
  }

  // ===== Try count endpoint if available =====
  async function tryFetchCount() {
    try {
      const res = await fetch(`${apiBase}/count`);
      if (!res.ok) return null;
      const data = await res.json();
      // Accept number, {count}, {total}, {data:{count}}, etc.
      if (Number.isFinite(data)) return data;
      const unwrapped = unwrapObject(data);
      const candidates = [
        data?.count,
        data?.total,
        unwrapped?.count,
        unwrapped?.total,
      ];
      const firstNumber = candidates.find((n) => Number.isFinite(n));
      return Number.isFinite(firstNumber) ? firstNumber : null;
    } catch {
      return null;
    }
  }

  function renderPagination() {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";

    const makeBtn = (label, page, disabled = false, active = false) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className =
        "min-w-[2.5rem] px-3 py-2 rounded-md border text-sm " +
        (active
          ? "bg-midnight_green text-white border-midnight_green"
          : "bg-white border-gray-300 hover:bg-gray-50") +
        (disabled ? " opacity-50 cursor-not-allowed" : "");
      btn.disabled = disabled;
      if (!disabled) {
        btn.addEventListener("click", () => {
          if (page !== currentPage) {
            currentPage = page;
            refreshTable();
          }
        });
      }
      return btn;
    };

    const haveTotals = Number.isFinite(totalItems) && Number.isFinite(totalPages);

    const first = makeBtn("اول", 1, currentPage === 1);
    const prev = makeBtn("پچھلا", Math.max(1, currentPage - 1), currentPage === 1);
    paginationEl.appendChild(first);
    paginationEl.appendChild(prev);

    if (haveTotals) {
      const MAX_SHOWN = 7;
      let start = Math.max(1, currentPage - 3);
      let end = Math.min(totalPages, start + MAX_SHOWN - 1);
      if (end - start < MAX_SHOWN - 1) start = Math.max(1, end - (MAX_SHOWN - 1));

      if (start > 1) {
        paginationEl.appendChild(makeBtn("1", 1, false, currentPage === 1));
        if (start > 2) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          paginationEl.appendChild(ell);
        }
      }

      for (let p = start; p <= end; p++) {
        paginationEl.appendChild(makeBtn(String(p), p, false, p === currentPage));
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          paginationEl.appendChild(ell);
        }
        paginationEl.appendChild(makeBtn(String(totalPages), totalPages, false, currentPage === totalPages));
      }
    } else {
      const hint = document.createElement("span");
      hint.textContent = "مزید صفحات معلوم کیے جا رہے ہیں…";
      hint.className = "px-2 text-gray-500";
      paginationEl.appendChild(hint);
    }

    const next = makeBtn("اگلا", currentPage + 1, haveTotals ? currentPage >= totalPages : false);
    const last = makeBtn("آخری", haveTotals ? totalPages : currentPage, haveTotals ? currentPage >= totalPages : true);
    paginationEl.appendChild(next);
    paginationEl.appendChild(last);
  }

  function renderRows(articles) {
    if (!tableBody) return;
    tableBody.innerHTML = "";
    selectedIds.clear();
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
    if (bulkDeleteBtn) bulkDeleteBtn.disabled = true;

    articles.forEach((article) => {
      const id = article.id ?? article.ID ?? article.Id;
      const title = article.Title ?? article.title ?? "";
      const writer = article.writer ?? article.author ?? "-";
      const created = article.created_at ?? article.createdAt ?? Date.now();

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="py-3 px-4 align-middle">
          <input type="checkbox" class="ms-article-row-check w-5 h-5 accent-midnight_green" data-id="${id}" />
        </td>
        <td class="py-3 px-4 align-middle">${escapeHtml(title)}</td>
        <td class="py-3 px-4 align-middle">${escapeHtml(writer)}</td>
        <td class="py-3 px-4 align-middle">${formatDate(created)}</td>
        <td class="py-3 px-4 align-middle">
          <div class="flex gap-3 justify-end">
            <button class="text-blue-600 hover:text-blue-800" data-action="edit" data-id="${id}" title="ترمیم">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="text-red-600 hover:text-red-800" data-action="delete" data-id="${id}" title="حذف">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // ===== Fetch a page (robust to {success,data:[...]} etc.) =====
  async function fetchPage(page) {
    const offset = (page - 1) * PAGE_SIZE;
    const url = new URL(apiBase);
    url.searchParams.set("limit", PAGE_SIZE);
    url.searchParams.set("offset", offset);
    if (currentQuery.trim()) url.searchParams.set("q", currentQuery.trim());

    const res = await fetch(url.toString());
    const raw = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = raw?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    const items = unwrapArray(raw);
    if (!Array.isArray(items)) {
      throw new Error("Unexpected response format");
    }

    // Try to set totals if provided by API (optional)
    const maybeTotal = extractTotal(raw);
    if (Number.isFinite(maybeTotal)) {
      totalItems = maybeTotal;
      totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    }

    return items;
  }

  async function refreshTotalsIfNeeded(firstPageLength) {
    if (Number.isFinite(totalItems)) return;

    const count = await tryFetchCount();
    if (Number.isFinite(count)) {
      totalItems = count;
      totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      return;
    }

    if (firstPageLength < PAGE_SIZE) {
      totalItems = firstPageLength;
      totalPages = 1;
    } else {
      try {
        const probe = await fetchPage(2);
        if (probe.length === 0) {
          totalItems = PAGE_SIZE;
          totalPages = 1;
        } else {
          totalItems = null;
          totalPages = NaN; // unknown but >= 2 pages
        }
      } catch {
        totalItems = null;
        totalPages = NaN;
      }
    }
  }

  async function refreshTable() {
    try {
      // Optional: show a light inline loader in table
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-6">Loading…</td></tr>`;
      }

      const articles = await fetchPage(currentPage);

      if (Array.isArray(articles) && articles.length === 0 && currentPage > 1) {
        // went too far -> step back
        currentPage = currentPage - 1;
        const previous = await fetchPage(currentPage);
        await refreshTotalsIfNeeded(previous.length);
        renderRows(previous);
        renderPagination();
        return;
      }

      await refreshTotalsIfNeeded(articles.length);

      if (Number.isFinite(totalItems)) {
        totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;
      }

      renderRows(articles);
      renderPagination();
    } catch (err) {
      console.error("loadArticles error:", err);
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-red-600 py-6">Failed to load</td></tr>`;
      }
    }
  }
  window.renderArticles = refreshTable; // keep your external hook working

  // ===== Table actions (edit / delete / row check) =====
  if (tableBody) {
    tableBody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      const checkbox = e.target.closest(".ms-article-row-check");

      // Row checkbox
      if (checkbox) {
        const id = checkbox.dataset.id;
        if (checkbox.checked) selectedIds.add(id);
        else selectedIds.delete(id);
        if (bulkDeleteBtn) bulkDeleteBtn.disabled = selectedIds.size === 0;

        const checks = tableBody.querySelectorAll(".ms-article-row-check");
        const allChecked = Array.from(checks).every((c) => c.checked);
        if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
        return;
      }

      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === "edit") {
        // keep your redirect behavior
        window.location.href = `./Editarticle.html?id=${id}`;
      } else if (action === "delete") {
        if (confirm("⚠️ کیا آپ واقعی اس مضمون کو حذف کرنا چاہتے ہیں؟")) {
          try {
            const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            alert("🗑️ مضمون حذف کر دیا گیا!");
            refreshTable();
          } catch (err) {
            console.error("delete error:", err);
            alert("❌ Failed to delete article.");
          }
        }
      }
    });
  }

  // ===== Header Select All =====
  selectAllCheckbox?.addEventListener("change", () => {
    const checks = tableBody.querySelectorAll(".ms-article-row-check");
    const check = selectAllCheckbox.checked;
    checks.forEach((c) => {
      c.checked = check;
      const id = c.dataset.id;
      if (check) selectedIds.add(id);
      else selectedIds.delete(id);
    });
    if (bulkDeleteBtn) bulkDeleteBtn.disabled = selectedIds.size === 0;
  });

  // ===== Bulk Delete =====
  bulkDeleteBtn?.addEventListener("click", async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`کیا آپ واقعی ${selectedIds.size} مضامین حذف کرنا چاہتے ہیں؟`)) return;

    try {
      const ids = Array.from(selectedIds);
      const results = await Promise.allSettled(
        ids.map((id) => fetch(`${apiBase}/${id}`, { method: "DELETE" }))
      );

      const failed = [];
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.status === "fulfilled") {
          if (!r.value.ok) failed.push(ids[i]);
        } else {
          failed.push(ids[i]);
        }
      }

      if (failed.length) {
        alert(`⚠️ کچھ حذف نہ ہو سکے: ${failed.join(", ")}`);
      } else {
        alert("✅ منتخب مضامین حذف کر دیے گئے!");
      }

      await refreshTable();
    } catch (err) {
      console.error(err);
      alert("❌ نیٹ ورک خرابی۔ دوبارہ کوشش کریں۔");
    }
  });

  // ===== Submit (create/update) =====
  if (articleForm) {
    articleForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoader(submitButton);

      try {
        updateTagsField();

        const fd = new FormData();
        const titleVal = titleInput?.value.trim() || "";
        const slugVal =
          slugInput?.value.trim() ||
          titleVal.toLowerCase().replace(/\s+/g, "-");
        const tagsVal = tagsInput?.value || "";
        const seoVal = seoInput?.value || "";
        const writerVal = authorInput?.value || "";

        let articleHtml = "";
        if (quillInstance && quillInstance.root) {
          articleHtml = quillInstance.root.innerHTML;
        } else if (contentContainer) {
          articleHtml = contentContainer.innerHTML;
        }

        fd.append("Title", titleVal);
        fd.append("slug", slugVal);
        fd.append("tags", tagsVal);
        fd.append("seo", seoVal);
        fd.append("writer", writerVal);
        fd.append("ArticleText", articleHtml);

        if (imageInput?.files[0]) {
          fd.append("coverImage", imageInput.files[0]);
        }

        const id = articleIdInput?.value || "";
        const method = id ? "PUT" : "POST";
        const url = id ? `${apiBase}/${id}` : apiBase;

        const res = await fetch(url, { method, body: fd });
        const body = await res.json().catch(() => ({}));
        if (!res.ok || body?.success === false) {
          const errMsg = body?.error || body?.message || `HTTP ${res.status}`;
          throw new Error(errMsg);
        }

        alert(id ? "✅ Article updated!" : "✅ Article created!");

        resetForm();
        if (typeof refreshTable === "function") refreshTable();

        const backBtn = document.querySelector('[data-target="manage-articles"]');
        if (backBtn) backBtn.click();
      } catch (err) {
        console.error("submit error:", err);
        alert("❌ Error saving article. See console.");
      } finally {
        hideLoader(submitButton);
      }
    });
  }

  // ===== Slug auto-generate =====
  if (titleInput && slugInput) {
    titleInput.addEventListener("blur", () => {
      if (!slugInput.value) {
        const title = titleInput.value;
        const generatedSlug = title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");
        slugInput.value = generatedSlug;
      }
    });
  }

  // ===== Search wiring =====
  async function triggerSearch() {
    currentQuery = (searchInput?.value || "").trim();
    currentPage = 1;
    await refreshTable();
  }
  searchBtn?.addEventListener("click", triggerSearch);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") triggerSearch();
  });
  searchInput?.addEventListener("input", () => {
    suggestions?.classList.add("hidden");
  });

  // ===== Reset & populate helpers =====
  function resetForm() {
    if (articleForm) articleForm.reset();
    if (articleIdInput) articleIdInput.value = "";
    document.querySelectorAll(".qalam-tag-pill").forEach((p) => p.remove());
    updateTagsField();
    if (quillInstance) quillInstance.root.innerHTML = "";
    if (imagePreview) {
      imagePreview.src = "";
      imagePreview.classList.add("hidden");
    }
    if (formTitle) formTitle.textContent = "نیا مضمون شامل کریں";
  }

  async function populateForm(id) {
    try {
      const res = await fetch(`${apiBase}/${id}`);
      const raw = await res.json().catch(() => ({}));
      if (!res.ok || raw?.success === false) {
        const msg = raw?.error || raw?.message || `Server returned ${res.status}`;
        throw new Error(msg);
      }

      const article = unwrapObject(raw);
      if (!article) throw new Error("Unexpected response format for article");

      resetForm();

      articleIdInput.value = article.id || article.ID || article.Id || "";
      titleInput.value = article.Title || "";
      slugInput.value = article.slug || "";
      seoInput.value = article.seo || "";
      authorInput.value = article.writer || article.author || "";

      if (article.tags) {
        // tags can be "a,b" OR "[]"
        const tagStr = Array.isArray(article.tags)
          ? article.tags.join(",")
          : String(article.tags);
        tagStr
          .split(",")
          .map((t) => t.replace(/^\[|\]$/g, "").trim()) // clean "[]"
          .filter(Boolean)
          .forEach((tag) => addTagPill(tag));
      }

      if (quillInstance) {
        quillInstance.root.innerHTML = article.ArticleText || "";
      } else {
        contentContainer.innerHTML = article.ArticleText || "";
      }

      if (article.coverImageUrl) {
        imagePreview.src = article.coverImageUrl;
        imagePreview.classList.remove("hidden");
      }

      if (formTitle) formTitle.textContent = "مضمون میں ترمیم کریں";
      document.querySelector('[data-target="add-article"]').click();
    } catch (err) {
      console.error("populateForm error:", err);
      alert("❌ Failed to load article for editing.");
    }
  }
  // keep available if you need it elsewhere
  window.populateArticleForm = populateForm;

  // ===== Initial load =====
  refreshTable();
});


// -----------------------------------------------------------------



// Books section 

// document.addEventListener("DOMContentLoaded", () => {
//   const bookForm = document.getElementById("ms-book-form");
//   const booksTableBody = document.getElementById("ms-books-table-body");
//   const bookIdField = document.getElementById("ms-book-id");
//   const formTitle = document.getElementById("ms-book-form-title");

//   // 🔄 Loader element
//   const loader = document.createElement("div");
//   loader.id = "global-loader";
//   loader.className =
//     "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 hidden";
//   loader.innerHTML = `
//     <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//   `;
//   document.body.appendChild(loader);

//   function showLoader() {
//     loader.classList.remove("hidden");
//   }

//   function hideLoader() {
//     loader.classList.add("hidden");
//   }

//   let offset = 0;
//   const limit = 5; // show more by default
//   let isEditing = false;

//   // ✅ Load books
//   async function loadBooks() {
//     showLoader();
//     try {
//       const res = await fetch(
//         `https://masailworld.onrender.com/api/book?limit=${limit}&offset=${offset}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch books");

//       const books = await res.json();

//       if (offset === 0) {
//         booksTableBody.innerHTML = ""; // reset only on first load
//       }

//       if (books.length === 0) {
//         document.getElementById("load-more-books")?.remove();
//         return;
//       }

//       books.forEach((book) => {
//         const tr = document.createElement("tr");
//         tr.classList.add("border-b", "border-gray-200");

//         tr.innerHTML = `
//           <td class="py-3 px-4">${book.BookName}</td>
//           <td class="py-3 px-4">${book.BookWriter || "-"}</td>
//           <td class="py-3 px-4 flex gap-3">
//             <button onclick="editBook(${
//               book.id
//             })" title="Edit" class="text-blue-600 hover:text-blue-800">✏️</button>
//             <button onclick="deleteBook(${
//               book.id
//             }, this)" title="Delete" class="text-red-600 hover:text-red-800">🗑️</button>
//           </td>
//         `;

//         booksTableBody.appendChild(tr);
//       });

//       if (!document.getElementById("load-more-books")) {
//         const btn = document.createElement("button");
//         btn.id = "load-more-books";
//         btn.textContent = "آگے دیکھیں";
//         btn.className =
//           "mt-4 bg-midnight_green text-white py-2 px-6 rounded-lg hover:bg-midnight_green-400 transition";
//         btn.addEventListener("click", () => {
//           offset += limit;
//           loadBooks();
//         });
//         booksTableBody.parentElement.appendChild(btn);
//       }
//     } catch (err) {
//       console.error("❌ Error loading books:", err);
//       alert("کتابیں لوڈ کرنے میں مسئلہ ہے");
//     } finally {
//       hideLoader();
//     }
//   }

//   // ✅ Add / Update book
//   bookForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     showLoader();

//     try {
//       const formData = new FormData();
//       formData.append(
//         "BookName",
//         document.getElementById("ms-book-name").value.trim()
//       );
//       formData.append(
//         "BookWriter",
//         document.getElementById("ms-book-author").value.trim()
//       );
//       formData.append(
//         "BookDescription",
//         document.getElementById("ms-book-description").innerHTML.trim()
//       );

//       const coverFile = document.getElementById("ms-book-cover").files[0];
//       if (coverFile) formData.append("BookCoverImg", coverFile);

//       const pdfFile = document.getElementById("ms-book-file").files[0];
//       if (pdfFile) formData.append("BookPDF", pdfFile);

//       let url = "https://masailworld.onrender.com/api/book";
//       let method = "POST";

//       if (isEditing) {
//         const id = bookIdField.value;
//         url = `https://masailworld.onrender.com/api/book/${id}`;
//         method = "PUT";
//       }

//       const res = await fetch(url, {
//         method,
//         body: formData,
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert(
//           isEditing
//             ? "✅ کتاب کامیابی سے اپڈیٹ ہو گئی!"
//             : "✅ کتاب کامیابی سے شامل کر دی گئی!"
//         );

//         // Reset form
//         bookForm.reset();
//         document.getElementById("ms-book-description").innerHTML = "";
//         bookIdField.value = "";
//         formTitle.textContent = "نئی کتاب شامل کریں";
//         isEditing = false;

//         // Reload books
//         offset = 0;
//         await loadBooks();

//         // Redirect back
//         window.location.hash = "manage-books";
//       } else {
//         alert("❌ Error: " + (data.error || "کتاب محفوظ کرنے میں مسئلہ ہے"));
//       }
//     } catch (err) {
//       console.error("❌ Network error:", err);
//       alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
//     } finally {
//       hideLoader();
//     }
//   });

//   // ✅ Delete book
//   window.deleteBook = async (id, btn) => {
//     if (!confirm("کیا آپ واقعی اس کتاب کو حذف کرنا چاہتے ہیں؟")) return;
//     showLoader();

//     try {
//       const res = await fetch(
//         `https://masailworld.onrender.com/api/book/${id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       const data = await res.json();

//       if (res.ok) {
//         alert("📕 کتاب حذف کر دی گئی");
//         btn.closest("tr").remove();
//       } else {
//         alert("❌ Error: " + (data.error || "کتاب حذف کرنے میں مسئلہ"));
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
//     } finally {
//       hideLoader();
//     }
//   };

//   // ✅ Edit book (prefill form)
//   window.editBook = async (id) => {
//     showLoader();
//     try {
//       const res = await fetch(
//         `https://masailworld.onrender.com/api/book/${id}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch book");

//       const book = await res.json();

//       bookIdField.value = book.id;
//       document.getElementById("ms-book-name").value = book.BookName;
//       document.getElementById("ms-book-author").value = book.BookWriter || "";
//       document.getElementById("ms-book-description").innerHTML =
//         book.BookDescription || "";

//       isEditing = true;
//       formTitle.textContent = "کتاب ایڈٹ کریں";
//       window.location.hash = "add-book";
//     } catch (err) {
//       console.error("❌ Error loading book:", err);
//       alert("کتاب لوڈ کرنے میں مسئلہ ہے");
//     } finally {
//       hideLoader();
//     }
//   };

//   // 🚀 Initial load
//   loadBooks();
// });




document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://masailworld.onrender.com/api/book";

  // Form + fields
  const bookForm = document.getElementById("ms-book-form");
  const bookIdField = document.getElementById("ms-book-id");
  const formTitle = document.getElementById("ms-book-form-title");

  // List + controls
  const booksTableBody = document.getElementById("ms-books-table-body");
  const paginationEl = document.getElementById("ms-books-pagination");
  const selectAllCheckbox = document.getElementById("ms-books-select-all");
  const bulkDeleteBtn = document.getElementById("ms-books-bulk-delete-btn");
  const searchInput = document.getElementById("ms-books-search");
  const searchBtn = document.getElementById("ms-books-search-btn");
  const suggestions = document.getElementById("ms-books-suggestions");

  // 🔄 Loader
  const loader = document.createElement("div");
  loader.id = "global-loader";
  loader.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 hidden";
  loader.innerHTML = `<div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>`;
  document.body.appendChild(loader);
  const showLoader = () => loader.classList.remove("hidden");
  const hideLoader = () => loader.classList.add("hidden");

  // State
  const PAGE_SIZE = 10; // page size
  let currentPage = 1;
  let totalItems = null; // unknown initially (we’ll try /count)
  let totalPages = 1;
  let isEditing = false;
  const selectedIds = new Set();
  let currentQuery = "";

  // ===== Helpers =====
  const escapeHtml = (s) =>
    String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Try to fetch count if your API supports /book/count returning {count} or raw number
  async function tryFetchCount() {
    try {
      const res = await fetch(`${API_BASE}/count`);
      if (!res.ok) return null;
      const data = await res.json();
      const count = typeof data === "number" ? data : data?.count;
      return Number.isFinite(count) ? count : null;
    } catch {
      return null;
    }
  }

  function renderPagination() {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";

    const makeBtn = (label, page, disabled = false, active = false) => {
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.className =
        "min-w-[2.5rem] px-3 py-2 rounded-md border text-sm " +
        (active
          ? "bg-midnight_green text-white border-midnight_green"
          : "bg-white border-gray-300 hover:bg-gray-50") +
        (disabled ? " opacity-50 cursor-not-allowed" : "");
      btn.disabled = disabled;
      if (!disabled) {
        btn.addEventListener("click", () => {
          if (page !== currentPage) {
            currentPage = page;
            refreshTable();
          }
        });
      }
      return btn;
    };

    const haveTotals = Number.isFinite(totalItems) && Number.isFinite(totalPages);

    const first = makeBtn("اول", 1, currentPage === 1);
    const prev = makeBtn("پچھلا", Math.max(1, currentPage - 1), currentPage === 1);
    paginationEl.appendChild(first);
    paginationEl.appendChild(prev);

    if (haveTotals) {
      const MAX_SHOWN = 7;
      let start = Math.max(1, currentPage - 3);
      let end = Math.min(totalPages, start + MAX_SHOWN - 1);
      if (end - start < MAX_SHOWN - 1) start = Math.max(1, end - (MAX_SHOWN - 1));

      if (start > 1) {
        paginationEl.appendChild(makeBtn("1", 1, false, currentPage === 1));
        if (start > 2) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          paginationEl.appendChild(ell);
        }
      }

      for (let p = start; p <= end; p++) {
        paginationEl.appendChild(makeBtn(String(p), p, false, p === currentPage));
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          paginationEl.appendChild(ell);
        }
        paginationEl.appendChild(makeBtn(String(totalPages), totalPages, false, currentPage === totalPages));
      }
    } else {
      const hint = document.createElement("span");
      hint.textContent = "مزید صفحات معلوم کیے جا رہے ہیں…";
      hint.className = "px-2 text-gray-500";
      paginationEl.appendChild(hint);
    }

    const next = makeBtn("اگلا", currentPage + 1, haveTotals ? currentPage >= totalPages : false);
    const last = makeBtn("آخری", haveTotals ? totalPages : currentPage, haveTotals ? currentPage >= totalPages : true);
    paginationEl.appendChild(next);
    paginationEl.appendChild(last);
  }

  function renderRows(books) {
    booksTableBody.innerHTML = "";
    selectedIds.clear();
    selectAllCheckbox.checked = false;
    bulkDeleteBtn.disabled = true;

    books.forEach((book) => {
      const id = book.id ?? book.ID ?? book.Id;
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-200";
      tr.innerHTML = `
        <td class="py-3 px-4 align-middle">
          <input type="checkbox" class="ms-book-row-check w-5 h-5 accent-midnight_green" data-id="${id}" />
        </td>
        <td class="py-3 px-4 align-middle">${escapeHtml(book.BookName)}</td>
        <td class="py-3 px-4 align-middle">${escapeHtml(book.BookWriter || "-")}</td>
        <td class="py-3 px-4 align-middle">
          <div class="flex gap-3 justify-end">
            <button class="text-blue-600 hover:text-blue-800" data-action="edit" data-id="${id}" title="ترمیم">✏️</button>
            <button class="text-red-600 hover:text-red-800" data-action="delete" data-id="${id}" title="حذف">🗑️</button>
          </div>
        </td>
      `;
      booksTableBody.appendChild(tr);
    });
  }

  async function fetchPage(page) {
    const offset = (page - 1) * PAGE_SIZE;
    const url = new URL(API_BASE);
    url.searchParams.set("limit", PAGE_SIZE);
    url.searchParams.set("offset", offset);
    if (currentQuery.trim()) url.searchParams.set("q", currentQuery.trim());
    const res = await fetch(url.toString());
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load books");
    if (!Array.isArray(data)) throw new Error("Unexpected response format");
    return data;
  }

  async function refreshTotalsIfNeeded(firstPageLength) {
    if (Number.isFinite(totalItems)) return;

    const count = await tryFetchCount();
    if (Number.isFinite(count)) {
      totalItems = count;
      totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      return;
    }

    if (firstPageLength < PAGE_SIZE) {
      totalItems = firstPageLength;
      totalPages = 1;
    } else {
      try {
        const probe = await fetchPage(2);
        if (probe.length === 0) {
          totalItems = PAGE_SIZE;
          totalPages = 1;
        } else {
          totalItems = null;
          totalPages = NaN; // unknown but >= 2 pages
        }
      } catch {
        totalItems = null;
        totalPages = NaN;
      }
    }
  }

  async function refreshTable() {
    try {
      booksTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-6">Loading…</td></tr>`;
      const books = await fetchPage(currentPage);

      if (Array.isArray(books) && books.length === 0 && currentPage > 1) {
        currentPage = currentPage - 1; // went too far
        const previous = await fetchPage(currentPage);
        await refreshTotalsIfNeeded(previous.length);
        renderRows(previous);
        renderPagination();
        return;
      }

      await refreshTotalsIfNeeded(books.length);

      if (Number.isFinite(totalItems)) {
        totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
        if (currentPage > totalPages) currentPage = totalPages;
      }

      renderRows(books);
      renderPagination();
    } catch (err) {
      console.error("❌ Error loading books:", err);
      booksTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-600 py-6">Failed to load</td></tr>`;
    }
  }

  // ===== Table actions (delegation) =====
  booksTableBody.addEventListener("click", async (e) => {
    const checkbox = e.target.closest(".ms-book-row-check");
    const btn = e.target.closest("button");

    // Row checkbox
    if (checkbox) {
      const id = checkbox.dataset.id;
      if (checkbox.checked) selectedIds.add(id);
      else selectedIds.delete(id);
      bulkDeleteBtn.disabled = selectedIds.size === 0;

      const checks = booksTableBody.querySelectorAll(".ms-book-row-check");
      const allChecked = Array.from(checks).every((c) => c.checked);
      selectAllCheckbox.checked = allChecked;
      return;
    }

    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    if (action === "edit") {
      editBook(id);
    } else if (action === "delete") {
      deleteBook(id);
    }
  });

  // Header Select All
  selectAllCheckbox.addEventListener("change", () => {
    const checks = booksTableBody.querySelectorAll(".ms-book-row-check");
    const check = selectAllCheckbox.checked;
    checks.forEach((c) => {
      c.checked = check;
      const id = c.dataset.id;
      if (check) selectedIds.add(id);
      else selectedIds.delete(id);
    });
    bulkDeleteBtn.disabled = selectedIds.size === 0;
  });

  // Bulk Delete
  bulkDeleteBtn.addEventListener("click", async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`کیا آپ واقعی ${selectedIds.size} کتابیں حذف کرنا چاہتے ہیں؟`)) return;

    try {
      showLoader();
      const ids = Array.from(selectedIds);
      const results = await Promise.allSettled(
        ids.map((id) => fetch(`${API_BASE}/${id}`, { method: "DELETE" }))
      );

      const failed = [];
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.status === "fulfilled") {
          if (!r.value.ok) failed.push(ids[i]);
        } else {
          failed.push(ids[i]);
        }
      }

      if (failed.length) {
        alert(`⚠️ کچھ حذف نہ ہو سکیں: ${failed.join(", ")}`);
      } else {
        alert("✅ منتخب کتابیں حذف کر دی گئیں!");
      }

      await refreshTable();
    } catch (err) {
      console.error(err);
      alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
    } finally {
      hideLoader();
    }
  });

  // ===== CRUD: Add / Update book =====
  if (bookForm) {
    bookForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoader();

      try {
        const formData = new FormData();
        formData.append("BookName", document.getElementById("ms-book-name").value.trim());
        formData.append("BookWriter", document.getElementById("ms-book-author").value.trim());
        formData.append("BookDescription", document.getElementById("ms-book-description").innerHTML.trim());

        const coverFile = document.getElementById("ms-book-cover").files[0];
        if (coverFile) formData.append("BookCoverImg", coverFile);

        const pdfFile = document.getElementById("ms-book-file").files[0];
        if (pdfFile) formData.append("BookPDF", pdfFile);

        let url = API_BASE;
        let method = "POST";

        if (isEditing) {
          const id = bookIdField.value;
          url = `${API_BASE}/${id}`;
          method = "PUT";
        }

        const res = await fetch(url, { method, body: formData });
        const data = await res.json();

        if (res.ok) {
          alert(isEditing ? "✅ کتاب کامیابی سے اپڈیٹ ہو گئی!" : "✅ کتاب کامیابی سے شامل کر دی گئی!");
          // Reset form
          bookForm.reset();
          document.getElementById("ms-book-description").innerHTML = "";
          bookIdField.value = "";
          formTitle.textContent = "نئی کتاب شامل کریں";
          isEditing = false;

          // Reload current page
          await refreshTable();

          // Redirect back
          window.location.hash = "manage-books";
        } else {
          alert("❌ Error: " + (data.error || "کتاب محفوظ کرنے میں مسئلہ ہے"));
        }
      } catch (err) {
        console.error("❌ Network error:", err);
        alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
      } finally {
        hideLoader();
      }
    });
  }

  // ===== Edit book (prefill form) =====
  async function editBook(id) {
    try {
      showLoader();
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      const book = await res.json();

      bookIdField.value = book.id;
      document.getElementById("ms-book-name").value = book.BookName || "";
      document.getElementById("ms-book-author").value = book.BookWriter || "";
      document.getElementById("ms-book-description").innerHTML = book.BookDescription || "";

      isEditing = true;
      formTitle.textContent = "کتاب ایڈٹ کریں";
      window.location.hash = "add-book";
    } catch (err) {
      console.error("❌ Error loading book:", err);
      alert("کتاب لوڈ کرنے میں مسئلہ ہے");
    } finally {
      hideLoader();
    }
  }
  window.editBook = editBook; // keep global if other code calls it

  // ===== Delete single book =====
  async function deleteBook(id) {
    if (!confirm("کیا آپ واقعی اس کتاب کو حذف کرنا چاہتے ہیں؟")) return;
    try {
      showLoader();
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert("📕 کتاب حذف کر دی گئی");
        await refreshTable();
      } else {
        alert("❌ Error: " + (data.error || "کتاب حذف کرنے میں مسئلہ"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
    } finally {
      hideLoader();
    }
  }
  window.deleteBook = deleteBook; // keep global if something else uses it

  // ===== Search wiring =====
  async function triggerSearch() {
    currentQuery = (searchInput?.value || "").trim();
    currentPage = 1;
    await refreshTable();
  }
  searchBtn?.addEventListener("click", triggerSearch);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") triggerSearch();
  });
  searchInput?.addEventListener("input", () => {
    suggestions?.classList.add("hidden");
  });

  // 🚀 Initial load
  refreshTable();
});



// ---------------------------------------Ulma

// API base URL (adjust if needed)
/* ================================
   Ulema Manage — Full Working JS
   ================================ */

(() => {
  const API_URL = "https://masailworld.onrender.com/api/aleem";

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    initUI();
    initForm();
    initModal();
    initSearch();
    refreshTable();
  });

  /* ---------- State ---------- */
  const STATE = {
    pageSize: 10,
    currentPage: 1,
    totalItems: null,
    totalPages: 1,
    selected: new Set(),
    query: "",
  };

  /* ---------- DOM ---------- */
  const DOM = {};
  function cacheDom() {
    // Pages
    DOM.managePage = document.getElementById("ms-page-manage-ulema");
    DOM.addPage    = document.getElementById("ms-page-add-ulema");

    // Table & controls
    DOM.tbody      = document.getElementById("ms-ulema-table-body");
    DOM.pager      = document.getElementById("ms-ulema-pagination");
    DOM.selectAll  = document.getElementById("ms-ulema-select-all");
    DOM.bulkDel    = document.getElementById("ms-ulema-bulk-delete-btn");

    // Search
    DOM.searchInput = document.getElementById("ms-ulema-search");
    DOM.searchBtn   = document.getElementById("ms-ulema-search-btn");
    DOM.suggestions = document.getElementById("ms-ulema-suggestions");

    // Form
    DOM.form      = document.getElementById("ms-ulema-form");
    DOM.formTitle = document.getElementById("ms-ulema-form-title");
    DOM.id        = document.getElementById("ms-ulema-id");
    DOM.name      = document.getElementById("ms-ulema-name");
    DOM.position  = document.getElementById("ms-ulema-designation");
    DOM.bio       = document.getElementById("ms-ulema-bio");
    DOM.photo     = document.getElementById("ms-ulema-photo");
    DOM.photoPrev = document.getElementById("ms-ulema-photo-preview");
    DOM.submitBtn = DOM.form ? DOM.form.querySelector('[type="submit"]') : null;

    // Modal
    DOM.modal       = document.getElementById("ms-ulema-modal");
    DOM.modalClose  = document.getElementById("ms-ulema-modal-close");
    DOM.modalOk     = document.getElementById("ms-ulema-modal-ok");
    DOM.mName       = document.getElementById("ms-ulema-modal-name");
    DOM.mPosition   = document.getElementById("ms-ulema-modal-position");
    DOM.mAbout      = document.getElementById("ms-ulema-modal-about");
    DOM.mPhoto      = document.getElementById("ms-ulema-modal-photo");

    // Overlays
    DOM.overlay       = document.getElementById("ulema-global-loader");
    DOM.uploadOverlay = document.getElementById("ulema-upload-overlay");
    DOM.uploadBar     = document.getElementById("ulema-upload-bar");
    DOM.uploadText    = document.getElementById("ulema-upload-text");
  }

  /* ---------- Utils ---------- */
  function showOverlay()  { DOM.overlay?.classList.remove("hidden"); }
  function hideOverlay()  { DOM.overlay?.classList.add("hidden"); }
  function showUpload(p=0){ DOM.uploadOverlay?.classList.remove("hidden"); updateUpload(p); }
  function updateUpload(p){
    const pct = Math.max(0, Math.min(100, Math.round(p)));
    if (DOM.uploadBar)  DOM.uploadBar.style.width = `${pct}%`;
    if (DOM.uploadText) DOM.uploadText.textContent = `${pct}%`;
  }
  function hideUpload()   { DOM.uploadOverlay?.classList.add("hidden"); }

  function btnSpin(btn, label = "Processing...") {
    if (!btn) return;
    btn.dataset._old = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>${label}`;
  }
  function btnUnspin(btn, fallback = "Submit") {
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = btn.dataset._old || fallback;
  }

  const getField = (obj, ...keys) => {
    for (const k of keys) if (obj && k in obj && obj[k] != null) return obj[k];
    return "";
  };
  const uidOf = (obj) => getField(obj, "id", "Id", "ID");
  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;").replace("/<//g", "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  /* ---------- FileReader progress (on choose file) ---------- */
  DOM.photo?.addEventListener("change", () => {
    const file = DOM.photo.files?.[0];
    if (!file) return;

    // basic validations
    if (!file.type.startsWith("image/")) {
      alert("براہ کرم صرف تصویر اپلوڈ کریں");
      DOM.photo.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB cap (adjust if you like)
      alert("تصویر 10MB سے کم ہونی چاہیے");
      DOM.photo.value = "";
      return;
    }

    // local preview + read progress (not upload)
    const reader = new FileReader();
    showUpload(0);
    reader.onprogress = (e) => {
      if (e.lengthComputable) updateUpload((e.loaded / e.total) * 100);
    };
    reader.onload = (e) => {
      if (DOM.photoPrev) {
        DOM.photoPrev.src = e.target.result;
        DOM.photoPrev.classList.remove("hidden");
      }
      setTimeout(hideUpload, 200);
    };
    reader.onerror = () => {
      hideUpload();
      alert("فائل پڑھنے میں مسئلہ آیا");
    };
    reader.readAsDataURL(file);
  });

  /* ---------- XHR with progress (actual upload) ---------- */
  function xhrSend({ url, method = "POST", formData, onProgress }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.onload = () => {
        let json = null;
        try { json = JSON.parse(xhr.responseText || "{}"); } catch (_) {}
        resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, body: json });
      };
      xhr.onerror = () => {
        resolve({ ok: false, status: 0, body: { error: "Network error" } });
      };
      if (xhr.upload && typeof onProgress === "function") {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
        };
      }
      xhr.send(formData);
    });
  }

  /* ---------- UI (list) ---------- */
  function initUI() {
    document.querySelectorAll("[data-target='add-ulema']").forEach((btn) =>
      btn.addEventListener("click", () => {
        clearForm();
        showAdd();
      })
    );

    document.querySelectorAll("[data-target='manage-ulema'], .as-back-link").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault?.();
        showManage();
      })
    );

    DOM.tbody?.addEventListener("click", (e) => {
      const rowCheck = e.target.closest(".ms-ulema-row-check");
      const viewBtn  = e.target.closest(".ms-view-btn");
      const editBtn  = e.target.closest(".ms-edit-btn");
      const delBtn   = e.target.closest(".ms-delete-btn");

      if (rowCheck) {
        const id = rowCheck.dataset.id;
        if (rowCheck.checked) STATE.selected.add(id);
        else STATE.selected.delete(id);
        DOM.bulkDel.disabled = STATE.selected.size === 0;

        const all = DOM.tbody.querySelectorAll(".ms-ulema-row-check");
        const allChecked = Array.from(all).every((c) => c.checked);
        if (DOM.selectAll) DOM.selectAll.checked = allChecked;
        return;
      }

      if (viewBtn) {
        openModalById(viewBtn.dataset.id);
        return;
      }
      if (editBtn) {
        window.location.href = `./EditUlema.html?id=${editBtn.dataset.id}`;
        return;
      }
      if (delBtn) {
        deleteOne(delBtn.dataset.id);
        return;
      }
    });

    DOM.selectAll?.addEventListener("change", () => {
      const checks = DOM.tbody?.querySelectorAll(".ms-ulema-row-check") ?? [];
      const on = DOM.selectAll.checked;
      STATE.selected.clear();
      checks.forEach((c) => {
        c.checked = on;
        if (on) STATE.selected.add(c.dataset.id);
      });
      DOM.bulkDel.disabled = STATE.selected.size === 0;
    });

    DOM.bulkDel?.addEventListener("click", async () => {
      if (STATE.selected.size === 0) return;
      if (!confirm(`کیا آپ واقعی ${STATE.selected.size} انٹریاں حذف کرنا چاہتے ہیں؟`)) return;
      try {
        showOverlay();
        const ids = Array.from(STATE.selected);
        const results = await Promise.allSettled(
          ids.map((id) => fetch(`${API_URL}/${id}`, { method: "DELETE" }))
        );
        const failed = [];
        results.forEach((r, i) => {
          if (r.status !== "fulfilled" || !r.value.ok) failed.push(ids[i]);
        });
        if (failed.length) alert(`⚠️ کچھ حذف نہ ہو سکیں: ${failed.join(", ")}`);
        else alert("✅ منتخب انٹریاں حذف کر دی گئیں!");
        await refreshTable();
      } catch (e) {
        console.error(e);
        alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
      } finally {
        hideOverlay();
      }
    });
  }

  function showManage() {
    DOM.managePage?.classList.remove("hidden");
    DOM.addPage?.classList.add("hidden");
    if (DOM.formTitle) DOM.formTitle.textContent = "نئے عالم شامل کریں";
    clearForm();
  }
  function showAdd() {
    DOM.managePage?.classList.add("hidden");
    DOM.addPage?.classList.remove("hidden");
  }

  /* ---------- Search ---------- */
  function initSearch() {
    const trigger = async () => {
      STATE.query = (DOM.searchInput?.value || "").trim();
      STATE.currentPage = 1;
      await refreshTable();
    };
    DOM.searchBtn?.addEventListener("click", trigger);
    DOM.searchInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") trigger();
    });
    DOM.searchInput?.addEventListener("input", () => {
      DOM.suggestions?.classList.add("hidden");
    });
  }

  /* ---------- Form (single-shot upload; fallback ONLY if first fails) ---------- */
  function buildFD() {
    const fd = new FormData();
    fd.append("Name", (DOM.name?.value || "").trim());
    fd.append("Position", (DOM.position?.value || "").trim());
    fd.append("About", (DOM.bio?.innerHTML || "").trim());
    if (DOM.photo?.files?.[0]) {
      fd.append("ProfileImg", DOM.photo.files[0]);
    }
    return fd;
  }

  async function uploadProfileOnly(id) {
    if (!DOM.photo?.files?.[0]) return { ok: true };
    const fd = new FormData();
    fd.append("ProfileImg", DOM.photo.files[0]);

    showUpload(0);
    const res = await xhrSend({
      url: `${API_URL}/${id}/profile`,
      method: "PUT",
      formData: fd,
      onProgress: (p) => updateUpload(p),
    });
    hideUpload();
    return res;
  }

  function initForm() {
    if (!DOM.form) return;

    DOM.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = (DOM.id?.value || "").trim();
      const isEdit = !!id;

      try {
        btnSpin(DOM.submitBtn, isEdit ? "Updating..." : "Saving...");
        showOverlay();

        // Single request with photo (progress)
        const fdAll = buildFD();
        showUpload(0);
        const first = await xhrSend({
          url: isEdit ? `${API_URL}/${id}` : API_URL,
          method: isEdit ? "PUT" : "POST",
          formData: fdAll,
          onProgress: (p) => updateUpload(p),
        });
        hideUpload();

        if (!first.ok) {
          // Fallback: try as fields-only (no image), then upload image-only endpoint
          console.warn("First upload failed; trying fallback.", first);
          const fdNoPhoto = new FormData();
          fdNoPhoto.append("Name", (DOM.name?.value || "").trim());
          fdNoPhoto.append("Position", (DOM.position?.value || "").trim());
          fdNoPhoto.append("About", (DOM.bio?.innerHTML || "").trim());

          const second = await xhrSend({
            url: isEdit ? `${API_URL}/${id}` : API_URL,
            method: isEdit ? "PUT" : "POST",
            formData: fdNoPhoto,
          });
          if (!second.ok) {
            const msg = second.body?.error || second.body?.message || `HTTP ${second.status}`;
            throw new Error(msg);
          }

          // if create, get new id then upload photo
          let finalId = isEdit ? id : (uidOf(second.body) || second.body?.id || second.body?.Id || second.body?.ID);
          if (!finalId) throw new Error("No ID returned from server.");
          const pic = await uploadProfileOnly(finalId);
          if (!pic.ok) {
            const m = pic.body?.error || pic.body?.message || `HTTP ${pic.status}`;
            throw new Error(m);
          }
        }

        // Success -> redirect to manage list
        alert(isEdit ? "✅ انٹری اپڈیٹ ہوگئی" : "✅ نیا عالم شامل ہوگیا");
        // Redirect to requested location
        window.location.href = "/Pages/index.html#manage-ulema";
      } catch (err) {
        console.error(err);
        const message =
          err?.message ||
          "❌ نیٹ ورک مسئلہ یا انٹری محفوظ نہیں ہو سکی";
        alert(message);
      } finally {
        btnUnspin(DOM.submitBtn);
        hideOverlay();
        hideUpload();
      }
    });
  }

  function clearForm() {
    if (DOM.id) DOM.id.value = "";
    if (DOM.name) DOM.name.value = "";
    if (DOM.position) DOM.position.value = "";
    if (DOM.bio) DOM.bio.innerHTML = "";
    if (DOM.photo) DOM.photo.value = "";
    if (DOM.photoPrev) {
      DOM.photoPrev.src = "";
      DOM.photoPrev.classList.add("hidden");
    }
  }

  /* ---------- Modal ---------- */
  function initModal() {
    const close = () => DOM.modal?.classList.add("hidden");
    DOM.modalClose?.addEventListener("click", close);
    DOM.modalOk?.addEventListener("click", close);
    DOM.modal?.addEventListener("click", (e) => {
      if (e.target === DOM.modal) close();
    });
  }

  async function openModalById(id) {
    try {
      showOverlay();
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch entry");

      const name  = getField(data, "Name", "name") || "—";
      const pos   = getField(data, "Position", "position") || "—";
      const about = getField(data, "About", "about", "Description", "description") || "—";

      const profileUrl = `${API_URL}/${id}/profile?ts=${Date.now()}`;

      if (DOM.mName)     DOM.mName.textContent = name;
      if (DOM.mPosition) DOM.mPosition.textContent = pos;
      if (DOM.mAbout)    DOM.mAbout.innerHTML = about;
      if (DOM.mPhoto) {
        DOM.mPhoto.src = profileUrl;
        DOM.mPhoto.classList.remove("bg-gray-100");
        DOM.mPhoto.onerror = () => {
          DOM.mPhoto.src = "";
          DOM.mPhoto.classList.add("bg-gray-100");
        };
      }

      DOM.modal?.classList.remove("hidden");
    } catch (e) {
      console.error(e);
      alert("❌ تفصیل لانے میں مسئلہ آیا");
    } finally {
      hideOverlay();
    }
  }
  window.openUlemaQuickView = openModalById;

  /* ---------- Fetch + Pagination ---------- */
  async function fetchPage(page) {
    const offset = (page - 1) * STATE.pageSize;
    const url = new URL(API_URL);
    url.searchParams.set("limit", STATE.pageSize);
    url.searchParams.set("offset", offset);
    if (STATE.query) url.searchParams.set("q", STATE.query);

    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);

    let rows = Array.isArray(json) ? json
             : Array.isArray(json.rows) ? json.rows
             : Array.isArray(json.data) ? json.data
             : Array.isArray(json.items) ? json.items
             : [];

    const headerCount = Number(res.headers.get("X-Total-Count"));
    const bodyCount   = Number(json?.count ?? json?.total ?? json?.pagination?.total);
    const countVal = Number.isFinite(headerCount) ? headerCount
                   : Number.isFinite(bodyCount)   ? bodyCount
                   : null;

    return { rows, count: countVal };
  }

  async function discoverTotalsIfNeeded(firstBatchCount, discoveredTotal) {
    if (Number.isFinite(STATE.totalItems)) return;

    if (Number.isFinite(discoveredTotal)) {
      STATE.totalItems = discoveredTotal;
      STATE.totalPages = Math.max(1, Math.ceil(STATE.totalItems / STATE.pageSize));
      return;
    }

    if (firstBatchCount < STATE.pageSize) {
      STATE.totalItems = firstBatchCount;
      STATE.totalPages = 1;
      return;
    }

    try {
      const probe = await fetchPage(2);
      if (probe.rows.length === 0) {
        STATE.totalItems = STATE.pageSize;
        STATE.totalPages = 1;
      } else {
        STATE.totalItems = null;
        STATE.totalPages = NaN;
      }
    } catch {
      STATE.totalItems = null;
      STATE.totalPages = NaN;
    }
  }

  function renderPagination() {
    if (!DOM.pager) return;
    DOM.pager.innerHTML = "";

    const makeBtn = (label, page, disabled = false, active = false) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.className =
        "min-w-[2.5rem] px-3 py-2 rounded-md border text-sm " +
        (active
          ? "bg-midnight_green text-white border-midnight_green"
          : "bg-white border-gray-300 hover:bg-gray-50") +
        (disabled ? " opacity-50 cursor-not-allowed" : "");
      b.disabled = disabled;
      if (!disabled) {
        b.addEventListener("click", () => {
          if (page !== STATE.currentPage) {
            STATE.currentPage = page;
            refreshTable();
          }
        });
      }
      return b;
    };

    const haveTotals = Number.isFinite(STATE.totalItems) && Number.isFinite(STATE.totalPages);

    DOM.pager.appendChild(makeBtn("اول", 1, STATE.currentPage === 1));
    DOM.pager.appendChild(makeBtn("پچھلا", Math.max(1, STATE.currentPage - 1), STATE.currentPage === 1));

    if (haveTotals) {
      const MAX = 7;
      let start = Math.max(1, STATE.currentPage - 3);
      let end   = Math.min(STATE.totalPages, start + MAX - 1);
      if (end - start < MAX - 1) start = Math.max(1, end - (MAX - 1));

      if (start > 1) {
        DOM.pager.appendChild(makeBtn("1", 1, false, STATE.currentPage === 1));
        if (start > 2) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          DOM.pager.appendChild(ell);
        }
      }
      for (let p = start; p <= end; p++) {
        DOM.pager.appendChild(makeBtn(String(p), p, false, p === STATE.currentPage));
      }
      if (end < STATE.totalPages) {
        if (end < STATE.totalPages - 1) {
          const ell = document.createElement("span");
          ell.textContent = "…";
          ell.className = "px-2 text-gray-500";
          DOM.pager.appendChild(ell);
        }
        DOM.pager.appendChild(makeBtn(String(STATE.totalPages), STATE.totalPages, false, STATE.currentPage === STATE.totalPages));
      }
    } else {
      const hint = document.createElement("span");
      hint.textContent = "مزید صفحات معلوم کیے جا رہے ہیں…";
      hint.className = "px-2 text-gray-500";
      DOM.pager.appendChild(hint);
    }

    DOM.pager.appendChild(makeBtn("اگلا", STATE.currentPage + 1, haveTotals ? STATE.currentPage >= STATE.totalPages : false));
    DOM.pager.appendChild(makeBtn("آخری", haveTotals ? STATE.totalPages : STATE.currentPage, haveTotals ? STATE.currentPage >= STATE.totalPages : true));
  }

  function renderRows(rows) {
    DOM.tbody.innerHTML = "";
    STATE.selected.clear();
    if (DOM.selectAll) DOM.selectAll.checked = false;
    if (DOM.bulkDel) DOM.bulkDel.disabled = true;

    if (!rows.length) {
      DOM.tbody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-gray-500">کوئی ریکارڈ نہیں ملا</td></tr>`;
      return;
    }

    rows.forEach((u) => {
      const id = uidOf(u);
      const name = getField(u, "Name", "name") || "-";
      const pos  = getField(u, "Position", "position") || "-";

      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-200";
      tr.innerHTML = `
        <td class="py-3 px-4 align-middle">
          <input type="checkbox" class="ms-ulema-row-check w-5 h-5 accent-midnight_green" data-id="${id}" />
        </td>
        <td class="py-3 px-4 align-middle">${escapeHtml(name)}</td>
        <td class="py-3 px-4 align-middle">${escapeHtml(pos)}</td>
        <td class="py-3 px-4 align-middle">
          <div class="flex gap-3 justify-end">
            <button class="ms-view-btn text-midnight_green hover:underline" data-id="${id}" title="تفصیل دیکھیں">👁️</button>
            <button class="ms-edit-btn text-blue-600 hover:underline" data-id="${id}" title="ترمیم">✏️</button>
            <button class="ms-delete-btn text-red-600 hover:underline" data-id="${id}" title="حذف">🗑️</button>
          </div>
        </td>
      `;
      DOM.tbody.appendChild(tr);
    });
  }

  async function refreshTable() {
    try {
      DOM.tbody.innerHTML = `<tr><td colspan="4" class="text-center py-6">Loading…</td></tr>`;
      const { rows, count } = await fetchPage(STATE.currentPage);

      if (rows.length === 0 && STATE.currentPage > 1) {
        STATE.currentPage -= 1;
        const back = await fetchPage(STATE.currentPage);
        await discoverTotalsIfNeeded(back.rows.length, back.count);
        renderRows(back.rows);
        renderPagination();
        return;
      }

      await discoverTotalsIfNeeded(rows.length, count);

      if (Number.isFinite(STATE.totalItems)) {
        STATE.totalPages = Math.max(1, Math.ceil(STATE.totalItems / STATE.pageSize));
        if (STATE.currentPage > STATE.totalPages) STATE.currentPage = STATE.totalPages;
      }

      renderRows(rows);
      renderPagination();
    } catch (e) {
      console.error("load error:", e);
      DOM.tbody.innerHTML = `<tr><td colspan="4" class="text-center text-red-600 py-6">Failed to load</td></tr>`;
    }
  }

  /* ---------- Single delete ---------- */
  async function deleteOne(id) {
    if (!confirm("کیا آپ واقعی اس انٹری کو حذف کرنا چاہتے ہیں؟")) return;
    try {
      showOverlay();
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
      alert("✅ انٹری حذف ہوگئی");
      await refreshTable();
    } catch (e) {
      console.error(e);
      alert("❌ انٹری حذف نہیں ہو سکی");
    } finally {
      hideOverlay();
    }
  }
  window.deleteUlema = deleteOne;
})();







// -----------------------------------------Users

// API base URL


// User Creation

const USER_API = "https://masailworld.onrender.com/api/user";

/* ========= Loader (re-used) ========= */
function showLoader() {
  let loader = document.getElementById("loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader";
    loader.className =
      "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50";
    loader.innerHTML = `
      <div class="w-16 h-16 border-4 border-white border-t-midnight_green rounded-full animate-spin"></div>
    `;
    document.body.appendChild(loader);
  }
  loader.style.display = "flex";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

/* ========= State ========= */
const STATE = {
  pageSize: 10,
  currentPage: 1,
  hasNext: false,        // computed via one-extra fetch
  selected: new Set(),
  query: "",
};

/* ========= DOM cache ========= */
const DOM = {};
function cacheDom() {
  DOM.tbody     = document.getElementById("ms-users-table-body");
  DOM.pager     = document.getElementById("ms-users-pagination");
  DOM.selectAll = document.getElementById("ms-users-select-all");
  DOM.bulkDel   = document.getElementById("ms-users-bulk-delete-btn");

  DOM.searchInput = document.getElementById("ms-users-search");
  DOM.searchBtn   = document.getElementById("ms-users-search-btn");
  DOM.suggestions = document.getElementById("ms-users-suggestions");

  // Form (may exist on add/edit page)
  DOM.form   = document.getElementById("ms-user-form");
  DOM.fId    = document.getElementById("ms-user-id");
  DOM.fName  = document.getElementById("ms-user-name");
  DOM.fEmail = document.getElementById("ms-user-email");
  DOM.fPass  = document.getElementById("ms-user-password");
  DOM.fCPass = document.getElementById("ms-user-confirm-password");
  DOM.formTitle = document.getElementById("ms-user-form-title");
  DOM.passwordHelp = document.getElementById("ms-password-help-text");
}

/* ========= Utils ========= */
const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

/* ========= Fetch helpers (one-extra technique) ========= */
async function fetchPage(page) {
  const offset = (page - 1) * STATE.pageSize;
  const url = new URL(USER_API);
  url.searchParams.set("limit", STATE.pageSize + 1); // ask one extra
  url.searchParams.set("offset", offset);
  if (STATE.query) url.searchParams.set("q", STATE.query);

  const res = await fetch(url.toString());
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);

  let rows = Array.isArray(json) ? json
           : Array.isArray(json.rows) ? json.rows
           : Array.isArray(json.data) ? json.data
           : Array.isArray(json.items) ? json.items
           : [];

  let hasNext = false;
  if (rows.length > STATE.pageSize) {
    hasNext = true;
    rows = rows.slice(0, STATE.pageSize);
  }
  return { rows, hasNext };
}

/* ========= Render ========= */
function renderPagination() {
  if (!DOM.pager) return;
  DOM.pager.innerHTML = "";

  const makeBtn = (label, page, disabled = false, active = false) => {
    const b = document.createElement("button");
    b.textContent = label;
    b.className =
      "min-w-[2.5rem] px-3 py-2 rounded-md border text-sm " +
      (active
        ? "bg-midnight_green text-white border-midnight_green"
        : "bg-white border-gray-300 hover:bg-gray-50") +
      (disabled ? " opacity-50 cursor-not-allowed" : "");
    b.disabled = disabled;
    if (!disabled) {
      b.addEventListener("click", () => {
        if (page !== STATE.currentPage) {
          STATE.currentPage = page;
          refreshTable();
        }
      });
    }
    return b;
  };

  // First & Prev
  DOM.pager.appendChild(makeBtn("اول", 1, STATE.currentPage === 1));
  DOM.pager.appendChild(
    makeBtn("پچھلا", Math.max(1, STATE.currentPage - 1), STATE.currentPage === 1)
  );

  // Small numeric window (no totals)
  const start = Math.max(1, STATE.currentPage - 2);
  const end   = STATE.hasNext ? STATE.currentPage + 2 : STATE.currentPage;
  for (let p = start; p <= end; p++) {
    if (p <= 0) continue;
    DOM.pager.appendChild(makeBtn(String(p), p, false, p === STATE.currentPage));
  }

  // Next & Last (Last behaves like Next when totals are unknown)
  DOM.pager.appendChild(makeBtn("اگلا", STATE.currentPage + 1, !STATE.hasNext));
  DOM.pager.appendChild(makeBtn("آخری", STATE.currentPage + 1, !STATE.hasNext));
}

function renderRows(list) {
  if (!DOM.tbody) return;

  DOM.tbody.innerHTML = "";
  STATE.selected.clear();
  if (DOM.selectAll) DOM.selectAll.checked = false;
  if (DOM.bulkDel)   DOM.bulkDel.disabled = true;

  if (!list.length) {
    DOM.tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-500">کوئی ریکارڈ نہیں ملا</td></tr>`;
    return;
  }

  list.forEach((user) => {
    const id = user.id ?? user.Id ?? user.ID;
    const name = user.Name ?? user.name ?? "-";
    const email = user.Email ?? user.email ?? "-";

    const tr = document.createElement("tr");
    tr.className = "border-b border-gray-200 hover:bg-gray-50";
    tr.innerHTML = `
      <td class="py-3 px-4 align-middle">
        <input type="checkbox" class="ms-user-row-check w-5 h-5 accent-midnight_green" data-id="${id}" />
      </td>
      <td class="py-3 px-4 align-middle">${escapeHtml(String(id))}</td>
      <td class="py-3 px-4 align-middle">${escapeHtml(name)}</td>
      <td class="py-3 px-4 align-middle">${escapeHtml(email)}</td>
      <td class="py-3 px-4 align-middle">
        <button class="edit-btn text-blue-600 hover:underline" data-id="${id}">ترمیم</button>
        <button class="delete-btn text-red-600 hover:underline ml-2" data-id="${id}">حذف کریں</button>
      </td>
    `;
    DOM.tbody.appendChild(tr);
  });
}

/* ========= Main refresh ========= */
async function refreshTable() {
  if (!DOM.tbody) return; // edit page might not have table
  try {
    DOM.tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6">Loading…</td></tr>`;
    const { rows, hasNext } = await fetchPage(STATE.currentPage);

    // overshot page? go back once
    if (rows.length === 0 && STATE.currentPage > 1) {
      STATE.currentPage -= 1;
      const back = await fetchPage(STATE.currentPage);
      STATE.hasNext = back.hasNext;
      renderRows(back.rows);
      renderPagination();
      return;
    }

    STATE.hasNext = hasNext;
    renderRows(rows);
    renderPagination();
  } catch (err) {
    console.error("Failed to load users:", err);
    DOM.tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-600 py-6">Failed to load</td></tr>`;
  }
}

/* ========= Delete helpers ========= */
async function deleteUser(id) {
  if (!confirm("❓ کیا آپ واقعی اس صارف کو حذف کرنا چاہتے ہیں؟")) return;

  showLoader();
  try {
    const res = await fetch(`${USER_API}/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "❌ صارف حذف کرنے میں مسئلہ آیا");
      return;
    }
    alert("🗑️ صارف کامیابی سے حذف ہوگیا!");
    await refreshTable();
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("❌ کوئی مسئلہ پیش آگیا۔");
  } finally {
    hideLoader();
  }
}

async function deleteMany(ids) {
  if (!ids.length) return;
  if (!confirm(`کیا آپ واقعی ${ids.length} صارفین حذف کرنا چاہتے ہیں؟`)) return;

  showLoader();
  try {
    const results = await Promise.allSettled(
      ids.map((id) => fetch(`${USER_API}/${id}`, { method: "DELETE" }))
    );
    const failed = [];
    results.forEach((r, i) => {
      if (r.status !== "fulfilled" || !r.value.ok) failed.push(ids[i]);
    });

    if (failed.length) {
      alert(`⚠️ کچھ حذف نہ ہو سکیں: ${failed.join(", ")}`);
    } else {
      alert("✅ منتخب صارفین حذف کر دیے گئے!");
    }
    await refreshTable();
  } catch (e) {
    console.error(e);
    alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
  } finally {
    hideLoader();
  }
}

/* ========= UI / Events ========= */
function initUI() {
  // Table delegation (edit + delete + row check)
  DOM.tbody?.addEventListener("click", (e) => {
    const rowCheck = e.target.closest(".ms-user-row-check");
    const editBtn  = e.target.closest(".edit-btn");
    const delBtn   = e.target.closest(".delete-btn");

    // select row
    if (rowCheck) {
      const id = rowCheck.dataset.id;
      if (rowCheck.checked) STATE.selected.add(id);
      else STATE.selected.delete(id);

      if (DOM.bulkDel) DOM.bulkDel.disabled = STATE.selected.size === 0;

      const checks = DOM.tbody.querySelectorAll(".ms-user-row-check");
      const allChecked = Array.from(checks).every((c) => c.checked);
      if (DOM.selectAll) DOM.selectAll.checked = allChecked;
      return;
    }

    // edit
    if (editBtn) {
      const userId = editBtn.getAttribute("data-id");
      window.location.href = `./EditUser.html?id=${userId}`;
      return;
    }

    // delete single
    if (delBtn) {
      const userId = delBtn.getAttribute("data-id");
      deleteUser(userId);
      return;
    }
  });

  // header select all
  DOM.selectAll?.addEventListener("change", () => {
    const checks = DOM.tbody?.querySelectorAll(".ms-user-row-check") ?? [];
    const on = DOM.selectAll.checked;
    STATE.selected.clear();
    checks.forEach((c) => {
      c.checked = on;
      if (on) STATE.selected.add(c.dataset.id);
    });
    if (DOM.bulkDel) DOM.bulkDel.disabled = STATE.selected.size === 0;
  });

  // bulk delete
  DOM.bulkDel?.addEventListener("click", () => {
    const ids = Array.from(STATE.selected);
    deleteMany(ids);
  });
}

/* ========= Search ========= */
function initSearch() {
  const trigger = async () => {
    STATE.query = (DOM.searchInput?.value || "").trim();
    STATE.currentPage = 1;
    await refreshTable();
  };
  DOM.searchBtn?.addEventListener("click", trigger);
  DOM.searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") trigger();
  });
  DOM.searchInput?.addEventListener("input", () => {
    DOM.suggestions?.classList.add("hidden");
  });
}

/* ========= Form (add/update) ========= */
async function handleFormSubmit(e) {
  e.preventDefault();

  const id = (DOM.fId?.value || "").trim();
  const Name = (DOM.fName?.value || "").trim();
  const Email = (DOM.fEmail?.value || "").trim();
  const Password = (DOM.fPass?.value || "").trim();
  const ConfirmPassword = (DOM.fCPass?.value || "").trim();

  if (!Name || !Email) {
    alert("❌ براہ کرم نام اور ای میل بھریں");
    return;
  }

  showLoader();
  try {
    const method = id ? "PUT" : "POST";
    const url = id ? `${USER_API}/${id}` : USER_API;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name, Email, Password, ConfirmPassword }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.error || "❌ مسئلہ پیش آیا");
      return;
    }

    alert(id ? "✏️ صارف کامیابی سے اپڈیٹ ہوگیا!" : "✅ صارف کامیابی سے شامل ہوگیا!");
    e.target.reset();

    // If we're on the manage page, refresh the table. If not, redirect back.
    if (DOM.tbody) {
      await refreshTable();
      // back to list anchor (adjust path to your project)
      window.location.href = "../index.html#manage-users";
    } else {
      window.location.href = "../index.html#manage-users";
    }
  } catch (error) {
    console.error("Error saving user:", error);
    alert("❌ کوئی مسئلہ پیش آگیا۔");
  } finally {
    hideLoader();
  }
}

/* ========= Prefill when editing ========= */
async function prefillIfEditing() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id || !DOM.form) return;

  showLoader();
  try {
    const res = await fetch(`${USER_API}/${id}`);
    const user = await res.json();
    if (res.ok) {
      if (DOM.fId) DOM.fId.value = user.id ?? user.Id ?? user.ID ?? "";
      if (DOM.fName) DOM.fName.value = user.Name ?? "";
      if (DOM.fEmail) DOM.fEmail.value = user.Email ?? "";

      if (DOM.formTitle) DOM.formTitle.innerText = "✏️ صارف میں ترمیم کریں";
      if (DOM.passwordHelp) {
        DOM.passwordHelp.innerText = "پاس ورڈ تبدیل کرنے کے لیے نیا پاس ورڈ درج کریں، ورنہ خالی چھوڑ دیں۔";
      }
    } else {
      alert("❌ صارف نہیں ملا");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  } finally {
    hideLoader();
  }
}

/* ========= Boot ========= */
document.addEventListener("DOMContentLoaded", () => {
  cacheDom();

  // If manage page markup exists, init list features
  if (DOM.tbody) {
    initUI();
    initSearch();
    refreshTable();
  }

  // If the add/edit form exists on this page, init it & prefill
  if (DOM.form) {
    DOM.form.addEventListener("submit", handleFormSubmit);
    prefillIfEditing();
  }
});





// -------------------------------------------------------- Categories


 const BOOTSTRAP_ICONS = [
    "bi bi-book","bi bi-bookmark","bi bi-book-half","bi bi-journal","bi bi-journals",
    "bi bi-collection","bi bi-grid","bi bi-tags","bi bi-tag","bi bi-hash",
    "bi bi-star","bi bi-star-fill","bi bi-heart","bi bi-heart-fill","bi bi-gem",
    "bi bi-lightning","bi bi-lightning-charge","bi bi-award","bi bi-badge-ad",
    "bi bi-people","bi bi-person","bi bi-person-badge","bi bi-person-lines-fill",
    "bi bi-chat","bi bi-chat-dots","bi bi-chat-left-text","bi bi-envelope",
    "bi bi-bell","bi bi-calendar","bi bi-clock","bi bi-pin-map","bi bi-geo",
    "bi bi-archive","bi bi-box","bi bi-folder","bi bi-folder2","bi bi-folder-plus",
    "bi bi-upload","bi bi-download","bi bi-cloud-upload","bi bi-cloud",
    "bi bi-pencil","bi bi-pen","bi bi-brush","bi bi-eye","bi bi-eye-fill",
    "bi bi-search","bi bi-filter","bi bi-funnel","bi bi-list","bi bi-list-ul",
    "bi bi-grid-3x3-gap","bi bi-columns-gap","bi bi-layout-text-sidebar",
    "bi bi-link-45deg","bi bi-share","bi bi-share-fill","bi bi-box-arrow-up-right",
    "bi bi-gear","bi bi-sliders","bi bi-shield","bi bi-lock","bi bi-unlock",
    "bi bi-check-circle","bi bi-x-circle","bi bi-info-circle","bi bi-question-circle",
    "bi bi-exclamation-triangle","bi bi-flag","bi bi-trophy","bi bi-mortarboard",
    "bi bi-globe","bi bi-translate","bi bi-type","bi bi-fonts","bi bi-image",
    "bi bi-images","bi bi-camera","bi bi-collection-play","bi bi-music-note",
    "bi bi-bookmark-star","bi bi-clipboard","bi bi-clipboard-check","bi bi-diagram-3",
    "bi bi-diagram-3-fill","bi bi-card-list","bi bi-credit-card","bi bi-cpu",
    "bi bi-database","bi bi-server","bi bi-wrench","bi bi-tools","bi bi-rocket",
  ];

  (function iconPicker(){
    const hidden = document.getElementById("ms-category-icon"); // hidden real value
    const trigger = document.getElementById("ms-icon-trigger");
    const panel = document.querySelector("#ms-icon-panel > div");
    const listEl = document.getElementById("ms-icon-list");
    const filterEl = document.getElementById("ms-icon-filter");
    const curIcon = document.getElementById("ms-icon-current");
    const curLabel = document.getElementById("ms-icon-current-label");
    const bigPreview = document.getElementById("ms-icon-preview");

    let open = false;
    let options = BOOTSTRAP_ICONS.slice();
    let selected = options[0] || "";

    function setSelected(value){
      selected = value;
      hidden.value = value;              // submit this
      curIcon.className = `text-2xl ${value}`;
      curLabel.textContent = value || "—";
      bigPreview.className = `text-3xl ${value}`;
    }

    function renderList(items){
      listEl.innerHTML = "";
      items.forEach(cls => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "w-full flex items-center justify-between py-2.5 px-3 hover:bg-ash_gray/20 rounded-lg text-right";
        row.setAttribute("role","option");
        row.setAttribute("aria-selected", String(cls === selected));

        const left = document.createElement("span");
        left.className = "flex items-center gap-3";
        const ico = document.createElement("i");
        ico.className = `text-xl ${cls}`;
        const txt = document.createElement("span");
        txt.className = "text-base text-rich_black";
        txt.textContent = cls;

        left.appendChild(ico);
        left.appendChild(txt);

        const check = document.createElement("i");
        check.className = cls === selected ? "bi bi-check-lg text-xl" : "bi bi-dot text-xl opacity-0";

        row.appendChild(left);
        row.appendChild(check);

        row.addEventListener("click", () => {
          setSelected(cls);
          renderList(options);
          closePanel();
        });

        listEl.appendChild(row);
      });
    }

    function openPanel(){
      open = true;
      panel.classList.remove("hidden");
      filterEl.focus();
    }
    function closePanel(){
      open = false;
      panel.classList.add("hidden");
      trigger.focus();
    }

    trigger.addEventListener("click", () => {
      open ? closePanel() : openPanel();
    });

    document.addEventListener("click", (e) => {
      if (!panel.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
        if (open) closePanel();
      }
    });

    filterEl.addEventListener("input", () => {
      const q = (filterEl.value || "").toLowerCase().trim();
      options = q ? BOOTSTRAP_ICONS.filter(c => c.toLowerCase().includes(q)) : BOOTSTRAP_ICONS.slice();
      renderList(options);
    });

    // Keyboard basics for trigger
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open ? closePanel() : openPanel();
      }
    });

    // init
    setSelected(selected);
    renderList(options);
  })();

(() => {
  const TAGS_API = "https://dynamicmasailworld.onrender.com/api/tags";

  /* ---------- Tunables ---------- */
  const SUGGESTION_LIMIT = 10;

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    initUI();
    initSearch();
    initForm();
    refreshTable();
  });

  /* ---------- State ---------- */
  const STATE = {
    pageSize: 10,
    currentPage: 1,
    hasNext: false,
    selected: new Set(),
    query: "",
  };

  /* ---------- DOM ---------- */
  const DOM = {};
  function cacheDom() {
    DOM.tbody     = document.getElementById("ms-categories-table-body");
    DOM.pager     = document.getElementById("ms-categories-pagination");
    DOM.selectAll = document.getElementById("ms-categories-select-all");
    DOM.bulkDel   = document.getElementById("ms-categories-bulk-delete-btn");

    DOM.searchInput = document.getElementById("ms-categories-search");
    DOM.searchBtn   = document.getElementById("ms-categories-search-btn");
    DOM.suggestions = document.getElementById("ms-categories-suggestions");

    DOM.form       = document.getElementById("ms-category-form");
    DOM.fId        = document.getElementById("ms-category-id");
    DOM.fName      = document.getElementById("ms-category-name");
    DOM.fSlug      = document.getElementById("ms-category-slug");
    DOM.fIcon      = document.getElementById("ms-category-icon");
    DOM.fDesc      = document.getElementById("ms-category-description");
    DOM.fThumb     = document.getElementById("ms-category-thumbnail");

    DOM.overlay = document.getElementById("categories-global-loader");
  }

  /* ---------- Utils ---------- */
  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  const showOverlay = () => DOM.overlay?.classList.remove("hidden");
  const hideOverlay = () => DOM.overlay?.classList.add("hidden");

  // Normalize the tag object (no roman fields)
  function normalizeTag(tag) {
    const id =
      tag.id ?? tag.Id ?? tag.ID ?? tag._id ?? tag.tagId ?? null;

    const name =
      tag.Name ?? tag.name ?? tag.title ?? tag.label ?? "";

    const iconClass =
      tag.iconClass ?? tag.IconClass ?? tag.icon ?? "";

    const createdRaw =
      tag.createdAt ?? tag.CreatedAt ?? tag.created ?? tag.dateAdded ?? tag.insertedAt ?? null;

    let createdTs = null;
    if (createdRaw) {
      const ts = Date.parse(createdRaw);
      createdTs = isNaN(ts) ? null : ts;
    }

    let idNum = null;
    if (id != null && /^[0-9]+$/.test(String(id))) idNum = Number(id);

    const nameLower = String(name).toLowerCase();
    const slug = String(tag.slug ?? "").toLowerCase();

    return { raw: tag, id, name, iconClass, createdTs, idNum, nameLower, slug };
  }

  // Enforce DESC (latest first): createdAt desc → numeric id desc → name desc
  function sortTagsDesc(list) {
    return list.slice().sort((a, b) => {
      const A = normalizeTag(a);
      const B = normalizeTag(b);

      if (A.createdTs !== null && B.createdTs !== null) return B.createdTs - A.createdTs;
      if (A.createdTs !== null) return -1;
      if (B.createdTs !== null) return 1;

      if (A.idNum !== null && B.idNum !== null) return B.idNum - A.idNum;
      if (A.idNum !== null) return -1;
      if (B.idNum !== null) return 1;

      return String(B.name).localeCompare(String(A.name));
    });
  }

  function debounce(fn, ms) {
    let t = null;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  /* ---------- Fetch helpers ---------- */
  async function fetchRaw({ limit, offset, q }) {
    const url = new URL(TAGS_API);
    if (limit != null)  url.searchParams.set("limit", limit);
    if (offset != null) url.searchParams.set("offset", offset);

    // Ask the server for newest-first, but we still sort on the client.
    url.searchParams.set("sort", "-createdAt");
    url.searchParams.set("order", "desc");

    if ((q || "").trim()) {
      url.searchParams.set("q", q);
      url.searchParams.set("search", q);
    }

    const res = await fetch(url.toString());
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);

    const rows = Array.isArray(json) ? json
              : Array.isArray(json.rows) ? json.rows
              : Array.isArray(json.data) ? json.data
              : Array.isArray(json.items) ? json.items
              : [];
    return rows;
  }

  async function fetchPage(page) {
    const offset = (page - 1) * STATE.pageSize;
    let rows = await fetchRaw({ limit: STATE.pageSize + 1, offset, q: STATE.query || "" });

    // Always sort client-side to guarantee DESC
    rows = sortTagsDesc(rows);

    let hasNext = false;
    if (rows.length > STATE.pageSize) {
      hasNext = true;
      rows = rows.slice(0, STATE.pageSize);
    }
    return { rows, hasNext };
  }

  async function fetchSuggestions(q) {
    if (!q) return [];
    try {
      let rows = await fetchRaw({ limit: Math.max(SUGGESTION_LIMIT * 2, 20), offset: 0, q });
      rows = sortTagsDesc(rows);
      return rows.slice(0, SUGGESTION_LIMIT);
    } catch {
      return [];
    }
  }

  /* ---------- Render ---------- */
  function renderPagination() {
    if (!DOM.pager) return;
    DOM.pager.innerHTML = "";

    const makeBtn = (label, page, disabled = false, active = false) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.className =
        "min-w-[2.5rem] px-3 py-2 rounded-md border text-sm " +
        (active ? "bg-midnight_green text-white border-midnight_green"
                : "bg-white border-gray-300 hover:bg-gray-50") +
        (disabled ? " opacity-50 cursor-not-allowed" : "");
      b.disabled = disabled;
      if (!disabled) b.addEventListener("click", () => {
        if (page !== STATE.currentPage) { STATE.currentPage = page; refreshTable(); }
      });
      return b;
    };

    DOM.pager.appendChild(makeBtn("اول", 1, STATE.currentPage === 1));
    DOM.pager.appendChild(makeBtn("پچھلا", Math.max(1, STATE.currentPage - 1), STATE.currentPage === 1));

    const windowSize = 5;
    let start = Math.max(1, STATE.currentPage - 2);
    for (let p = start; p < start + windowSize; p++) {
      if (p <= 0) continue;
      DOM.pager.appendChild(makeBtn(String(p), p, false, p === STATE.currentPage));
      if (!STATE.hasNext && p > STATE.currentPage) break;
    }

    DOM.pager.appendChild(makeBtn("اگلا", STATE.currentPage + 1, !STATE.hasNext));
    DOM.pager.appendChild(makeBtn("آخری", STATE.currentPage + 1, !STATE.hasNext));
  }

  function renderRows(list) {
    if (!DOM.tbody) return;
    DOM.tbody.innerHTML = "";
    STATE.selected.clear();
    if (DOM.selectAll) DOM.selectAll.checked = false;
    if (DOM.bulkDel)   DOM.bulkDel.disabled = true;

    if (!list.length) {
      DOM.tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-500">کوئی ریکارڈ نہیں ملا</td></tr>`;
      return;
    }

    list.forEach((tag) => {
      const n = normalizeTag(tag);
      const id = n.id ?? "-";
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-200 hover:bg-gray-50";
      tr.innerHTML = `
        <td class="py-3 px-4 align-middle">
          <input type="checkbox" class="ms-category-row-check w-5 h-5 accent-midnight_green" data-id="${escapeHtml(String(id))}" />
        </td>
        <td class="py-3 px-4 align-middle">${escapeHtml(String(id))}</td>
        <td class="py-3 px-4 align-middle">
          <img src="${TAGS_API}/${encodeURIComponent(id)}/cover?ts=${Date.now()}" alt="thumbnail" class="w-12 h-12 rounded object-cover"
               onerror="this.src=''; this.classList.add('bg-gray-100')" />
        </td>
        <td class="py-3 px-4 align-middle">${escapeHtml(n.name || "-")}</td>
        <td class="py-3 px-4 align-middle"><i class="${escapeHtml(n.iconClass || "")}"></i></td>
        <td class="py-3 px-4 align-middle">
          <div class="flex gap-3 justify-end">
            <button class="ms-edit-btn text-blue-600 hover:underline" data-id="${escapeHtml(String(id))}">ترمیم</button>
            <button class="ms-delete-btn text-red-600 hover:underline" data-id="${escapeHtml(String(id))}">حذف کریں</button>
          </div>
        </td>
      `;
      DOM.tbody.appendChild(tr);
    });
  }

  /* ---------- Main refresh ---------- */
  async function refreshTable() {
    try {
      if (DOM.tbody) {
        DOM.tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6">Loading…</td></tr>`;
      }
      const { rows, hasNext } = await fetchPage(STATE.currentPage);

      if (rows.length === 0 && STATE.currentPage > 1) {
        STATE.currentPage -= 1;
        const back = await fetchPage(STATE.currentPage);
        STATE.hasNext = back.hasNext;
        renderRows(back.rows);
        renderPagination();
        return;
      }

      STATE.hasNext = hasNext;
      renderRows(rows);
      renderPagination();
    } catch (err) {
      console.error("load tags error:", err);
      if (DOM.tbody) {
        DOM.tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red-600 py-6">Failed to load</td></tr>`;
      }
    }
  }

  /* ---------- UI / Events ---------- */
  function initUI() {
    DOM.tbody?.addEventListener("click", (e) => {
      const rowCheck = e.target.closest(".ms-category-row-check");
      const editBtn  = e.target.closest(".ms-edit-btn");
      const delBtn   = e.target.closest(".ms-delete-btn");

    if (rowCheck) {
        const id = rowCheck.dataset.id;
        if (rowCheck.checked) STATE.selected.add(id); else STATE.selected.delete(id);
        if (DOM.bulkDel) DOM.bulkDel.disabled = STATE.selected.size === 0;

        const checks = DOM.tbody.querySelectorAll(".ms-category-row-check");
        const allChecked = Array.from(checks).every((c) => c.checked);
        if (DOM.selectAll) DOM.selectAll.checked = allChecked;
        return;
      }

      if (editBtn) {
        const id = editBtn.dataset.id;
        if (id) window.location.href = `./Editcategory.html?id=${encodeURIComponent(id)}`;
        return;
      }

      if (delBtn) {
        const id = delBtn.dataset.id;
        if (id) deleteOne(id);
        return;
      }
    });

    DOM.selectAll?.addEventListener("change", () => {
      const checks = DOM.tbody?.querySelectorAll(".ms-category-row-check") ?? [];
      const on = DOM.selectAll.checked;
      STATE.selected.clear();
      checks.forEach((c) => { c.checked = on; if (on) STATE.selected.add(c.dataset.id); });
      if (DOM.bulkDel) DOM.bulkDel.disabled = STATE.selected.size === 0;
    });

    DOM.bulkDel?.addEventListener("click", async () => {
      if (STATE.selected.size === 0) return;
      if (!confirm(`کیا آپ واقعی ${STATE.selected.size} موضوعات حذف کرنا چاہتے ہیں؟`)) return;

      try {
        showOverlay();
        const ids = Array.from(STATE.selected);
        const results = await Promise.allSettled(
          ids.map((id) => fetch(`${TAGS_API}/${encodeURIComponent(id)}`, { method: "DELETE" }))
        );
        const failed = [];
        results.forEach((r, i) => { if (r.status !== "fulfilled" || !r.value.ok) failed.push(ids[i]); });

        if (failed.length) alert(`⚠️ کچھ حذف نہ ہو سکیں: ${failed.join(", ")}`);
        else alert("✅ منتخب موضوعات حذف کر دیے گئے!");
        await refreshTable();
      } catch (e) {
        console.error(e);
        alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
      } finally {
        hideOverlay();
      }
    });
  }

  /* ---------- Search (debounced; server-only) ---------- */
  function initSearch() {
    const trigger = async () => {
      STATE.query = (DOM.searchInput?.value || "").trim();
      STATE.currentPage = 1;
      await refreshTable();
      hideSuggestions();
    };
    DOM.searchBtn?.addEventListener("click", trigger);

    const handleInput = debounce(async () => {
      const q = (DOM.searchInput?.value || "").trim();
      if (!q) return hideSuggestions();
      try {
        const items = await fetchSuggestions(q);
        if (!items.length) return hideSuggestions();

        DOM.suggestions.innerHTML = "";
        items.forEach((item) => {
          const n = normalizeTag(item);
          const li = document.createElement("li");
          li.className = "px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between gap-2";
          li.innerHTML = `
            <span class="truncate">${escapeHtml(n.name || "-")}</span>
            <span class="text-sm text-gray-400">${escapeHtml(String(n.id ?? ""))}</span>
          `;
          li.addEventListener("click", () => {
            DOM.searchInput.value = n.name || "";
            STATE.query = n.name || "";
            STATE.currentPage = 1;
            refreshTable();
            hideSuggestions();
          });
          DOM.suggestions.appendChild(li);
        });
        DOM.suggestions.classList.remove("hidden");
      } catch {
        hideSuggestions();
      }
    }, 250);

    DOM.searchInput?.addEventListener("input", handleInput);
    DOM.searchInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") trigger();
      if (e.key === "Escape") hideSuggestions();
    });

    document.addEventListener("click", (e) => {
      if (!DOM.suggestions?.contains(e.target) && e.target !== DOM.searchInput) hideSuggestions();
    });

    function hideSuggestions() {
      if (!DOM.suggestions) return;
      DOM.suggestions.innerHTML = "";
      DOM.suggestions.classList.add("hidden");
    }
  }

  /* ---------- Create/Update form ---------- */
  function initForm() {
    if (!DOM.form) return;

    DOM.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const id        = (DOM.fId?.value || "").trim();
      const Name      = (DOM.fName?.value || "").trim();
      const slugRaw   = (DOM.fSlug?.value || "").trim();
      const iconClass = (DOM.fIcon?.value || "").trim();
      const AboutTags = (DOM.fDesc?.innerHTML || "").trim();
      const thumbnail = DOM.fThumb?.files?.[0];

      if (!Name || !iconClass) {
        alert("❌ براہ کرم موضوع کا نام اور آئیکن درج کریں");
        return;
      }

      const formData = new FormData();
      formData.append("Name", Name);
      formData.append("slug", slugRaw || Name.toLowerCase().replace(/\s+/g, "-"));
      formData.append("iconClass", iconClass);
      formData.append("AboutTags", AboutTags);
      if (thumbnail) formData.append("tagsCover", thumbnail);

      try {
        showOverlay();
        const res = await fetch(id ? `${TAGS_API}/${encodeURIComponent(id)}` : TAGS_API, {
          method: id ? "PUT" : "POST",
          body: formData,
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          alert(data?.error || "❌ موضوع محفوظ کرنے میں مسئلہ پیش آیا");
          return;
        }

        alert(id ? "✅ موضوع اپ ڈیٹ ہوگیا!" : "✅ موضوع کامیابی سے شامل ہوگیا!");
        DOM.form.reset();
        if (DOM.fId) DOM.fId.value = "";
        STATE.currentPage = 1; // jump to newest
        await refreshTable();

        const backBtn = document.querySelector('[data-target="manage-categories"]');
        if (backBtn) backBtn.click();
      } catch (error) {
        console.error("Error saving tag:", error);
        alert("❌ کوئی مسئلہ پیش آگیا۔");
      } finally {
        hideOverlay();
      }
    });
  }

  /* ---------- Single delete ---------- */
  async function deleteOne(id) {
    if (!confirm("کیا آپ واقعی اس موضوع کو حذف کرنا چاہتے ہیں؟")) return;

    try {
      showOverlay();
      const res = await fetch(`${TAGS_API}/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.error || "❌ موضوع حذف کرنے میں مسئلہ پیش آیا");
        return;
      }

      alert("✅ موضوع کامیابی سے حذف ہوگیا!");
      await refreshTable();
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("❌ کوئی مسئلہ پیش آگیا۔");
    } finally {
      hideOverlay();
    }
  }
})();







// ----------status --------------------

const STATS_API = "https://masailworld.onrender.com/api/stats/totals";

// Load stats and update dashboard
async function loadStats() {
  try {
    const res = await fetch(STATS_API);
    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error("❌ Failed to fetch stats:", data.error);
      return;
    }

    const counts = data.counts;

    // Map API keys to DOM IDs
    document.getElementById("ms-total-fatawa").innerText = counts.fatawa || 0;
    document.getElementById("ms-total-articles").innerText =
      counts.articles || 0;
    document.getElementById("ms-total-books").innerText = counts.books || 0;
    document.getElementById("ms-total-users").innerText = counts.users || 0;
    document.getElementById("ms-total-categories").innerText = counts.tags || 0;
    document.getElementById("ms-total-questions").innerText = counts.ulema || 0;
    document.getElementById("ms-total-submissions").innerText =
      counts.ulema || 0; // adjust if you have real table
  } catch (error) {
    console.error("❌ Error loading stats:", error);
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadStats);



// Pending Questions
(() => {
  const FATWA_API = "https://masailworld.onrender.com/api/fatwa";

  document.addEventListener("DOMContentLoaded", () => {
    cacheDom();
    initUI();
    initSearch();
    refreshTable(); // initial load
  });

  /* ---------- State ---------- */
  const STATE = {
    pageSize: 10,
    currentPage: 1,
    hasNext: false,     // computed with "one extra" fetch
    selected: new Set(),
    query: "",
  };

  /* ---------- DOM ---------- */
  const DOM = {};
  function cacheDom() {
    DOM.tbody     = document.getElementById("ms-questions-table-body");
    DOM.pager     = document.getElementById("ms-questions-pagination");
    DOM.selectAll = document.getElementById("ms-questions-select-all");
    DOM.bulkDel   = document.getElementById("ms-questions-bulk-delete-btn");

    DOM.searchInput = document.getElementById("ms-questions-search");
    DOM.searchBtn   = document.getElementById("ms-questions-search-btn");
    DOM.suggestions = document.getElementById("ms-questions-suggestions");

    DOM.overlay   = document.getElementById("questions-global-loader");
  }

  /* ---------- Utils ---------- */
  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  function showOverlay() { DOM.overlay?.classList.remove("hidden"); }
  function hideOverlay() { DOM.overlay?.classList.add("hidden"); }

  function statusBadge(status) {
    const s = (status || "").toLowerCase();
    const map = {
      pending: "text-yellow-700 bg-yellow-100",
      answered: "text-green-700 bg-green-100",
      rejected: "text-red-700 bg-red-100",
    };
    const cls = map[s] || "text-gray-700 bg-gray-100";
    return `<span class="px-2 py-1 rounded-md text-sm font-semibold ${cls}">${escapeHtml(status || "-")}</span>`;
  }

  /* ---------- Fetch helpers ---------- */
  // We hit /pending and pass limit/offset (&q optional).
  async function fetchPage(page) {
    const offset = (page - 1) * STATE.pageSize;

    const url = new URL(`${FATWA_API}/pending`);
    // request one extra row to detect next
    url.searchParams.set("limit", STATE.pageSize + 1);
    url.searchParams.set("offset", offset);
    if (STATE.query) url.searchParams.set("q", STATE.query);

    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);

    let rows = Array.isArray(json) ? json
             : Array.isArray(json.rows) ? json.rows
             : Array.isArray(json.data) ? json.data
             : Array.isArray(json.items) ? json.items
             : [];

    // hasNext detection
    let hasNext = false;
    if (rows.length > STATE.pageSize) {
      hasNext = true;
      rows = rows.slice(0, STATE.pageSize);
    }
    return { rows, hasNext };
  }

  /* ---------- Render ---------- */
  function renderPagination() {
    if (!DOM.pager) return;
    DOM.pager.innerHTML = "";

    const makeBtn = (label, page, disabled = false, active = false) => {
      const b = document.createElement("button");
      b.textContent = label;
      b.className =
        "min-w-[2.5rem] px-3 py-2 rounded-md border text-sm " +
        (active
          ? "bg-midnight_green text-white border-midnight_green"
          : "bg-white border-gray-300 hover:bg-gray-50") +
        (disabled ? " opacity-50 cursor-not-allowed" : "");
      b.disabled = disabled;
      if (!disabled) {
        b.addEventListener("click", () => {
          if (page !== STATE.currentPage) {
            STATE.currentPage = page;
            refreshTable();
          }
        });
      }
      return b;
    };

    // First & Prev
    DOM.pager.appendChild(makeBtn("اول", 1, STATE.currentPage === 1));
    DOM.pager.appendChild(
      makeBtn("پچھلا", Math.max(1, STATE.currentPage - 1), STATE.currentPage === 1)
    );

    // Small numeric window (no totals)
    const start = Math.max(1, STATE.currentPage - 2);
    const end   = STATE.hasNext ? STATE.currentPage + 2 : STATE.currentPage;
    for (let p = start; p <= end; p++) {
      if (p <= 0) continue;
      DOM.pager.appendChild(makeBtn(String(p), p, false, p === STATE.currentPage));
    }

    // Next & Last (Last behaves like Next when totals are unknown)
    DOM.pager.appendChild(
      makeBtn("اگلا", STATE.currentPage + 1, !STATE.hasNext)
    );
    DOM.pager.appendChild(
      makeBtn("آخری", STATE.currentPage + 1, !STATE.hasNext)
    );
  }

  function renderRows(list) {
    if (!DOM.tbody) return;

    DOM.tbody.innerHTML = "";
    STATE.selected.clear();
    if (DOM.selectAll) DOM.selectAll.checked = false;
    if (DOM.bulkDel)   DOM.bulkDel.disabled = true;

    if (!list.length) {
      DOM.tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-500">کوئی ریکارڈ نہیں ملا</td></tr>`;
      return;
    }

    list.forEach((f) => {
      const id = f.id ?? f.Id ?? f.ID;
      const userName = f.questionername ?? f.userName ?? "نامعلوم";
      const summary = (f.detailquestion || f.summary || "")
        .toString()
        .replace(/\s+/g, " ")
        .trim();
      const short = summary.length > 80 ? summary.slice(0, 80) + "…" : summary;
      const status = f.status ?? f.Status ?? "pending";

      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100 hover:bg-gray-50";
      tr.innerHTML = `
        <td class="py-3 px-4 align-middle">
          <input type="checkbox" class="ms-question-row-check w-5 h-5 accent-midnight_green" data-id="${id}" />
        </td>
        <td class="py-3 px-4 align-middle">${escapeHtml(String(id))}</td>
        <td class="py-3 px-4 align-middle">${escapeHtml(userName)}</td>
        <td class="py-3 px-4 align-middle">${escapeHtml(short)}</td>
        <td class="py-3 px-4 align-middle">${statusBadge(status)}</td>
        <td class="py-3 px-4 align-middle">
          <div class="flex gap-3 justify-end">
            <a href="Answer.html?id=${id}" 
               class="bg-midnight_green text-white px-3 py-2 rounded hover:bg-midnight_green-400 inline-block">
              جواب دیں
            </a>
            <button class="ms-delete-btn text-red-600 hover:underline" data-id="${id}">حذف کریں</button>
          </div>
        </td>
      `;
      DOM.tbody.appendChild(tr);
    });
  }

  /* ---------- Main refresh ---------- */
  async function refreshTable() {
    try {
      if (DOM.tbody) {
        DOM.tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6">Loading…</td></tr>`;
      }
      const { rows, hasNext } = await fetchPage(STATE.currentPage);

      // overshot page? go back once
      if (rows.length === 0 && STATE.currentPage > 1) {
        STATE.currentPage -= 1;
        const back = await fetchPage(STATE.currentPage);
        STATE.hasNext = back.hasNext;
        renderRows(back.rows);
        renderPagination();
        return;
      }

      STATE.hasNext = hasNext;
      renderRows(rows);
      renderPagination();
    } catch (err) {
      console.error("load questions error:", err);
      if (DOM.tbody) {
        DOM.tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red-600 py-6">Failed to load</td></tr>`;
      }
    }
  }

  /* ---------- UI / Events ---------- */
  function initUI() {
    // row delegation
    DOM.tbody?.addEventListener("click", (e) => {
      const rowCheck = e.target.closest(".ms-question-row-check");
      const delBtn   = e.target.closest(".ms-delete-btn");

      // select row
      if (rowCheck) {
        const id = rowCheck.dataset.id;
        if (rowCheck.checked) STATE.selected.add(id);
        else STATE.selected.delete(id);

        if (DOM.bulkDel) DOM.bulkDel.disabled = STATE.selected.size === 0;

        const checks = DOM.tbody.querySelectorAll(".ms-question-row-check");
        const allChecked = Array.from(checks).every((c) => c.checked);
        if (DOM.selectAll) DOM.selectAll.checked = allChecked;
        return;
      }

      // delete single
      if (delBtn) {
        const id = delBtn.dataset.id;
        if (id) deleteOne(id);
        return;
      }
    });

    // header select all
    DOM.selectAll?.addEventListener("change", () => {
      const checks = DOM.tbody?.querySelectorAll(".ms-question-row-check") ?? [];
      const on = DOM.selectAll.checked;
      STATE.selected.clear();
      checks.forEach((c) => {
        c.checked = on;
        if (on) STATE.selected.add(c.dataset.id);
      });
      if (DOM.bulkDel) DOM.bulkDel.disabled = STATE.selected.size === 0;
    });

    // bulk delete
    DOM.bulkDel?.addEventListener("click", async () => {
      if (STATE.selected.size === 0) return;
      if (!confirm(`کیا آپ واقعی ${STATE.selected.size} سوالات حذف کرنا چاہتے ہیں؟`)) return;

      try {
        showOverlay();
        const ids = Array.from(STATE.selected);
        const results = await Promise.allSettled(
          ids.map((id) => fetch(`${FATWA_API}/${id}`, { method: "DELETE" }))
        );

        const failed = [];
        results.forEach((r, i) => {
          if (r.status !== "fulfilled" || !r.value.ok) failed.push(ids[i]);
        });

        if (failed.length) {
          alert(`⚠️ کچھ حذف نہ ہو سکیں: ${failed.join(", ")}`);
        } else {
          alert("✅ منتخب سوالات حذف کر دیے گئے!");
        }
        await refreshTable();
      } catch (e) {
        console.error(e);
        alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
      } finally {
        hideOverlay();
      }
    });
  }

  /* ---------- Search ---------- */
  function initSearch() {
    const trigger = async () => {
      STATE.query = (DOM.searchInput?.value || "").trim();
      STATE.currentPage = 1;
      await refreshTable();
    };
    DOM.searchBtn?.addEventListener("click", trigger);
    DOM.searchInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") trigger();
    });
    DOM.searchInput?.addEventListener("input", () => {
      DOM.suggestions?.classList.add("hidden");
    });
  }

  /* ---------- Delete single ---------- */
  async function deleteOne(id) {
    if (!confirm("کیا آپ واقعی اس سوال کو حذف کرنا چاہتے ہیں؟")) return;
    try {
      showOverlay();
      const res = await fetch(`${FATWA_API}/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || "❌ سوال حذف کرنے میں مسئلہ پیش آیا");
        return;
      }
      alert("✅ سوال حذف ہوگیا!");
      await refreshTable();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("❌ کوئی مسئلہ پیش آگیا۔");
    } finally {
      hideOverlay();
    }
  }
})();





// Listing Fatawa Search

(function () {
  const tbody = document.getElementById("ms-fatawa-table-body");
  const input = document.getElementById("ms-fatawa-search");
  const btn = document.getElementById("ms-fatawa-search-btn");
  const dd = document.getElementById("ms-fatawa-suggestions");

  let currentIndex = -1; // for keyboard navigation
  let lastQuery = "";

  // Utility: get all row data (live)
  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  // Build a display string per row for matching + a label for suggestions
  function rowToRecord(tr) {
    const cells = tr.querySelectorAll("td, th");
    // Expected order: [0]=number, [1]=title, [2]=mufti, [3]=date
    const number = cells[0]?.innerText?.trim() || "";
    const title = cells[1]?.innerText?.trim() || "";
    const mufti = cells[2]?.innerText?.trim() || "";
    const date = cells[3]?.innerText?.trim() || "";
    const haystack = [number, title, mufti, date].join(" | ").toLowerCase();
    const label = title || number || "—";
    return { tr, number, title, mufti, date, haystack, label };
  }

  // Show/hide dropdown
  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    currentIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  // Render suggestions list
  function renderSuggestions(records, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 10;
    let count = 0;
    records.forEach((rec) => {
      if (count >= max) return;
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
      // Simple highlight (no HTML injection)
      const safe = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const title = rec.title || "—";
      const meta = `${rec.number} • ${rec.mufti} • ${rec.date}`.replace(
        /^ • /,
        ""
      );
      li.innerHTML = `
          <div class="font-medium">${safe(title)}</div>
          <div class="text-sm text-gray-500">${safe(meta)}</div>
        `;
      li.addEventListener("click", () => {
        input.value = rec.title || rec.number;
        applyFilter(q);
        hideDropdown();
        // Scroll the matched row into view
        rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
        rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
        setTimeout(
          () =>
            rec.tr.classList.remove("ring-2", "ring-midnight_green", "rounded"),
          1200
        );
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });
      dd.appendChild(li);
      count++;
    });

    if (count === 0) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }

    showDropdown();
  }

  // Core filter
  function applyFilter(q) {
    const query = (q ?? input.value).trim().toLowerCase();
    lastQuery = query;

    const rows = getRows();
    const records = rows.map(rowToRecord);

    // Filter rows
    let visibleCount = 0;
    records.forEach((rec) => {
      const match = !query || rec.haystack.includes(query);
      rec.tr.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    // Rebuild suggestions based on matches
    renderSuggestions(
      records.filter((r) => r.haystack.includes(query)),
      query
    );

    // If search cleared, hide dropdown
    if (!query) hideDropdown();

    // If no matches, still show "no result" dropdown
    if (query && visibleCount === 0) showDropdown();
  }

  // Debounce helper
  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedFilter = debounce(() => applyFilter(input.value), 150);

  // Events
  input.addEventListener("input", debouncedFilter);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilter(input.value);
  });

  // Keyboard navigation for dropdown
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if (dd.classList.contains("hidden") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      } else {
        // run search if no selection
        applyFilter(input.value);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // Watch for dynamic table changes (if rows come later via JS)
  const mo = new MutationObserver(() => {
    // Re-apply current filter when table updates
    applyFilter(lastQuery);
  });
  mo.observe(tbody, { childList: true, subtree: true });

  // Initial pass (if table already has rows)
  applyFilter("");
})();

// Listing Article Search

(function () {
  const tbody = document.getElementById("ms-articles-table-body");
  const input = document.getElementById("ms-articles-search");
  const btn = document.getElementById("ms-articles-search-btn");
  const dd = document.getElementById("ms-articles-suggestions");

  let currentIndex = -1;
  let lastQuery = "";

  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  // Map each row -> searchable record
  function rowToRecord(tr) {
    const cells = tr.querySelectorAll("td, th");
    // Expected order: [0]=title, [1]=author, [2]=date
    const title = cells[0]?.innerText?.trim() || "";
    const author = cells[1]?.innerText?.trim() || "";
    const date = cells[2]?.innerText?.trim() || "";
    const haystack = [title, author, date].join(" | ").toLowerCase();
    const label = title || author || "—";
    return { tr, title, author, date, haystack, label };
  }

  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    currentIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  function renderSuggestions(records, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 10;
    let count = 0;

    records.slice(0, max).forEach((rec) => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";

      const safe = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const meta = `${rec.author} • ${rec.date}`.replace(/^ • /, "");

      li.innerHTML = `
          <div class="font-medium">${safe(rec.title || "—")}</div>
          <div class="text-sm text-gray-500">${safe(meta)}</div>
        `;

      li.addEventListener("click", () => {
        input.value = rec.title || rec.author;
        applyFilter(q);
        hideDropdown();
        rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
        rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
        setTimeout(
          () =>
            rec.tr.classList.remove("ring-2", "ring-midnight_green", "rounded"),
          1200
        );
      });

      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });

      dd.appendChild(li);
      count++;
    });

    if (count === 0) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }

    showDropdown();
  }

  function applyFilter(q) {
    const query = (q ?? input.value).trim().toLowerCase();
    lastQuery = query;

    const rows = getRows();
    const records = rows.map(rowToRecord);

    // Filter table rows
    let visibleCount = 0;
    records.forEach((rec) => {
      const match = !query || rec.haystack.includes(query);
      rec.tr.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    // Suggestions mirror the matches
    renderSuggestions(
      records.filter((r) => r.haystack.includes(query)),
      query
    );

    if (!query) hideDropdown();
    if (query && visibleCount === 0) showDropdown();
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedFilter = debounce(() => applyFilter(input.value), 150);

  // Wire up events
  input.addEventListener("input", debouncedFilter);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilter(input.value);
  });

  // Keyboard nav for suggestions
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if (dd.classList.contains("hidden") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      } else {
        applyFilter(input.value);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // If rows are injected later, keep filter in sync
  const mo = new MutationObserver(() => applyFilter(lastQuery));
  mo.observe(tbody, { childList: true, subtree: true });

  // Initial pass
  applyFilter("");
})();

// Listing Book search

(function () {
  const tbody = document.getElementById("ms-books-table-body");
  const input = document.getElementById("ms-books-search");
  const btn = document.getElementById("ms-books-search-btn");
  const dd = document.getElementById("ms-books-suggestions");

  let currentIndex = -1;
  let lastQuery = "";

  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  // Convert a table row into a searchable record
  function rowToRecord(tr) {
    const cells = tr.querySelectorAll("td, th");
    // Expected order: [0]=book title, [1]=author, [2]=actions
    const title = cells[0]?.innerText?.trim() || "";
    const author = cells[1]?.innerText?.trim() || "";
    const haystack = [title, author].join(" | ").toLowerCase();
    return { tr, title, author, haystack };
  }

  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    currentIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  function renderSuggestions(records, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 10;
    const safe = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    records.slice(0, max).forEach((rec) => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
      li.innerHTML = `
          <div class="font-medium">${safe(rec.title || "—")}</div>
          <div class="text-sm text-gray-500">${safe(rec.author || "")}</div>
        `;
      li.addEventListener("click", () => {
        input.value = rec.title || rec.author || "";
        applyFilter(q);
        hideDropdown();
        rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
        rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
        setTimeout(
          () =>
            rec.tr.classList.remove("ring-2", "ring-midnight_green", "rounded"),
          1200
        );
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });
      dd.appendChild(li);
    });

    if (!dd.children.length) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }

    showDropdown();
  }

  function applyFilter(q) {
    const query = (q ?? input.value).trim().toLowerCase();
    lastQuery = query;

    const rows = getRows();
    const records = rows.map(rowToRecord);

    let visibleCount = 0;
    records.forEach((rec) => {
      const match = !query || rec.haystack.includes(query);
      rec.tr.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    renderSuggestions(
      records.filter((r) => r.haystack.includes(query)),
      query
    );

    if (!query) hideDropdown();
    if (query && visibleCount === 0) showDropdown();
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedFilter = debounce(() => applyFilter(input.value), 150);

  // Events
  input.addEventListener("input", debouncedFilter);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilter(input.value);
  });

  // Keyboard navigation for the dropdown
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if (dd.classList.contains("hidden") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      } else {
        applyFilter(input.value);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // Keep results in sync if rows load dynamically
  const mo = new MutationObserver(() => applyFilter(lastQuery));
  mo.observe(tbody, { childList: true, subtree: true });

  // Initial render
  applyFilter("");
})();

// Listing Ulema Searching

(function () {
  const tbody = document.getElementById("ms-ulema-table-body");
  const input = document.getElementById("ms-ulema-search");
  const btn = document.getElementById("ms-ulema-search-btn");
  const dd = document.getElementById("ms-ulema-suggestions");

  let currentIndex = -1;
  let lastQuery = "";

  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  // Map row -> searchable record
  function rowToRecord(tr) {
    const cells = tr.querySelectorAll("td, th");
    // Expected order: [0]=name, [1]=designation, [2]=actions
    const name = cells[0]?.innerText?.trim() || "";
    const designation = cells[1]?.innerText?.trim() || "";
    const haystack = [name, designation].join(" | ").toLowerCase();
    return { tr, name, designation, haystack };
  }

  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    currentIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  function renderSuggestions(records, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 10;
    const safe = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    records.slice(0, max).forEach((rec) => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
      li.innerHTML = `
          <div class="font-medium">${safe(rec.name || "—")}</div>
          <div class="text-sm text-gray-500">${safe(
            rec.designation || ""
          )}</div>
        `;
      li.addEventListener("click", () => {
        input.value = rec.name || rec.designation || "";
        applyFilter(q);
        hideDropdown();
        rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
        rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
        setTimeout(
          () =>
            rec.tr.classList.remove("ring-2", "ring-midnight_green", "rounded"),
          1200
        );
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });
      dd.appendChild(li);
    });

    if (!dd.children.length) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }

    showDropdown();
  }

  function applyFilter(q) {
    const query = (q ?? input.value).trim().toLowerCase();
    lastQuery = query;

    const rows = getRows();
    const records = rows.map(rowToRecord);

    let visibleCount = 0;
    records.forEach((rec) => {
      const match = !query || rec.haystack.includes(query);
      rec.tr.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    renderSuggestions(
      records.filter((r) => r.haystack.includes(query)),
      query
    );

    if (!query) hideDropdown();
    if (query && visibleCount === 0) showDropdown();
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedFilter = debounce(() => applyFilter(input.value), 150);

  // Events
  input.addEventListener("input", debouncedFilter);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilter(input.value);
  });

  // Keyboard navigation in dropdown
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if (dd.classList.contains("hidden") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      } else {
        applyFilter(input.value);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // Keep in sync if rows load dynamically
  const mo = new MutationObserver(() => applyFilter(lastQuery));
  mo.observe(tbody, { childList: true, subtree: true });

  // Initial render
  applyFilter("");
})();

// Listing Category Search

(function () {
  const tbody = document.getElementById("ms-categories-table-body");
  const input = document.getElementById("ms-categories-search");
  const btn = document.getElementById("ms-categories-search-btn");
  const dd = document.getElementById("ms-categories-suggestions");

  let currentIndex = -1;
  let lastQuery = "";

  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  // Extract searchable data from each row
  function rowToRecord(tr) {
    const cells = tr.querySelectorAll("td, th");
    // Expected order: [0]=thumbnail, [1]=name, [2]=icon, [3]=actions
    const name = cells[1]?.innerText?.trim() || "";
    const icon = cells[2]?.innerText?.trim() || "";
    const haystack = [name, icon].join(" | ").toLowerCase();
    return { tr, name, icon, haystack };
  }

  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    currentIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  function renderSuggestions(records, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 10;
    const safe = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    records.slice(0, max).forEach((rec) => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
      li.innerHTML = `
          <div class="font-medium">${safe(rec.name || "—")}</div>
          <div class="text-sm text-gray-500">${safe(rec.icon || "")}</div>
        `;
      li.addEventListener("click", () => {
        input.value = rec.name || rec.icon || "";
        applyFilter(q);
        hideDropdown();
        rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
        rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
        setTimeout(
          () =>
            rec.tr.classList.remove("ring-2", "ring-midnight_green", "rounded"),
          1200
        );
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });
      dd.appendChild(li);
    });

    if (!dd.children.length) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }

    showDropdown();
  }

  function applyFilter(q) {
    const query = (q ?? input.value).trim().toLowerCase();
    lastQuery = query;

    const rows = getRows();
    const records = rows.map(rowToRecord);

    let visibleCount = 0;
    records.forEach((rec) => {
      const match = !query || rec.haystack.includes(query);
      rec.tr.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    renderSuggestions(
      records.filter((r) => r.haystack.includes(query)),
      query
    );

    if (!query) hideDropdown();
    if (query && visibleCount === 0) showDropdown();
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedFilter = debounce(() => applyFilter(input.value), 150);

  // Events
  input.addEventListener("input", debouncedFilter);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilter(input.value);
  });

  // Keyboard navigation in dropdown
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if (dd.classList.contains("hidden") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      } else {
        applyFilter(input.value);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Close dropdown on outside click
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // Keep in sync if rows load dynamically
  const mo = new MutationObserver(() => applyFilter(lastQuery));
  mo.observe(tbody, { childList: true, subtree: true });

  // Initial render
  applyFilter("");
})();

// Listing Question Search input

(function () {
  const tbody = document.getElementById("ms-questions-table-body");
  const input = document.getElementById("ms-questions-search");
  const btn = document.getElementById("ms-questions-search-btn");
  const dd = document.getElementById("ms-questions-suggestions");

  let currentIndex = -1;
  let lastQuery = "";

  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  // Extract searchable data from each row
  function rowToRecord(tr) {
    const cells = tr.querySelectorAll("td, th");
    // Expected: [0]=user, [1]=summary, [2]=status, [3]=actions
    const user = cells[0]?.innerText?.trim() || "";
    const summary = cells[1]?.innerText?.trim() || "";
    const status = cells[2]?.innerText?.trim() || "";
    const haystack = [user, summary, status].join(" | ").toLowerCase();
    return { tr, user, summary, status, haystack };
  }

  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    currentIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  function renderSuggestions(records, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 10;
    const safe = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    records.slice(0, max).forEach((rec) => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
      li.innerHTML = `
          <div class="font-medium">${safe(rec.summary || "—")}</div>
          <div class="text-sm text-gray-500">${safe(rec.user)} • ${safe(
        rec.status
      )}</div>
        `;
      li.addEventListener("click", () => {
        input.value = rec.summary || rec.user || "";
        applyFilter(q);
        hideDropdown();
        rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
        rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
        setTimeout(
          () =>
            rec.tr.classList.remove("ring-2", "ring-midnight_green", "rounded"),
          1200
        );
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });
      dd.appendChild(li);
    });

    if (!dd.children.length) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }

    showDropdown();
  }

  function applyFilter(q) {
    const query = (q ?? input.value).trim().toLowerCase();
    lastQuery = query;

    const rows = getRows();
    const records = rows.map(rowToRecord);

    let visibleCount = 0;
    records.forEach((rec) => {
      const match = !query || rec.haystack.includes(query);
      rec.tr.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    renderSuggestions(
      records.filter((r) => r.haystack.includes(query)),
      query
    );

    if (!query) hideDropdown();
    if (query && visibleCount === 0) showDropdown();
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedFilter = debounce(() => applyFilter(input.value), 150);

  // Events
  input.addEventListener("input", debouncedFilter);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilter(input.value);
  });

  // Keyboard navigation
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if (dd.classList.contains("hidden") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      } else {
        applyFilter(input.value);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // Observe table for dynamic row updates
  const mo = new MutationObserver(() => applyFilter(lastQuery));
  mo.observe(tbody, { childList: true, subtree: true });

  // Initial filter
  applyFilter("");
})();

// Listing a User search input

(function () {
  const tbody = document.getElementById("ms-users-table-body");
  const input = document.getElementById("ms-users-search");
  const btn = document.getElementById("ms-users-search-btn");
  const dd = document.getElementById("ms-users-suggestions");

  let currentIndex = -1;
  let lastQuery = "";

  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  // Extract searchable data
  function rowToRecord(tr) {
    const cells = tr.querySelectorAll("td, th");
    // Expected: [0]=name, [1]=email, [2]=actions
    const name = cells[0]?.innerText?.trim() || "";
    const email = cells[1]?.innerText?.trim() || "";
    const haystack = [name, email].join(" | ").toLowerCase();
    return { tr, name, email, haystack };
  }

  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    currentIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  function renderSuggestions(records, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 10;
    const safe = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    records.slice(0, max).forEach((rec) => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";
      li.innerHTML = `
          <div class="font-medium">${safe(rec.name || "—")}</div>
          <div class="text-sm text-gray-500">${safe(rec.email || "")}</div>
        `;
      li.addEventListener("click", () => {
        input.value = rec.name || rec.email || "";
        applyFilter(q);
        hideDropdown();
        rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
        rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
        setTimeout(
          () =>
            rec.tr.classList.remove("ring-2", "ring-midnight_green", "rounded"),
          1200
        );
      });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });
      dd.appendChild(li);
    });

    if (!dd.children.length) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }

    showDropdown();
  }

  function applyFilter(q) {
    const query = (q ?? input.value).trim().toLowerCase();
    lastQuery = query;

    const rows = getRows();
    const records = rows.map(rowToRecord);

    let visibleCount = 0;
    records.forEach((rec) => {
      const match = !query || rec.haystack.includes(query);
      rec.tr.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    renderSuggestions(
      records.filter((r) => r.haystack.includes(query)),
      query
    );

    if (!query) hideDropdown();
    if (query && visibleCount === 0) showDropdown();
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  const debouncedFilter = debounce(() => applyFilter(input.value), 150);

  // Events
  input.addEventListener("input", debouncedFilter);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    applyFilter(input.value);
  });

  // Keyboard navigation
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if (dd.classList.contains("hidden") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[currentIndex].classList.add("bg-gray-100");
      items[currentIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (currentIndex >= 0 && items[currentIndex]) {
        e.preventDefault();
        items[currentIndex].click();
      } else {
        applyFilter(input.value);
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // Watch for table updates
  const mo = new MutationObserver(() => applyFilter(lastQuery));
  mo.observe(tbody, { childList: true, subtree: true });

  // Initial
  applyFilter("");
})();

// Global Search functionality

(function () {
  // --- Elements
  const input = document.getElementById("ms-global-search");
  const btn = document.getElementById("ms-global-search-btn");
  const dd = document.getElementById("ms-global-search-suggestions");

  if (!input || !btn || !dd) return;

  // --- Config: where things live
  const sections = [
    {
      key: "fatawa",
      hash: "manage-fatawa",
      tbodyId: "ms-fatawa-table-body",
      cols: ["number", "title", "mufti", "date"],
    },
    {
      key: "articles",
      hash: "manage-articles",
      tbodyId: "ms-articles-table-body",
      cols: ["title", "author", "date"],
    },
    {
      key: "books",
      hash: "manage-books",
      tbodyId: "ms-books-table-body",
      cols: ["title", "author"],
    },
    {
      key: "ulema",
      hash: "manage-ulema",
      tbodyId: "ms-ulema-table-body",
      cols: ["name", "designation"],
    },
    {
      key: "categories",
      hash: "manage-categories",
      tbodyId: "ms-categories-table-body",
      cols: ["(thumb)", "name", "icon"],
    },
    {
      key: "questions",
      hash: "manage-questions",
      tbodyId: "ms-questions-table-body",
      cols: ["user", "summary", "status"],
    },
    {
      key: "users",
      hash: "manage-users",
      tbodyId: "ms-users-table-body",
      cols: ["name", "email"],
    },
    {
      key: "submissions",
      hash: "manage-submissions",
      tbodyId: "ms-submissions-table-body",
      cols: ["title", "mufti", "date", "status"],
    },
  ];

  // Nice, short type labels for the dropdown badges
  const typeLabels = {
    fatawa: "فتویٰ",
    articles: "مضمون",
    books: "کتاب",
    ulema: "عالم",
    categories: "موضوع",
    questions: "سوال",
    users: "صارف",
    submissions: "گذارش",
  };

  // --- Helpers
  const safe = (s = "") =>
    String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function getRecords() {
    const recs = [];
    sections.forEach((cfg) => {
      const tbody = document.getElementById(cfg.tbodyId);
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll("tr"));
      rows.forEach((tr, idx) => {
        const tds = tr.querySelectorAll("td, th");

        // Map common shapes by index (based on your tables)
        let primary = "",
          secondary = "",
          meta = "";
        switch (cfg.key) {
          case "fatawa": {
            const number = tds[0]?.innerText?.trim() || "";
            const title = tds[1]?.innerText?.trim() || "";
            const mufti = tds[2]?.innerText?.trim() || "";
            const date = tds[3]?.innerText?.trim() || "";
            primary = title || number;
            secondary = mufti;
            meta = date;
            addRec(
              cfg,
              tr,
              [number, title, mufti, date],
              primary,
              secondary,
              meta,
              idx
            );
            break;
          }
          case "articles": {
            const title = tds[0]?.innerText?.trim() || "";
            const author = tds[1]?.innerText?.trim() || "";
            const date = tds[2]?.innerText?.trim() || "";
            primary = title;
            secondary = author;
            meta = date;
            addRec(
              cfg,
              tr,
              [title, author, date],
              primary,
              secondary,
              meta,
              idx
            );
            break;
          }
          case "books": {
            const title = tds[0]?.innerText?.trim() || "";
            const author = tds[1]?.innerText?.trim() || "";
            primary = title;
            secondary = author;
            addRec(cfg, tr, [title, author], primary, secondary, "", idx);
            break;
          }
          case "ulema": {
            const name = tds[0]?.innerText?.trim() || "";
            const designation = tds[1]?.innerText?.trim() || "";
            primary = name;
            secondary = designation;
            addRec(cfg, tr, [name, designation], primary, secondary, "", idx);
            break;
          }
          case "categories": {
            const name = tds[1]?.innerText?.trim() || "";
            const icon = tds[2]?.innerText?.trim() || "";
            primary = name;
            secondary = icon;
            addRec(cfg, tr, [name, icon], primary, secondary, "", idx);
            break;
          }
          case "questions": {
            const user = tds[0]?.innerText?.trim() || "";
            const summary = tds[1]?.innerText?.trim() || "";
            const status = tds[2]?.innerText?.trim() || "";
            primary = summary || user;
            secondary = user;
            meta = status;
            addRec(
              cfg,
              tr,
              [user, summary, status],
              primary,
              secondary,
              meta,
              idx
            );
            break;
          }
          case "users": {
            const name = tds[0]?.innerText?.trim() || "";
            const email = tds[1]?.innerText?.trim() || "";
            primary = name;
            secondary = email;
            addRec(cfg, tr, [name, email], primary, secondary, "", idx);
            break;
          }
          case "submissions": {
            const title = tds[0]?.innerText?.trim() || "";
            const mufti = tds[1]?.innerText?.trim() || "";
            const date = tds[2]?.innerText?.trim() || "";
            const status = tds[3]?.innerText?.trim() || "";
            primary = title;
            secondary = mufti;
            meta = `${date} • ${status}`.replace(/^ • /, "");
            addRec(
              cfg,
              tr,
              [title, mufti, date, status],
              primary,
              secondary,
              meta,
              idx
            );
            break;
          }
        }

        function addRec(cfg, tr, fields, primary, secondary, meta, idx) {
          const hay = fields.join(" | ").toLowerCase();
          recs.push({
            type: cfg.key,
            typeLabel: typeLabels[cfg.key] || cfg.key,
            hash: cfg.hash,
            tr,
            index: idx,
            primary: primary || "—",
            secondary: secondary || "",
            meta: meta || "",
            haystack: hay,
          });
        }
      });
    });
    return recs;
  }

  function showDropdown() {
    dd.classList.remove("hidden");
  }
  function hideDropdown() {
    dd.classList.add("hidden");
    activeIndex = -1;
    Array.from(dd.children).forEach((li) => li.classList.remove("bg-gray-100"));
  }

  function render(results, q) {
    dd.innerHTML = "";
    if (!q) {
      hideDropdown();
      return;
    }

    const max = 12;
    results.slice(0, max).forEach((r, i) => {
      const li = document.createElement("li");
      li.tabIndex = 0;
      li.className = "px-4 py-2 cursor-pointer hover:bg-gray-100";

      const badge = `
        <span class="text-xs inline-block rounded-md px-2 py-0.5 border mr-2 align-middle">
          ${safe(r.typeLabel)}
        </span>
      `;
      const meta = r.meta
        ? `<span class="text-gray-500 text-sm">• ${safe(r.meta)}</span>`
        : "";

      li.innerHTML = `
        <div class="flex items-start gap-2">
          ${badge}
          <div class="min-w-0">
            <div class="font-medium truncate">${safe(r.primary)}</div>
            <div class="text-sm text-gray-500 truncate">${safe(
              r.secondary
            )} ${meta}</div>
          </div>
        </div>
      `;

      li.addEventListener("click", () => jumpTo(r));
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter") li.click();
      });
      dd.appendChild(li);
    });

    if (!dd.children.length) {
      const li = document.createElement("li");
      li.className = "px-4 py-2 text-gray-500";
      li.textContent = "کوئی نتیجہ نہیں ملا";
      dd.appendChild(li);
    }
    showDropdown();
  }

  function jumpTo(rec) {
    const doScroll = () => {
      // Ensure target page is visible (your app uses hash routing)
      if (location.hash !== "#" + rec.hash) {
        location.hash = rec.hash;
      }
      // Scroll to row (might need a short delay for page switch/render)
      setTimeout(() => {
        try {
          rec.tr.scrollIntoView({ behavior: "smooth", block: "center" });
          rec.tr.classList.add("ring-2", "ring-midnight_green", "rounded");
          setTimeout(
            () =>
              rec.tr.classList.remove(
                "ring-2",
                "ring-midnight_green",
                "rounded"
              ),
            1200
          );
        } catch (_) {}
      }, 250);
    };
    doScroll();
    hideDropdown();
  }

  function searchNow() {
    const q = input.value.trim().toLowerCase();
    const recs = getRecords();
    const results = !q ? [] : recs.filter((r) => r.haystack.includes(q));
    render(results, q);
  }

  // Debounce
  function debounce(fn, ms) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, a), ms);
    };
  }
  const debouncedSearch = debounce(searchNow, 150);

  // Keyboard navigation
  let activeIndex = -1;
  input.addEventListener("keydown", (e) => {
    const items = Array.from(dd.querySelectorAll("li"));
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && items.length) {
      e.preventDefault();
      activeIndex =
        e.key === "ArrowDown"
          ? (activeIndex + 1) % items.length
          : (activeIndex - 1 + items.length) % items.length;
      items.forEach((li) => li.classList.remove("bg-gray-100"));
      items[activeIndex].classList.add("bg-gray-100");
      items[activeIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && items[activeIndex]) {
        e.preventDefault();
        items[activeIndex].click();
      } else {
        searchNow();
      }
    } else if (e.key === "Escape") {
      hideDropdown();
    }
  });

  // Events
  input.addEventListener("input", debouncedSearch);
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    searchNow();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target) && e.target !== input) hideDropdown();
  });

  // Re-index on table mutations to keep results fresh
  const observedTbodyIds = sections.map((s) => s.tbodyId);
  const mo = new MutationObserver(() => {
    if (input.value.trim()) searchNow();
  });
  observedTbodyIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) mo.observe(el, { childList: true, subtree: true });
  });
})();





// Latest Entry Display section 

(() => {
  const ACTIVITY_API = "https://masailworld.onrender.com/api/activity/recent?limit=1";

  const els = {
    loader: document.getElementById("ms-recent-activity-loader"),
    books: document.getElementById("ms-activity-books"),
    articles: document.getElementById("ms-activity-articles"),
    fatawa: document.getElementById("ms-activity-fatawa"),
    ulema: document.getElementById("ms-activity-ulema"),
    tags: document.getElementById("ms-activity-tags"),
    users: document.getElementById("ms-activity-users"),
  };

  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");

  function showLoader(){ els.loader?.classList.remove("hidden"); }
  function hideLoader(){ els.loader?.classList.add("hidden"); }

  /**
   * Render a simple list of {id,title} items.
   * Each <li> is an anchor to a sensible destination.
   */
  function renderList(rootEl, items, type) {
    if (!rootEl) return;
    rootEl.innerHTML = "";

    if (!items || !items.length) {
      rootEl.innerHTML = `<li class="text-sm text-gray-500">کوئی تازہ آئٹم نہیں</li>`;
      return;
    }

    // Where should each type link?
    const toHref = (id) => {
      switch (type) {
        case "books":   return `index.html#manage-books`;
        case "articles":return `index.html#manage-articles`;
        case "fatawa":  return `Answer.html?id=${id}`;               // quick jump to answer page
        case "ulema":   return `EditUlema.html?id=${id}`;
        case "tags":    return `Editcategory.html?id=${id}`;
        case "users":   return `EditUser.html?id=${id}`;
        default:        return `#`;
      }
    };

    items.forEach(({ id, title }) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${toHref(id)}"
           class="group flex items-start justify-between rounded-lg border border-transparent hover:border-ash_gray px-3 py-2 transition">
          <span class="text-sm text-rich_black line-clamp-2 group-hover:text-midnight_green">
            ${escapeHtml(title ?? "—")}
          </span>
          <span class="ml-3 text-xs text-gray-500 shrink-0">#${escapeHtml(id)}</span>
        </a>
      `;
      rootEl.appendChild(li);
    });
  }

  async function loadRecentActivity() {
    try {
      showLoader();
      const res = await fetch(ACTIVITY_API, { cache: "no-store" });
      const data = await res.json();

      // Defensive defaults if API shape changes
      renderList(els.books,    data?.books    ?? [], "books");
      renderList(els.articles, data?.articles ?? [], "articles");
      renderList(els.fatawa,   data?.fatawa   ?? [], "fatawa");
      renderList(els.ulema,    data?.ulema    ?? [], "ulema");
      renderList(els.tags,     data?.tags     ?? [], "tags");
      renderList(els.users,    data?.users    ?? [], "users");
    } catch (err) {
      console.error("Recent activity load error:", err);
      const emptyMsg = `<li class="text-sm text-red-600">سرگرمیاں لوڈ نہیں ہو سکیں</li>`;
      ["books","articles","fatawa","ulema","tags","users"].forEach(k => {
        if (els[k]) els[k].innerHTML = emptyMsg;
      });
    } finally {
      hideLoader();
    }
  }

  // Auto-load only if the section exists (dashboard page)
  document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("ms-recent-activity");
    if (section) loadRecentActivity();
  });
})();