import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL DATA — every skill + where it was used
   ═══════════════════════════════════════════════════════════════════════════ */
const SKILLS = [
  // pri: higher = shown first. Based on usage count + relevance to target audience
  // AI & ML (cat 1)
  { label: "PyTorch", cat: 1, pri: 10, used: ["SAM3 - ML Researcher", "Carleton - Research Asst", "LeRobot SO-101", "M.A.Sc. Thesis"] },
  { label: "SLAM", cat: 1, pri: 9, used: ["Carleton - Research Asst", "M.A.Sc. Thesis"] },
  { label: "Comp Vision", cat: 1, pri: 9, used: ["Carleton - Research Asst", "M.A.Sc. Thesis"] },
  { label: "RAG", cat: 1, pri: 7, used: ["SAM3 - ML Researcher"] },
  { label: "Claude API", cat: 1, pri: 7, used: ["SAM3 - ML Researcher"] },
  { label: "Hugging Face", cat: 1, pri: 7, used: ["LeRobot SO-101"] },
  { label: "n8n", cat: 1, pri: 6, used: ["SAM3 - ML Researcher"] },
  { label: "TensorFlow", cat: 1, pri: 5, used: [] },
  { label: "scikit-learn", cat: 1, pri: 4, used: [] },
  { label: "Vec Search", cat: 1, pri: 3, used: [] },
  { label: "Prompt Eng", cat: 1, pri: 3, used: [] },
  { label: "OpenClaw", cat: 1, pri: 2, used: [] },
  // Hardware & Robotics (cat 2)
  { label: "Jetson", cat: 2, pri: 10, used: ["LeRobot SO-101"] },
  { label: "PCB", cat: 2, pri: 9, used: ["Smart Band", "Carleton - Research/TA"] },
  { label: "Drones", cat: 2, pri: 9, used: ["Carleton - Research Asst", "M.A.Sc. Thesis"] },
  { label: "IoT", cat: 2, pri: 8, used: ["SAM3 - ML Researcher", "Smart Band"] },
  { label: "Arduino", cat: 2, pri: 7, used: ["Smart Band", "Hydroponics System"] },
  { label: "ROS 2", cat: 2, pri: 7, used: ["M.A.Sc. Thesis"] },
  { label: "Isaac Sim", cat: 2, pri: 6, used: ["LeRobot SO-101"] },
  { label: "MCU", cat: 2, pri: 5, used: ["Smart Band"] },
  { label: "Circuits", cat: 2, pri: 4, used: ["Carleton - Research/TA"] },
  { label: "FPGA", cat: 2, pri: 3, used: [] },
  { label: "Gazebo", cat: 2, pri: 2, used: [] },
  // Cloud & DevOps (cat 3)
  { label: "AWS", cat: 3, pri: 9, used: ["Magnet Forensics - DevOps"] },
  { label: "Docker", cat: 3, pri: 8, used: ["Carleton - Research Asst", "M.A.Sc. Thesis"] },
  { label: "Linux", cat: 3, pri: 7, used: ["Magnet Forensics - DevOps"] },
  { label: "Jenkins", cat: 3, pri: 5, used: ["Magnet Forensics - DevOps"] },
  { label: "RabbitMQ", cat: 3, pri: 5, used: ["Carleton - Research Asst", "M.A.Sc. Thesis"] },
  // Web & DB (cat 4)
  { label: "React", cat: 4, pri: 8, used: ["Carleton - Research Asst", "LidarWorld", "M.A.Sc. Thesis"] },
  { label: "PostgreSQL", cat: 4, pri: 6, used: ["Speakeasy"] },
  { label: "Supabase", cat: 4, pri: 5, used: ["Speakeasy"] },
  { label: "Node.js", cat: 4, pri: 4, used: [] },
  { label: "Redux", cat: 4, pri: 2, used: [] },
  { label: "HTML/CSS", cat: 4, pri: 2, used: [] },
  { label: "Sass", cat: 4, pri: 1, used: [] },
  { label: "MongoDB", cat: 4, pri: 3, used: [] },
  { label: "Firebase", cat: 4, pri: 2, used: [] },
  { label: "Git", cat: 4, pri: 4, used: [] },
  // Languages (cat 5)
  { label: "Python", cat: 5, pri: 10, used: ["SAM3", "Carleton", "Magnet Forensics", "Telesat", "Speakeasy", "Algo Trading", "LeRobot SO-101"] },
  { label: "C/C++", cat: 5, pri: 8, used: ["Carleton - Research/TA", "Smart Band", "M.A.Sc. Thesis"] },
  { label: "TypeScript", cat: 5, pri: 7, used: ["LidarWorld", "Speakeasy"] },
  { label: "JavaScript", cat: 5, pri: 5, used: ["LidarWorld"] },
  { label: "Rust", cat: 5, pri: 3, used: [] },
  { label: "SQL", cat: 5, pri: 4, used: [] },
];

