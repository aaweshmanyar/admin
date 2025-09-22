 const params = new URLSearchParams(window.location.search);
  const userParam = params.get("user");

  if (userParam) {
    // Replace "-" back to spaces
    const userName = userParam.replace(/-/g, " ");

    // Set name in DOM
    document.getElementById("user-name").textContent = userName;

    // Update avatar with first letter
    const firstLetter = userName.charAt(0).toUpperCase();
    document.getElementById("user-avatar").src =
      `https://placehold.co/40x40/eff6e0/124559?text=${firstLetter}`;
  }






// View , Add and Edit , delete fatawa start here 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ms-fatwa-form");
  const tableBody = document.getElementById("ms-fatawa-table-body");
  const manageFatawaPage = document.getElementById("ms-page-manage-fatawa");

  // === Loader ===
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

  // === Pagination setup ===
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.textContent = "آگے دیکھیں";
  loadMoreBtn.className =
    "mt-4 bg-midnight_green text-white py-2 px-6 rounded-lg text-lg hover:bg-midnight_green-400 transition w-full md:w-auto";
  loadMoreBtn.style.display = "none";
  manageFatawaPage.appendChild(loadMoreBtn);

  let offset = 0;
  const limit = 2;
  let hasMore = true;

  // === Load fatawa into table ===
  async function loadFatawa() {
    try {
      const res = await fetch(
        `https://masailworld.onrender.com/api/fatwa?limit=${limit}&offset=${offset}`
      );
      const fatawa = await res.json();

      if (res.ok) {
        fatawa.forEach((fatwa) => {
          const row = document.createElement("tr");
          row.className = "border-b border-gray-200";

          row.innerHTML = `
            <td class="py-3 px-4">${fatwa.id}</td>
            <td class="py-3 px-4">${fatwa.Title}</td>
            <td class="py-3 px-4">${fatwa.muftisahab || "—"}</td>
            <td class="py-3 px-4">${new Date(
              fatwa.created_at
            ).toLocaleDateString("ur-PK")}</td>
            <td class="py-3 px-4 flex space-x-2 justify-end">
              <button class="edit-btn text-green-600 hover:underline" data-id="${
                fatwa.id
              }">✏️</button>
              <button class="delete-btn text-red-600 hover:underline" data-id="${
                fatwa.id
              }">🗑️</button>
            </td>
          `;
          tableBody.appendChild(row);
        });

        offset += fatawa.length;

        if (fatawa.length < limit) {
          hasMore = false;
          loadMoreBtn.style.display = "none";
        } else {
          loadMoreBtn.style.display = "block";
        }
      } else {
        console.error("❌ Error loading fatawa:", fatawa.error);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  }

  loadFatawa();

  loadMoreBtn.addEventListener("click", () => {
    if (hasMore) loadFatawa();
  });

  // === Edit / Delete handlers ===
  tableBody.addEventListener("click", async (e) => {
    const target = e.target;

    // Delete
    if (target.classList.contains("delete-btn")) {
      const id = target.dataset.id;
      if (confirm("کیا آپ واقعی اس فتویٰ کو حذف کرنا چاہتے ہیں؟")) {
        try {
          const res = await fetch(`https://masailworld.onrender.com/api/fatwa/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();

          if (res.ok) {
            alert("✅ فتویٰ حذف کر دیا گیا!");
            target.closest("tr").remove();
          } else {
            alert("❌ Error: " + (data.error || "Failed to delete"));
          }
        } catch (err) {
          console.error(err);
          alert("❌ Network error. Please try again.");
        }
      }
    }

    // Edit
    if (target.classList.contains("edit-btn")) {
      const id = target.dataset.id;
      try {
        const res = await fetch(`https://masailworld.onrender.com/api/fatwa/${id}`);
        const fatwa = await res.json();

        if (res.ok) {
          // Fill form
          document.getElementById("ms-fatwa-id").value = fatwa.id;
          document.getElementById("ms-fatwa-title").value = fatwa.Title;
          document.getElementById("ms-fatwa-slug").value = fatwa.slug || "";
          document.getElementById("ms-fatwa-keywords-input").value =
            fatwa.tags || "";
          document.getElementById("ms-fatwa-meta-description").value =
            fatwa.tafseel || "";
          document.getElementById("ms-fatwa-question").innerHTML =
            fatwa.detailquestion || "";
          document.getElementById("ms-fatwa-answer").innerHTML =
            fatwa.Answer || "";
          document.getElementById("ms-fatwa-mufti").value =
            fatwa.muftisahab || "";

          // Switch to form page
          window.location.hash = "add-fatwa";
        } else {
          alert("❌ Error fetching fatwa for edit");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Network error while fetching fatwa.");
      }
    }
  });

  // === Form submission (create or update) ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    const id = document.getElementById("ms-fatwa-id").value;

    const fatwaData = {
      Title: document.getElementById("ms-fatwa-title").value.trim(),
      slug: document.getElementById("ms-fatwa-slug").value.trim(),
      tags: document.getElementById("ms-fatwa-keywords-input").value.trim(),
      tafseel: document
        .getElementById("ms-fatwa-meta-description")
        .value.trim(),
      detailquestion: document
        .getElementById("ms-fatwa-question")
        .innerHTML.trim(),
      Answer: document.getElementById("ms-fatwa-answer").innerHTML.trim(),
      muftisahab: document.getElementById("ms-fatwa-mufti").value.trim(),
    };

    try {
      let res, data;

      if (id) {
        // Update existing fatwa
        res = await fetch(`https://masailworld.onrender.com/api/fatwa/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fatwaData),
        });
      } else {
        // Create new fatwa
        res = await fetch("https://masailworld.onrender.com/api/fatwa/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fatwaData),
        });
      }

      data = await res.json();
      hideLoader();

      if (res.ok) {
        alert(
          id
            ? "✅ فتویٰ کامیابی سے اپڈیٹ کر دیا گیا!"
            : "✅ فتویٰ کامیابی سے شامل کر دیا گیا!"
        );
        form.reset();
        document.getElementById("ms-fatwa-id").value = "";

        setTimeout(() => {
          window.location.hash = "manage-fatawa";
          tableBody.innerHTML = ""; // refresh table
          offset = 0;
          hasMore = true;
          loadFatawa();
        }, 1000);
      } else {
        alert("❌ Error: " + (data.error || "Failed to save fatwa"));
      }
    } catch (err) {
      console.error(err);
      hideLoader();
      alert("❌ Network error. Please try again.");
    }
  });
});

// View , Add and Edit , delete fatawa end here 


// View , Add and Edit , delete Article start here 



// document.addEventListener("DOMContentLoaded", () => {
//   const apiBase = "http://localhost:5000/api/article"; // ensure server uses this route

//   // DOM references
//   const tableBody = document.getElementById("ms-articles-table-body");
//   const articleForm = document.getElementById("ms-article-form");
//   const articleIdInput = document.getElementById("ms-article-id");
//   const titleInput = document.getElementById("ms-article-title");
//   const slugInput = document.getElementById("ms-article-slug");
//   const tagsContainer = document.getElementById("ms-article-keywords-container");
//   const tagsVisibleInput = document.getElementById("ms-article-keywords-input");
//   const tagsHiddenInput = document.getElementById("ms-article-keywords"); // name="tags"
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

//   // Initialize Quill if available, otherwise make container editable
//   let quillInstance = null;
//   if (window.Quill) {
//     try {
//       quillInstance = new Quill("#ms-article-content", {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//             [{ 'script': 'sub'}, { 'script': 'super' }],
//             [{ 'indent': '-1'}, { 'indent': '+1' }],
//             [{ 'direction': 'rtl' }],
//             [{ 'color': [] }, { 'background': [] }],
//             [{ 'font': [] }],
//             [{ 'align': [] }],
//             ['link', 'image', 'video'],
//             ['clean']
//           ]
//         }
//       });
//       // store in a global map to be accessible elsewhere if needed
//       window.quillInstances = window.quillInstances || {};
//       window.quillInstances["ms-article-content"] = quillInstance;
//     } catch (e) {
//       console.warn("Quill init failed, falling back to contentEditable:", e);
//       if (contentContainer) contentContainer.contentEditable = true;
//     }
//   } else {
//     // no Quill loaded — make content area editable
//     if (contentContainer) contentContainer.contentEditable = true;
//   }

//   // Image preview handler
//   if (imageInput && imagePreview) {
//     imageInput.addEventListener("change", function() {
//       const file = this.files[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
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

//   // Tag UI functions (pills)
//   function addTagPill(text) {
//     if (!tagsContainer || !text) return;
//     const pill = document.createElement("div");
//     pill.className = "qalam-tag-pill inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100";
//     pill.innerHTML = `<span class="tag-text">${escapeHtml(text)}</span><button type="button" class="qalam-tag-remove-btn ml-2 text-red-500" title="Remove tag">&times;</button>`;
//     tagsContainer.insertBefore(pill, tagsVisibleInput);
//     updateTagsHidden();
//   }

//   function updateTagsHidden() {
//     if (!tagsContainer || !tagsHiddenInput) return;
//     const tags = Array.from(tagsContainer.querySelectorAll(".qalam-tag-pill .tag-text")).map(el => el.textContent.trim()).filter(Boolean);
//     tagsHiddenInput.value = tags.join(",");
//   }

//   // wire tag input behavior
//   if (tagsVisibleInput && tagsContainer) {
//     tagsVisibleInput.addEventListener("keydown", (e) => {
//       if (e.key === "Enter" || e.key === ",") {
//         e.preventDefault();
//         const text = tagsVisibleInput.value.trim();
//         if (text) addTagPill(text);
//         tagsVisibleInput.value = "";
//       } else if (e.key === "Backspace" && tagsVisibleInput.value === "") {
//         const last = tagsContainer.querySelector(".qalam-tag-pill:last-of-type");
//         if (last) { last.remove(); updateTagsHidden(); }
//       }
//     });

//     tagsContainer.addEventListener("click", (e) => {
//       if (e.target.classList.contains("qalam-tag-remove-btn")) {
//         e.target.closest(".qalam-tag-pill").remove();
//         updateTagsHidden();
//       } else {
//         tagsVisibleInput.focus();
//       }
//     });
//   }

//   // helper to escape
//   function escapeHtml(s) {
//     if (!s) return "";
//     return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//   }

//   // --- Load articles list into table ---
 

//   // Helper to extract .ql-editor innerHTML from server value (your server returns full wrapper)
//   function extractEditorInner(htmlString) {
//     if (!htmlString) return "";
//     const tmp = document.createElement("div");
//     tmp.innerHTML = htmlString;
//     const ql = tmp.querySelector(".ql-editor");
//     if (ql) return ql.innerHTML;
//     return tmp.innerHTML;
//   }

//   // Reset form for new article
//   function resetForm() {
//     if (articleForm) articleForm.reset();
//     if (articleIdInput) articleIdInput.value = "";
//     if (tagsContainer) {
//       tagsContainer.querySelectorAll(".qalam-tag-pill").forEach(p => p.remove());
//     }
//     if (tagsVisibleInput) tagsVisibleInput.value = "";
//     updateTagsHidden();
    
//     if (quillInstance) {
//       quillInstance.root.innerHTML = "";
//     } else if (contentContainer) {
//       contentContainer.innerHTML = "";
//     }
    
//     if (imagePreview) {
//       imagePreview.src = "";
//       imagePreview.classList.add("hidden");
//     }
    
//     if (formTitle) formTitle.textContent = "نیا مضمون شامل کریں";
//   }

//   // --- Prefill form for edit ---
//   async function handleEditArticle(id) {
//     if (!id) return alert("Invalid article id");
//     try {
//       const res = await fetch(`http://localhost:5000/api/article/${id}`);
//       if (!res.ok) throw new Error(`Server returned ${res.status}`);
//       const article = await res.json();
//       console.log("Article for edit:", article);
//       console.log("Testing it",  article.slug)

//       // set scalars
//       if (articleIdInput) articleIdInput.value = article.id ?? article.ID ?? article.Id ?? "";
//       if (titleInput) titleInput.value = article.Title;
//       if (slugInput) slugInput.value = article.slug;
//       if (seoInput) seoInput.value = article.seo ?? article.SEO ?? article.meta_description ?? "";
//       if (authorInput) authorInput.value = article.writer ?? article.author ?? article.Writer ?? "";

//       // tags (may be null)
//       const tagsCsv = article.tags ?? article.Tags ?? article.keywords ?? "";
//       // clear existing pills
//       if (tagsContainer) {
//         tagsContainer.querySelectorAll(".qalam-tag-pill").forEach(p => p.remove());
//         if (tagsCsv) {
//           tagsCsv.split(",").map(s => s.trim()).filter(Boolean).forEach(t => addTagPill(t));
//         }
//         // ensure hidden field updated
//         updateTagsHidden();
//       }
//       if (tagsVisibleInput) tagsVisibleInput.value = "";

//       // ArticleText: server returns Quill wrapper — extract inner
//       const raw = article.ArticleText ?? article.articleText ?? article.content ?? "";
//       const html = extractEditorInner(raw);
//       if (quillInstance && typeof quillInstance.clipboard?.dangerouslyPasteHTML === "function") {
//         // paste into quill
//         quillInstance.clipboard.dangerouslyPasteHTML(html || "");
//       } else if (contentContainer) {
//         contentContainer.innerHTML = html || "";
//       }

//       // image preview
//       if (imagePreview) {
//         imagePreview.classList.remove("hidden");
//         imagePreview.src = "";
//         try {
//           const imgRes = await fetch(`${apiBase}/${id}/image`);
//           if (imgRes.ok) {
//             const blob = await imgRes.blob();
//             imagePreview.src = URL.createObjectURL(blob);
//             imagePreview.classList.remove("hidden");
//           } else if (article.image_url) {
//             // اگر API میں image_url موجود ہے تو اسے استعمال کریں
//             imagePreview.src = article.image_url;
//             imagePreview.classList.remove("hidden");
//           } else {
//             imagePreview.src = "";
//             imagePreview.classList.add("hidden");
//           }
//         } catch (e) {
//           console.warn("image preview failed", e);
//           if (article.image_url) {
//             imagePreview.src = article.image_url;
//             imagePreview.classList.remove("hidden");
//           } else {
//             imagePreview.src = "";
//             imagePreview.classList.add("hidden");
//           }
//         }
//       }

//       // UI: change title and open add panel if you have a toggle
//       if (formTitle) formTitle.textContent = "مضمون اپڈیٹ کریں";
//       const openBtn = document.querySelector('[data-target="add-article"]');
//       if (openBtn) openBtn.click();
//       if (titleInput) titleInput.focus();
//     } catch (err) {
//       console.error("handleEditArticle error:", err);
//       alert("Failed to load article for edit. Check console.");
//     }
//   }

//   // --- Submit (create or update) ---
//   if (articleForm) {
//     articleForm.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       showLoader(submitButton);

//       try {
//         const fd = new FormData();
//         const titleVal = titleInput ? titleInput.value.trim() : "";
//         const slugVal = slugInput ? slugInput.value.trim() : (titleVal.toLowerCase().replace(/\s+/g,"-"));
//         const tagsVal = tagsHiddenInput ? tagsHiddenInput.value : "";
//         const seoVal = seoInput ? seoInput.value : "";
//         const writerVal = authorInput ? authorInput.value : "";
        
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

//         if (imageInput && imageInput.files && imageInput.files[0]) {
//           fd.append("coverImage", imageInput.files[0]);
//         }

//         const id = articleIdInput ? articleIdInput.value : "";
//         const method = id ? "PUT" : "POST";
//         const url = id ? `${apiBase}/${id}` : apiBase;

//         const res = await fetch(url, { method, body: fd });
//         if (!res.ok) {
//           const errBody = await res.json().catch(()=>({}));
//           throw new Error(errBody.error || `HTTP ${res.status}`);
//         }
//         const result = await res.json();
//         alert(id ? "✅ Article updated!" : "✅ Article created!");
        
//         // reset form
//         resetForm();
        
//         // reload table
//         loadArticles();
        
//         // return to list view if you have a control
//         const backBtn = document.querySelector('[data-target="manage-articles"]');
//         if (backBtn) backBtn.click();
//       } catch (err) {
//         console.error("submit error:", err);
//         alert("❌ Error saving article. See console.");
//       } finally {
//         hideLoader(submitButton);
//       }
//     });
//   }

  // --- Table click for edit / delete ---
//   if (tableBody) {
//     tableBody.addEventListener("click", async (ev) => {
//       const btn = ev.target.closest("button");
//       if (!btn) return;
//       const id = btn.dataset.id;
//       const action = btn.dataset.action;
//       if (action === "edit") {
//         window.location.href = `/Pages/Editcategory.html?id=${id}`;
//       } else if (action === "delete") {
//         if (!confirm("کیا آپ واقعی اس مضمون کو حذف کرنا چاہتے ہیں؟")) return;
//         showLoader(btn);
//         try {
//           const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
//           if (!res.ok) {
//             const err = await res.json().catch(()=>({}));
//             throw new Error(err.error || `HTTP ${res.status}`);
//           }
//           alert("🗑️ Article deleted");
//           loadArticles();
//         } catch (err) {
//           console.error("delete error:", err);
//           alert("❌ Error deleting article");
//         } finally {
//           hideLoader(btn);
//         }
//       }
//     });
//   }

//   // Cancel button handler
//   const cancelButton = document.querySelector('.as-cancel-btn');
//   if (cancelButton) {
//     cancelButton.addEventListener('click', () => {
//       resetForm();
//     });
//   }

//   // Auto-generate slug from title
//   if (titleInput && slugInput) {
//     titleInput.addEventListener('blur', () => {
//       if (!slugInput.value) {
//         const title = titleInput.value;
//         const generatedSlug = title.toLowerCase()
//           .replace(/\s+/g, '-')
//           .replace(/[^\w\-]+/g, '')
//           .replace(/\-\-+/g, '-')
//           .replace(/^-+/, '')
//           .replace(/-+$/, '');
//         slugInput.value = generatedSlug;
//       }
//     });
//   }

//   // initial
//   loadArticles();
// });




document.addEventListener("DOMContentLoaded", () => {
  const apiBase = "https://masailworld.onrender.com/api/article"; // API endpoint

  // DOM references
  const tableBody = document.getElementById("ms-articles-table-body");
  const articleForm = document.getElementById("ms-article-form");
  const articleIdInput = document.getElementById("ms-article-id");
  const titleInput = document.getElementById("ms-article-title");
  const slugInput = document.getElementById("ms-article-slug");
  const tagsInput = document.getElementById("ms-article-keywords"); // ✅ single field for tags
  const seoInput = document.getElementById("ms-article-meta-description");
  const authorInput = document.getElementById("ms-article-author");
  const imageInput = document.getElementById("ms-article-image");
  const imagePreview = document.getElementById("ms-article-image-preview");
  const contentContainer = document.getElementById("ms-article-content");
  const formTitle = document.getElementById("ms-article-form-title");
  const submitButton = document.getElementById("ms-article-submit");

  // Loader helpers
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

  // Quill
  let quillInstance = null;
  if (window.Quill) {
    try {
      quillInstance = new Quill("#ms-article-content", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ]
        }
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

  // Image preview
  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
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

  // Tag UI (use same input for pills + storage)
  function addTagPill(text) {
    if (!tagsInput || !text) return;
    const pill = document.createElement("div");
    pill.className = "qalam-tag-pill inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100";
    pill.innerHTML = `<span class="tag-text">${escapeHtml(text)}</span><button type="button" class="qalam-tag-remove-btn ml-2 text-red-500">&times;</button>`;
    tagsInput.parentNode.insertBefore(pill, tagsInput);
    updateTagsField();
  }

  function updateTagsField() {
    if (!tagsInput) return;
    const tags = Array.from(document.querySelectorAll(".qalam-tag-pill .tag-text"))
      .map(el => el.textContent.trim())
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
        if (last) { last.remove(); updateTagsField(); }
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
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Load articles
  async function loadArticles() {
    if (!tableBody) return;
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Loading...</td></tr>`;
    try {
      const res = await fetch(apiBase);
      if (!res.ok) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-600">Server returned ${res.status}</td></tr>`;
        return;
      }
      const articles = await res.json();
      if (!Array.isArray(articles) || articles.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center">No articles found</td></tr>`;
        return;
      }
      tableBody.innerHTML = "";
      articles.forEach(article => {
        const id = article.id ?? article.ID ?? article.Id;
        const title = article.Title ?? article.title ?? "";
        const writer = article.writer ?? article.author ?? "-";
        const created = article.created_at ?? article.createdAt ?? Date.now();
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="py-3 px-4">${escapeHtml(title)}</td>
          <td class="py-3 px-4">${escapeHtml(writer)}</td>
          <td class="py-3 px-4">${new Date(created).toLocaleDateString()}</td>
          <td class="py-3 px-4 flex gap-3">
            <button class="text-blue-600 hover:text-blue-800" data-action="edit" data-id="${id}">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="text-red-600 hover:text-red-800" data-action="delete" data-id="${id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error("loadArticles error:", err);
      tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-600">Failed to load</td></tr>`;
    }
  }
  window.renderArticles = loadArticles;

  // Reset form
  function resetForm() {
    if (articleForm) articleForm.reset();
    if (articleIdInput) articleIdInput.value = "";
    document.querySelectorAll(".qalam-tag-pill").forEach(p => p.remove());
    updateTagsField();
    if (quillInstance) quillInstance.root.innerHTML = "";
    if (imagePreview) { imagePreview.src = ""; imagePreview.classList.add("hidden"); }
    if (formTitle) formTitle.textContent = "نیا مضمون شامل کریں";
  }

  // Populate form for editing
  async function populateForm(id) {
    try {
      const res = await fetch(`${apiBase}/${id}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const article = await res.json();

      resetForm();

      articleIdInput.value = article.id || article.ID || article.Id || "";
      titleInput.value = article.Title || "";
      slugInput.value = article.slug || "";
      seoInput.value = article.seo || "";
      authorInput.value = article.writer || article.author || "";

      // Tags
      if (article.tags) {
        article.tags.split(",").forEach(tag => addTagPill(tag.trim()));
      }

      // Content
      if (quillInstance) {
        quillInstance.root.innerHTML = article.ArticleText || "";
      } else {
        contentContainer.innerHTML = article.ArticleText || "";
      }

      // Image
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

  // Handle table actions
  if (tableBody) {
    tableBody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === "edit") {
        window.location.href = `./Editarticle.html?id=${id}`; 
      } else if (action === "delete") {
        if (confirm("⚠️ Are you sure you want to delete this article?")) {
          try {
            const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            alert("🗑️ Article deleted!");
            loadArticles();
          } catch (err) {
            console.error("delete error:", err);
            alert("❌ Failed to delete article.");
          }
        }
      }
    });
  }

  // Submit
  if (articleForm) {
    articleForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoader(submitButton);

      try {
        updateTagsField();

        const fd = new FormData();
        const titleVal = titleInput?.value.trim() || "";
        const slugVal = slugInput?.value.trim() || titleVal.toLowerCase().replace(/\s+/g,"-");
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
        if (!res.ok) {
          const errBody = await res.json().catch(()=>({}));
          throw new Error(errBody.error || `HTTP ${res.status}`);
        }
        await res.json();
        alert(id ? "✅ Article updated!" : "✅ Article created!");

        resetForm();
        if (typeof loadArticles === "function") loadArticles();

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

  // Slug auto-generate
  if (titleInput && slugInput) {
    titleInput.addEventListener('blur', () => {
      if (!slugInput.value) {
        const title = titleInput.value;
        const generatedSlug = title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
        slugInput.value = generatedSlug;
      }
    });
  }

  // Initial load
  loadArticles();

});








// -----------------------------------------------------------------


document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("ms-book-form");
  const booksTableBody = document.getElementById("ms-books-table-body");
  const bookIdField = document.getElementById("ms-book-id"); 
  const formTitle = document.getElementById("ms-book-form-title");

  // 🔄 Loader element
  const loader = document.createElement("div");
  loader.id = "global-loader";
  loader.className =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 hidden";
  loader.innerHTML = `
    <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  `;
  document.body.appendChild(loader);

  function showLoader() {
    loader.classList.remove("hidden");
  }

  function hideLoader() {
    loader.classList.add("hidden");
  }

  let offset = 0;
  const limit = 5; // show more by default
  let isEditing = false;

  // ✅ Load books
  async function loadBooks() {
    showLoader();
    try {
      const res = await fetch(
        `https://masailworld.onrender.com/api/book?limit=${limit}&offset=${offset}`
      );
      if (!res.ok) throw new Error("Failed to fetch books");

      const books = await res.json();

      if (offset === 0) {
        booksTableBody.innerHTML = ""; // reset only on first load
      }

      if (books.length === 0) {
        document.getElementById("load-more-books")?.remove();
        return;
      }

      books.forEach((book) => {
        const tr = document.createElement("tr");
        tr.classList.add("border-b", "border-gray-200");

        tr.innerHTML = `
          <td class="py-3 px-4">${book.BookName}</td>
          <td class="py-3 px-4">${book.BookWriter || "-"}</td>
          <td class="py-3 px-4 flex gap-3">
            <button onclick="editBook(${book.id})" title="Edit" class="text-blue-600 hover:text-blue-800">✏️</button>
            <button onclick="deleteBook(${book.id}, this)" title="Delete" class="text-red-600 hover:text-red-800">🗑️</button>
          </td>
        `;

        booksTableBody.appendChild(tr);
      });

      if (!document.getElementById("load-more-books")) {
        const btn = document.createElement("button");
        btn.id = "load-more-books";
        btn.textContent = "آگے دیکھیں";
        btn.className =
          "mt-4 bg-midnight_green text-white py-2 px-6 rounded-lg hover:bg-midnight_green-400 transition";
        btn.addEventListener("click", () => {
          offset += limit;
          loadBooks();
        });
        booksTableBody.parentElement.appendChild(btn);
      }
    } catch (err) {
      console.error("❌ Error loading books:", err);
      alert("کتابیں لوڈ کرنے میں مسئلہ ہے");
    } finally {
      hideLoader();
    }
  }

  // ✅ Add / Update book
  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    try {
      const formData = new FormData();
      formData.append(
        "BookName",
        document.getElementById("ms-book-name").value.trim()
      );
      formData.append(
        "BookWriter",
        document.getElementById("ms-book-author").value.trim()
      );
      formData.append(
        "BookDescription",
        document.getElementById("ms-book-description").innerHTML.trim()
      );

      const coverFile = document.getElementById("ms-book-cover").files[0];
      if (coverFile) formData.append("BookCoverImg", coverFile);

      const pdfFile = document.getElementById("ms-book-file").files[0];
      if (pdfFile) formData.append("BookPDF", pdfFile);

      let url = "https://masailworld.onrender.com/api/book";
      let method = "POST";

      if (isEditing) {
        const id = bookIdField.value;
        url = `https://masailworld.onrender.com/api/book/${id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          isEditing
            ? "✅ کتاب کامیابی سے اپڈیٹ ہو گئی!"
            : "✅ کتاب کامیابی سے شامل کر دی گئی!"
        );

        // Reset form
        bookForm.reset();
        document.getElementById("ms-book-description").innerHTML = "";
        bookIdField.value = "";
        formTitle.textContent = "نئی کتاب شامل کریں";
        isEditing = false;

        // Reload books
        offset = 0;
        await loadBooks();

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

  // ✅ Delete book
  window.deleteBook = async (id, btn) => {
    if (!confirm("کیا آپ واقعی اس کتاب کو حذف کرنا چاہتے ہیں؟")) return;
    showLoader();

    try {
      const res = await fetch(`https://masailworld.onrender.com/api/book/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        alert("📕 کتاب حذف کر دی گئی");
        btn.closest("tr").remove();
      } else {
        alert("❌ Error: " + (data.error || "کتاب حذف کرنے میں مسئلہ"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ نیٹ ورک مسئلہ۔ دوبارہ کوشش کریں");
    } finally {
      hideLoader();
    }
  };

  // ✅ Edit book (prefill form)
  window.editBook = async (id) => {
    showLoader();
    try {
      const res = await fetch(`https://masailworld.onrender.com/api/book/${id}`);
      if (!res.ok) throw new Error("Failed to fetch book");

      const book = await res.json();

      bookIdField.value = book.id;
      document.getElementById("ms-book-name").value = book.BookName;
      document.getElementById("ms-book-author").value =
        book.BookWriter || "";
      document.getElementById("ms-book-description").innerHTML =
        book.BookDescription || "";

      isEditing = true;
      formTitle.textContent = "کتاب ایڈٹ کریں";
      window.location.hash = "add-book";
    } catch (err) {
      console.error("❌ Error loading book:", err);
      alert("کتاب لوڈ کرنے میں مسئلہ ہے");
    } finally {
      hideLoader();
    }
  };

  // 🚀 Initial load
  loadBooks();
});







// ---------------------------------------Ulma


// API base URL (adjust if needed)
const API_URL = "https://masailworld.onrender.com/api/aleem";

document.addEventListener("DOMContentLoaded", () => {
  initUIControls();
  fetchUlema();
  setupForm();
});

/* ========== Utility helpers ========== */
function getField(obj, ...keys) {
  // returns first defined key value from obj (handles different casings)
  for (const k of keys) {
    if (obj == null) continue;
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) return obj[k];
  }
  return "";
}

function uidOf(obj) {
  return getField(obj, "id", "Id", "ID");
}

/* ========== UI navigation ========== */
function showManagePage() {
  document.querySelector("#ms-page-manage-ulema").classList.remove("hidden");
  document.querySelector("#ms-page-add-ulema").classList.add("hidden");
  document.getElementById("ms-ulema-form-title").innerText = "نئے عالم شامل کریں";
  clearForm();
}

function showAddEditPage() {
  document.querySelector("#ms-page-manage-ulema").classList.add("hidden");
  document.querySelector("#ms-page-add-ulema").classList.remove("hidden");
}

/* attach handlers for add/cancel/back buttons */
function initUIControls() {
  // Add new button (top of manage page)
  document.querySelectorAll("[data-target='add-ulema']").forEach(btn => {
    btn.addEventListener("click", () => {
      clearForm();
      showAddEditPage();
    });
  });

  // Cancel buttons (have data-target="manage-ulema")
  document.querySelectorAll("[data-target='manage-ulema']").forEach(btn => {
    btn.addEventListener("click", () => {
      showManagePage();
    });
  });

  // If there is a back link with the class .as-back-link that should return to manage
  document.querySelectorAll(".as-back-link").forEach(a => {
    a.addEventListener("click", (e) => {
      // Normally this is an anchor - don't let it jump
      e.preventDefault();
      showManagePage();
    });
  });
}

/* ========== Fetch & render ========== */
async function fetchUlema() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const ulemaList = await res.json();

    const tbody = document.getElementById("ms-ulema-table-body");
    tbody.innerHTML = "";

    ulemaList.forEach(ulema => {
      const id = uidOf(ulema);
      const name = getField(ulema, "Name", "name") || "-";
      const position = getField(ulema, "Position", "position") || "-";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="py-3 px-4">${escapeHtml(name)}</td>
        <td class="py-3 px-4">${escapeHtml(position)}</td>
        <td class="py-3 px-4 flex gap-2 justify-end">
          <button data-id="${id}" class="ms-edit-btn text-blue-600 hover:underline">ایڈیٹ</button>
          <button data-id="${id}" class="ms-delete-btn text-red-600 hover:underline">حذف</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // attach event listeners to newly created buttons
   document.querySelectorAll(".ms-edit-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    if (id) {
      // redirect to Edit page with ID in querystring
      window.location.href = `./EditUlema.html?id=${id}`;
    }
  });
});

    document.querySelectorAll(".ms-delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        if (id) deleteUlema(id);
      });
    });

  } catch (error) {
    console.error("❌ fetchUlema error:", error);
    // optional: show a UI message to the user
  }
}

/* ========== Form handling (create + update) ========== */
function setupForm() {
  const form = document.getElementById("ms-ulema-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // detect if editing
    const existingId = document.getElementById("ms-ulema-id").value.trim();
    const isEdit = existingId !== "";

    const nameVal = document.getElementById("ms-ulema-name").value.trim();
    const positionVal = document.getElementById("ms-ulema-designation").value.trim();
    const aboutHtml = document.getElementById("ms-ulema-bio").innerHTML.trim();
    const photoInput = document.getElementById("ms-ulema-photo");

    const formData = new FormData();
    formData.append("Name", nameVal);
    formData.append("Position", positionVal);
    formData.append("About", aboutHtml);

    if (photoInput && photoInput.files && photoInput.files[0]) {
      // ✅ send only "ProfileImg", because backend expects this
      formData.append("ProfileImg", photoInput.files[0]);
    }

    try {
      const url = isEdit ? `${API_URL}/${existingId}` : API_URL;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        let message = `Failed to ${isEdit ? "update" : "create"} entry (status ${res.status})`;
        try {
          const errJson = await res.json();
          if (errJson && errJson.message) message += `: ${errJson.message}`;
        } catch (_) {}
        throw new Error(message);
      }

      alert(`✅ ${isEdit ? "انٹری اپڈیٹ ہوگئی" : "نیا عالم شامل ہوگیا"}!`);
      showManagePage();
      fetchUlema();
    } catch (error) {
      console.error("❌ create/updateAleem error:", error);
      alert("❌ انٹری محفوظ نہیں ہو سکی");
    }
  });
}


/* Pre-fill form for editing */
async function editUlema(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const ulema = await res.json();

    // get fields robustly
    const name = getField(ulema, "Name", "name");
    const position = getField(ulema, "Position", "position");
    const about = getField(ulema, "About", "about", "Description", "description");

    document.getElementById("ms-ulema-id").value = uidOf(ulema) || id;
    document.getElementById("ms-ulema-name").value = name || "";
    document.getElementById("ms-ulema-designation").value = position || "";
    document.getElementById("ms-ulema-bio").innerHTML = about || "";

    // set form title and show edit view
    document.getElementById("ms-ulema-form-title").innerText = "عالم کی ترمیم کریں";
    showAddEditPage();

    // Note: file inputs cannot be prefilled for security reasons.
  } catch (error) {
    console.error("❌ editUlema error:", error);
    alert("❌ انٹری حاصل نہیں کی جا سکی");
  }
}

/* Delete Ulema */
async function deleteUlema(id) {
  if (!confirm("کیا آپ واقعی اس انٹری کو حذف کرنا چاہتے ہیں؟")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete entry");

    alert("✅ انٹری حذف ہوگئی");
    fetchUlema();
  } catch (error) {
    console.error("❌ deleteUlema error:", error);
    alert("❌ انٹری حذف نہیں ہو سکی");
  }
}

/* ========== Helpers ========== */
function clearForm() {
  document.getElementById("ms-ulema-id").value = "";
  document.getElementById("ms-ulema-name").value = "";
  document.getElementById("ms-ulema-designation").value = "";
  const bio = document.getElementById("ms-ulema-bio");
  if (bio) bio.innerHTML = "";
  const photoInput = document.getElementById("ms-ulema-photo");
  if (photoInput) photoInput.value = "";
  document.getElementById("ms-ulema-form-title").innerText = "نئے عالم شامل کریں";
}

// simple XSS escape for values we inject into table (we use innerHTML above only for safe strings)
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}





