import { api, el, fmtSize, setupLightbox, thumbButton } from "./common.js";
import { createUploader } from "./uploader.js";

const $ = (id) => document.getElementById(id);
const NAME_KEY = "wedding-uploader-name";

const loginView = $("login-view");
const mainView = $("main-view");
const openLightbox = setupLightbox();
const uploader = createUploader();
const rows = new Map(); // task id -> row nodes

function show(signedIn) {
  loginView.hidden = signedIn;
  mainView.hidden = !signedIn;
}

// ---- login ----
$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("login-btn");
  const err = $("login-error");
  err.textContent = "";
  btn.disabled = true;
  try {
    await api("login", { method: "POST", body: { password: $("password").value } });
    $("password").value = "";
    show(true);
    loadGallery();
  } catch (ex) {
    err.textContent = ex.status === 401 ? "That password isn't right — please try again." : ex.message;
  } finally {
    btn.disabled = false;
  }
});

// ---- uploads ----
const nameInput = $("uploader");
nameInput.value = localStorage.getItem(NAME_KEY) || "";
nameInput.addEventListener("input", () => localStorage.setItem(NAME_KEY, nameInput.value));

const fileInput = $("file-input");
$("choose-btn").addEventListener("click", () => {
  const err = $("upload-error");
  if (!nameInput.value.trim()) {
    err.textContent = "Please enter your name first.";
    nameInput.focus();
    return;
  }
  err.textContent = "";
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const files = [...fileInput.files];
  fileInput.value = "";
  if (!files.length) return;
  const visibility = document.querySelector('input[name="visibility"]:checked').value;
  const tasks = uploader.add(files, {
    visibility,
    uploader: nameInput.value.trim().slice(0, 60),
    caption: $("caption").value.trim(),
  });
  $("caption").value = "";
  void tasks;
});

function renderTask(task) {
  let r = rows.get(task.id);
  if (!r) {
    const name = el("span", { class: "name", text: task.file.name });
    const status = el("span", { class: "status" });
    const retry = el("button", { type: "button", class: "small", text: "Retry", onclick: () => uploader.retry(task) });
    const bar = el("i");
    const pct = el("span");
    const badge = el("span", {
      class: `badge ${task.visibility}`,
      text: task.visibility === "shared" ? "shared" : "private",
    });
    const li = el("li", { class: "row" }, [
      el("div", { class: "top" }, [name, status]),
      el("div", { class: "meta" }, [badge, el("span", { text: fmtSize(task.file.size) }), pct, retry]),
      el("div", { class: "bar" }, [bar]),
    ]);
    $("queue").prepend(li);
    r = { li, status, retry, bar, pct };
    rows.set(task.id, r);
  }
  const percent = Math.round(task.progress * 100);
  r.bar.style.width = `${percent}%`;
  r.pct.textContent = `${percent}%`;
  r.status.textContent = task.status === "failed" && task.error ? `failed — ${task.error}` : task.status;
  r.retry.hidden = task.status !== "failed";
  r.li.className = `row ${task.status}`;
}

uploader.on("update", renderTask);
uploader.on("settled", (task) => {
  if (task.visibility === "shared") loadGallery();
});

window.addEventListener("beforeunload", (e) => {
  const active = [...rows.values()].some((r) => /uploading|queued|paused/.test(r.li.className));
  if (active) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// ---- gallery ----
async function loadGallery() {
  const grid = $("gallery");
  try {
    const { items } = await api("list-shared");
    grid.replaceChildren(
      ...items.map((item) =>
        el("div", { class: "tile" }, [
          thumbButton(item, () => openLightbox(item)),
          el("div", { class: "info" }, [
            el("span", { class: "who", text: item.uploader }),
            item.caption ? el("span", { class: "who", text: item.caption }) : null,
          ]),
        ]),
      ),
    );
    $("gallery-empty").hidden = items.length > 0;
    $("gallery-count").textContent = items.length ? `${items.length} item${items.length === 1 ? "" : "s"}` : "";
  } catch (ex) {
    if (ex.status === 401) show(false);
    else $("gallery-count").textContent = ex.message;
  }
}
$("refresh-btn").addEventListener("click", loadGallery);

// ---- boot ----
(async () => {
  try {
    const s = await api("session");
    show(s.guest);
    if (s.guest) loadGallery();
    else show(false);
  } catch {
    show(false);
  }
})();