const CAT_COLORS = {
  0: [0, 221, 192],     // teal - center
  1: [90, 180, 255],    // blue - AI/ML/LLM
  2: [245, 175, 50],    // amber - hardware/robotics
  3: [120, 160, 220],   // steel - cloud
  4: [110, 210, 160],   // green - web/db
  5: [170, 200, 140],   // sage - languages
  empty: [20, 30, 42],
};

const CAT_NAMES = { 1: "AI/ML", 2: "Hardware", 3: "Cloud", 4: "Web/DB", 5: "Languages" };

/* ═══════════════════════════════════════════════════════════════════════════
   HEX GRID CANVAS
   ═══════════════════════════════════════════════════════════════════════════ */
function HexGrid({ onHexClick, settingsRef, onVisibilityChange }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const hexPositions = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId, t = 0;
    let builtW = 0, builtH = 0;

    function hexPath(cx, cy, size) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 180 * (60 * i - 30);
        const px = cx + size * Math.cos(a), py = cy + size * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function buildGrid(w, h) {
      const baseHex = 48;
      const hSp = baseHex * 1.82;
      const vSp = baseHex * 1.58;
      const cols = Math.ceil(w / hSp) + 1;
      const rows = Math.ceil(h / vSp) + 1;

      // Read min cols setting
      const S = settingsRef.current || {};
      const minCols = S.minCols ?? 3;

      // Check if enough room for minCols tiles in the widest row
      const availWidth = w * 0.48; // right side width
      const fittingCols = Math.floor(availWidth / hSp);
      if (fittingCols < minCols) {
        hexPositions.current = [];
        builtW = w; builtH = h;
        if (onVisibilityChange) onVisibilityChange(false);
        return;
      }

      // Exclusion zone: left 52%, from 6% to 74% height (covers text + stats)
      // Below 74% and above 6%: tiles on the left side too
      const exL = 0.52, exT = 0.06, exB = 0.74;

      const positions = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * hSp + (r % 2 ? hSp * 0.5 : 0);
          const cy = r * vSp + vSp * 0.5;
          const nx = cx / w, ny = cy / h;
          if (nx < exL && ny > exT && ny < exB) continue;
          positions.push({ cx, cy, nx, ny, skill: null, baseR: baseHex });
        }
      }

      // Find center position (right side, vertically centered)
      let centerIdx = 0, minD = Infinity;
      positions.forEach((p, i) => {
        const d = Math.sqrt((p.nx - 0.62) ** 2 + (p.ny - 0.46) ** 2);
        if (d < minD) { minD = d; centerIdx = i; }
      });
      positions[centerIdx].skill = { label: "TS", cat: 0, pri: 99, used: [] };
      positions[centerIdx].isCenter = true;

      // Sort available positions by distance from center (closest first)
      const centerPos = positions[centerIdx];
      const available = positions.filter((_, i) => i !== centerIdx);
      available.sort((a, b) => {
        const da = Math.sqrt((a.cx - centerPos.cx) ** 2 + (a.cy - centerPos.cy) ** 2);
        const db = Math.sqrt((b.cx - centerPos.cx) ** 2 + (b.cy - centerPos.cy) ** 2);
        return da - db;
      });

      // Sort skills by priority (highest first)
      const sorted = [...SKILLS].sort((a, b) => b.pri - a.pri);

      // Assign: highest priority skills get closest positions
      // If fewer positions than skills, low-pri skills just don't appear
      const count = Math.min(sorted.length, available.length);
      for (let i = 0; i < count; i++) {
        available[i].skill = sorted[i];
      }

      hexPositions.current = positions;
      builtW = w; builtH = h;
      builtMinCols = S.minCols ?? 3;
      if (onVisibilityChange) onVisibilityChange(true);
    }

    let builtMinCols = -1;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 10) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      const S = settingsRef.current || {};
      const curMinCols = S.minCols ?? 3;
      if (Math.abs(rect.width - builtW) > 30 || Math.abs(rect.height - builtH) > 30 || curMinCols !== builtMinCols) {
        buildGrid(rect.width, rect.height);
      }
    }

    function onMouse(e) {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function onLeave() { mouseRef.current = { x: -9999, y: -9999 }; }
    function onClick(e) {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      let closest = null, minD = Infinity;
      hexPositions.current.forEach(p => {
        if (!p.skill || p.isCenter) return;
        const d = Math.sqrt((mx - p.cx) ** 2 + (my - p.cy) ** 2);
        const hr = p.baseR;
        if (d < hr * 1.2 && d < minD) { minD = d; closest = p; }
      });
      if (closest && onHexClick) {
        onHexClick({ skill: closest.skill, x: e.clientX, y: e.clientY });
      }
    }

    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);
    resize();
    const r1 = setTimeout(resize, 100), r2 = setTimeout(resize, 500);
    window.addEventListener("resize", resize);

    let smx = -9999, smy = -9999;
    const trail = [];
    let frameCount = 0;

    function draw() {
      t += 0.004;
      frameCount++;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      if (w < 10 || h < 10) {
        animId = requestAnimationFrame(draw); return;
      }

      // Check if settings changed and rebuild needed
      const curMC = (settingsRef.current || {}).minCols ?? 3;
      if (curMC !== builtMinCols) resize();

      ctx.clearRect(0, 0, w, h);
      if (hexPositions.current.length === 0) {
        animId = requestAnimationFrame(draw); return;
      }

      // Read live settings from ref
      const S = settingsRef.current || {};
      const TRAIL_LEN = S.trailLen ?? 150;
      const BORDER_BASE = S.borderBase ?? 0.15;
      const DOT_MOD = Math.max(1, Math.round(S.dotMod ?? 7));
      const DOT_SIZE = S.dotSize ?? 3.0;

      const mx = mouseRef.current.x, my = mouseRef.current.y;
      smx += (mx - smx) * 0.12; smy += (my - smy) * 0.12;
      const mActive = smx > -1000;
      const spotR = 170;

      // Push current position to trail every 2nd frame
      if (mActive && frameCount % 2 === 0) {
        trail.push({ x: smx, y: smy });
        if (trail.length > TRAIL_LEN) trail.shift();
      }
      if (!mActive) { trail.length = 0; }

      // Proximity function: checks current mouse + trail history
      // Returns 0-1 where 1 = directly under current spotlight
      function getProx(px, py) {
        if (!mActive) return 0;
        // Current mouse (full strength)
        const dCur = Math.sqrt((smx - px) ** 2 + (smy - py) ** 2);
        let best = Math.max(0, 1 - dCur / spotR);
        best = best * best; // quadratic

        // Trail points (decaying strength)
        for (let i = trail.length - 1; i >= 0; i--) {
          const age = (trail.length - 1 - i) / TRAIL_LEN; // 0=newest, 1=oldest
          const decay = (1 - age) * 0.55; // trail fades to 55% of current
          const d = Math.sqrt((trail[i].x - px) ** 2 + (trail[i].y - py) ** 2);
          let p = Math.max(0, 1 - d / spotR);
          p = p * p * decay;
          if (p > best) best = p;
        }
        return best;
      }

      const hexes = hexPositions.current;

      // ── Pass 1: Edges with sparse category-colored dots ──
      hexes.forEach((a, ai) => {
        if (!a.skill) return;
        hexes.forEach((b, bi) => {
          if (bi <= ai || !b.skill) return;
          const dx = a.cx - b.cx, dy = a.cy - b.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = a.baseR * 3.8;
          if (dist > maxDist) return;

          let eProx = Math.max(getProx(a.cx, a.cy), getProx(b.cx, b.cy));
          if (eProx < 0.005) return;

          // Edge line
          ctx.beginPath(); ctx.moveTo(a.cx, a.cy); ctx.lineTo(b.cx, b.cy);
          ctx.strokeStyle = "rgba(0,221,192," + (eProx * 0.12).toFixed(4) + ")";
          ctx.lineWidth = eProx > 0.1 ? 1.2 : 0.4;
          ctx.stroke();

          // Traveling dot — only if BOTH endpoints are well-lit AND sparse (every 5th edge)
          const bothLit = Math.min(getProx(a.cx, a.cy), getProx(b.cx, b.cy));
          if (bothLit > 0.08 && (ai + bi) % DOT_MOD === 0) {
            const pulse = (t * 0.3 + ai * 0.1) % 1;
            const px = a.cx + (b.cx - a.cx) * pulse;
            const py = a.cy + (b.cy - a.cy) * pulse;
            const dToA = Math.sqrt((px - a.cx) ** 2 + (py - a.cy) ** 2);
            const dToB = Math.sqrt((px - b.cx) ** 2 + (py - b.cy) ** 2);
            const nearCat = dToA < dToB ? a.skill.cat : b.skill.cat;
            const dc = CAT_COLORS[nearCat] || CAT_COLORS[0];
            ctx.beginPath();
            ctx.arc(px, py, DOT_SIZE, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(" + dc[0] + "," + dc[1] + "," + dc[2] + "," + (bothLit * 0.4).toFixed(4) + ")";
            ctx.fill();
          }
        });
      });

      // ── Pass 2: Hexes ──
      hexes.forEach(hex => {
        const isEmpty = !hex.skill;
        const isCenter = hex.isCenter;
        const sk = hex.skill;
        const c = isEmpty ? CAT_COLORS.empty : CAT_COLORS[sk.cat];
        const hr = hex.baseR;

        const prox = isEmpty ? 0 : getProx(hex.cx, hex.cy);

        const breathe = Math.sin(t * 1.2 + hex.cx * 0.003 + hex.cy * 0.005) * 0.06 + 0.94;

        // ── Bloom glow ──
        if (prox > 0.03 && !isEmpty) {
          const glR = hr * 3.5;
          const grd = ctx.createRadialGradient(hex.cx, hex.cy, 0, hex.cx, hex.cy, glR);
          grd.addColorStop(0, "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (prox * 0.2).toFixed(4) + ")");
          grd.addColorStop(0.3, "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (prox * 0.05).toFixed(4) + ")");
          grd.addColorStop(1, "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0)");
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(hex.cx, hex.cy, glR, 0, Math.PI * 2); ctx.fill();

          if (prox > 0.08) {
            hexPath(hex.cx, hex.cy, hr + 7);
            ctx.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (prox * 0.4).toFixed(4) + ")";
            ctx.lineWidth = 1.5; ctx.stroke();
          }
        }

        // ── Hex fill ──
        hexPath(hex.cx, hex.cy, hr);
        let fillA = isEmpty ? 0 : (isCenter
          ? (0.005 + prox * 0.22) * breathe
          : (0.0 + prox * 0.16) * breathe);
        ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + fillA.toFixed(4) + ")";
        ctx.fill();

        // ── Border (always visible as faint outline, bright in spotlight) ──
        let borderA;
        if (isEmpty) {
          borderA = BORDER_BASE * 0.55;
        } else if (isCenter) {
          borderA = (BORDER_BASE * 1.3 + prox * 0.60) * breathe;
        } else {
          borderA = (BORDER_BASE + prox * 0.50) * breathe;
        }
        ctx.strokeStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + borderA.toFixed(4) + ")";
        ctx.lineWidth = isCenter ? 2 : (prox > 0.1 ? 2 : 0.8);
        ctx.stroke();

        // ── Label ──
        if (sk && !isEmpty) {
          let textA = isCenter
            ? 0.02 + prox * 0.90
            : 0.0 + prox * 0.95;
          if (textA > 0.01) {
            const fs = isCenter ? 15 : 11;
            ctx.font = (isCenter ? "700 " : "500 ") + fs + "px 'Azeret Mono', monospace";
            ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + Math.min(textA, 1).toFixed(4) + ")";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(sk.label, hex.cx, hex.cy);
          }
        }
      });

      // ── Legend (bottom-left of viewport) ──
      const lgX = 20, lgY = h - 22;
      ctx.font = "500 11px 'Azeret Mono', monospace";
      let lx = lgX;
      [
        { l: "AI/ML", cat: 1 }, { l: "Hardware", cat: 2 },
        { l: "Cloud", cat: 3 }, { l: "Web/DB", cat: 4 }, { l: "Languages", cat: 5 },
      ].forEach(item => {
        const c = CAT_COLORS[item.cat];
        ctx.beginPath(); ctx.arc(lx, lgY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.6)"; ctx.fill();
        ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.5)";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(item.l, lx + 9, lgY);
        lx += ctx.measureText(item.l).width + 30;
      });

      // "hover to explore" hint
      ctx.font = "400 9px 'Azeret Mono', monospace";
      ctx.fillStyle = "rgba(81,91,107,0.35)";
      ctx.textAlign = "right";
      ctx.fillText("hover to explore \u00b7 click for details", w - 16, lgY);

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId); clearTimeout(r1); clearTimeout(r2);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [onHexClick, onVisibilityChange]);

  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, cursor: "crosshair" }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SKILL POPUP
   ═══════════════════════════════════════════════════════════════════════════ */