// -----------------------------------------Users

// API base URL

const USER_API = "https://masailworld.onrender.com/api/user"; 

// Show loader
function showLoader() {
  let loader = document.getElementById("loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader";
    loader.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50";
    loader.innerHTML = `
      <div class="w-16 h-16 border-4 border-white border-t-midnight_green rounded-full animate-spin"></div>
    `;
    document.body.appendChild(loader);
  }
  loader.style.display = "flex";
}

// Hide loader
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// Delete user by ID
async function deleteUser(id) {
  if (!confirm("❓ کیا آپ واقعی اس صارف کو حذف کرنا چاہتے ہیں؟")) {
    return;
  }

  showLoader();
  try {
    const res = await fetch(`${USER_API}/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "❌ صارف حذف کرنے میں مسئلہ آیا");
      return;
    }

    alert("🗑️ صارف کامیابی سے حذف ہوگیا!");
    loadUsers(); // refresh table
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("❌ کوئی مسئلہ پیش آگیا۔");
  } finally {
    hideLoader();
  }
}

// Load all users into the table
async function loadUsers() {
  showLoader();
  try {
    const res = await fetch(USER_API);
    const users = await res.json();

    const tbody = document.getElementById("ms-users-table-body");
    tbody.innerHTML = "";

    users.forEach(user => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-200 hover:bg-gray-50";

      tr.innerHTML = `
        <td class="py-3 px-4">${user.Name}</td>
        <td class="py-3 px-4">${user.Email || "-"}</td>
        <td class="py-3 px-4">
          <button class="edit-btn text-blue-600 hover:underline" data-id="${user.id}">ترمیم</button>
          <button class="delete-btn text-red-600 hover:underline ml-2" data-id="${user.id}">حذف کریں</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach edit event to buttons
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-id");
        // ✅ Redirect to edit page with ID
        window.location.href = `./EditUser.html?id=${userId}`;
      });
    });

    // Attach delete event to buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const userId = btn.getAttribute("data-id");
        deleteUser(userId);
      });
    });

  } catch (error) {
    console.error("Failed to load users:", error);
    alert("❌ صارفین کو لوڈ کرنے میں مسئلہ آیا");
  } finally {
    hideLoader();
  }
}

