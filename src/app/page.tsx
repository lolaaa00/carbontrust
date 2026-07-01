"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ── Pipeline stage config ── */
const PIPE_STAGES = [
  { emoji: "📡", name: "Evidence\nSubmitted",  sub: "Public URLs",            text: "Received",    cls: "ct-pnode-active" },
  { emoji: "🌐", name: "Validators\nFetch",     sub: "gl.nondet.web.get()",   text: "Fetching",    cls: "ct-pnode-active" },
  { emoji: "🧭", name: "Independent\nEvaluation", sub: "3 validators",        text: "Evaluating",  cls: "ct-pnode-active-g" },
  { emoji: "⚖",  name: "Equivalence\nPrinciple", sub: "11 fields",           text: "Reconciling", cls: "ct-pnode-active-g" },
  { emoji: "✓",  name: "Assessment\nStored",    sub: "On-chain",              text: "Complete",    cls: "ct-pnode-done" },
];

export default function HomePage() {
  const [activeStages, setActiveStages] = useState<Set<number>>(new Set());

  /* ── Mark body ready so animations activate after hydration ── */
  useEffect(() => {
    document.body.classList.add("js-ready");
    return () => document.body.classList.remove("js-ready");
  }, []);

  /* ── Pipeline animation ── */
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function runPipe() {
      setActiveStages(new Set());
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
      PIPE_STAGES.forEach((_, i) => {
        timeouts.push(
          setTimeout(() => setActiveStages((prev) => new Set([...prev, i])), i * 900 + 400)
        );
      });
    }

    runPipe();
    const interval = setInterval(runPipe, 7000);
    return () => { clearInterval(interval); timeouts.forEach(clearTimeout); };
  }, []);

  /* ── Reveal on scroll ── */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".ct-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("ct-on");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => {
      const sibs = el.parentElement?.querySelectorAll<HTMLElement>(".ct-reveal");
      if (sibs && sibs.length > 1) {
        const idx = Array.from(sibs).indexOf(el);
        el.style.transitionDelay = idx * 0.08 + "s";
      }
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ── Mesh background ── */}
      <div className="ct-mesh">
        <div className="ct-orb ct-o1" />
        <div className="ct-orb ct-o2" />
        <div className="ct-orb ct-o3" />
      </div>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "9rem 2rem 5rem",
        }}
      >
        {/* Badge */}
        <div
          className="ct-hero-badge"
          style={{
            fontFamily: "var(--mono)",
            fontSize: ".7rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--gold)",
            padding: ".4375rem 1.125rem",
            border: "1px solid rgba(223,190,139,0.25)",
            borderRadius: "6px",
            background: "rgba(223,190,139,0.06)",
            marginBottom: "2.5rem",
            display: "inline-flex",
            alignItems: "center",
            gap: ".625rem",
          }}
        >
          <span className="ct-badge-dot" />
          Decentralized Environmental Intelligence · GenLayer StudioNet
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--sg)",
            fontSize: "clamp(3rem,9.5vw,7.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.94,
            marginBottom: "1.5rem",
            maxWidth: "880px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="ct-ht-word" style={{ animationDelay: ".15s" }}>
              Uncertain evidence.
            </span>
          </span>
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="ct-ht-grad" style={{ animationDelay: ".38s" }}>
              Confidence-scored
            </span>
          </span>
          <span style={{ display: "block", overflow: "hidden" }}>
            <span className="ct-ht-word" style={{ animationDelay: ".62s" }}>
              consensus.
            </span>
          </span>
        </h1>

        {/* Sub */}
        <p
          className="ct-hero-sub"
          style={{
            fontSize: "1.125rem",
            lineHeight: 1.65,
            color: "var(--ct-text-2)",
            maxWidth: "580px",
            marginBottom: "2.75rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          CarbonTrust doesn&apos;t merely track carbon claims. It uses{" "}
          <span style={{ color: "var(--gold)" }}>GenLayer validator consensus</span> to decide
          whether the evidence actually supports them — carbon estimates, biodiversity, fraud risk,
          all confidence-scored.
        </p>

        {/* Buttons */}
        <div
          className="ct-hero-btns"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}
        >
          <Link href="/explore" className="ct-btn ct-btn-p">
            Explore Evidence <span className="ct-arr">→</span>
          </Link>
          <Link href="/explore" className="ct-btn ct-btn-g">
            See an Assessment
          </Link>
        </div>

        {/* ── Evidence → Consensus Pipeline ── */}
        <div
          className="ct-pipeline-wrap"
          style={{ width: "100%", maxWidth: "920px", padding: "1.75rem 2.25rem 1.625rem", marginTop: "2.75rem" }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: ".58rem",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "var(--ct-text-3)",
              marginBottom: "1.25rem",
              textAlign: "left",
            }}
          >
            Evidence-to-Assessment Pipeline · GenLayer Consensus · StudioNet
          </div>
          <div className="ct-pipeline-line" style={{ position: "relative" }}>
            <div className="ct-beam-dot" />
            {PIPE_STAGES.map((stage, i) => (
              <div
                key={i}
                className={`${activeStages.has(i) ? stage.cls : ""}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: ".5rem",
                  padding: ".625rem .4rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div className="ct-pnode-ring">{stage.emoji}</div>
                <div
                  style={{
                    fontFamily: "var(--sg)",
                    fontSize: ".72rem",
                    fontWeight: 600,
                    color: "var(--ct-text)",
                    textAlign: "center",
                    lineHeight: 1.25,
                    whiteSpace: "pre-line",
                  }}
                >
                  {stage.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: ".55rem",
                    color: "var(--ct-text-3)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  {stage.sub}
                </div>
                <div className="ct-pnode-st">{stage.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EVIDENCE REGISTRY
      ══════════════════════════════════════════ */}
      <div className="ct-divider" />
      <section
        id="evidence"
        style={{ position: "relative", zIndex: 2, maxWidth: "1180px", margin: "0 auto", padding: "7rem 2rem" }}
      >
        <div className="ct-reveal">
          <div className="ct-sec-lbl">Evidence Registry</div>
          <h2 className="ct-sec-title">
            No evidence. <span className="ct-grad-text">No assessment.</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ct-text-2)", lineHeight: 1.65, maxWidth: "560px" }}>
            Every claim is tied to public evidence URLs — satellite imagery, audits, permits,
            biodiversity surveys. The contract fetches and reads them during consensus.
          </p>
        </div>

        <div
          className="ct-ev-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.125rem", marginTop: "3rem" }}
        >
          {[
            {
              cls: "ct-ev-sat",
              badge: "🛰 Satellite Imagery",
              badgeStyle: { color: "#7FB1FF", background: "rgba(79,141,255,.1)", border: "1px solid rgba(79,141,255,.22)" },
              title: "Landsat-8 Time Series Analysis 2020–2025",
              desc: "Multi-year imagery showing progressive vegetation recovery in replanted zones of the reforestation project area.",
              source: "NASA / USGS Landsat Program",
              date: "2025-06-01",
            },
            {
              cls: "ct-ev-env",
              badge: "📄 Environmental Report",
              badgeStyle: { color: "var(--forest-2)", background: "rgba(58,117,100,.12)", border: "1px solid rgba(58,117,100,.25)" },
              title: "Carbon Sequestration Methodology — VCS VM0007",
              desc: "Verra VCS methodology framework used as the basis for carbon sequestration estimates in this project.",
              source: "Verra · Verified Carbon Standard",
              date: "2024-11-15",
            },
            {
              cls: "ct-ev-aud",
              badge: "✓ Third-Party Audit",
              badgeStyle: { color: "#A89BF5", background: "rgba(139,127,232,.1)", border: "1px solid rgba(139,127,232,.22)" },
              title: "Independent Verification Report — Bureau Veritas 2025",
              desc: "Third-party verification confirming methodology compliance and carbon estimate validation.",
              source: "Bureau Veritas",
              date: "2025-03-20",
            },
            {
              cls: "ct-ev-gov",
              badge: "🛡 Government Permit",
              badgeStyle: { color: "var(--gold)", background: "rgba(223,190,139,.1)", border: "1px solid rgba(223,190,139,.22)" },
              title: "IBAMA Reforestation Authorization No. 2020/BR/PA-4521",
              desc: "Brazilian Federal Agency authorization for reforestation activities in Pará State degraded areas.",
              source: "IBAMA",
              date: "2020-01-15",
            },
            {
              cls: "ct-ev-bio",
              badge: "🌿 Biodiversity Survey",
              badgeStyle: { color: "#6EE7B7", background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.22)" },
              title: "Amazon Basin Biodiversity Recovery Assessment 2024",
              desc: "Field survey documenting species recovery: return of 12 mammal species and 28 bird species to restored corridors.",
              source: "WWF / Local University Partnership",
              date: "2024-08-10",
            },
          ].map((card, i) => (
            <div key={i} className={`ct-ev-card ct-reveal ${card.cls}`} style={{ padding: "1.5rem 1.5rem 1.375rem" }}>
              <div
                style={{
                  ...card.badgeStyle,
                  fontFamily: "var(--mono)",
                  fontSize: ".58rem",
                  fontWeight: 500,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  padding: ".25rem .65rem",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                  marginBottom: "1rem",
                }}
              >
                {card.badge}
              </div>
              <div style={{ fontFamily: "var(--sg)", fontSize: "1rem", fontWeight: 600, color: "var(--ct-text)", marginBottom: ".5rem", lineHeight: 1.3 }}>
                {card.title}
              </div>
              <div style={{ fontSize: ".85rem", color: "var(--ct-text-2)", lineHeight: 1.55, marginBottom: "1.125rem" }}>
                {card.desc}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: ".875rem", borderTop: "1px solid rgba(154,188,171,.08)" }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: ".65rem", color: "var(--ct-text-3)" }}>{card.source}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: ".6rem", color: "var(--ct-text-3)", opacity: .7 }}>{card.date}</span>
              </div>
            </div>
          ))}

          {/* Slot counter */}
          <div
            className="ct-ev-card ct-ev-sat ct-reveal"
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              borderStyle: "dashed",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem", opacity: .5 }}>+</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: ".7rem", color: "var(--ct-text-3)", letterSpacing: ".06em" }}>
              5 of 50 evidence slots used
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONSENSUS ASSESSMENT TERMINAL
      ══════════════════════════════════════════ */}
      <div className="ct-divider" />
      <section
        id="assessment"
        style={{ position: "relative", zIndex: 2, maxWidth: "1180px", margin: "0 auto", padding: "7rem 2rem" }}
      >
        <div className="ct-reveal">
          <div className="ct-sec-lbl">Consensus Assessment Terminal</div>
          <h2 className="ct-sec-title">
            Carbon, biodiversity, fraud risk.{" "}
            <span className="ct-grad-text">All confidence-scored.</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ct-text-2)", lineHeight: 1.65, maxWidth: "560px" }}>
            Not approve or reject. A full structured verdict — every dimension scored, every source traced.
          </p>
        </div>

        <div className="ct-assess-wrap ct-reveal" style={{ marginTop: "3rem" }}>
          {/* Head */}
          <div
            style={{
              padding: "1.5rem 2rem",
              borderBottom: "1px solid rgba(58,117,100,.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--sg)", fontSize: "1.125rem", fontWeight: 700, color: "var(--ct-text)" }}>
                Amazon Basin Reforestation Initiative
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: ".68rem", color: "var(--ct-text-3)", marginTop: ".15rem" }}>
                Assessment #1 · Project ID 1 · GreenFuture Foundation · 5 evidence items reviewed
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: ".65rem",
                fontWeight: 500,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                padding: ".3rem .875rem",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                color: "var(--gold)",
                background: "rgba(223,190,139,.12)",
                border: "1px solid rgba(223,190,139,.25)",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 8px var(--gold)", display: "inline-block" }} />
              Moderate Confidence
            </div>
          </div>

          {/* Body */}
          <div
            className="ct-assess-body"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
          >
            {/* Left */}
            <div className="ct-assess-left" style={{ padding: "2rem", borderRight: "1px solid rgba(58,117,100,.1)" }}>
              {/* Gauge */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid rgba(154,188,171,.08)" }}>
                <div style={{ position: "relative", width: "96px", height: "96px", flexShrink: 0 }}>
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(154,188,171,0.1)" strokeWidth="7" />
                    <circle cx="48" cy="48" r="42" fill="none" stroke="url(#gaugeGrad)" strokeWidth="7" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="58" transform="rotate(-90 48 48)" />
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3A7564" />
                        <stop offset="100%" stopColor="#DFBE8B" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: "var(--sg)", fontSize: "1.75rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>78</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: ".5rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ct-text-3)", marginTop: ".15rem" }}>Score</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ct-text-3)", marginBottom: ".375rem" }}>Confidence Level</div>
                  <div style={{ fontFamily: "var(--sg)", fontSize: "1.0625rem", fontWeight: 600, color: "var(--ct-text)" }}>High · 75–89 band</div>
                </div>
              </div>

              {/* Carbon range */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--ct-text-3)", marginBottom: ".875rem" }}>Carbon Estimate Range (tCO2e)</div>
                <div style={{ position: "relative", height: "8px", background: "rgba(154,188,171,.1)", borderRadius: "4px", marginBottom: ".625rem" }}>
                  <div style={{ position: "absolute", top: 0, left: "18%", right: "22%", height: "100%", borderRadius: "4px", background: "linear-gradient(90deg,var(--forest),var(--gold))" }} />
                  <div style={{ position: "absolute", top: "-4px", width: "3px", height: "16px", background: "var(--gold-2)", borderRadius: "2px", boxShadow: "0 0 8px var(--gold)", left: "48%" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mono)", fontSize: ".7rem", color: "var(--ct-text-2)" }}>
                  <span>80,000</span><span>110,000</span>
                </div>
                <div style={{ textAlign: "center", marginTop: ".875rem" }}>
                  <span style={{ fontFamily: "var(--sg)", fontSize: "1.5rem", fontWeight: 700, color: "var(--gold)" }}>95,000</span>{" "}
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".65rem", color: "var(--ct-text-3)" }}>tCO2e likely estimate</span>
                </div>
              </div>

              {/* Risk grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: ".75rem" }}>
                {[
                  ["Additionality", "Likely", "var(--pass)"],
                  ["Environmental Risk", "Low", "var(--pass)"],
                  ["Evidence Quality", "High", "var(--pass)"],
                  ["Fraud Risk", "Low", "var(--pass)"],
                ].map(([label, val, col]) => (
                  <div key={label} style={{ background: "rgba(7,45,51,.6)", border: "1px solid rgba(154,188,171,.1)", borderRadius: "6px", padding: ".75rem .875rem" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: ".55rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ct-text-3)", marginBottom: ".3rem" }}>{label}</div>
                    <div style={{ fontFamily: "var(--sg)", fontSize: ".9375rem", fontWeight: 600, color: col }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Permanence & Biodiversity bars */}
              {[["Permanence Confidence", "72%", 72], ["Biodiversity Impact · Positive", "68%", 68]].map(([label, val, pct]) => (
                <div key={label} style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(154,188,171,.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".625rem" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: ".6rem", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ct-text-3)" }}>{label}</span>
                    <span style={{ fontFamily: "var(--sg)", fontSize: ".9375rem", fontWeight: 600, color: "var(--sage)" }}>{val}</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(154,188,171,.1)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", background: "linear-gradient(90deg,var(--forest),var(--sage))" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right */}
            <div style={{ padding: "2rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: ".55rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--ct-text-3)", marginBottom: "1rem" }}>
                Source Findings
              </div>

              {[
                { align: "Supports", alignCls: { color: "var(--sage)", background: "rgba(154,188,171,.1)", border: "1px solid rgba(154,188,171,.22)" }, text: "Satellite imagery confirms vegetation recovery consistent with claims.", cred: "Landsat-8 Time Series · Credibility: HIGH" },
                { align: "Supports", alignCls: { color: "var(--sage)", background: "rgba(154,188,171,.1)", border: "1px solid rgba(154,188,171,.22)" }, text: "Third-party audit corroborates methodology compliance and estimate validity.", cred: "Bureau Veritas Verification · Credibility: HIGH" },
                { align: "Mixed",    alignCls: { color: "var(--gold)", background: "rgba(223,190,139,.1)", border: "1px solid rgba(223,190,139,.2)" },   text: "Government permit confirms authorization but does not independently verify carbon outcomes.", cred: "IBAMA Authorization · Credibility: MODERATE" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: ".875rem", padding: ".75rem 0", borderBottom: i < 2 ? "1px solid rgba(154,188,171,.07)" : "none" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".58rem", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", padding: ".18rem .5rem", borderRadius: "3px", flexShrink: 0, alignSelf: "flex-start", marginTop: "1px", ...f.alignCls }}>{f.align}</span>
                  <div>
                    <div style={{ fontSize: ".875rem", color: "var(--ct-text-2)", lineHeight: 1.5 }}>{f.text}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: ".58rem", color: "var(--ct-text-3)", marginTop: ".2rem" }}>{f.cred}</div>
                  </div>
                </div>
              ))}

              {/* Recommended action */}
              <div style={{ marginTop: "1.25rem", padding: "1.125rem 1.25rem", background: "rgba(223,190,139,.06)", border: "1px solid rgba(223,190,139,.18)", borderRadius: "8px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: ".58rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: ".5rem" }}>Recommended Action</div>
                <div style={{ fontSize: ".9rem", color: "var(--ct-text-2)", lineHeight: 1.55 }}>
                  Proceed with credit issuance with annual monitoring verification. Strong satellite evidence supports carbon removal claims. Permanence confidence moderate due to limited long-term monitoring data — recommend continued tracking.
                </div>
              </div>

              <div style={{ marginTop: "1.25rem", fontFamily: "var(--mono)", fontSize: ".62rem", color: "var(--ct-text-3)" }}>
                Missing evidence: Long-term soil carbon sampling data<br />
                Contract: 0x02D4...3520D · Block: 14,847,291 · StudioNet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EXPLORE PROJECTS
      ══════════════════════════════════════════ */}
      <div className="ct-divider" />
      <section
        id="explore"
        style={{ position: "relative", zIndex: 2, maxWidth: "1180px", margin: "0 auto", padding: "7rem 2rem" }}
      >
        <div className="ct-reveal">
          <div className="ct-sec-lbl">Explore Projects</div>
          <h2 className="ct-sec-title">
            Every assessment. <span className="ct-grad-text">Publicly verifiable.</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ct-text-2)", lineHeight: 1.65, maxWidth: "560px" }}>
            No login required. Every consensus verdict is shareable, traceable to its contract,
            and permanently on-chain.
          </p>
        </div>

        <div
          className="ct-proj-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem", marginTop: "3rem" }}
        >
          {[
            { type: "Reforestation", status: "Assessed", statusColor: "var(--sage)", statusBg: "rgba(154,188,171,.1)", statusBorder: "rgba(154,188,171,.22)", title: "Amazon Basin Reforestation Initiative", loc: "Pará State, Brazil", stats: ["95K tCO2e","78% confidence","5 evidence"] },
            { type: "Blue Carbon",   status: "Assessed", statusColor: "var(--sage)", statusBg: "rgba(154,188,171,.1)", statusBorder: "rgba(154,188,171,.22)", title: "Sundarbans Mangrove Restoration",         loc: "Khulna Division, Bangladesh", stats: ["42K tCO2e","85% confidence","7 evidence"] },
            { type: "Renewable Energy", status: "Pending Review", statusColor: "var(--gold)", statusBg: "rgba(223,190,139,.1)", statusBorder: "rgba(223,190,139,.2)", title: "Atacama Solar Methane Offset",            loc: "Antofagasta, Chile", stats: ["— tCO2e","3 evidence"] },
          ].map((p, i) => (
            <Link key={i} href="/explore" style={{ textDecoration: "none" }}>
              <div className="ct-proj-card ct-reveal" style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.125rem" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".6rem", color: "var(--ct-text-3)" }}>{p.type}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".58rem", fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", padding: ".2rem .6rem", borderRadius: "3px", color: p.statusColor, background: p.statusBg, border: `1px solid ${p.statusBorder}` }}>{p.status}</span>
                </div>
                <div style={{ fontFamily: "var(--sg)", fontSize: "1.1875rem", fontWeight: 700, color: "var(--ct-text)", marginBottom: ".5rem", lineHeight: 1.25 }}>{p.title}</div>
                <div style={{ fontSize: ".85rem", color: "var(--ct-text-2)", marginBottom: "1.25rem" }}>{p.loc}</div>
                <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                  {p.stats.map((s) => (
                    <span key={s} style={{ fontFamily: "var(--mono)", fontSize: ".62rem", padding: ".2rem .6rem", borderRadius: "3px", color: "var(--forest-2)", background: "rgba(58,117,100,.1)", border: "1px solid rgba(58,117,100,.2)" }}>{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <div className="ct-divider" />
      <section style={{ position: "relative", zIndex: 2, maxWidth: "1180px", margin: "0 auto", padding: "7rem 2rem" }}>
        <div className="ct-reveal">
          <div className="ct-sec-lbl">How It Works</div>
          <h2 className="ct-sec-title">
            From claim to <span className="ct-grad-text">consensus verdict.</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ct-text-2)", lineHeight: 1.65, maxWidth: "560px" }}>
            No backend. No oracle service. The GenLayer contract is the canonical adjudication engine.
          </p>
        </div>

        <div
          className="ct-steps-grid ct-reveal"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", border: "1px solid rgba(58,117,100,.15)", borderRadius: "10px", overflow: "hidden", background: "rgba(58,117,100,.1)", marginTop: "3rem" }}
        >
          {[
            { n: "01", h: "Create Case", p: "Lock project type, location, carbon claims, biodiversity claims, and monitoring period on-chain." },
            { n: "02", h: "Submit Evidence", p: "Public URLs with metadata — satellite imagery, audits, permits, surveys. Up to 50 per project." },
            { n: "03", h: "Request Review", p: "Owner triggers consensus. Validators fetch up to 12 evidence URLs during execution." },
            { n: "04", h: "Consensus Stored", p: "Equivalence principle reconciles 11 fields across validators. Verdict written on-chain, permanently." },
          ].map((s) => (
            <div key={s.n} className="ct-step">
              <div style={{ fontFamily: "var(--sg)", fontSize: "2.5rem", fontWeight: 700, background: "linear-gradient(135deg,rgba(58,117,100,.5),rgba(223,190,139,.4))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: "1.25rem", letterSpacing: "-.04em" }}>{s.n}</div>
              <h3 style={{ fontFamily: "var(--sg)", fontSize: "1.0625rem", fontWeight: 700, color: "var(--ct-text)", marginBottom: ".5rem", letterSpacing: "-.02em" }}>{s.h}</h3>
              <p style={{ fontSize: ".9375rem", color: "var(--ct-text-2)", lineHeight: 1.55 }}>{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY GENLAYER
      ══════════════════════════════════════════ */}
      <div className="ct-divider" />
      <section
        id="why"
        style={{ position: "relative", zIndex: 2, maxWidth: "1180px", margin: "0 auto", padding: "7rem 2rem" }}
      >
        <div className="ct-reveal">
          <div className="ct-sec-lbl">Why This Requires GenLayer</div>
          <h2 className="ct-sec-title">
            A spreadsheet stores a number.{" "}
            <span className="ct-grad-text">CarbonTrust decides if it&apos;s true.</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ct-text-2)", lineHeight: 1.65, maxWidth: "560px" }}>
            Carbon estimates, additionality, fraud risk — these are genuinely subjective judgments.
            No deterministic contract can make them.
          </p>
        </div>

        <div
          className="ct-why-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "3rem" }}
        >
          {/* Traditional */}
          <div
            className="ct-reveal"
            style={{ padding: "2.25rem 2rem", borderRadius: "10px", background: "rgba(7,45,51,.6)", border: "1px solid rgba(154,188,171,.08)" }}
          >
            <div style={{ fontFamily: "var(--mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ct-text-3)", marginBottom: "1.5rem" }}>Traditional Carbon Registries</div>
            {[
              "Store a claimed number — no independent evaluation of whether evidence supports it",
              "Binary approve/reject — erases the genuine uncertainty in environmental science",
              "Single human reviewer or centralized oracle — one point of failure or bias",
              "No source-level traceability — you can't see which evidence supported which conclusion",
              "Fraud and inflated claims slip through static, rules-based review",
            ].map((txt, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".875rem", padding: ".75rem 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <span style={{ color: "var(--ct-text-3)", fontSize: ".875rem", flexShrink: 0, marginTop: "1px" }}>×</span>
                <div style={{ fontSize: ".9375rem", lineHeight: 1.55, color: "var(--ct-text-3)" }}>{txt}</div>
              </div>
            ))}
          </div>

          {/* CarbonTrust */}
          <div className="ct-wc-ct ct-reveal" style={{ padding: "2.25rem 2rem", borderRadius: "10px" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.5rem" }}>CarbonTrust · GenLayer Protocol</div>
            {[
              { icon: "✦", col: "var(--forest-2)", txt: "Validators independently fetch and read evidence URLs during execution — no pre-cached data", tag: "Non-deterministic evaluation", tagCls: "forest" },
              { icon: "✦", col: "var(--gold)",     txt: "Equivalence principle reconciles 11 fields across validators — consensus, not vote count", tag: "GenLayer consensus", tagCls: "gold" },
              { icon: "✦", col: "var(--forest-2)", txt: "Every assessment includes source findings — alignment and credibility per evidence item", tag: "Source-attested verdicts", tagCls: "forest" },
              { icon: "✦", col: "var(--sage)",     txt: "Confidence scores across carbon, additionality, permanence, biodiversity, and fraud risk", tag: "Multi-dimensional scoring", tagCls: "gold" },
              { icon: "✦", col: "var(--gold)",     txt: "No evidence, no assessment — the contract requires at least one item before review can run", tag: "Evidence-gated review", tagCls: "forest" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: ".875rem", padding: ".75rem 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <span style={{ color: item.col, fontSize: ".875rem", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: ".9375rem", lineHeight: 1.55, color: "var(--ct-text-2)" }}>{item.txt}</div>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: ".55rem", letterSpacing: ".12em", textTransform: "uppercase",
                    display: "inline-block", marginTop: ".25rem", padding: ".15rem .5rem", borderRadius: "3px",
                    ...(item.tagCls === "gold"
                      ? { color: "var(--gold)", background: "rgba(223,190,139,.08)", border: "1px solid rgba(223,190,139,.18)" }
                      : { color: "var(--forest-2)", background: "rgba(58,117,100,.1)", border: "1px solid rgba(58,117,100,.2)" }),
                  }}>
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <div
        className="ct-fcta ct-reveal"
        style={{ maxWidth: "960px", margin: "8rem auto 5rem", padding: "5rem 3rem", borderRadius: "16px", textAlign: "center", position: "relative", zIndex: 2 }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "var(--sg)", fontSize: "clamp(2.25rem,6vw,3.75rem)", fontWeight: 700, letterSpacing: "-.03em", color: "var(--ct-text)", lineHeight: 1.05, marginBottom: "1.25rem" }}>
            Carbon claims deserve <span className="ct-grad-text-2">more than a number.</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ct-text-2)", lineHeight: 1.65, margin: "0 auto 2.5rem", maxWidth: "520px" }}>
            CarbonTrust turns environmental evidence into confidence-scored, source-attested
            consensus assessments. Built on GenLayer. No backend. No oracle. Just evidence and
            judgment.
          </p>
          <Link href="/projects/new" className="ct-btn ct-btn-p">
            Create an Assessment <span className="ct-arr">→</span>
          </Link>
        </div>
      </div>
    </>
  );
}
