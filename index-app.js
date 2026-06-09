(function () {
  const CACHE_STORE_KEY = "ice-study-pack-cache-v3";
  const LAST_PACK_KEY = "ice-study-pack-last-v3";
  const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
  const TRIAL_QUERY = new URLSearchParams(window.location.search);
  const TRIAL_BIOLOGY_14 = TRIAL_QUERY.get("trial") === "bio14";
  const API_BASE = (() => {
    if (window.IC_EDUCATE_API_BASE) {
      return String(window.IC_EDUCATE_API_BASE).replace(/\/$/, "");
    }
    if (window.location.protocol.startsWith("http") && !window.location.hostname.endsWith("github.io")) {
      return window.location.origin.replace(/\/$/, "");
    }
    return "http://127.0.0.1:8001";
  })();

  const CATALOG = {
    "Cambridge IGCSE": {
      levels: {
        IGCSE: ["Mathematics", "Biology", "Chemistry", "Physics", "Economics", "Business", "English"],
        Extended: ["Mathematics", "Biology", "Chemistry", "Physics", "Economics"]
      }
    },
    "Cambridge A Level": {
      levels: {
        "AS Level": ["Mathematics", "Biology", "Chemistry", "Physics", "Economics", "Business"],
        "A Level": ["Mathematics", "Biology", "Chemistry", "Physics", "Economics", "Business"]
      }
    },
    "IB Diploma": {
      levels: {
        SL: ["Mathematics", "Biology", "Chemistry", "Physics", "Economics", "English"],
        HL: ["Mathematics", "Biology", "Chemistry", "Physics", "Economics", "Business"]
      }
    },
    HKDSE: {
      levels: {
        DSE: ["Mathematics", "Biology", "Chemistry", "Physics", "Economics", "Business", "English"]
      }
    },
    "CFA Program": {
      levels: {
        "Level I": ["Ethics", "Quantitative Methods", "Economics", "Financial Statement Analysis", "Equity", "Fixed Income"],
        "Level II": ["Ethics", "Quantitative Methods", "Economics", "Corporate Issuers", "Financial Statement Analysis", "Equity Valuation", "Fixed Income", "Derivatives", "Portfolio Management"],
        "Level III": ["Asset Allocation", "Portfolio Construction", "Derivatives And Risk", "Performance Evaluation", "Ethics"]
      }
    }
  };

  const state = {
    currentPack: null,
    currentTab: "notes",
    currentLane: "Foundation",
    quizSessions: {},
    bridgeOnline: false,
    bridgeNote: "",
    aiGenerationReady: false,
    topicalOptions: [],
    selectedTopicIds: [],
    recommendations: null
  };

  const elements = {
    studyForm: document.getElementById("studyForm"),
    syllabusSelect: document.getElementById("syllabusSelect"),
    levelSelect: document.getElementById("levelSelect"),
    topicSelect: document.getElementById("topicSelect"),
    paceSelect: document.getElementById("paceSelect"),
    worksheetLengthSelect: document.getElementById("worksheetLengthSelect"),
    goalInput: document.getElementById("goalInput"),
    focusInput: document.getElementById("focusInput"),
    recommendationWrap: document.getElementById("recommendationWrap"),
    recommendationHint: document.getElementById("recommendationHint"),
    recommendationChips: document.getElementById("recommendationChips"),
    useRecommendationsButton: document.getElementById("useRecommendationsButton"),
    officialTopicWrap: document.getElementById("officialTopicWrap"),
    officialTopicChoices: document.getElementById("officialTopicChoices"),
    cacheStatus: document.getElementById("cacheStatus"),
    bridgeStatus: document.getElementById("bridgeStatus"),
    clearCacheButton: document.getElementById("clearCacheButton"),
    generateButton: document.getElementById("generateButton"),
    studyWorkspace: document.getElementById("studyWorkspace"),
    packTitle: document.getElementById("packTitle"),
    packSubtitle: document.getElementById("packSubtitle"),
    notesCount: document.getElementById("notesCount"),
    questionCount: document.getElementById("questionCount"),
    worksheetCount: document.getElementById("worksheetCount"),
    packMeta: document.getElementById("packMeta"),
    importantPoints: document.getElementById("importantPoints"),
    diagramMount: document.getElementById("diagramMount"),
    noteCards: document.getElementById("noteCards"),
    studyTabs: Array.from(document.querySelectorAll(".study-tab")),
    notesPanel: document.getElementById("notesPanel"),
    quizPanel: document.getElementById("quizPanel"),
    worksheetPanel: document.getElementById("worksheetPanel"),
    lanePills: Array.from(document.querySelectorAll(".lane-pill")),
    quizLaneLabel: document.getElementById("quizLaneLabel"),
    quizPrompt: document.getElementById("quizPrompt"),
    quizPosition: document.getElementById("quizPosition"),
    quizConcept: document.getElementById("quizConcept"),
    quizAnswers: document.getElementById("quizAnswers"),
    quizFeedback: document.getElementById("quizFeedback"),
    quizFeedbackTitle: document.getElementById("quizFeedbackTitle"),
    quizFeedbackBody: document.getElementById("quizFeedbackBody"),
    quizCorrectCount: document.getElementById("quizCorrectCount"),
    quizMissedCount: document.getElementById("quizMissedCount"),
    quizReplayCount: document.getElementById("quizReplayCount"),
    replayQueueList: document.getElementById("replayQueueList"),
    resetLaneButton: document.getElementById("resetLaneButton"),
    nextQuestionButton: document.getElementById("nextQuestionButton"),
    worksheetMeta: document.getElementById("worksheetMeta"),
    worksheetIntro: document.getElementById("worksheetIntro"),
    worksheetPreview: document.getElementById("worksheetPreview"),
    worksheetScriptWrap: document.getElementById("worksheetScriptWrap"),
    worksheetScriptNote: document.getElementById("worksheetScriptNote"),
    worksheetScriptCommand: document.getElementById("worksheetScriptCommand"),
    downloadWorksheetButton: document.getElementById("downloadWorksheetButton"),
    printWorksheetButton: document.getElementById("printWorksheetButton"),
    downloadAnswerKeyButton: document.getElementById("downloadAnswerKeyButton"),
    worksheetUpload: document.getElementById("worksheetUpload"),
    markWorksheetButton: document.getElementById("markWorksheetButton"),
    markingResult: document.getElementById("markingResult")
  };

  function safeText(value, fallback = "") {
    return String(value ?? fallback).trim();
  }

  function normalizeToken(value) {
    return safeText(value)
      .toLowerCase()
      .replace(/[^\w\s-]+/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function slugify(value) {
    return normalizeToken(value)
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "study-pack";
  }

  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function sentenceCase(value) {
    const cleaned = safeText(value);
    if (!cleaned) {
      return "";
    }
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function splitIdeas(value) {
    return unique(
      safeText(value)
        .replace(/\r/g, "")
        .replace(/[;|]/g, "\n")
        .replace(/\.\s+/g, ".\n")
        .split(/\n|,/)
        .map((item) => item.replace(/^[\-\u2022\*\d\.\)\(]+/, "").trim())
        .filter((item) => item.length > 3)
    );
  }

  function wrapText(text, maxChars) {
    const words = safeText(text).split(/\s+/).filter(Boolean);
    if (!words.length) {
      return [""];
    }

    const lines = [];
    let current = "";
    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    });
    if (current) {
      lines.push(current);
    }
    return lines;
  }

  function fillSelect(select, items) {
    select.innerHTML = "";
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
  }

  function loadCacheStore() {
    try {
      return JSON.parse(window.localStorage.getItem(CACHE_STORE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveCacheStore(store) {
    window.localStorage.setItem(CACHE_STORE_KEY, JSON.stringify(store));
  }

  function defaultRequest() {
    if (TRIAL_BIOLOGY_14) {
      return {
        syllabus: "Cambridge IGCSE",
        level: "IGCSE",
        topic: "Biology",
        goal: "Master IGCSE Biology Chapter 14 Coordination and response with concise notes, exam-style quizzes, and a worksheet focused on reflexes, the eye, hormones, and homeostasis.",
        focus: "Chapter 14 Coordination and response; reflex arc; sense organs and the eye; hormones; homeostasis; blood glucose control; tropic responses",
        pace: "balanced",
        worksheetLength: 12
      };
    }
    return {
      syllabus: Object.keys(CATALOG)[0],
      level: Object.keys(CATALOG["Cambridge IGCSE"].levels)[0],
      topic: CATALOG["Cambridge IGCSE"].levels.IGCSE[0],
      goal: "",
      focus: "",
      pace: "balanced",
      worksheetLength: 12
    };
  }

  function buildRequestKey(request) {
    return [
      request.syllabus,
      request.level,
      request.topic,
      request.goal,
      request.focus,
      request.pace,
      String(request.worksheetLength),
      (request.topicIds || []).join(","),
      (request.recommendedFocus || []).join(",")
    ]
      .map(normalizeToken)
      .join("::");
  }

  function syncLevelOptions(preferredLevel) {
    const syllabus = elements.syllabusSelect.value || defaultRequest().syllabus;
    const levels = Object.keys(CATALOG[syllabus].levels);
    fillSelect(elements.levelSelect, levels);
    if (preferredLevel && levels.includes(preferredLevel)) {
      elements.levelSelect.value = preferredLevel;
    }
    syncTopicOptions();
  }

  function syncTopicOptions(preferredTopic) {
    const syllabus = elements.syllabusSelect.value;
    const level = elements.levelSelect.value;
    const topics = CATALOG[syllabus].levels[level] || [];
    fillSelect(elements.topicSelect, topics);
    if (preferredTopic && topics.includes(preferredTopic)) {
      elements.topicSelect.value = preferredTopic;
    }
  }

  function applyRequestToForm(request) {
    if (!request) {
      return;
    }
    elements.syllabusSelect.value = request.syllabus || defaultRequest().syllabus;
    syncLevelOptions(request.level);
    syncTopicOptions(request.topic);
    elements.paceSelect.value = request.pace || "balanced";
    elements.worksheetLengthSelect.value = String(request.worksheetLength || 12);
    elements.goalInput.value = request.goal || "";
    elements.focusInput.value = request.focus || "";
  }

  function readRequestFromForm() {
    return {
      syllabus: safeText(elements.syllabusSelect.value),
      level: safeText(elements.levelSelect.value),
      topic: safeText(elements.topicSelect.value),
      goal: safeText(elements.goalInput.value),
      focus: safeText(elements.focusInput.value),
      pace: safeText(elements.paceSelect.value, "balanced"),
      worksheetLength: Number(elements.worksheetLengthSelect.value) || 12,
      topicIds: [...state.selectedTopicIds],
      recommendedFocus: Array.isArray(state.recommendations?.recommendedFocus) ? [...state.recommendations.recommendedFocus] : []
    };
  }

  function generatorSubjectForRequest(request) {
    if (safeText(request.syllabus) !== "Cambridge IGCSE") {
      return "";
    }
    const map = {
      Mathematics: "Mathematics",
      Biology: "Biology",
      Chemistry: "Chemistry",
      Physics: "Physics"
    };
    return map[safeText(request.topic)] || "";
  }

  function setSelectedTopicIds(topicIds) {
    state.selectedTopicIds = [...new Set((topicIds || []).map((item) => safeText(item)).filter(Boolean))];
    elements.officialTopicChoices.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.checked = state.selectedTopicIds.includes(input.value);
    });
  }

  function renderOfficialTopicChoices() {
    if (!state.topicalOptions.length) {
      elements.officialTopicWrap.hidden = true;
      elements.officialTopicChoices.innerHTML = "";
      state.selectedTopicIds = [];
      return;
    }

    elements.officialTopicWrap.hidden = false;
    elements.officialTopicChoices.innerHTML = state.topicalOptions
      .map(
        (option) => `
          <label class="topic-choice">
            <input type="checkbox" value="${escapeHtml(option.id)}" ${state.selectedTopicIds.includes(option.id) ? "checked" : ""}>
            <span>${escapeHtml(option.title)}</span>
          </label>
        `
      )
      .join("");

    elements.officialTopicChoices.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.addEventListener("change", () => {
        const next = Array.from(elements.officialTopicChoices.querySelectorAll("input[type='checkbox']:checked")).map((node) => node.value);
        state.selectedTopicIds = next;
      });
    });
  }

  function renderRecommendations() {
    const recommendedFocus = Array.isArray(state.recommendations?.recommendedFocus)
      ? state.recommendations.recommendedFocus.filter(Boolean)
      : [];
    const topicMatches = Array.isArray(state.recommendations?.topicMatches)
      ? state.recommendations.topicMatches
      : [];
    const libraryMatches = Array.isArray(state.recommendations?.libraryMatches)
      ? state.recommendations.libraryMatches
      : [];

    if (!recommendedFocus.length && !topicMatches.length && !libraryMatches.length) {
      elements.recommendationWrap.hidden = true;
      elements.recommendationChips.innerHTML = "";
      return;
    }

    elements.recommendationWrap.hidden = false;
    const topicHint = topicMatches.length
      ? `${topicMatches.length} official topic match${topicMatches.length === 1 ? "" : "es"} found`
      : "No official topic-pack matches";
    const libraryHint = libraryMatches.length
      ? `${libraryMatches.length} library resource${libraryMatches.length === 1 ? "" : "s"} matched`
      : "No close library resources matched";
    elements.recommendationHint.textContent = `${topicHint}. ${libraryHint}.`;
    elements.recommendationChips.innerHTML = recommendedFocus
      .map((item) => `<button class="recommendation-chip" type="button" data-focus="${escapeHtml(item)}">${escapeHtml(item)}</button>`)
      .join("");

    elements.recommendationChips.querySelectorAll("[data-focus]").forEach((button) => {
      button.addEventListener("click", () => {
        const choice = safeText(button.getAttribute("data-focus"));
        if (!choice) {
          return;
        }
        const parts = splitIdeas(elements.focusInput.value);
        if (!parts.some((item) => normalizeToken(item) === normalizeToken(choice))) {
          parts.push(choice);
          elements.focusInput.value = parts.join(", ");
        }
      });
    });
  }

  async function loadRecommendations() {
    const request = readRequestFromForm();
    const subject = generatorSubjectForRequest(request) || request.topic;
    if (!state.bridgeOnline) {
      state.recommendations = null;
      renderRecommendations();
      return;
    }

    try {
      const params = new URLSearchParams({
        syllabus: request.syllabus,
        level: request.level,
        topic: request.topic,
        subject,
        goal: request.goal,
        focus: request.focus
      });
      const response = await fetch(`${API_BASE}/api/study-pack/recommend?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json();
      state.recommendations = payload;
      const suggestedTopicIds = Array.isArray(payload.recommendedTopicIds)
        ? payload.recommendedTopicIds.map((item) => safeText(item)).filter(Boolean)
        : [];
      if (suggestedTopicIds.length && state.topicalOptions.length) {
        const validIds = suggestedTopicIds.filter((id) => state.topicalOptions.some((option) => option.id === id));
        if (validIds.length) {
          setSelectedTopicIds(validIds);
        }
      }
      renderRecommendations();
    } catch (error) {
      state.recommendations = null;
      renderRecommendations();
    }
  }

  async function loadOfficialTopicOptions() {
    const request = readRequestFromForm();
    const subject = generatorSubjectForRequest(request);
    if (!state.bridgeOnline || !subject) {
      state.topicalOptions = [];
      renderOfficialTopicChoices();
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/worksheets/options`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json();
      const subjects = payload?.topical?.subjects || [];
      const match = subjects.find((item) => safeText(item.label) === subject || safeText(item.value) === subject);
      const options = Array.isArray(match?.topicPacks)
        ? match.topicPacks.map((item) => ({ id: safeText(item.id), title: safeText(item.title) })).filter((item) => item.id && item.title)
        : [];
      state.topicalOptions = options;
      if (TRIAL_BIOLOGY_14 && subject === "Biology" && options.some((item) => item.id === "14")) {
        state.selectedTopicIds = ["14"];
        renderOfficialTopicChoices();
        return;
      }
      const preferred = state.selectedTopicIds.filter((item) => options.some((option) => option.id === item));
      state.selectedTopicIds = preferred.length ? preferred : options.slice(0, 1).map((item) => item.id);
      renderOfficialTopicChoices();
      if (state.recommendations?.recommendedTopicIds?.length) {
        const validIds = state.recommendations.recommendedTopicIds.filter((item) => options.some((option) => option.id === item));
        if (validIds.length) {
          setSelectedTopicIds(validIds);
        }
      }
    } catch (error) {
      state.topicalOptions = [];
      renderOfficialTopicChoices();
    }
  }

  function buildTopicProfile(topic) {
    const value = normalizeToken(topic);

    if (value.includes("ethic")) {
      return {
        centralQuestion: "what duty applies and what the clean next action should be",
        diagramLabel: "Decision path",
        starters: [
          "Identify the duty before judging the action",
          "Separate what happened from what should have happened next",
          "Check who is harmed, what disclosure is needed, and what control failed"
        ],
        trap: "jumping to the violation label before checking the process"
      };
    }

    if (value.includes("quant")) {
      return {
        centralQuestion: "what the model is telling you and whether the inference is trustworthy",
        diagramLabel: "Model flow",
        starters: [
          "Name the statistic, then translate it into plain English",
          "Separate fit, inference quality, and forecast usefulness",
          "Check the assumptions before trusting the result"
        ],
        trap: "treating statistical significance as the same as economic importance"
      };
    }

    if (value.includes("economics")) {
      return {
        centralQuestion: "how the cause and effect chain moves through markets, growth, or policy",
        diagramLabel: "Cause and effect map",
        starters: [
          "Start with the shock, then trace the transmission path",
          "State which variable moves first and why",
          "Finish with the market or policy implication"
        ],
        trap: "describing a fact without linking it to the next economic effect"
      };
    }

    if (value.includes("mathematics") || value.includes("math")) {
      return {
        centralQuestion: "which rule or method the question is really testing",
        diagramLabel: "Method map",
        starters: [
          "State the rule before plugging in numbers",
          "Track the units, signs, and algebra steps carefully",
          "Use one worked example to check the method"
        ],
        trap: "jumping to substitution before setting up the structure"
      };
    }

    if (value.includes("biology")) {
      return {
        centralQuestion: "what the process does, where it happens, and why it matters",
        diagramLabel: "Process diagram",
        starters: [
          "Name the structure, process, and function clearly",
          "Use arrows to show sequence and cause",
          "Link definitions to examples and common exam wording"
        ],
        trap: "memorising words without understanding the sequence"
      };
    }

    if (value.includes("chemistry")) {
      return {
        centralQuestion: "what changes at particle level and how the equation or trend shows it",
        diagramLabel: "Reaction flow",
        starters: [
          "Link observations to particle explanations",
          "Balance the idea, not just the symbols",
          "Use conditions, trends, and practical steps together"
        ],
        trap: "giving the observation without the explanation"
      };
    }

    if (value.includes("physics")) {
      return {
        centralQuestion: "which principle, formula, and unit chain the question depends on",
        diagramLabel: "Principle flow",
        starters: [
          "Write the relationship before calculating",
          "Track variables, units, and sign conventions",
          "Explain what the final value means in the physical context"
        ],
        trap: "using the correct formula with the wrong variable meaning"
      };
    }

    if (value.includes("english")) {
      return {
        centralQuestion: "what the text is doing and how the evidence proves it",
        diagramLabel: "Idea chain",
        starters: [
          "Make the claim, then support it with precise evidence",
          "Explain the effect, not just the technique name",
          "Keep structure and reader impact connected"
        ],
        trap: "naming a feature without explaining its purpose"
      };
    }

    if (value.includes("business") || value.includes("portfolio") || value.includes("corporate")) {
      return {
        centralQuestion: "what framework applies and which trade-off matters most",
        diagramLabel: "Decision map",
        starters: [
          "State the framework, then use it on the case",
          "Compare advantages, risks, and stakeholder effects",
          "End with a justified judgement, not a description"
        ],
        trap: "listing pros and cons without choosing the decisive factor"
      };
    }

    return {
      centralQuestion: "what the core idea is, how it works, and how it appears in questions",
      diagramLabel: "Concept map",
      starters: [
        "Define the idea in plain language before drilling questions",
        "Use one example, one method, and one common mistake",
        "Replay weak areas until the explanation feels automatic"
      ],
      trap: "stopping at recognition instead of active recall"
    };
  }

  function buildFocusItems(request, profile) {
    return unique(
      [
        ...(Array.isArray(request.recommendedFocus) ? request.recommendedFocus : []),
        ...splitIdeas(request.focus),
        ...splitIdeas(request.goal),
        ...profile.starters,
        `${request.topic} inside ${request.syllabus} ${request.level}`,
        `Common exam traps in ${request.topic}`
      ]
        .map((item) => sentenceCase(item.replace(/\.$/, "")))
        .filter((item) => item.length > 10)
    ).slice(0, 6);
  }

  function buildImportantPoints(request, profile, focusItems) {
    return [
      `Start ${request.topic} by locking in ${profile.centralQuestion}.`,
      `Use the student goal as the filter: ${request.goal}.`,
      `Turn each focus area into one definition, one example, and one quick self-check.`,
      `Treat the main trap as a deliberate review target: ${profile.trap}.`,
      `Move through Foundation, Core, and Stretch until missed questions stop returning.`,
      ...focusItems.slice(0, 2).map((item) => `Priority focus: ${item}.`)
    ];
  }

  function buildNoteCards(request, profile, focusItems) {
    const first = focusItems[0] || `core ideas in ${request.topic}`;
    const second = focusItems[1] || `worked examples in ${request.topic}`;
    const third = focusItems[2] || `common mistakes in ${request.topic}`;

    return [
      {
        title: "Big picture",
        points: [
          `${request.topic} is being studied here as a usable skill, not just a fact list.`,
          `The first checkpoint is whether the student can explain ${profile.centralQuestion}.`,
          `Keep linking every example back to the stated outcome: ${request.goal}.`
        ]
      },
      {
        title: "What to learn first",
        points: [
          `${first}.`,
          `${second}.`,
          `Only add harder questions once the core explanation is stable.`
        ]
      },
      {
        title: "How to answer well",
        points: [
          `Read the prompt and decide whether it wants definition, method, process, or judgement.`,
          `Show the structure first, then the detail.`,
          `Finish with a short check that proves the answer actually fits the question.`
        ]
      },
      {
        title: "Common mistakes",
        points: [
          `${third}.`,
          `Rushing past the setup step.`,
          `Revising passively instead of testing recall out loud or in writing.`
        ]
      }
    ];
  }

  function buildDiagramSvg(request, profile, focusItems) {
    const nodes = unique([request.topic, ...focusItems.slice(0, 4)]).slice(0, 5);
    const positions = [
      { x: 330, y: 120, width: 180, height: 60, fill: "#fff4e8", stroke: "#ef5b30" },
      { x: 60, y: 60, width: 180, height: 56, fill: "#fffdf8", stroke: "#d8c5ae" },
      { x: 60, y: 190, width: 180, height: 56, fill: "#fffdf8", stroke: "#d8c5ae" },
      { x: 420, y: 40, width: 180, height: 56, fill: "#fffdf8", stroke: "#d8c5ae" },
      { x: 420, y: 210, width: 180, height: 56, fill: "#fffdf8", stroke: "#d8c5ae" }
    ];

    const connectorMarkup = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4]
    ]
      .filter(([, target]) => nodes[target])
      .map(([sourceIndex, targetIndex]) => {
        const source = positions[sourceIndex];
        const target = positions[targetIndex];
        const sourceX = source.x;
        const sourceY = source.y + source.height / 2;
        const targetX = targetIndex < 3 ? target.x + target.width : target.x;
        const targetY = target.y + target.height / 2;
        return `<line x1="${sourceX}" y1="${sourceY}" x2="${targetX}" y2="${targetY}" stroke="#d1b99d" stroke-width="2" stroke-linecap="round"></line>`;
      })
      .join("");

    const nodeMarkup = nodes
      .map((text, index) => {
        const box = positions[index];
        const labelLines = wrapText(text, 18)
          .slice(0, 3)
          .map((line, lineIndex) => {
            const x = box.x + box.width / 2;
            const y = box.y + 24 + lineIndex * 14;
            return `<text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-family="Sora, sans-serif" fill="#17312a">${escapeHtml(line)}</text>`;
          })
          .join("");

        return `
          <rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="16" fill="${box.fill}" stroke="${box.stroke}" stroke-width="1.5"></rect>
          ${labelLines}
        `;
      })
      .join("");

    return `
      <svg viewBox="0 0 660 310" role="img" aria-label="${escapeHtml(profile.diagramLabel)} for ${escapeHtml(request.topic)}">
        <rect x="1" y="1" width="658" height="308" rx="24" fill="#f9f1e5" stroke="#ead9c4"></rect>
        <text x="28" y="34" font-size="14" font-family="Sora, sans-serif" fill="#5f6c67">${escapeHtml(profile.diagramLabel)}</text>
        ${connectorMarkup}
        ${nodeMarkup}
      </svg>
    `;
  }

  function buildDistractors(request, focusItem, profile) {
    return unique([
      `Memorise ${request.topic} without explaining the reasoning`,
      `Skip the setup and go straight to the answer`,
      `Treat ${focusItem.toLowerCase()} as a fact list with no application`,
      `Ignore the main trap: ${profile.trap}`,
      `Use recognition only instead of active recall`
    ]).slice(0, 4);
  }

  function buildChoices(correctChoice, distractors, seed) {
    const pool = unique([correctChoice, ...distractors]).slice(0, 3);
    while (pool.length < 3) {
      pool.push(`Distractor ${pool.length + 1}`);
    }
    const rotations = [
      pool,
      [pool[1], pool[0], pool[2]],
      [pool[2], pool[1], pool[0]]
    ];
    const choices = rotations[seed % rotations.length];
    return {
      choices,
      answerIndex: choices.findIndex((item) => item === correctChoice)
    };
  }

  function laneTemplate(request, lane, focusItem) {
    if (lane === "Foundation") {
      return {
        prompt: `Which move best shows a student understands the basic idea behind ${focusItem.toLowerCase()}?`,
        concept: "Foundation questions check whether the student can identify the rule before applying it.",
        correct: `State the idea clearly and connect it to one clean example in ${request.topic}`,
        explanation: "That answer shows the student understands the idea before trying harder application."
      };
    }

    if (lane === "Core") {
      return {
        prompt: `A student sees a standard exam question on ${focusItem.toLowerCase()}. What is the best first move?`,
        concept: "Core questions focus on method choice and process quality.",
        correct: "Choose the method, show the setup, and explain why it fits the prompt",
        explanation: "Core performance comes from choosing the right process before chasing the final answer."
      };
    }

    return {
      prompt: `Which response would earn the strongest judgement on a harder question about ${focusItem.toLowerCase()}?`,
      concept: "Stretch questions reward evaluation, clean justification, and avoiding the obvious trap.",
      correct: "Use evidence, compare alternatives, and justify why this is the best answer",
      explanation: "Stretch answers need more than a fact. They need a defended judgement."
    };
  }

  function buildQuizQuestion(request, lane, focusItem, profile, index) {
    const template = laneTemplate(request, lane, focusItem);
    const distractors = buildDistractors(request, focusItem, profile);
    const choicePack = buildChoices(template.correct, distractors, index);
    return {
      id: `${slugify(request.topic)}-${slugify(lane)}-${index + 1}`,
      lane,
      prompt: template.prompt,
      concept: template.concept,
      choices: choicePack.choices,
      answer: choicePack.answerIndex,
      explanation: `${template.explanation} Keep ${focusItem.toLowerCase()} tied to the student's goal: ${request.goal}.`
    };
  }

  function buildQuizLanes(request, profile, focusItems) {
    const paceMap = {
      guided: { Foundation: 5, Core: 4, Stretch: 3 },
      balanced: { Foundation: 4, Core: 4, Stretch: 4 },
      fast: { Foundation: 3, Core: 4, Stretch: 5 }
    };
    const laneCounts = paceMap[request.pace] || paceMap.balanced;
    const lanes = {};

    ["Foundation", "Core", "Stretch"].forEach((lane) => {
      lanes[lane] = Array.from({ length: laneCounts[lane] }, (_, index) =>
        buildQuizQuestion(
          request,
          lane,
          focusItems[index % focusItems.length] || request.topic,
          profile,
          index
        )
      );
    });

    return lanes;
  }

  function buildWorksheetQuestion(request, lane, focusItem, profile, index) {
    const marks = lane === "Foundation" ? 2 : lane === "Core" ? 3 : 4;
    const promptMap = {
      Foundation: `Define or explain ${focusItem.toLowerCase()} in the context of ${request.topic}.`,
      Core: `Apply ${focusItem.toLowerCase()} to a short exam-style example and show the method.`,
      Stretch: `Evaluate a harder case involving ${focusItem.toLowerCase()} and justify the best answer.`
    };

    const answerPoints = lane === "Foundation"
      ? [
          "State the core idea in plain language.",
          "Link it to one short example or exam trigger."
        ]
      : lane === "Core"
        ? [
            "Identify the rule, process, or framework to use.",
            "Show the setup before the final answer.",
            "Check that the answer actually matches the question wording."
          ]
        : [
            "Compare at least two possible responses or interpretations.",
            "Use evidence to justify the stronger answer.",
            `Address the trap: ${profile.trap}.`,
            "End with a clean final judgement."
          ];

    return {
      number: index + 1,
      lane,
      marks,
      prompt: promptMap[lane],
      answerPoints
    };
  }

  function buildWorksheet(request, profile, focusItems) {
    const total = Number(request.worksheetLength) || 12;
    const lanes = ["Foundation", "Core", "Stretch"];
    const questions = [];

    for (let index = 0; index < total; index += 1) {
      const lane = lanes[index % lanes.length];
      const focusItem = focusItems[index % focusItems.length] || request.topic;
      questions.push(buildWorksheetQuestion(request, lane, focusItem, profile, index));
    }

    const answerKeyLines = questions.map((question) => {
      const marksText = `${question.marks} mark${question.marks === 1 ? "" : "s"}`;
      const bullets = question.answerPoints.map((point) => `- ${point}`).join("\n");
      return `Q${question.number} (${question.lane}, ${marksText})\n${bullets}`;
    });

    return {
      intro: `Extra practice for ${request.topic}. Work through the questions in order, then upload the completed worksheet for marking when the local autograder bridge is available.`,
      questions,
      answerKeyLines,
      rubricText: answerKeyLines.join("\n\n")
    };
  }

  function buildStudyPack(request) {
    const profile = buildTopicProfile(request.topic);
    const focusItems = buildFocusItems(request, profile);
    const importantPoints = buildImportantPoints(request, profile, focusItems);
    const noteCards = buildNoteCards(request, profile, focusItems);
    const quizLanes = buildQuizLanes(request, profile, focusItems);
    const worksheet = buildWorksheet(request, profile, focusItems);
    const totalQuestions = Object.values(quizLanes).reduce((sum, lane) => sum + lane.length, 0);

    return {
      id: `pack-${slugify(request.topic)}-${Date.now()}`,
      cacheKey: buildRequestKey(request),
      generatedAt: new Date().toISOString(),
      source: "local",
      request,
      recommendations: state.recommendations,
      title: `${request.topic} Study Pack`,
      subtitle: `${request.syllabus} | ${request.level} | ${request.topic}`,
      notes: {
        importantPoints,
        noteCards,
        diagramSvg: buildDiagramSvg(request, profile, focusItems),
        focusItems
      },
      quiz: {
        lanes: quizLanes,
        totalQuestions
      },
      worksheet
    };
  }

  function normalizeAiPack(rawPack, request) {
    const profile = buildTopicProfile(request.topic);
    const focusItems = Array.isArray(rawPack?.notes?.focusItems) && rawPack.notes.focusItems.length
      ? rawPack.notes.focusItems
      : buildFocusItems(request, profile);
    const noteCards = Array.isArray(rawPack?.notes?.noteCards) ? rawPack.notes.noteCards : [];
    const importantPoints = Array.isArray(rawPack?.notes?.importantPoints) ? rawPack.notes.importantPoints : [];
    const quizLanes = rawPack?.quiz?.lanes || {};
    const normalizedLanes = {
      Foundation: Array.isArray(quizLanes.Foundation) ? quizLanes.Foundation : [],
      Core: Array.isArray(quizLanes.Core) ? quizLanes.Core : [],
      Stretch: Array.isArray(quizLanes.Stretch) ? quizLanes.Stretch : []
    };
    const totalQuestions = Object.values(normalizedLanes).reduce((sum, lane) => sum + lane.length, 0);
    const worksheet = rawPack?.worksheet || {};
    const answerKeyLines = Array.isArray(worksheet.answerKeyLines) ? worksheet.answerKeyLines : [];

    return {
      id: safeText(rawPack.id) || `pack-${slugify(request.topic)}-${Date.now()}`,
      cacheKey: buildRequestKey(request),
      generatedAt: safeText(rawPack.generatedAt) || new Date().toISOString(),
      source: safeText(rawPack.provider, "ai"),
      request,
      recommendations: rawPack.recommendations || state.recommendations || null,
      title: safeText(rawPack.title) || `${request.topic} Study Pack`,
      subtitle: safeText(rawPack.subtitle) || `${request.syllabus} | ${request.level} | ${request.topic}`,
      notes: {
        importantPoints,
        noteCards,
        diagramSvg: buildDiagramSvg(request, profile, focusItems),
        focusItems
      },
      quiz: {
        lanes: normalizedLanes,
        totalQuestions
      },
      worksheet: {
        intro: safeText(worksheet.intro) || `Extra practice for ${request.topic}.`,
        questions: Array.isArray(worksheet.questions) ? worksheet.questions : [],
        answerKeyLines,
        rubricText: safeText(worksheet.rubricText) || answerKeyLines.join("\n\n"),
        generatorCommand: safeText(worksheet.generatorCommand),
        scriptNote: safeText(worksheet.scriptNote)
      }
    };
  }

  function createLaneSession(questions) {
    return {
      queue: questions.map((question) => question.id),
      currentId: null,
      masteredIds: new Set(),
      repeatCounts: {},
      correct: 0,
      missed: 0,
      awaitingContinue: false,
      selectedChoice: null,
      lastResult: null
    };
  }

  function initializeQuizSessions(pack) {
    state.quizSessions = {
      Foundation: createLaneSession(pack.quiz.lanes.Foundation || []),
      Core: createLaneSession(pack.quiz.lanes.Core || []),
      Stretch: createLaneSession(pack.quiz.lanes.Stretch || [])
    };
    state.currentLane = "Foundation";
  }

  function getCurrentLaneQuestions() {
    return state.currentPack?.quiz?.lanes?.[state.currentLane] || [];
  }

  function getCurrentLaneSession() {
    return state.quizSessions[state.currentLane];
  }

  function getQuestionById(questions, id) {
    return questions.find((question) => question.id === id) || null;
  }

  function ensureCurrentQuestion() {
    const session = getCurrentLaneSession();
    if (!session || session.currentId || !session.queue.length) {
      return;
    }
    session.currentId = session.queue.shift();
  }

  function setBridgeStatus(online, note) {
    state.bridgeOnline = online;
    state.bridgeNote = note || "";
    elements.bridgeStatus.textContent = online ? `Autograder ready: ${note}` : note;
    elements.bridgeStatus.classList.toggle("ghost", !online);
    elements.bridgeStatus.classList.toggle("online-pill", online);
    elements.bridgeStatus.classList.toggle("offline-pill", !online);
  }

  async function checkBridge() {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json();
      state.aiGenerationReady = Boolean(payload.studyPackGenerationConfigured);
      const providerHint = payload.geminiConfigured || payload.deepseekConfigured
        ? "AI marking provider configured"
        : "Bridge online, but API keys still needed for real marking";
      setBridgeStatus(true, providerHint);
      await loadOfficialTopicOptions();
      await loadRecommendations();
    } catch (error) {
      state.aiGenerationReady = false;
      setBridgeStatus(false, "Autograder offline. Start the local bridge to enable upload marking.");
      state.topicalOptions = [];
      renderOfficialTopicChoices();
    }
  }

  function updateCacheStatus(source, pack) {
    const time = pack?.generatedAt ? new Date(pack.generatedAt).toLocaleString() : "";
    if (!pack) {
      elements.cacheStatus.textContent = "No study pack loaded";
      return;
    }
    if (source === "cache") {
      elements.cacheStatus.textContent = `Loaded from cache | ${time}`;
      elements.packMeta.textContent = "Loaded from cache";
      return;
    }
    const sourceLabel = pack.source && pack.source !== "local" ? `AI generated (${pack.source})` : "Freshly generated";
    elements.cacheStatus.textContent = `${sourceLabel} | ${time}`;
    elements.packMeta.textContent = sourceLabel;
  }

  function setActiveTab(tabName) {
    state.currentTab = tabName;
    elements.studyTabs.forEach((button) => {
      const active = button.dataset.tab === tabName;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    elements.notesPanel.hidden = tabName !== "notes";
    elements.quizPanel.hidden = tabName !== "quiz";
    elements.worksheetPanel.hidden = tabName !== "worksheet";
  }

  function renderNotes(pack) {
    elements.importantPoints.innerHTML = pack.notes.importantPoints
      .map((point) => `<li>${escapeHtml(point)}</li>`)
      .join("");
    elements.diagramMount.innerHTML = pack.notes.diagramSvg;
    elements.noteCards.innerHTML = pack.notes.noteCards
      .map(
        (card) => `
          <article class="panel-card note-card">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Notes Card</p>
                <h3>${escapeHtml(card.title)}</h3>
              </div>
            </div>
            <ul class="point-list">
              ${card.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("");
  }

  function renderReplayQueue(session, questions) {
    const queuedPrompts = session.queue
      .map((id) => getQuestionById(questions, id))
      .filter(Boolean)
      .map((question) => question.prompt);

    elements.replayQueueList.innerHTML = queuedPrompts.length
      ? queuedPrompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")
      : "<li>No repeats waiting yet.</li>";
  }

  function renderQuiz() {
    const questions = getCurrentLaneQuestions();
    const session = getCurrentLaneSession();
    if (!session || !questions.length) {
      elements.quizLaneLabel.textContent = `${state.currentLane} lane`;
      elements.quizPrompt.textContent = "No questions available for this lane.";
      elements.quizPosition.textContent = "0 / 0";
      elements.quizConcept.textContent = "Generate a study pack to begin.";
      elements.quizAnswers.innerHTML = "";
      elements.quizFeedback.hidden = true;
      return;
    }

    ensureCurrentQuestion();

    elements.lanePills.forEach((button) => {
      button.classList.toggle("active", button.dataset.lane === state.currentLane);
    });

    elements.quizCorrectCount.textContent = String(session.correct);
    elements.quizMissedCount.textContent = String(session.missed);
    elements.quizReplayCount.textContent = String(session.queue.length);

    if (!session.currentId) {
      elements.quizLaneLabel.textContent = `${state.currentLane} lane complete`;
      elements.quizPrompt.textContent = `You cleared the ${state.currentLane} lane.`;
      elements.quizPosition.textContent = `${questions.length} / ${questions.length}`;
      elements.quizConcept.textContent = "Move to another lane or reset this one for another run.";
      elements.quizAnswers.innerHTML = "";
      elements.quizFeedback.hidden = false;
      elements.quizFeedback.className = "feedback-panel correct";
      elements.quizFeedbackTitle.textContent = "Lane complete";
      elements.quizFeedbackBody.textContent = "Every question in this lane has been answered correctly at least once.";
      elements.nextQuestionButton.disabled = true;
      renderReplayQueue(session, questions);
      return;
    }

    const currentQuestion = getQuestionById(questions, session.currentId);
    if (!currentQuestion) {
      return;
    }

    const masteredCount = session.masteredIds.size;
    elements.quizLaneLabel.textContent = `${state.currentLane} lane`;
    elements.quizPrompt.textContent = currentQuestion.prompt;
    elements.quizPosition.textContent = `${Math.min(masteredCount + 1, questions.length)} / ${questions.length}`;
    elements.quizConcept.textContent = currentQuestion.concept;

    elements.quizAnswers.innerHTML = currentQuestion.choices
      .map((choice, index) => {
        const letter = String.fromCharCode(65 + index);
        let className = "answer-option";
        if (session.awaitingContinue) {
          if (index === currentQuestion.answer) {
            className += " correct";
          } else if (index === session.selectedChoice && index !== currentQuestion.answer) {
            className += " incorrect";
          } else if (index === session.selectedChoice) {
            className += " selected";
          }
        }

        return `
          <button class="${className}" type="button" data-choice-index="${index}" ${session.awaitingContinue ? "disabled" : ""}>
            <span class="answer-letter">${letter}</span>
            <span class="answer-text">${escapeHtml(choice)}</span>
          </button>
        `;
      })
      .join("");

    elements.quizAnswers.querySelectorAll("[data-choice-index]").forEach((button) => {
      button.addEventListener("click", () => {
        submitQuizChoice(Number(button.getAttribute("data-choice-index")));
      });
    });

    if (session.lastResult) {
      elements.quizFeedback.hidden = false;
      elements.quizFeedback.className = `feedback-panel ${session.lastResult.correct ? "correct" : "incorrect"}`;
      elements.quizFeedbackTitle.textContent = session.lastResult.correct ? "Correct" : "Not yet";
      elements.quizFeedbackBody.textContent = session.lastResult.explanation;
    } else {
      elements.quizFeedback.hidden = true;
      elements.quizFeedbackTitle.textContent = "";
      elements.quizFeedbackBody.textContent = "";
    }

    elements.nextQuestionButton.disabled = !session.awaitingContinue;
    renderReplayQueue(session, questions);
  }

  function submitQuizChoice(choiceIndex) {
    const questions = getCurrentLaneQuestions();
    const session = getCurrentLaneSession();
    if (!session || session.awaitingContinue) {
      return;
    }

    const currentQuestion = getQuestionById(questions, session.currentId);
    if (!currentQuestion) {
      return;
    }

    const correct = choiceIndex === currentQuestion.answer;
    session.selectedChoice = choiceIndex;
    session.awaitingContinue = true;
    session.lastResult = {
      correct,
      explanation: currentQuestion.explanation
    };

    if (correct) {
      session.correct += 1;
      session.masteredIds.add(currentQuestion.id);
    } else {
      session.missed += 1;
      session.repeatCounts[currentQuestion.id] = (session.repeatCounts[currentQuestion.id] || 0) + 1;
      session.queue.push(currentQuestion.id);
    }

    renderQuiz();
  }

  function continueQuiz() {
    const session = getCurrentLaneSession();
    if (!session || !session.awaitingContinue) {
      return;
    }

    session.awaitingContinue = false;
    session.selectedChoice = null;
    session.currentId = null;
    session.lastResult = null;
    renderQuiz();
  }

  function resetCurrentLane() {
    state.quizSessions[state.currentLane] = createLaneSession(getCurrentLaneQuestions());
    renderQuiz();
  }

  function renderWorksheet(pack) {
    elements.worksheetMeta.textContent = `${pack.worksheet.questions.length} questions`;
    elements.worksheetIntro.textContent = pack.worksheet.intro;
    elements.worksheetPreview.innerHTML = pack.worksheet.questions
      .map(
        (question) => `
          <li>
            <strong>Q${question.number}. ${escapeHtml(question.prompt)}</strong>
            <span>${escapeHtml(question.lane)} lane | ${escapeHtml(String(question.marks))} marks</span>
          </li>
        `
      )
      .join("");

    const command = safeText(pack.worksheet.generatorCommand);
    const note = safeText(pack.worksheet.scriptNote);
    if (command) {
      elements.worksheetScriptWrap.hidden = false;
      elements.worksheetScriptNote.textContent = note || "This worksheet PDF came from the local IGCSE topical paper generator.";
      elements.worksheetScriptCommand.textContent = command;
    } else {
      elements.worksheetScriptWrap.hidden = true;
      elements.worksheetScriptNote.textContent = "The local Python script used for this worksheet will appear here.";
      elements.worksheetScriptCommand.textContent = "";
    }
  }

  function renderPack(pack, source) {
    state.currentPack = pack;
    initializeQuizSessions(pack);
    elements.studyWorkspace.hidden = false;
    elements.packTitle.textContent = pack.title;
    elements.packSubtitle.textContent = `${pack.subtitle} | ${pack.request.goal}`;
    elements.notesCount.textContent = String(pack.notes.noteCards.length);
    elements.questionCount.textContent = String(pack.quiz.totalQuestions);
    elements.worksheetCount.textContent = String(pack.worksheet.questions.length);
    renderNotes(pack);
    renderQuiz();
    renderWorksheet(pack);
    updateCacheStatus(source, pack);
    setActiveTab("notes");
    window.localStorage.setItem(LAST_PACK_KEY, pack.cacheKey);
  }

  async function generateOrLoadPack(request) {
    const key = buildRequestKey(request);
    const store = loadCacheStore();
    if (store[key]) {
      renderPack(store[key], "cache");
      return;
    }

    let pack;
    if (state.bridgeOnline && state.aiGenerationReady) {
      elements.generateButton.disabled = true;
      elements.generateButton.textContent = "Generating with AI...";
      try {
        const response = await fetch(`${API_BASE}/api/study-pack/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            syllabus: request.syllabus,
            curriculum: request.syllabus,
            level: request.level,
            topic: request.topic,
            subject: request.topic,
            goal: request.goal,
            description: request.goal,
            focus: request.focus,
            pace: request.pace,
            worksheetLength: request.worksheetLength,
            recommendedFocus: request.recommendedFocus,
            topicIds: request.topicIds,
            preferredProvider: "deepseek",
            createdAt: new Date().toISOString()
          })
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || `HTTP ${response.status}`);
        }
        pack = normalizeAiPack(payload, request);
      } catch (error) {
        pack = buildStudyPack(request);
        pack.fallbackReason = safeText(error.message || "AI generation failed");
      } finally {
        elements.generateButton.disabled = false;
        elements.generateButton.textContent = "Generate study pack";
      }
    } else {
      pack = buildStudyPack(request);
    }

    store[key] = pack;
    saveCacheStore(store);
    renderPack(pack, "fresh");
  }

  function clearAllCache() {
    window.localStorage.removeItem(CACHE_STORE_KEY);
    window.localStorage.removeItem(LAST_PACK_KEY);
    state.currentPack = null;
    state.quizSessions = {};
    elements.studyWorkspace.hidden = true;
    elements.markingResult.innerHTML = "<p class=\"hub-copy\">No marking result yet.</p>";
    updateCacheStatus("", null);
  }

  function asciiPdfText(value) {
    return safeText(value)
      .normalize("NFKD")
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function buildPdfBlob(title, subtitle, lines) {
    const wrapped = [
      ...wrapText(title, 58),
      ...wrapText(subtitle, 88),
      "",
      ...lines.flatMap((line) => wrapText(line, 92))
    ];
    const pageSize = 42;
    const pages = [];
    for (let index = 0; index < wrapped.length; index += pageSize) {
      pages.push(wrapped.slice(index, index + pageSize));
    }

    const pageRefs = [];
    const objects = {};
    const fontObjectId = 3;
    let nextObjectId = 4;
    const encoder = new TextEncoder();

    pages.forEach((pageLines, pageIndex) => {
      const pageId = nextObjectId;
      const contentId = nextObjectId + 1;
      nextObjectId += 2;
      pageRefs.push(pageId);

      const content = [];
      let y = 790;
      content.push("BT");
      content.push("/F1 16 Tf");
      content.push(`50 ${y} Td`);
      const firstLine = pageLines[0] || title;
      content.push(`(${asciiPdfText(pageIndex === 0 ? firstLine : `${title} - Page ${pageIndex + 1}`)}) Tj`);
      y -= 22;
      content.push("0 -22 Td");
      content.push("/F1 11 Tf");

      const lineStart = pageIndex === 0 ? 1 : 0;
      for (let lineIndex = lineStart; lineIndex < pageLines.length; lineIndex += 1) {
        content.push(`(${asciiPdfText(pageLines[lineIndex])}) Tj`);
        content.push("0 -15 Td");
      }
      content.push("ET");

      const stream = content.join("\n");
      const length = encoder.encode(stream).length;
      objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentId} 0 R >>`;
      objects[contentId] = `<< /Length ${length} >>\nstream\n${stream}\nendstream`;
    });

    objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objects[2] = `<< /Type /Pages /Count ${pageRefs.length} /Kids [${pageRefs.map((id) => `${id} 0 R`).join(" ")}] >>`;
    objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    const objectCount = nextObjectId - 1;

    for (let objectId = 1; objectId <= objectCount; objectId += 1) {
      offsets[objectId] = encoder.encode(pdf).length;
      pdf += `${objectId} 0 obj\n${objects[objectId]}\nendobj\n`;
    }

    const xrefStart = encoder.encode(pdf).length;
    pdf += `xref\n0 ${objectCount + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let objectId = 1; objectId <= objectCount; objectId += 1) {
      pdf += `${String(offsets[objectId]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

    return new Blob([pdf], { type: "application/pdf" });
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadWorksheetPdf() {
    if (!state.currentPack) {
      return;
    }
    const pack = state.currentPack;
    const lines = pack.worksheet.questions.flatMap((question) => [
      `Q${question.number}. ${question.prompt}`,
      `${question.lane} lane | ${question.marks} marks`,
      "",
      "Answer space:",
      "",
      "____________________________________________________________",
      "____________________________________________________________",
      ""
    ]);
    const blob = buildPdfBlob(`${pack.title} Worksheet`, `${pack.subtitle} | Extra practice`, lines);
    downloadBlob(blob, `${slugify(pack.title)}-worksheet.pdf`);
  }

  async function downloadGeneratedTopicalWorksheet() {
    if (!state.currentPack) {
      return false;
    }
    const request = state.currentPack.request;
    const subject = generatorSubjectForRequest(request);
    const topicIds = (request.topicIds || []).filter(Boolean);
    if (!state.bridgeOnline || !subject || !topicIds.length) {
      return false;
    }

    const chosenTitles = state.topicalOptions
      .filter((option) => topicIds.includes(option.id))
      .map((option) => option.title);

    try {
      elements.downloadWorksheetButton.disabled = true;
      elements.downloadWorksheetButton.textContent = "Generating official PDF...";
      const response = await fetch(`${API_BASE}/api/worksheets/generate-topical`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          syllabus: request.syllabus,
          level: request.level,
          subject,
          topic: chosenTitles.join(" + ") || subject,
          topicIds,
          worksheetLength: request.worksheetLength
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      state.currentPack.worksheet.generatorCommand = safeText(payload?.generatorCommand);
      state.currentPack.worksheet.scriptNote = "Generated by the local topical paper script using the selected official Biology Chapter 14 topic.";
      renderWorksheet(state.currentPack);
      const url = payload?.result?.output?.pdfPathLocalUrl || payload?.result?.output?.pdfUrlAbsolute || payload?.result?.output?.pdfUrl;
      if (!url) {
        throw new Error("No generated worksheet PDF URL returned.");
      }
      window.open(url, "_blank", "noopener,noreferrer");
      return true;
    } catch (error) {
      return false;
    } finally {
      elements.downloadWorksheetButton.disabled = false;
      elements.downloadWorksheetButton.textContent = "Download worksheet PDF";
    }
  }

  function downloadAnswerKeyPdf() {
    if (!state.currentPack) {
      return;
    }
    const pack = state.currentPack;
    const blob = buildPdfBlob(`${pack.title} Answer Key`, `${pack.subtitle} | Marking points`, pack.worksheet.answerKeyLines);
    downloadBlob(blob, `${slugify(pack.title)}-answer-key.pdf`);
  }

  function openPrintView() {
    if (!state.currentPack) {
      return;
    }

    const pack = state.currentPack;
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      return;
    }

    const questionHtml = pack.worksheet.questions
      .map(
        (question) => `
          <article class="print-question">
            <h3>Q${question.number}. ${escapeHtml(question.prompt)}</h3>
            <p>${escapeHtml(question.lane)} lane | ${escapeHtml(String(question.marks))} marks</p>
            <div class="print-lines"></div>
          </article>
        `
      )
      .join("");

    popup.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(pack.title)} Worksheet</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 32px; color: #1f1f1f; }
          h1, h2, h3 { margin: 0; }
          h1 { font-size: 26px; margin-bottom: 8px; }
          p { line-height: 1.5; }
          .print-question { margin-top: 22px; page-break-inside: avoid; }
          .print-lines { margin-top: 16px; min-height: 110px; border-bottom: 1px solid #b8b8b8; }
          @media print {
            body { margin: 18px; }
          }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(pack.title)} Worksheet</h1>
        <p>${escapeHtml(pack.subtitle)}</p>
        <p>${escapeHtml(pack.worksheet.intro)}</p>
        ${questionHtml}
        <script>
          window.onload = function () {
            window.focus();
            window.print();
          };
        <\/script>
      </body>
      </html>
    `);
    popup.document.close();
  }

  function renderMarkingResult(html) {
    elements.markingResult.innerHTML = html;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        reject(new Error(`${file.name} is too large. Keep uploads under 12 MB.`));
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        resolve({
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          dataUrl: reader.result
        });
      });
      reader.addEventListener("error", () => reject(new Error(`Could not read ${file.name}.`)));
      reader.readAsDataURL(file);
    });
  }

  async function markUploadedWorksheet() {
    const file = elements.worksheetUpload.files[0];
    if (!state.currentPack) {
      renderMarkingResult("<p class=\"hub-copy\">Generate a study pack first.</p>");
      return;
    }
    if (!file) {
      renderMarkingResult("<p class=\"hub-copy\">Upload a completed worksheet file first.</p>");
      return;
    }
    if (!state.bridgeOnline) {
      renderMarkingResult("<p class=\"hub-copy\">The local autograder bridge is offline. Start it, then upload again.</p>");
      return;
    }

    elements.markWorksheetButton.disabled = true;
    renderMarkingResult("<p class=\"hub-copy\">Uploading worksheet for marking...</p>");

    try {
      const uploadedFile = await readFileAsDataUrl(file);
      const payload = {
        syllabus: state.currentPack.request.syllabus,
        curriculum: state.currentPack.request.syllabus,
        level: state.currentPack.request.level,
        subject: state.currentPack.request.topic,
        topic: state.currentPack.request.topic,
        subtopic: state.currentPack.request.topic,
        description: state.currentPack.request.goal,
        answerFormat: "Worksheet upload",
        markScheme: state.currentPack.worksheet.rubricText,
        rubric: state.currentPack.worksheet.rubricText,
        uploadedFile
      };

      const response = await fetch(`${API_BASE}/api/platform/teacher-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      const fixPoints = Array.isArray(result.fixPoints) && result.fixPoints.length
        ? `<ul class="point-list">${result.fixPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`
        : "<p class=\"hub-copy\">No extra fix points returned.</p>";

      renderMarkingResult(`
        <div class="marking-summary">
          <h3>Marked successfully</h3>
          <p><strong>Score:</strong> ${escapeHtml(String(result.score || 0))} / ${escapeHtml(String(result.maxScore || 0))}</p>
          <p>${escapeHtml(result.feedback || "No feedback returned.")}</p>
          ${fixPoints}
        </div>
      `);
    } catch (error) {
      renderMarkingResult(`<p class="hub-copy">${escapeHtml(error.message || "Could not mark the worksheet.")}</p>`);
    } finally {
      elements.markWorksheetButton.disabled = false;
    }
  }

  function restoreLastPack() {
    if (TRIAL_BIOLOGY_14) {
      return;
    }
    const store = loadCacheStore();
    const lastKey = window.localStorage.getItem(LAST_PACK_KEY);
    if (!lastKey || !store[lastKey]) {
      return;
    }
    const pack = store[lastKey];
    applyRequestToForm(pack.request);
    state.recommendations = pack.recommendations || null;
    renderRecommendations();
    setSelectedTopicIds(pack.request.topicIds || []);
    renderPack(pack, "cache");
  }

  function bindEvents() {
    elements.syllabusSelect.addEventListener("change", async () => {
      syncLevelOptions();
      await loadOfficialTopicOptions();
      await loadRecommendations();
    });
    elements.levelSelect.addEventListener("change", async () => {
      syncTopicOptions();
      await loadOfficialTopicOptions();
      await loadRecommendations();
    });
    elements.topicSelect.addEventListener("change", async () => {
      await loadOfficialTopicOptions();
      await loadRecommendations();
    });
    elements.goalInput.addEventListener("blur", loadRecommendations);
    elements.focusInput.addEventListener("blur", loadRecommendations);

    elements.useRecommendationsButton.addEventListener("click", () => {
      const suggestions = Array.isArray(state.recommendations?.recommendedFocus)
        ? state.recommendations.recommendedFocus
        : [];
      if (!suggestions.length) {
        return;
      }
      elements.focusInput.value = suggestions.join(", ");
    });

    elements.studyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await generateOrLoadPack(readRequestFromForm());
    });

    elements.clearCacheButton.addEventListener("click", clearAllCache);

    elements.studyTabs.forEach((button) => {
      button.addEventListener("click", () => setActiveTab(button.dataset.tab));
    });

    elements.lanePills.forEach((button) => {
      button.addEventListener("click", () => {
        state.currentLane = button.dataset.lane;
        renderQuiz();
      });
    });

    elements.resetLaneButton.addEventListener("click", resetCurrentLane);
    elements.nextQuestionButton.addEventListener("click", continueQuiz);
    elements.downloadWorksheetButton.addEventListener("click", async () => {
      const usedGenerator = await downloadGeneratedTopicalWorksheet();
      if (!usedGenerator) {
        downloadWorksheetPdf();
      }
    });
    elements.printWorksheetButton.addEventListener("click", openPrintView);
    elements.downloadAnswerKeyButton.addEventListener("click", downloadAnswerKeyPdf);
    elements.markWorksheetButton.addEventListener("click", markUploadedWorksheet);
  }

  function initializeForm() {
    const request = defaultRequest();
    fillSelect(elements.syllabusSelect, Object.keys(CATALOG));
    elements.syllabusSelect.value = request.syllabus;
    syncLevelOptions(request.level);
    syncTopicOptions(request.topic);
    elements.paceSelect.value = request.pace;
    elements.worksheetLengthSelect.value = String(request.worksheetLength);
    elements.goalInput.value = request.goal || "";
    elements.focusInput.value = request.focus || "";
    renderOfficialTopicChoices();
  }

  initializeForm();
  bindEvents();
  updateCacheStatus("", null);
  restoreLastPack();
  checkBridge();
  loadRecommendations();
})();