// Handle form submit (add or update user)
document.getElementById("ms-user-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("ms-user-id").value.trim();
  const Name = document.getElementById("ms-user-name").value.trim();
  const Email = document.getElementById("ms-user-email").value.trim();
  const Password = document.getElementById("ms-user-password").value.trim();
  const ConfirmPassword = document.getElementById("ms-user-confirm-password").value.trim();

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
      body: JSON.stringify({ Name, Email, Password, ConfirmPassword })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "❌ مسئلہ پیش آیا");
      return;
    }

    alert(id ? "✏️ صارف کامیابی سے اپڈیٹ ہوگیا!" : "✅ صارف کامیابی سے شامل ہوگیا!");
    e.target.reset(); // clear form
    loadUsers(); // refresh table
    window.location.href = "../index.html#manage-users"; // back to list
  } catch (error) {
    console.error("Error saving user:", error);
    alert("❌ کوئی مسئلہ پیش آگیا۔");
  } finally {
    hideLoader();
  }
});

// Prefill form if editing
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    showLoader();
    try {
      const res = await fetch(`${USER_API}/${id}`);
      const user = await res.json();

      if (res.ok) {
        document.getElementById("ms-user-id").value = user.id;
        document.getElementById("ms-user-name").value = user.Name;
        document.getElementById("ms-user-email").value = user.Email || "";

        document.getElementById("ms-user-form-title").innerText = "✏️ صارف میں ترمیم کریں";
        document.getElementById("ms-password-help-text").innerText =
          "پاس ورڈ تبدیل کرنے کے لیے نیا پاس ورڈ درج کریں، ورنہ خالی چھوڑ دیں۔";
      } else {
        alert("❌ صارف نہیں ملا");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      hideLoader();
    }
  } else {
    loadUsers(); // normal load
  }
});