function SkillPopup({ data, onClose }) {
  if (!data) return null;
  const { skill, x, y } = data;
  const c = CAT_COLORS[skill.cat];
  const catName = CAT_NAMES[skill.cat] || "";
  const rgb = c[0] + "," + c[1] + "," + c[2];

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Position popup near click, but keep on screen
  const left = Math.min(x + 12, window.innerWidth - 280);
  const top = Math.min(y - 20, window.innerHeight - 200);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200 }} />
      <div style={{
        position: "fixed", left, top, zIndex: 201, width: 260,
        background: "rgba(10,14,22,0.95)", border: "1px solid rgba(" + rgb + ",0.25)",
        borderRadius: 3, padding: "16px 18px", backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(" + rgb + ",0.06)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: "rgba(" + rgb + ",0.9)" }}>
            {skill.label}
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(" + rgb + ",0.4)", letterSpacing: "0.1em" }}>
            {catName}
          </span>
        </div>
        {skill.used && skill.used.length > 0 ? (
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 8 }}>
              USED AT
            </div>
            {skill.used.map((u, i) => (
              <div key={i} style={{
                fontFamily: "var(--body)", fontSize: 12.5, color: "var(--text)",
                padding: "5px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                fontWeight: 300,
              }}>
                {u}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: "var(--body)", fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>
            Skill in toolkit
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function HeroPage() {
  const [heroReady, setHeroReady] = useState(false);
  const [popup, setPopup] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [tilesVisible, setTilesVisible] = useState(true);
  const [dotMod, setDotMod] = useState(7);
  const [dotSize, setDotSize] = useState(3.0);
  const [borderBase, setBorderBase] = useState(0.15);
  const [trailLen, setTrailLen] = useState(150);
  const [minCols, setMinCols] = useState(5);
  const settingsRef = useRef({ dotMod: 7, dotSize: 3.0, borderBase: 0.15, trailLen: 150, minCols: 5 });

  useEffect(() => {
    settingsRef.current = { dotMod, dotSize, borderBase, trailLen, minCols };
  }, [dotMod, dotSize, borderBase, trailLen, minCols]);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  const ha = (d) => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? "translateY(0)" : "translateY(28px)",
    transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) " + d + "ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) " + d + "ms",
  });

  const handleHexClick = useCallback((data) => setPopup(data), []);
  const closePopup = useCallback(() => setPopup(null), []);
  const handleVisibility = useCallback((v) => setTilesVisible(v), []);

  const sliderLabel = { fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.06em", minWidth: 90 };
  const sliderVal = { fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)", minWidth: 40, textAlign: "right" };
  const sliderInput = { flex: 1, accentColor: "#00DDC0", height: 4, cursor: "pointer", background: "transparent" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        :root { --bg:#060A11;--surface:#0D1219;--elev:#161E2C;--accent:#00DDC0;--amber:#F0A500;--text:#BFC5CF;--heading:#EDF0F5;--muted:#515B6B;--border:rgba(0,221,192,0.08);--bhi:rgba(0,221,192,0.28);--mono:'Azeret Mono',monospace;--body:'IBM Plex Sans',sans-serif; }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--text);font-family:var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::selection{background:rgba(0,221,192,0.16);color:var(--heading)}
        a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .stat-row{display:flex;gap:48px;flex-wrap:wrap}
        @media(max-width:600px){.stat-row{gap:28px!important}}
        input[type=range]{-webkit-appearance:none;appearance:none;background:rgba(0,221,192,0.1);border-radius:2px;height:4px;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:#00DDC0;cursor:pointer;border:none}
        input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:#00DDC0;cursor:pointer;border:none}
      `}</style>

      {/* ── Settings panel ── */}
      <div style={{
        position: "fixed", top: 56, right: 16, zIndex: 150, pointerEvents: "auto",
      }}>
        <button onClick={() => setPanelOpen(!panelOpen)} style={{
          fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent)",
          background: "rgba(6,10,17,0.9)", border: "1px solid var(--border)",
          borderRadius: 2, padding: "6px 14px", cursor: "pointer",
          backdropFilter: "blur(10px)", letterSpacing: "0.08em",
          display: "flex", alignItems: "center", gap: 6, marginLeft: "auto",
        }}>
          {panelOpen ? "\u25BC" : "\u25B6"} TUNING
        </button>
        {panelOpen && (
          <div style={{
            marginTop: 6, background: "rgba(6,10,17,0.92)", border: "1px solid var(--border)",
            borderRadius: 2, padding: "16px 18px", backdropFilter: "blur(14px)",
            width: 320, display: "flex", flexDirection: "column", gap: 14,
          }}>
            {/* Dot density */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={sliderLabel}>Dot density</span>
              <input type="range" min="1" max="10" step="1" value={dotMod}
                onChange={e => setDotMod(Number(e.target.value))} style={sliderInput} />
              <span style={sliderVal}>1/{dotMod}</span>
            </div>
            {/* Dot size */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={sliderLabel}>Dot size</span>
              <input type="range" min="5" max="50" step="1" value={Math.round(dotSize * 10)}
                onChange={e => setDotSize(Number(e.target.value) / 10)} style={sliderInput} />
              <span style={sliderVal}>{dotSize.toFixed(1)}px</span>
            </div>
            {/* Hex outline */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={sliderLabel}>Hex outline</span>
              <input type="range" min="0" max="300" step="1" value={Math.round(borderBase * 1000)}
                onChange={e => setBorderBase(Number(e.target.value) / 1000)} style={sliderInput} />
              <span style={sliderVal}>{(borderBase * 100).toFixed(1)}%</span>
            </div>
            {/* Trail duration */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={sliderLabel}>Trail time</span>
              <input type="range" min="0" max="360" step="5" value={trailLen}
                onChange={e => setTrailLen(Number(e.target.value))} style={sliderInput} />
              <span style={sliderVal}>{(trailLen / 60).toFixed(1)}s</span>
            </div>
            {/* Min tiles per row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={sliderLabel}>Min cols</span>
              <input type="range" min="1" max="8" step="1" value={minCols}
                onChange={e => setMinCols(Number(e.target.value))} style={sliderInput} />
              <span style={sliderVal}>{minCols}</span>
            </div>
            {/* Reset */}
            <button onClick={() => { setDotMod(7); setDotSize(3.0); setBorderBase(0.15); setTrailLen(150); setMinCols(5); }} style={{
              fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", background: "none",
              border: "1px solid var(--border)", borderRadius: 2, padding: "5px 12px",
              cursor: "pointer", letterSpacing: "0.08em", alignSelf: "flex-end",
            }}>RESET DEFAULTS</button>
          </div>
        )}
      </div>

      {/* ── Popup ── */}
      <SkillPopup data={popup} onClose={closePopup} />

      {/* ── Topo background ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <svg viewBox="0 0 1400 1000" style={{ width: "100%", height: "100%", opacity: 0.015 }} preserveAspectRatio="xMidYMid slice">
          <g fill="none" stroke="#00DDC0" strokeWidth="0.5">
            <path d="M-100,200Q200,150 450,220T900,180T1500,250" />
            <path d="M-100,500Q250,460 530,520T950,480T1500,550" />
            <path d="M-100,800Q220,770 500,820T880,780T1500,850" />
          </g>
        </svg>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(6,10,17,0.85)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 700, color: "var(--heading)" }}>
            TS<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
            {["About", "Experience", "Projects", "Skills", "Publications", "Contact"].map(item => (
              <span key={item} style={{ fontFamily: "var(--body)", fontSize: 13, color: "var(--muted)", cursor: "pointer" }}>{item}</span>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", zIndex: 1, overflow: "hidden" }}>
        {/* Hex grid canvas (absolute, inside hero, clips at section boundary) */}
        <HexGrid onHexClick={handleHexClick} settingsRef={settingsRef} onVisibilityChange={handleVisibility} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 28px 60px", width: "100%", position: "relative", zIndex: 2, pointerEvents: "none" }}>
          {/* Text column - full width when tiles hidden, 46% when visible */}
          <div style={{ maxWidth: tilesVisible ? "46%" : "100%", pointerEvents: "auto", transition: "max-width 0.4s ease" }}>
            <div style={ha(0)}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px",
                borderRadius: 2, border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.05)", marginBottom: 28,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2.5s infinite" }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#22c55e", letterSpacing: "0.06em" }}>Building robots at SAM3</span>
              </div>
            </div>

            <div style={ha(100)}>
              <h1 style={{ fontFamily: "var(--mono)", fontSize: "clamp(38px,5.5vw,60px)", fontWeight: 700, color: "var(--heading)", lineHeight: 1.05, marginBottom: 10 }}>
                Tom Sloan
              </h1>
            </div>

            <div style={ha(200)}>
              <p style={{ fontFamily: "var(--mono)", fontSize: "clamp(15px,2vw,20px)", color: "var(--accent)", fontWeight: 500, marginBottom: 24, lineHeight: 1.35 }}>
                Applied AI Engineer
              </p>
            </div>

            <div style={ha(300)}>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--text)", fontWeight: 300, marginBottom: 16 }}>
                I design hardware, train models, and ship the software that connects them. Right now I'm teaching a robotic arm to pick things up by watching me do it first.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--muted)", fontWeight: 300, marginBottom: 32 }}>
                4 IEEE publications · 6 AWS certifications · Training imitation learning policies on a Jetson Orin Nano.
              </p>
            </div>

            <div style={ha(400)}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <a href="#contact" style={{
                  fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--bg)", background: "var(--accent)",
                  padding: "10px 24px", borderRadius: 2, textDecoration: "none", fontWeight: 600, letterSpacing: "0.04em",
                }}>Get in touch</a>
                <a href="#" style={{
                  fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--accent)", border: "1px solid var(--bhi)",
                  padding: "10px 24px", borderRadius: 2, textDecoration: "none", fontWeight: 500,
                }}>GitHub</a>
                <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 4 }}>Ottawa, Canada</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={ha(550)}>
            <div style={{ marginTop: 56, paddingTop: 28, borderTop: "1px solid var(--border)", maxWidth: tilesVisible ? "46%" : "100%", pointerEvents: "auto", display: "flex", gap: 32, flexWrap: "nowrap", transition: "max-width 0.4s ease" }}>
              {[{ n: "4", l: "Publications" }, { n: "7", l: "Certs" }, { n: "8+", l: "Yrs Eng." }, { n: "5", l: "Projects" }].map((s, i) => (
                <div key={i} style={{ whiteSpace: "nowrap" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 28, fontWeight: 700, color: "var(--heading)", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: "var(--body)", fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 28px", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 24 }}>
          <span style={{ color: "var(--accent)" }}>// </span>ABOUT
        </h2>
        <div style={{ maxWidth: 700 }}>
          <p style={{ fontSize: 16, lineHeight: 1.75, fontWeight: 300 }}>
            I've designed PCBs, trained SLAM models on a $300 consumer drone, wrangled AWS deployments, and built React frontends to see what's actually happening. Most of my time right now goes toward robotics and applied ML for defense and healthcare.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, fontWeight: 300, marginTop: 16 }}>
            The problems I like most are the ones where you can't stay in one layer. Something breaks and you need to figure out if it's the sensor, the model, the comms protocol, or the deployment config. That's where I do my best work.
          </p>
        </div>
      </section>
    </>
  );
}