// -------------------------------------------------------- Categories

const TAGS_API = "https://masailworld.onrender.com/api/tags";

// Show loader
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

// Hide loader
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// Load all tags into the table
async function loadTags() {
  showLoader();
  try {
    const res = await fetch(TAGS_API);
    const tags = await res.json();

    const tbody = document.getElementById("ms-categories-table-body");
    tbody.innerHTML = "";

    tags.forEach((tag) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-200 hover:bg-gray-50";

      tr.innerHTML = `
        <td class="py-3 px-4">
          <img src="${TAGS_API}/${tag.id}/cover" alt="thumbnail" class="w-12 h-12 rounded object-cover"/>
        </td>
        <td class="py-3 px-4">${tag.Name}</td>
        <td class="py-3 px-4"><i class="${tag.iconClass}"></i></td>
        <td class="py-3 px-4">
          <button class="text-blue-600 hover:underline" onclick="editTag(${tag.id})">ترمیم</button>
          <button class="text-red-600 hover:underline ml-2" onclick="deleteTag(${tag.id})">حذف کریں</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Failed to load tags:", error);
    alert("❌ موضوعات کو لوڈ کرنے میں مسئلہ آیا");
  } finally {
    hideLoader();
  }
}

// Handle form submit (create/update tag)
document
  .getElementById("ms-category-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("ms-category-id").value;
    const Name = document.getElementById("ms-category-name").value.trim();
    const slug = document.getElementById("ms-category-slug").value.trim();
    const iconClass = document.getElementById("ms-category-icon").value.trim();
    const AboutTags = document.getElementById("ms-category-description").innerHTML;
    const thumbnail = document.getElementById("ms-category-thumbnail").files[0];

    if (!Name || !iconClass) {
      alert("❌ براہ کرم موضوع کا نام اور آئیکن درج کریں");
      return;
    }

    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("slug", slug || Name.toLowerCase().replace(/\s+/g, "-"));
    formData.append("iconClass", iconClass);
    formData.append("AboutTags", AboutTags);
    if (thumbnail) formData.append("tagsCover", thumbnail);

    showLoader();
    try {
      const res = await fetch(id ? `${TAGS_API}/${id}` : TAGS_API, {
        method: id ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "❌ موضوع محفوظ کرنے میں مسئلہ پیش آیا");
        return;
      }

      alert(id ? "✅ موضوع اپ ڈیٹ ہوگیا!" : "✅ موضوع کامیابی سے شامل ہوگیا!");
      e.target.reset();
      document.getElementById("ms-category-id").value = ""; // clear hidden id
      loadTags();

      // Go back to manage-categories section (if tabs/SPA)
      const backBtn = document.querySelector('[data-target="manage-categories"]');
      if (backBtn) backBtn.click();
    } catch (error) {
      console.error("Error saving tag:", error);
      alert("❌ کوئی مسئلہ پیش آگیا۔");
    } finally {
      hideLoader();
    }
  });

// Delete tag
async function deleteTag(id) {
  if (!confirm("کیا آپ واقعی اس موضوع کو حذف کرنا چاہتے ہیں؟")) return;

  showLoader();
  try {
    const res = await fetch(`${TAGS_API}/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "❌ موضوع حذف کرنے میں مسئلہ پیش آیا");
      return;
    }

    alert("✅ موضوع کامیابی سے حذف ہوگیا!");
    loadTags();
  } catch (error) {
    console.error("Error deleting tag:", error);
    alert("❌ کوئی مسئلہ پیش آگیا۔");
  } finally {
    hideLoader();
  }
}

// (Optional) Edit handler to load existing tag into form
async function editTag(id) {
  if(id){
    window.location.href=`./Editcategory.html?id=${id}`;
  }
}

// Load tags when page opens
document.addEventListener("DOMContentLoaded", loadTags);







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
    document.getElementById("ms-total-articles").innerText = counts.articles || 0;
    document.getElementById("ms-total-books").innerText = counts.books || 0;
    document.getElementById("ms-total-users").innerText = counts.users || 0;
    document.getElementById("ms-total-categories").innerText = counts.tags || 0;
    document.getElementById("ms-total-questions").innerText = counts.ulema || 0; 
    document.getElementById("ms-total-submissions").innerText = counts.ulema || 0; // adjust if you have real table

  } catch (error) {
    console.error("❌ Error loading stats:", error);
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadStats);




// Pending Questions

async function loadPendingFatwas() {
  try {
    // 
    const res = await fetch("https://masailworld.onrender.com/api/fatwa/pending");
    if (!res.ok) throw new Error("Failed to fetch fatawa");

    const fatawas = await res.json();

    const tbody = document.getElementById("ms-questions-table-body");
    tbody.innerHTML = ""; // clear old

    fatawas.forEach(f => {
      const tr = document.createElement("tr");
      tr.classList.add("border-b", "border-gray-100");

      tr.innerHTML = `
        <td class="py-3 px-4">${f.questionername || "نامعلوم"}</td>
        <td class="py-3 px-4">${f.detailquestion.substring(0, 50)}...</td>
        <td class="py-3 px-4">
          <span class="text-yellow-600 font-bold">${f.status}</span>
        </td>
        <td class="py-3 px-4">
          <a href="Answer.html?id=${f.id}" 
             class="bg-midnight_green text-white px-4 py-2 rounded hover:bg-midnight_green-400 inline-block">
            جواب دیں
          </a>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("❌ Error loading fatawa:", err);
  }
}

// Call this when page loads
document.addEventListener("DOMContentLoaded", loadPendingFatwas);












