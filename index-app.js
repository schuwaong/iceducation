(function () {
  const CACHE_STORE_KEY = "ice-study-pack-cache-v4";
  const LAST_PACK_KEY = "ice-study-pack-last-v4";
  const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
  const TRIAL_QUERY = new URLSearchParams(window.location.search);
  const TRIAL_BIOLOGY_14 = TRIAL_QUERY.get("trial") === "bio14";
  const WHOLE_CHAPTER_VALUE = "__whole_chapter__";
  const API_BASE = (() => {
    if (window.IC_EDUCATE_API_BASE) {
      return String(window.IC_EDUCATE_API_BASE).replace(/\/$/, "");
    }
    if (window.location.protocol.startsWith("http") && !window.location.hostname.endsWith("github.io")) {
      if (["127.0.0.1", "localhost"].includes(window.location.hostname) && window.location.port !== "8001") {
        return "http://127.0.0.1:8001";
      }
      return window.location.origin.replace(/\/$/, "");
    }
    return "http://127.0.0.1:8001";
  })();
  const BUNDLED_SNAPSHOT = window.IC_EDUCATE_SNAPSHOT || null;

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

  const FALLBACK_SYLLABUS_TOPICS = {
    Biology: [
      {
        id: "14",
        title: "Coordination and response",
        subtopics: [
          { id: "14.1", title: "Coordination and response" },
          { id: "14.2", title: "Sense organs" },
          { id: "14.3", title: "Hormones" },
          { id: "14.4", title: "Homeostasis" },
          { id: "14.5", title: "Tropic responses" }
        ]
      }
    ]
  };

  const state = {
    currentPack: null,
    currentTab: "plan",
    currentLane: "Foundation",
    quizSessions: {},
    bridgeOnline: false,
    bridgeNote: "",
    bridgeGeneratorScript: "",
    aiGenerationReady: false,
    uploadMarkingReady: false,
    catalog: CATALOG,
    catalogStats: null,
    librarySummary: BUNDLED_SNAPSHOT?.library || null,
    syllabusSubjectOrder: Object.keys(FALLBACK_SYLLABUS_TOPICS),
    syllabusTopicsBySubject: { ...FALLBACK_SYLLABUS_TOPICS },
    syllabusTopicsByKey: {},
    topicalOptions: [],
    selectedTopicIds: [],
    recommendations: null
  };

  const elements = {
    studyForm: document.getElementById("studyForm"),
    syllabusSelect: document.getElementById("syllabusSelect"),
    levelSelect: document.getElementById("levelSelect"),
    topicSelect: document.getElementById("topicSelect"),
    chapterSelect: document.getElementById("chapterSelect"),
    subtopicSelect: document.getElementById("subtopicSelect"),
    syllabusCoverageHint: document.getElementById("syllabusCoverageHint"),
    learningTargetSelect: document.getElementById("learningTargetSelect"),
    paceSelect: document.getElementById("paceSelect"),
    worksheetLengthSelect: document.getElementById("worksheetLengthSelect"),
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
    planCount: document.getElementById("planCount"),
    notesCount: document.getElementById("notesCount"),
    questionCount: document.getElementById("questionCount"),
    worksheetCount: document.getElementById("worksheetCount"),
    packMeta: document.getElementById("packMeta"),
    importantPoints: document.getElementById("importantPoints"),
    diagramMount: document.getElementById("diagramMount"),
    noteCards: document.getElementById("noteCards"),
    studyTabs: Array.from(document.querySelectorAll(".study-tab")),
    planPanel: document.getElementById("planPanel"),
    planMeta: document.getElementById("planMeta"),
    planIntro: document.getElementById("planIntro"),
    planFocusGrid: document.getElementById("planFocusGrid"),
    planDayList: document.getElementById("planDayList"),
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
    worksheetActionStatus: document.getElementById("worksheetActionStatus"),
    generateExamStyleButton: document.getElementById("generateExamStyleButton"),
    downloadGeneratedWorksheetButton: document.getElementById("downloadGeneratedWorksheetButton"),
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

  function fillSelectOptions(select, items) {
    select.innerHTML = "";
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = safeText(item.value);
      option.textContent = safeText(item.label || item.value);
      if (item.disabled) {
        option.disabled = true;
      }
      select.appendChild(option);
    });
  }

  function selectedValues(select) {
    return Array.from(select.selectedOptions || [])
      .map((option) => safeText(option.value))
      .filter(Boolean);
  }

  function setSelectedValues(select, values) {
    const wanted = new Set((Array.isArray(values) ? values : [values]).map((item) => safeText(item)).filter(Boolean));
    let selectedAny = false;
    Array.from(select.options || []).forEach((option) => {
      option.selected = wanted.has(option.value);
      selectedAny = selectedAny || option.selected;
    });
    return selectedAny;
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

  function packHasRenderableStudyContent(pack) {
    const noteCards = Array.isArray(pack?.notes?.noteCards) ? pack.notes.noteCards : [];
    const lanes = pack?.quiz?.lanes || {};
    const laneQuestions = ["Foundation", "Core", "Stretch"].flatMap((lane) =>
      Array.isArray(lanes[lane]) ? lanes[lane] : []
    );
    return noteCards.some((card) => Array.isArray(card?.points) && card.points.length)
      && laneQuestions.some((question) => Array.isArray(question?.choices) && question.choices.length >= 3);
  }

  function removeCachedPack(cacheKey) {
    if (!cacheKey) {
      return;
    }
    const store = loadCacheStore();
    delete store[cacheKey];
    saveCacheStore(store);
    if (window.localStorage.getItem(LAST_PACK_KEY) === cacheKey) {
      window.localStorage.removeItem(LAST_PACK_KEY);
    }
  }

  function persistCurrentPack() {
    if (!state.currentPack?.cacheKey) {
      return;
    }
    const store = loadCacheStore();
    store[state.currentPack.cacheKey] = state.currentPack;
    saveCacheStore(store);
    window.localStorage.setItem(LAST_PACK_KEY, state.currentPack.cacheKey);
  }

  function resolveApiUrl(url) {
    const value = safeText(url);
    if (!value) {
      return "";
    }
    if (/^(https?:|blob:|data:)/i.test(value)) {
      return value;
    }
    if (value.startsWith("/")) {
      return `${API_BASE}${value}`;
    }
    return `${API_BASE}/${value.replace(/^\.?\//, "")}`;
  }

  function fileNameFromUrl(url, fallback) {
    const value = safeText(url);
    if (!value) {
      return fallback;
    }
    try {
      const parsed = new URL(resolveApiUrl(value));
      const parts = parsed.pathname.split("/").filter(Boolean);
      return decodeURIComponent(parts[parts.length - 1] || fallback);
    } catch (error) {
      return fallback;
    }
  }

  function canGenerateOfficialWorksheet(request = state.currentPack?.request) {
    const topicIds = Array.isArray(request?.topicIds) ? request.topicIds.filter(Boolean) : [];
    return Boolean(state.bridgeOnline && generatorSubjectForRequest(request) && topicIds.length);
  }

  function bundledSnapshotSyllabi() {
    return Array.isArray(BUNDLED_SNAPSHOT?.catalog?.syllabi) ? BUNDLED_SNAPSHOT.catalog.syllabi : [];
  }

  function hasBundledSnapshot() {
    return bundledSnapshotSyllabi().length > 0;
  }

  function normalizeTopicPacks(topicPacks) {
    return Array.isArray(topicPacks)
      ? topicPacks
          .map((pack) => ({
            id: safeText(pack.id),
            title: safeText(pack.title),
            source: safeText(pack.source),
            subtopics: Array.isArray(pack.subtopics)
              ? pack.subtopics
                  .map((subtopic) => ({ id: safeText(subtopic.id), title: safeText(subtopic.title) }))
                  .filter((subtopic) => subtopic.id && subtopic.title)
              : []
          }))
          .filter((pack) => pack.id || pack.title)
      : [];
  }

  function buildCatalogStateFromSyllabi(syllabi) {
    const nextCatalog = syllabi.length ? {} : { ...CATALOG };
    const nextTopicsBySubject = { ...FALLBACK_SYLLABUS_TOPICS };
    const nextTopicsByKey = {};
    const nextSubjects = [];
    let topicPackCount = 0;
    let subtopicCount = 0;

    syllabi.forEach((syllabusItem) => {
      const syllabusName = safeText(syllabusItem.name);
      const subjects = Array.isArray(syllabusItem.subjects) ? syllabusItem.subjects : [];
      const subjectLabels = [];
      subjects.forEach((item) => {
        const label = safeText(item.label || item.value);
        if (!label) {
          return;
        }
        subjectLabels.push(label);
        nextSubjects.push(label);
        const packs = normalizeTopicPacks(item.topicPacks);
        topicPackCount += packs.length;
        subtopicCount += packs.reduce((total, pack) => total + pack.subtopics.length, 0);
        if (syllabusName) {
          nextTopicsByKey[`${syllabusName}::${label}`] = packs;
        }
        if (!nextTopicsBySubject[label]) {
          nextTopicsBySubject[label] = packs;
        }
      });
      if (syllabusName) {
        const levels = Array.isArray(syllabusItem.levels) && syllabusItem.levels.length ? syllabusItem.levels : ["Standard"];
        nextCatalog[syllabusName] = {
          levels: Object.fromEntries(levels.map((level) => [safeText(level), unique(subjectLabels)]))
        };
      }
    });

    return {
      catalog: nextCatalog,
      syllabusSubjectOrder: unique([...nextSubjects, ...Object.keys(FALLBACK_SYLLABUS_TOPICS)]),
      syllabusTopicsBySubject: nextTopicsBySubject,
      syllabusTopicsByKey: nextTopicsByKey,
      catalogStats: {
        syllabusCount: Object.keys(nextCatalog).length,
        subjectCount: unique(nextSubjects).length,
        topicPackCount,
        subtopicCount
      }
    };
  }

  function applyCatalogState(catalogState) {
    if (!catalogState) {
      return;
    }
    state.catalog = catalogState.catalog || { ...CATALOG };
    state.catalogStats = catalogState.catalogStats || null;
    state.syllabusSubjectOrder = catalogState.syllabusSubjectOrder || Object.keys(FALLBACK_SYLLABUS_TOPICS);
    state.syllabusTopicsBySubject = catalogState.syllabusTopicsBySubject || { ...FALLBACK_SYLLABUS_TOPICS };
    state.syllabusTopicsByKey = catalogState.syllabusTopicsByKey || {};
    mergeOfficialIgcseSubjects();
    mergeOfficialCambridgeALevelSubjects();
    mergeOfficialCambridgePrimaryLowerSecondarySubjects();
    mergeHkdseSubjects();
    mergeOxfordAqaSubjects();
    mergeSpmKssmSubjects();
  }

  function applyBundledSnapshot() {
    if (!hasBundledSnapshot()) {
      return false;
    }
    applyCatalogState(buildCatalogStateFromSyllabi(bundledSnapshotSyllabi()));
    state.catalogStats = BUNDLED_SNAPSHOT?.stats || state.catalogStats;
    state.librarySummary = BUNDLED_SNAPSHOT?.library || state.librarySummary;
    return true;
  }

  function officialIgcseCatalogSubjects() {
    const reader = window.IC_EDUCATE_OFFICIAL_IGCSE_SUBJECT_PACKS?.catalogSubjects;
    if (typeof reader !== "function") {
      return [];
    }
    try {
      return Array.isArray(reader()) ? reader() : [];
    } catch (error) {
      return [];
    }
  }

  function mergeOfficialIgcseSubjects() {
    const extras = officialIgcseCatalogSubjects();
    if (!extras.length) {
      return;
    }
    const syllabusName = "Cambridge IGCSE";
    if (!state.catalog[syllabusName]) {
      state.catalog[syllabusName] = { levels: { IGCSE: [] } };
    }
    if (!state.catalog[syllabusName].levels) {
      state.catalog[syllabusName].levels = { IGCSE: [] };
    }
    const igcseSubjects = Array.isArray(state.catalog[syllabusName].levels.IGCSE)
      ? [...state.catalog[syllabusName].levels.IGCSE]
      : [];
    const known = new Set(igcseSubjects.map(safeText));
    const addedLabels = [];
    extras.forEach((subject) => {
      const label = safeText(subject.label || subject.value);
      if (!label) {
        return;
      }
      const packs = normalizeTopicPacks(subject.topicPacks);
      state.syllabusTopicsByKey[`${syllabusName}::${label}`] = packs;
      state.syllabusTopicsBySubject[label] = packs;
      if (!known.has(label)) {
        known.add(label);
        igcseSubjects.push(label);
        addedLabels.push(label);
      }
    });
    state.catalog[syllabusName].levels.IGCSE = igcseSubjects;
    state.syllabusSubjectOrder = unique([...state.syllabusSubjectOrder, ...addedLabels]);
    if (state.catalogStats) {
      state.catalogStats = {
        ...state.catalogStats,
        subjectCount: state.catalogStats.subjectCount + addedLabels.length,
        topicPackCount: state.catalogStats.topicPackCount + addedLabels.length,
        subtopicCount: state.catalogStats.subtopicCount + extras.reduce((total, subject) => {
          return total + normalizeTopicPacks(subject.topicPacks).reduce((sum, pack) => sum + pack.subtopics.length, 0);
        }, 0)
      };
    }
  }

  function officialCambridgeALevelCatalogSubjects() {
    const reader = window.IC_EDUCATE_OFFICIAL_A_LEVEL_SUBJECT_PACKS?.catalogSubjects;
    if (typeof reader !== "function") {
      return [];
    }
    try {
      return Array.isArray(reader()) ? reader() : [];
    } catch (error) {
      return [];
    }
  }

  function mergeOfficialCambridgeALevelSubjects() {
    const extras = officialCambridgeALevelCatalogSubjects();
    if (!extras.length) {
      return;
    }
    const syllabusName = "Cambridge A Level";
    const levels = ["AS Level", "A Level"];
    if (!state.catalog[syllabusName]) {
      state.catalog[syllabusName] = { levels: {} };
    }
    if (!state.catalog[syllabusName].levels) {
      state.catalog[syllabusName].levels = {};
    }
    const currentLabels = unique(levels.flatMap((level) => (
      Array.isArray(state.catalog[syllabusName].levels[level])
        ? state.catalog[syllabusName].levels[level].map(safeText)
        : []
    )));
    const known = new Set(currentLabels);
    const addedLabels = [];
    const allLabels = [...currentLabels];
    extras.forEach((subject) => {
      const label = safeText(subject.label || subject.value);
      if (!label) {
        return;
      }
      const packs = normalizeTopicPacks(subject.topicPacks);
      state.syllabusTopicsByKey[`${syllabusName}::${label}`] = packs;
      state.syllabusTopicsBySubject[label] = packs;
      if (!known.has(label)) {
        known.add(label);
        allLabels.push(label);
        addedLabels.push(label);
      }
    });
    levels.forEach((level) => {
      state.catalog[syllabusName].levels[level] = allLabels;
    });
    state.syllabusSubjectOrder = unique([...state.syllabusSubjectOrder, ...addedLabels]);
    if (state.catalogStats) {
      state.catalogStats = {
        ...state.catalogStats,
        subjectCount: state.catalogStats.subjectCount + addedLabels.length,
        topicPackCount: state.catalogStats.topicPackCount + addedLabels.length,
        subtopicCount: state.catalogStats.subtopicCount + extras.reduce((total, subject) => {
          return total + normalizeTopicPacks(subject.topicPacks).reduce((sum, pack) => sum + pack.subtopics.length, 0);
        }, 0)
      };
    }
  }

  function officialCambridgePrimaryLowerSecondaryCatalogSyllabi() {
    const reader = window.IC_EDUCATE_CAMBRIDGE_PRIMARY_LOWER_SECONDARY_PACKS?.catalogSyllabi;
    if (typeof reader !== "function") {
      return [];
    }
    try {
      return Array.isArray(reader()) ? reader() : [];
    } catch (error) {
      return [];
    }
  }

  function mergeOfficialCambridgePrimaryLowerSecondarySubjects() {
    const syllabi = officialCambridgePrimaryLowerSecondaryCatalogSyllabi();
    if (!syllabi.length) {
      return;
    }
    syllabi.forEach((syllabus) => {
      const syllabusName = safeText(syllabus.name);
      if (!syllabusName || !Array.isArray(syllabus.subjects)) {
        return;
      }
      const levels = Array.isArray(syllabus.levels) && syllabus.levels.length ? syllabus.levels.map(safeText) : ["Standard"];
      const labels = [];
      syllabus.subjects.forEach((subject) => {
        const label = safeText(subject.label || subject.value);
        if (!label) {
          return;
        }
        labels.push(label);
        const packs = normalizeTopicPacks(subject.topicPacks);
        state.syllabusTopicsByKey[`${syllabusName}::${label}`] = packs;
        state.syllabusTopicsBySubject[label] = packs;
      });
      state.catalog[syllabusName] = {
        levels: Object.fromEntries(levels.map((level) => [level, labels]))
      };
      state.syllabusSubjectOrder = unique([...state.syllabusSubjectOrder, ...labels]);
      if (state.catalogStats) {
        state.catalogStats = {
          ...state.catalogStats,
          subjectCount: state.catalogStats.subjectCount + labels.length,
          topicPackCount: state.catalogStats.topicPackCount + labels.length,
          subtopicCount: state.catalogStats.subtopicCount + syllabus.subjects.reduce((total, subject) => {
            return total + normalizeTopicPacks(subject.topicPacks).reduce((sum, pack) => sum + pack.subtopics.length, 0);
          }, 0)
        };
      }
    });
  }

  function hkdseCatalogSyllabus() {
    const reader = window.IC_EDUCATE_HKDSE_PACKS?.catalogSyllabus;
    if (typeof reader !== "function") {
      return null;
    }
    try {
      const syllabus = reader();
      return syllabus && Array.isArray(syllabus.subjects) ? syllabus : null;
    } catch (error) {
      return null;
    }
  }

  function mergeHkdseSubjects() {
    const syllabus = hkdseCatalogSyllabus();
    if (!syllabus) {
      return;
    }
    const syllabusName = safeText(syllabus.name, "HKDSE");
    const levels = Array.isArray(syllabus.levels) && syllabus.levels.length ? syllabus.levels.map(safeText) : ["DSE"];
    const labels = [];
    syllabus.subjects.forEach((subject) => {
      const label = safeText(subject.label || subject.value);
      if (!label) {
        return;
      }
      labels.push(label);
      const packs = normalizeTopicPacks(subject.topicPacks);
      state.syllabusTopicsByKey[`${syllabusName}::${label}`] = packs;
      state.syllabusTopicsBySubject[label] = packs;
    });
    state.catalog[syllabusName] = {
      levels: Object.fromEntries(levels.map((level) => [level, labels]))
    };
    state.syllabusSubjectOrder = unique([...state.syllabusSubjectOrder, ...labels]);
    if (state.catalogStats) {
      state.catalogStats = {
        ...state.catalogStats,
        subjectCount: state.catalogStats.subjectCount + labels.length,
        topicPackCount: state.catalogStats.topicPackCount + labels.length,
        subtopicCount: state.catalogStats.subtopicCount + syllabus.subjects.reduce((total, subject) => {
          return total + normalizeTopicPacks(subject.topicPacks).reduce((sum, pack) => sum + pack.subtopics.length, 0);
        }, 0)
      };
    }
  }

  function oxfordAqaCatalogSyllabus() {
    const reader = window.IC_EDUCATE_OXFORDAQA_PACKS?.catalogSyllabus;
    if (typeof reader !== "function") {
      return null;
    }
    try {
      const syllabus = reader();
      return syllabus && Array.isArray(syllabus.subjects) ? syllabus : null;
    } catch (error) {
      return null;
    }
  }

  function mergeOxfordAqaSubjects() {
    const syllabus = oxfordAqaCatalogSyllabus();
    if (!syllabus) {
      return;
    }
    const syllabusName = safeText(syllabus.name, "Oxford AQA International GCSE & A Level");
    const levels = Array.isArray(syllabus.levels) && syllabus.levels.length ? syllabus.levels.map(safeText) : ["Standard"];
    const labels = [];
    syllabus.subjects.forEach((subject) => {
      const label = safeText(subject.label || subject.value);
      if (!label) {
        return;
      }
      labels.push(label);
      const packs = normalizeTopicPacks(subject.topicPacks);
      state.syllabusTopicsByKey[`${syllabusName}::${label}`] = packs;
      state.syllabusTopicsBySubject[label] = packs;
    });
    state.catalog[syllabusName] = {
      levels: Object.fromEntries(levels.map((level) => [level, labels]))
    };
    state.syllabusSubjectOrder = unique([...state.syllabusSubjectOrder, ...labels]);
    if (state.catalogStats) {
      state.catalogStats = {
        ...state.catalogStats,
        subjectCount: state.catalogStats.subjectCount + labels.length,
        topicPackCount: state.catalogStats.topicPackCount + labels.length,
        subtopicCount: state.catalogStats.subtopicCount + syllabus.subjects.reduce((total, subject) => {
          return total + normalizeTopicPacks(subject.topicPacks).reduce((sum, pack) => sum + pack.subtopics.length, 0);
        }, 0)
      };
    }
  }

  function spmKssmCatalogSyllabus() {
    const reader = window.IC_EDUCATE_SPM_KSSM_PACKS?.catalogSyllabus;
    if (typeof reader !== "function") {
      return null;
    }
    try {
      const syllabus = reader();
      return syllabus && Array.isArray(syllabus.subjects) ? syllabus : null;
    } catch (error) {
      return null;
    }
  }

  function mergeSpmKssmSubjects() {
    const syllabus = spmKssmCatalogSyllabus();
    if (!syllabus) {
      return;
    }
    const syllabusName = safeText(syllabus.name, "SPM / KSSM");
    const levels = Array.isArray(syllabus.levels) && syllabus.levels.length ? syllabus.levels.map(safeText) : ["Tingkatan 4", "Tingkatan 5"];
    const labels = [];
    syllabus.subjects.forEach((subject) => {
      const label = safeText(subject.label || subject.value);
      if (!label) {
        return;
      }
      labels.push(label);
      const packs = normalizeTopicPacks(subject.topicPacks);
      state.syllabusTopicsByKey[`${syllabusName}::${label}`] = packs;
      state.syllabusTopicsBySubject[label] = packs;
    });
    state.catalog[syllabusName] = {
      levels: Object.fromEntries(levels.map((level) => [level, labels]))
    };
    state.syllabusSubjectOrder = unique([...state.syllabusSubjectOrder, ...labels]);
    if (state.catalogStats) {
      state.catalogStats = {
        ...state.catalogStats,
        syllabusCount: state.catalogStats.syllabusCount + (state.catalog[syllabusName] ? 0 : 1),
        subjectCount: state.catalogStats.subjectCount + labels.length,
        topicPackCount: state.catalogStats.topicPackCount + labels.length,
        subtopicCount: state.catalogStats.subtopicCount + syllabus.subjects.reduce((total, subject) => {
          return total + normalizeTopicPacks(subject.topicPacks).reduce((sum, pack) => sum + pack.subtopics.length, 0);
        }, 0)
      };
    }
  }

  function subjectsForSelection(syllabus, level) {
    const catalog = state.catalog || CATALOG;
    const syllabusEntry = catalog[safeText(syllabus)];
    if (!syllabusEntry || typeof syllabusEntry !== "object" || !syllabusEntry.levels) {
      return [];
    }
    const exactSubjects = syllabusEntry.levels[safeText(level)];
    if (Array.isArray(exactSubjects) && exactSubjects.length) {
      return unique(exactSubjects.map(safeText).filter(Boolean));
    }
    const firstDefinedSubjects = Object.values(syllabusEntry.levels).find(
      (items) => Array.isArray(items) && items.length
    );
    return Array.isArray(firstDefinedSubjects)
      ? unique(firstDefinedSubjects.map(safeText).filter(Boolean))
      : [];
  }

  function defaultRequest() {
    if (TRIAL_BIOLOGY_14) {
      return {
        syllabus: "Cambridge IGCSE",
        level: "IGCSE",
        topic: "Biology",
        chapterIds: ["14"],
        chapterId: "14",
        chapterTitle: "Coordination and response",
        subtopicIds: [`${WHOLE_CHAPTER_VALUE}:14`],
        subtopicId: `${WHOLE_CHAPTER_VALUE}:14`,
        subtopic: "All Chapter 14 subtopics",
        learningTarget: "Master all 14. Coordination and response subtopics: Coordination and response, Sense organs, Hormones, Homeostasis, Tropic responses.",
        goal: "Master all 14. Coordination and response subtopics: Coordination and response, Sense organs, Hormones, Homeostasis, Tropic responses.",
        focus: "",
        pace: "balanced",
        worksheetLength: 12,
        topicIds: ["14"]
      };
    }
    const catalog = state.catalog || CATALOG;
    const syllabus = Object.keys(catalog)[0] || "Cambridge IGCSE";
    const level = Object.keys(catalog[syllabus]?.levels || { Standard: [] })[0] || "IGCSE";
    const subjects = subjectsForSelection(syllabus, level);
    return {
      syllabus,
      level,
      topic: subjects.includes("Biology") ? "Biology" : subjects[0] || "",
      chapterIds: ["14"],
      chapterId: "14",
      chapterTitle: "Coordination and response",
      subtopicIds: [`${WHOLE_CHAPTER_VALUE}:14`],
      subtopicId: `${WHOLE_CHAPTER_VALUE}:14`,
      subtopic: "All Chapter 14 subtopics",
      learningTarget: "Master all 14. Coordination and response subtopics: Coordination and response, Sense organs, Hormones, Homeostasis, Tropic responses.",
      goal: "",
      focus: "",
      pace: "balanced",
      worksheetLength: 12,
      topicIds: ["14"]
    };
  }

  function buildRequestKey(request) {
    return [
      request.syllabus,
      request.level,
      request.topic,
      (request.chapterIds || []).join(","),
      request.chapterId,
      request.chapterTitle,
      (request.subtopicIds || []).join(","),
      request.subtopicId,
      request.subtopic,
      request.learningTarget,
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

  function chapterLabel(chapter) {
    const id = safeText(chapter?.id);
    const title = safeText(chapter?.title);
    return id && title ? `${id}. ${title}` : title || id || "Selected topic";
  }

  function coverageChapterLabel(item) {
    const id = safeText(item?.chapterId || item?.id);
    const title = safeText(item?.chapterTitle || item?.title);
    return id && title ? `${id}. ${title}` : title || id || "Selected topic";
  }

  function subtopicLabel(subtopic) {
    const id = safeText(subtopic?.id);
    const title = safeText(subtopic?.title);
    return id && title ? `${id} ${title}` : title || id || "Selected subtopic";
  }

  function topicsForSubject(subject) {
    const syllabus = safeText(elements.syllabusSelect?.value || defaultRequest().syllabus);
    const key = `${syllabus}::${safeText(subject)}`;
    if (Array.isArray(state.syllabusTopicsByKey[key])) {
      return state.syllabusTopicsByKey[key];
    }
    return Array.isArray(state.syllabusTopicsBySubject[subject])
      ? state.syllabusTopicsBySubject[subject]
      : [];
  }

  function currentChapter() {
    const subject = safeText(elements.topicSelect.value);
    const id = selectedValues(elements.chapterSelect)[0] || safeText(elements.chapterSelect.value);
    return topicsForSubject(subject).find((chapter) => safeText(chapter.id) === id) || null;
  }

  function selectedChapters() {
    const subject = safeText(elements.topicSelect.value);
    const chapters = topicsForSubject(subject);
    const ids = selectedValues(elements.chapterSelect);
    const selected = chapters.filter((chapter) => ids.includes(safeText(chapter.id)));
    return selected.length ? selected : chapters.slice(0, 1);
  }

  function currentSubtopic() {
    const selected = selectedSubtopics();
    return selected.find((item) => !item.wholeChapter)?.subtopic || null;
  }

  function selectedSubtopics() {
    const values = selectedValues(elements.subtopicSelect);
    const out = [];
    selectedChapters().forEach((chapter) => {
      const chapterId = safeText(chapter.id);
      const wholeValue = `${WHOLE_CHAPTER_VALUE}:${chapterId}`;
      if (values.includes(wholeValue)) {
        out.push({ chapter, wholeChapter: true, value: wholeValue, label: `All ${chapterLabel(chapter)} subtopics` });
        return;
      }
      (chapter.subtopics || []).forEach((subtopic) => {
        const value = `${chapterId}:${safeText(subtopic.id)}`;
        if (values.includes(value)) {
          out.push({ chapter, subtopic, wholeChapter: false, value, label: `${subtopicLabel(subtopic)} (${safeText(chapter.title)})` });
        }
      });
    });
    return out.length
      ? out
      : selectedChapters().map((chapter) => ({
          chapter,
          wholeChapter: true,
          value: `${WHOLE_CHAPTER_VALUE}:${safeText(chapter.id)}`,
          label: `All ${chapterLabel(chapter)} subtopics`
        }));
  }

  function selectedSyllabusCoverage() {
    return selectedSubtopics().map((item) => {
      if (item.wholeChapter) {
        const subtopics = (item.chapter.subtopics || []).map(subtopicLabel).filter(Boolean);
        return {
          chapterId: safeText(item.chapter.id),
          chapterTitle: safeText(item.chapter.title),
          subtopicId: WHOLE_CHAPTER_VALUE,
          subtopicTitle: "Whole chapter",
          subtopics
        };
      }
      return {
        chapterId: safeText(item.chapter.id),
        chapterTitle: safeText(item.chapter.title),
        subtopicId: safeText(item.subtopic.id),
        subtopicTitle: safeText(item.subtopic.title),
        subtopics: [subtopicLabel(item.subtopic)]
      };
    });
  }

  function coverageLabels() {
    return selectedSyllabusCoverage().flatMap((item) => {
      if (item.subtopicId === WHOLE_CHAPTER_VALUE) {
        return item.subtopics.length
          ? item.subtopics.map((subtopic) => `${coverageChapterLabel(item)}: ${subtopic}`)
          : [coverageChapterLabel(item)];
      }
      return [`${coverageChapterLabel(item)}: ${item.subtopicId} ${item.subtopicTitle}`];
    });
  }

  function topicPackNeedsWebLookup(pack) {
    const title = normalizeToken(pack?.title);
    const source = normalizeToken(pack?.source);
    const subtopics = Array.isArray(pack?.subtopics) ? pack.subtopics : [];
    const onlySubtopic = subtopics[0] || {};
    const onlyTitle = normalizeToken(onlySubtopic.title);
    const onlyId = normalizeToken(onlySubtopic.id);
    if (!subtopics.length) {
      return true;
    }
    if (title === "readme" || title === "overview" || title.includes("curriculum outline")) {
      return true;
    }
    return subtopics.length === 1 && (
      onlyId === "all"
      || onlyTitle === "readme"
      || (source.startsWith("studioprime") && (onlyTitle.startsWith("all ") || title === onlyTitle))
    );
  }

  function countSelectedCoverageSubtopics() {
    const seen = new Set();
    selectedSyllabusCoverage().forEach((item) => {
      const chapterKey = normalizeToken(item.chapterId || item.chapterTitle || "selected-topic");
      if (safeText(item.subtopicId) === WHOLE_CHAPTER_VALUE) {
        (item.subtopics || []).forEach((subtopic) => {
          const subtopicKey = normalizeToken(subtopic);
          if (subtopicKey) {
            seen.add(`${chapterKey}:${subtopicKey}`);
          }
        });
        return;
      }
      const label = `${safeText(item.subtopicId)} ${safeText(item.subtopicTitle)}`.trim();
      const subtopicKey = normalizeToken(label);
      if (subtopicKey) {
        seen.add(`${chapterKey}:${subtopicKey}`);
      }
    });
    return seen.size;
  }

  function currentSubjectCoverageMeta() {
    const syllabus = safeText(elements.syllabusSelect?.value);
    const subject = safeText(elements.topicSelect?.value);
    const topicPacks = topicsForSubject(subject);
    const placeholderPacks = topicPacks.filter(topicPackNeedsWebLookup);
    const structuredPacks = topicPacks.filter((pack) => !topicPackNeedsWebLookup(pack));
    const totalSubtopics = topicPacks.reduce((total, pack) => total + (Array.isArray(pack.subtopics) ? pack.subtopics.length : 0), 0);
    const structuredSubtopics = structuredPacks.reduce((total, pack) => total + (Array.isArray(pack.subtopics) ? pack.subtopics.length : 0), 0);
    return {
      syllabus,
      subject,
      topicPackCount: topicPacks.length,
      totalSubtopics,
      structuredPackCount: structuredPacks.length,
      structuredSubtopics,
      placeholderPackCount: placeholderPacks.length,
      needsWebLookup: topicPacks.length > 0 && structuredPacks.length === 0,
      selectedSubtopicCount: countSelectedCoverageSubtopics()
    };
  }

  function updateSyllabusCoverageHint() {
    if (!elements.syllabusCoverageHint) {
      return;
    }
    const meta = currentSubjectCoverageMeta();
    if (!meta.subject) {
      elements.syllabusCoverageHint.textContent = "Select a subject to load the bundled syllabus map.";
      return;
    }
    if (!meta.topicPackCount) {
      elements.syllabusCoverageHint.textContent = hasBundledSnapshot()
        ? `No bundled syllabus topics were found for ${meta.syllabus} ${meta.subject} on the public site yet.`
        : "Start the local bridge to load the full syllabus library.";
      return;
    }
    if (meta.syllabus === "IB Diploma" && meta.needsWebLookup) {
      elements.syllabusCoverageHint.textContent = `IB ${meta.subject} is only mapped as a broad library placeholder on the public site right now. The snapshot has ${meta.topicPackCount} library document${meta.topicPackCount === 1 ? "" : "s"}, but no real chapter/subtopic breakdown yet, so 1 official web syllabus lookup is still needed for this subject.`;
      return;
    }
    if (meta.needsWebLookup) {
      elements.syllabusCoverageHint.textContent = `${meta.syllabus} ${meta.subject} is using ${meta.topicPackCount} broad library placeholder${meta.topicPackCount === 1 ? "" : "s"} on the public site. A proper web or manual syllabus map is still needed before the dropdown can show detailed subtopics.`;
      return;
    }
    const selectionNote = meta.selectedSubtopicCount
      ? ` You currently selected ${meta.selectedSubtopicCount} subtopic${meta.selectedSubtopicCount === 1 ? "" : "s"}.`
      : "";
    const placeholderNote = meta.placeholderPackCount
      ? ` ${meta.placeholderPackCount} broad library pack${meta.placeholderPackCount === 1 ? "" : "s"} still need extra syllabus mapping.`
      : "";
    elements.syllabusCoverageHint.textContent = `Bundled library snapshot loaded: ${meta.structuredPackCount} structured topic pack${meta.structuredPackCount === 1 ? "" : "s"} and ${meta.structuredSubtopics} subtopic${meta.structuredSubtopics === 1 ? "" : "s"} for ${meta.syllabus} ${meta.subject}.${selectionNote}${placeholderNote}`;
  }

  function chapterSummary(chapters = selectedChapters()) {
    const labels = chapters.map(chapterLabel).filter(Boolean);
    if (!labels.length) {
      return safeText(elements.topicSelect.value);
    }
    return labels.length === 1 ? labels[0] : labels.join(" + ");
  }

  function coverageSummary() {
    const labels = coverageLabels();
    if (!labels.length) {
      return null;
    }
    return labels.length === 1 ? labels[0] : labels.join("; ");
  }

  function requestCoverageLabels(request) {
    const coverage = Array.isArray(request?.selectedSyllabusCoverage)
      ? request.selectedSyllabusCoverage
      : [];
    if (!coverage.length) {
      return splitIdeas(request?.subtopic || "");
    }
    return coverage.flatMap((item) => {
      const chapter = coverageChapterLabel(item);
      const subtopics = Array.isArray(item.subtopics) ? item.subtopics.map(safeText).filter(Boolean) : [];
      if (safeText(item.subtopicId) === WHOLE_CHAPTER_VALUE) {
        return subtopics.length ? subtopics.map((subtopic) => `${chapter}: ${subtopic}`) : [chapter];
      }
      return [`${chapter}: ${safeText(item.subtopicId)} ${safeText(item.subtopicTitle)}`.trim()];
    });
  }

  function wholeChapterTarget(chapter) {
    const titles = (chapter?.subtopics || [])
      .map((subtopic) => safeText(subtopic.title))
      .filter(Boolean);
    if (!titles.length) {
      return `Master ${chapterLabel(chapter)}.`;
    }
    return `Master all ${chapterLabel(chapter)} subtopics: ${titles.join(", ")}.`;
  }

  function learningTargetFor(chapter, subtopic) {
    if (subtopic) {
      return `Learn ${subtopicLabel(subtopic)} in ${chapterLabel(chapter)}.`;
    }
    return wholeChapterTarget(chapter);
  }

  function learningTargetForSelection() {
    const labels = coverageLabels();
    if (!labels.length) {
      return "Select syllabus topics to learn.";
    }
    return `Master every selected syllabus point without gaps: ${labels.join("; ")}.`;
  }

  function syncInternalTopicSelection() {
    state.selectedTopicIds = selectedChapters().map((chapter) => safeText(chapter.id)).filter(Boolean);
  }

  function syncChapterOptions(preferredChapterId) {
    const subject = safeText(elements.topicSelect.value);
    const chapters = topicsForSubject(subject);
    const preferredIds = Array.isArray(preferredChapterId)
      ? preferredChapterId.map(safeText)
      : safeText(preferredChapterId).split(",").map(safeText).filter(Boolean);
    state.topicalOptions = chapters.map((chapter) => ({
      id: safeText(chapter.id),
      title: safeText(chapter.title),
      subtopics: Array.isArray(chapter.subtopics) ? chapter.subtopics : []
    })).filter((chapter) => chapter.id && chapter.title);
    if (!chapters.length) {
      fillSelectOptions(elements.chapterSelect, [
        {
          value: "",
          label: state.bridgeOnline
            ? "No syllabus topics found"
            : hasBundledSnapshot()
              ? "No bundled syllabus topics found"
              : "Start the local bridge to load syllabus topics"
        }
      ]);
      syncSubtopicOptions();
      return;
    }
    fillSelectOptions(
      elements.chapterSelect,
      chapters.map((chapter) => ({
        value: safeText(chapter.id),
        label: chapterLabel(chapter)
      }))
    );
    const selectedAny = setSelectedValues(elements.chapterSelect, preferredIds);
    if (!selectedAny && chapters.length) {
      setSelectedValues(elements.chapterSelect, [safeText(chapters[0].id)]);
    }
    syncSubtopicOptions();
  }

  function syncSubtopicOptions(preferredSubtopicId) {
    const chapters = selectedChapters();
    const rawPreferredIds = Array.isArray(preferredSubtopicId)
      ? preferredSubtopicId.map(safeText)
      : safeText(preferredSubtopicId).split(",").map(safeText).filter(Boolean);
    if (!chapters.length) {
      fillSelectOptions(elements.subtopicSelect, [{ value: "", label: "Select a topic first" }]);
      syncLearningTargetOptions();
      return;
    }
    const options = chapters.flatMap((chapter) => {
      const chapterId = safeText(chapter.id);
      return [
        { value: `${WHOLE_CHAPTER_VALUE}:${chapterId}`, label: `Whole chapter: ${chapterLabel(chapter)}` },
        ...(chapter.subtopics || []).map((subtopic) => ({
          value: `${chapterId}:${safeText(subtopic.id)}`,
          label: `${subtopicLabel(subtopic)} (${safeText(chapter.title)})`
        }))
      ];
    });
    fillSelectOptions(elements.subtopicSelect, options);
    const validValues = new Set(options.map((option) => option.value));
    const preferredIds = rawPreferredIds.flatMap((id) => {
      if (!id) {
        return [];
      }
      if (validValues.has(id)) {
        return [id];
      }
      if (id === WHOLE_CHAPTER_VALUE) {
        return chapters
          .map((chapter) => `${WHOLE_CHAPTER_VALUE}:${safeText(chapter.id)}`)
          .filter((value) => validValues.has(value));
      }
      if (!id.includes(":")) {
        return chapters
          .map((chapter) => `${safeText(chapter.id)}:${id}`)
          .filter((value) => validValues.has(value));
      }
      return [];
    });
    let selectedAny = setSelectedValues(elements.subtopicSelect, preferredIds);
    if (!selectedAny) {
      const wholeValues = chapters.map((chapter) => `${WHOLE_CHAPTER_VALUE}:${safeText(chapter.id)}`);
      selectedAny = setSelectedValues(elements.subtopicSelect, wholeValues);
    }
    syncLearningTargetOptions();
  }

  function syncLearningTargetOptions(preferredTarget) {
    const coverage = selectedSyllabusCoverage();
    const preferredTargets = Array.isArray(preferredTarget)
      ? preferredTarget.map(safeText)
      : safeText(preferredTarget).split("||").map(safeText).filter(Boolean);
    if (!coverage.length) {
      fillSelectOptions(elements.learningTargetSelect, [{ value: "", label: "Select a topic first" }]);
      state.selectedTopicIds = [];
      updateSyllabusCoverageHint();
      return;
    }

    const options = [
      {
        value: learningTargetForSelection(),
        label: "Complete selected coverage"
      },
      ...coverage.flatMap((item) => {
        if (item.subtopicId === WHOLE_CHAPTER_VALUE) {
          const target = `Master all of ${item.chapterId}. ${item.chapterTitle}: ${item.subtopics.join(", ")}.`;
          return [{ value: target, label: `Whole chapter: ${item.chapterId}. ${item.chapterTitle}` }];
        }
        const target = `Learn ${item.subtopicId} ${item.subtopicTitle} in ${item.chapterId}. ${item.chapterTitle}.`;
        return [{
          value: target,
          label: `${item.subtopicId} ${item.subtopicTitle}`
        }];
      })
    ];
    fillSelectOptions(elements.learningTargetSelect, options);
    let selectedAny = setSelectedValues(elements.learningTargetSelect, preferredTargets);
    if (!selectedAny) {
      selectedAny = setSelectedValues(elements.learningTargetSelect, [options[0]?.value]);
    }
    syncInternalTopicSelection();
    updateSyllabusCoverageHint();
  }

  function syncSubtopicFromLearningTarget() {
    syncInternalTopicSelection();
  }

  function syncLevelOptions(preferredLevel) {
    const syllabus = elements.syllabusSelect.value || defaultRequest().syllabus;
    const catalog = state.catalog || CATALOG;
    const levels = Object.keys(catalog[syllabus]?.levels || {});
    fillSelect(elements.levelSelect, levels);
    if (preferredLevel && levels.includes(preferredLevel)) {
      elements.levelSelect.value = preferredLevel;
    } else if (!levels.includes(elements.levelSelect.value) && levels.length) {
      elements.levelSelect.value = levels[0];
    }
    syncTopicOptions();
  }

  function syncTopicOptions(preferredTopic) {
    const syllabus = safeText(elements.syllabusSelect.value || defaultRequest().syllabus);
    const level = safeText(elements.levelSelect.value);
    const subjects = subjectsForSelection(syllabus, level);
    if (!subjects.length) {
      fillSelectOptions(elements.topicSelect, [
        {
          value: "",
          label: "No subjects found for this syllabus"
        }
      ]);
      syncChapterOptions();
      updateSyllabusCoverageHint();
      return;
    }
    fillSelect(elements.topicSelect, subjects);
    const currentTopic = safeText(elements.topicSelect.value);
    if (preferredTopic && subjects.includes(preferredTopic)) {
      elements.topicSelect.value = preferredTopic;
    } else if (subjects.includes(currentTopic)) {
      elements.topicSelect.value = currentTopic;
    } else if (subjects.includes("Biology")) {
      elements.topicSelect.value = "Biology";
    } else {
      elements.topicSelect.value = subjects[0];
    }
    syncChapterOptions();
  }

  function applyRequestToForm(request) {
    if (!request) {
      return;
    }
    elements.syllabusSelect.value = request.syllabus || defaultRequest().syllabus;
    syncLevelOptions(request.level);
    syncTopicOptions(request.topic);
    syncChapterOptions(request.chapterIds || request.chapterId);
    syncSubtopicOptions(request.subtopicIds || request.subtopicId);
    syncLearningTargetOptions(request.learningTargets || request.learningTarget || request.goal);
    elements.paceSelect.value = request.pace || "balanced";
    elements.worksheetLengthSelect.value = String(request.worksheetLength || 12);
    elements.focusInput.value = request.focus || "";
  }

  function readRequestFromForm() {
    const subject = safeText(elements.topicSelect.value);
    const chapters = selectedChapters();
    const coverage = selectedSyllabusCoverage();
    const selectedTargets = selectedValues(elements.learningTargetSelect);
    const chapterIds = chapters.map((chapter) => safeText(chapter.id)).filter(Boolean);
    const chapterTitle = chapterSummary(chapters);
    const subtopicIds = selectedSubtopics().map((item) => item.value).filter(Boolean);
    const subtopicTitle = coverageSummary() || `All selected ${subject} subtopics`;
    const selectedTarget = selectedTargets.length
      ? selectedTargets.join(" ")
      : learningTargetForSelection();
    const labels = coverageLabels();
    const completeCoverageInstruction = labels.length
      ? `Cover every selected syllabus point without gaps: ${labels.join("; ")}.`
      : "Cover every selected syllabus point without gaps.";
    syncInternalTopicSelection();
    return {
      syllabus: safeText(elements.syllabusSelect.value),
      level: safeText(elements.levelSelect.value),
      topic: subject,
      chapterIds,
      chapterId: chapterIds[0] || "",
      chapterTitle,
      subtopicIds,
      subtopicId: subtopicIds[0] || "",
      subtopic: subtopicTitle,
      selectedSyllabusCoverage: coverage,
      coverageLabels: labels,
      learningTargets: selectedTargets,
      learningTarget: selectedTarget,
      goal: `${selectedTarget} ${completeCoverageInstruction}`,
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

  function contentTopicForRequest(request) {
    return safeText(request.chapterTitle) || safeText(request.topic);
  }

  function contentSubtopicForRequest(request) {
    const value = safeText(request.subtopic);
    return value || contentTopicForRequest(request);
  }

  function setSelectedTopicIds(topicIds) {
    state.selectedTopicIds = [...new Set((topicIds || []).map((item) => safeText(item)).filter(Boolean))];
    elements.officialTopicChoices.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.checked = state.selectedTopicIds.includes(input.value);
    });
  }

  function renderOfficialTopicChoices() {
    elements.officialTopicWrap.hidden = true;
    elements.officialTopicChoices.innerHTML = "";
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
        topic: contentTopicForRequest(request),
        subject,
        goal: request.goal,
        focus: [request.subtopic, request.focus, ...(request.coverageLabels || [])].filter(Boolean).join(", ")
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
      if (!state.selectedTopicIds.length && suggestedTopicIds.length && state.topicalOptions.length) {
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
    if (!state.bridgeOnline) {
      syncTopicOptions(request.topic);
      syncChapterOptions(request.chapterIds || request.chapterId);
      syncSubtopicOptions(request.subtopicIds || request.subtopicId);
      syncLearningTargetOptions(request.learningTargets || request.learningTarget);
      renderOfficialTopicChoices();
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/worksheets/options`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload = await response.json();
      const syllabi = Array.isArray(payload?.catalog?.syllabi) ? payload.catalog.syllabi : [];
      if (syllabi.length) {
        applyCatalogState(buildCatalogStateFromSyllabi(syllabi));
      }
      if (!syllabi.length) {
        const usingBundledSnapshot = applyBundledSnapshot();
        if (usingBundledSnapshot) {
          state.librarySummary = payload?.library || state.librarySummary;
          fillSelect(elements.syllabusSelect, Object.keys(state.catalog));
          if (Object.keys(state.catalog).includes(request.syllabus)) {
            elements.syllabusSelect.value = request.syllabus;
          }
          syncLevelOptions(request.level);
          syncTopicOptions(request.topic);
          syncChapterOptions(request.chapterIds || request.chapterId);
          syncSubtopicOptions(request.subtopicIds || request.subtopicId);
          syncLearningTargetOptions(request.learningTargets || request.learningTarget);
          renderOfficialTopicChoices();
          return;
        }
        const subjects = payload?.topical?.subjects || [];
        const nextTopicsBySubject = { ...FALLBACK_SYLLABUS_TOPICS };
        const nextSubjects = [];
        subjects.forEach((item) => {
          const label = safeText(item.label || item.value);
          if (!label) {
            return;
          }
          nextSubjects.push(label);
          nextTopicsBySubject[label] = normalizeTopicPacks(item.topicPacks);
        });
        applyCatalogState({
          catalog: { ...CATALOG },
          catalogStats: state.catalogStats,
          syllabusSubjectOrder: unique([...nextSubjects, ...Object.keys(FALLBACK_SYLLABUS_TOPICS)]),
          syllabusTopicsBySubject: nextTopicsBySubject,
          syllabusTopicsByKey: {}
        });
      }
      state.librarySummary = payload?.library || state.librarySummary;
      fillSelect(elements.syllabusSelect, Object.keys(state.catalog));
      if (Object.keys(state.catalog).includes(request.syllabus)) {
        elements.syllabusSelect.value = request.syllabus;
      }
      syncLevelOptions(request.level);
      syncTopicOptions(request.topic);
      syncChapterOptions(request.chapterIds || request.chapterId);
      syncSubtopicOptions(request.subtopicIds || request.subtopicId);
      syncLearningTargetOptions(request.learningTargets || request.learningTarget);
      renderOfficialTopicChoices();
    } catch (error) {
      syncTopicOptions(request.topic);
      syncChapterOptions(request.chapterIds || request.chapterId);
      syncSubtopicOptions(request.subtopicIds || request.subtopicId);
      syncLearningTargetOptions(request.learningTargets || request.learningTarget);
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
    const contentTopic = contentTopicForRequest(request);
    const contentSubtopic = contentSubtopicForRequest(request);
    const coverage = requestCoverageLabels(request);
    return unique(
      [
        ...coverage,
        ...(Array.isArray(request.recommendedFocus) ? request.recommendedFocus : []),
        contentSubtopic,
        ...splitIdeas(request.focus),
        ...splitIdeas(request.learningTarget || request.goal),
        ...profile.starters,
        `${contentTopic} inside ${request.syllabus} ${request.level}`,
        `Common exam traps in ${contentTopic}`
      ]
        .map((item) => sentenceCase(item.replace(/\.$/, "")))
        .filter((item) => item.length > 10)
    ).slice(0, 6);
  }

  function buildImportantPoints(request, profile, focusItems) {
    const contentTopic = contentTopicForRequest(request);
    const coverage = requestCoverageLabels(request);
    return [
      coverage.length
        ? `Coverage checklist: ${coverage.slice(0, 8).join("; ")}${coverage.length > 8 ? "; and the remaining selected points" : ""}.`
        : `Cover the selected syllabus points for ${contentTopic}.`,
      `Start ${contentTopic} by locking in ${profile.centralQuestion}.`,
      `Use the selected syllabus target as the filter: ${request.learningTarget || request.goal}.`,
      `Turn each focus area into one definition, one example, and one quick self-check.`,
      `Treat the main trap as a deliberate review target: ${profile.trap}.`,
      `Move through Foundation, Core, and Stretch until missed questions stop returning.`,
      ...focusItems.slice(0, 2).map((item) => `Priority focus: ${item}.`)
    ];
  }

  function buildNoteCards(request, profile, focusItems) {
    const contentTopic = contentTopicForRequest(request);
    const coverage = requestCoverageLabels(request);
    const first = focusItems[0] || `core ideas in ${contentTopic}`;
    const second = focusItems[1] || `worked examples in ${contentTopic}`;
    const third = focusItems[2] || `common mistakes in ${contentTopic}`;

    return [
      {
        title: "Coverage checklist",
        points: coverage.length
          ? [
              ...coverage.slice(0, 4).map((item) => `Include ${item}.`),
              ...(coverage.length > 4 ? [`Also cover: ${coverage.slice(4).join("; ")}.`] : [])
            ].slice(0, 4)
          : [
              `${contentTopic} is being studied here as a usable skill, not just a fact list.`,
              `The first checkpoint is whether the student can explain ${profile.centralQuestion}.`,
              `Keep linking every example back to the selected syllabus target: ${request.learningTarget || request.goal}.`
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

  function buildCoverageChecklistCard(request) {
    const coverage = requestCoverageLabels(request);
    if (!coverage.length) {
      return null;
    }
    return {
      title: "Coverage checklist",
      points: [
        ...coverage.slice(0, 4).map((item) => `Include ${item}.`),
        ...(coverage.length > 4 ? [`Also cover: ${coverage.slice(4).join("; ")}.`] : [])
      ].slice(0, 4)
    };
  }

  function buildDiagramSvg(request, profile, focusItems) {
    const contentTopic = contentTopicForRequest(request);
    const nodes = unique([contentTopic, ...focusItems.slice(0, 4)]).slice(0, 5);
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
      <svg viewBox="0 0 660 310" role="img" aria-label="${escapeHtml(profile.diagramLabel)} for ${escapeHtml(contentTopic)}">
        <rect x="1" y="1" width="658" height="308" rx="24" fill="#f9f1e5" stroke="#ead9c4"></rect>
        <text x="28" y="34" font-size="14" font-family="Sora, sans-serif" fill="#5f6c67">${escapeHtml(profile.diagramLabel)}</text>
        ${connectorMarkup}
        ${nodeMarkup}
      </svg>
    `;
  }

  function buildDistractors(request, focusItem, profile) {
    const contentTopic = contentTopicForRequest(request);
    return unique([
      `Memorise ${contentTopic} without explaining the reasoning`,
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
    const contentTopic = contentTopicForRequest(request);
    if (lane === "Foundation") {
      return {
        prompt: `Which move best shows a student understands the basic idea behind ${focusItem.toLowerCase()}?`,
        concept: "Foundation questions check whether the student can identify the rule before applying it.",
        correct: `State the idea clearly and connect it to one clean example in ${contentTopic}`,
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
      id: `${slugify(contentTopicForRequest(request))}-${slugify(lane)}-${index + 1}`,
      lane,
      prompt: template.prompt,
      concept: template.concept,
      choices: choicePack.choices,
      answer: choicePack.answerIndex,
      explanation: `${template.explanation} Keep ${focusItem.toLowerCase()} tied to the selected syllabus target: ${request.learningTarget || request.goal}.`
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
          focusItems[index % focusItems.length] || contentTopicForRequest(request),
          profile,
          index
        )
      );
    });

    return lanes;
  }

  function buildWorksheetQuestion(request, lane, focusItem, profile, index) {
    const contentTopic = contentTopicForRequest(request);
    const marks = lane === "Foundation" ? 2 : lane === "Core" ? 3 : 4;
    const promptMap = {
      Foundation: `Define or explain ${focusItem.toLowerCase()} in the context of ${contentTopic}.`,
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
      const focusItem = focusItems[index % focusItems.length] || contentTopicForRequest(request);
      questions.push(buildWorksheetQuestion(request, lane, focusItem, profile, index));
    }

    const answerKeyLines = questions.map((question) => {
      const marksText = `${question.marks} mark${question.marks === 1 ? "" : "s"}`;
      const bullets = question.answerPoints.map((point) => `- ${point}`).join("\n");
      return `Q${question.number} (${question.lane}, ${marksText})\n${bullets}`;
    });

    return {
      intro: `Extra practice for ${contentTopicForRequest(request)}. Work through the questions in order, then upload the completed worksheet for marking when the local autograder bridge is available.`,
      questions,
      answerKeyLines,
      rubricText: answerKeyLines.join("\n\n")
    };
  }

  function buildSevenDayPlan(request, profile, focusItems, worksheet) {
    const contentTopic = contentTopicForRequest(request);
    const coverage = requestCoverageLabels(request);
    const selectedPoints = coverage.length ? coverage : focusItems;
    const mainFocus = selectedPoints[0] || contentTopic;
    const secondaryFocus = selectedPoints[1] || focusItems[1] || contentTopic;
    const worksheetCount = Array.isArray(worksheet?.questions) ? worksheet.questions.length : Number(request.worksheetLength) || 12;
    const paceLabel = request.pace === "guided"
      ? "guided foundation-first pace"
      : request.pace === "fast"
        ? "fast-track exam pace"
        : "balanced concept and practice pace";

    return {
      intro: `This 7-day plan is built for ${request.syllabus} ${request.level} ${request.topic}. It focuses on ${contentSubtopicForRequest(request)} with a ${paceLabel}.`,
      meta: {
        curriculum: request.syllabus,
        level: request.level,
        subject: request.topic,
        focus: mainFocus,
        pace: paceLabel,
        worksheetCount
      },
      focusCards: [
        {
          label: "Weak topic",
          value: mainFocus
        },
        {
          label: "Second priority",
          value: secondaryFocus
        },
        {
          label: "Main trap",
          value: profile.trap
        },
        {
          label: "Practice target",
          value: `${worksheetCount} worksheet questions plus Foundation, Core, and Stretch quiz lanes`
        }
      ],
      days: [
        {
          title: "Day 1: Diagnose the gap",
          goal: `Confirm what the student already knows about ${mainFocus}.`,
          tasks: [
            "Read the coverage checklist and highlight unfamiliar terms.",
            "Answer the Foundation quiz lane without notes.",
            "Write down every missed concept as a weak-area list."
          ]
        },
        {
          title: "Day 2: Rebuild the core idea",
          goal: `Make ${mainFocus} explainable in plain language.`,
          tasks: [
            "Study the first two notes cards slowly.",
            "Create one short definition, one example, and one non-example.",
            "Retake missed Foundation questions until the explanation is clean."
          ]
        },
        {
          title: "Day 3: Add worked examples",
          goal: `Connect ${mainFocus} to standard question wording.`,
          tasks: [
            "Use the concept map to explain the process or method out loud.",
            "Complete half of the worksheet questions without timing.",
            "Check each answer against the answer key and rewrite weak steps."
          ]
        },
        {
          title: "Day 4: Fix common mistakes",
          goal: `Attack the trap: ${profile.trap}.`,
          tasks: [
            "Review all wrong answers from Days 1-3.",
            "Write why each wrong answer was tempting.",
            "Complete the Core quiz lane and replay misses."
          ]
        },
        {
          title: "Day 5: Exam-style practice",
          goal: `Move from understanding to usable exam performance in ${contentTopic}.`,
          tasks: [
            "Finish the remaining worksheet questions.",
            "Mark the worksheet or upload it for marking if the bridge is available.",
            "Turn feedback into a three-point correction list."
          ]
        },
        {
          title: "Day 6: Timed retest",
          goal: "Check whether the skill survives time pressure.",
          tasks: [
            "Redo selected worksheet questions under time.",
            "Complete the Stretch quiz lane.",
            "Review only the questions that still feel uncertain."
          ]
        },
        {
          title: "Day 7: Parent review and next plan",
          goal: "Summarize progress and choose the next weak topic.",
          tasks: [
            "Review quiz misses, worksheet corrections, and notes highlights.",
            "Write a one-paragraph student summary: mastered, improving, still weak.",
            "Select the next topic/subtopic in IC Educate and generate the next plan."
          ]
        }
      ]
    };
  }

  function buildStudyPack(request) {
    const contentTopic = contentTopicForRequest(request);
    const profile = buildTopicProfile(contentTopic);
    const focusItems = buildFocusItems(request, profile);
    const importantPoints = buildImportantPoints(request, profile, focusItems);
    const noteCards = buildNoteCards(request, profile, focusItems);
    const quizLanes = buildQuizLanes(request, profile, focusItems);
    const worksheet = buildWorksheet(request, profile, focusItems);
    const studyPlan = buildSevenDayPlan(request, profile, focusItems, worksheet);
    const totalQuestions = Object.values(quizLanes).reduce((sum, lane) => sum + lane.length, 0);

    return {
      id: `pack-${slugify(contentTopic)}-${Date.now()}`,
      cacheKey: buildRequestKey(request),
      generatedAt: new Date().toISOString(),
      source: "local",
      request,
      recommendations: state.recommendations,
      title: `${contentTopic} Study Pack`,
      subtitle: `${request.syllabus} | ${request.level} | ${request.topic} | ${contentSubtopicForRequest(request)}`,
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
      studyPlan,
      worksheet
    };
  }

  function normalizeAiPack(rawPack, request) {
    const contentTopic = contentTopicForRequest(request);
    const profile = buildTopicProfile(contentTopic);
    const focusItems = Array.isArray(rawPack?.notes?.focusItems) && rawPack.notes.focusItems.length
      ? rawPack.notes.focusItems
      : buildFocusItems(request, profile);
    const noteCards = Array.isArray(rawPack?.notes?.noteCards) ? [...rawPack.notes.noteCards] : [];
    const coverageCard = buildCoverageChecklistCard(request);
    if (coverageCard) {
      if (noteCards.length) {
        noteCards[0] = coverageCard;
      } else {
        noteCards.push(coverageCard);
      }
    }
    const coverageImportantPoint = requestCoverageLabels(request).length
      ? `Coverage checklist: ${requestCoverageLabels(request).join("; ")}.`
      : "";
    const importantPoints = [
      coverageImportantPoint,
      ...(Array.isArray(rawPack?.notes?.importantPoints) ? rawPack.notes.importantPoints : [])
    ].filter(Boolean);
    const quizLanes = rawPack?.quiz?.lanes || {};
    const normalizedLanes = {
      Foundation: Array.isArray(quizLanes.Foundation) ? quizLanes.Foundation : [],
      Core: Array.isArray(quizLanes.Core) ? quizLanes.Core : [],
      Stretch: Array.isArray(quizLanes.Stretch) ? quizLanes.Stretch : []
    };
    const totalQuestions = Object.values(normalizedLanes).reduce((sum, lane) => sum + lane.length, 0);
    const worksheet = rawPack?.worksheet || {};
    const answerKeyLines = Array.isArray(worksheet.answerKeyLines) ? worksheet.answerKeyLines : [];

    const normalizedWorksheet = {
      intro: safeText(worksheet.intro) || `Extra practice for ${contentTopic}.`,
      questions: Array.isArray(worksheet.questions) ? worksheet.questions : [],
      answerKeyLines,
      rubricText: safeText(worksheet.rubricText) || answerKeyLines.join("\n\n"),
      generatorScript: safeText(worksheet.generatorScript),
      generatorCommand: safeText(worksheet.generatorCommand),
      scriptNote: safeText(worksheet.scriptNote),
      generatedPdfUrl: resolveApiUrl(
        worksheet.generatedPdfUrl
        || rawPack?.result?.output?.pdfPathLocalUrl
        || rawPack?.result?.output?.pdfUrlAbsolute
        || rawPack?.result?.output?.pdfUrl
      ),
      generatedAnswerKeyUrl: resolveApiUrl(
        worksheet.generatedAnswerKeyUrl
        || rawPack?.result?.output?.answerKeyLocalUrl
        || rawPack?.result?.output?.answerKeyPdfUrlAbsolute
        || rawPack?.result?.output?.markSchemePdfUrl
      )
    };

    return {
      id: safeText(rawPack.id) || `pack-${slugify(contentTopic)}-${Date.now()}`,
      cacheKey: buildRequestKey(request),
      generatedAt: safeText(rawPack.generatedAt) || new Date().toISOString(),
      source: safeText(rawPack.provider, "ai"),
      request,
      recommendations: rawPack.recommendations || state.recommendations || null,
      title: safeText(rawPack.title) || `${contentTopic} Study Pack`,
      subtitle: safeText(rawPack.subtitle) || `${request.syllabus} | ${request.level} | ${request.topic} | ${contentSubtopicForRequest(request)}`,
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
      studyPlan: rawPack.studyPlan || buildSevenDayPlan(request, profile, focusItems, normalizedWorksheet),
      worksheet: normalizedWorksheet
    };
  }

  function buildPrebuiltPack(request) {
    const finder = window.IC_EDUCATE_PREBUILT_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
  }

  function buildGeneratedSciencePack(request) {
    const finder = window.IC_EDUCATE_GENERATED_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
  }

  function buildOfficialIgcseSubjectPack(request) {
    const finder = window.IC_EDUCATE_OFFICIAL_IGCSE_SUBJECT_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
  }

  function buildOfficialCambridgeALevelSubjectPack(request) {
    const finder = window.IC_EDUCATE_OFFICIAL_A_LEVEL_SUBJECT_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
  }

  function buildOfficialCambridgePrimaryLowerSecondaryPack(request) {
    const finder = window.IC_EDUCATE_CAMBRIDGE_PRIMARY_LOWER_SECONDARY_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
  }

  function buildHkdsePack(request) {
    const finder = window.IC_EDUCATE_HKDSE_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
  }

  function buildOxfordAqaPack(request) {
    const finder = window.IC_EDUCATE_OXFORDAQA_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
  }

  function buildSpmKssmPack(request) {
    const finder = window.IC_EDUCATE_SPM_KSSM_PACKS?.find;
    if (typeof finder !== "function") {
      return null;
    }
    try {
      const rawPack = finder(request);
      if (!rawPack) {
        return null;
      }
      const pack = normalizeAiPack(rawPack, request);
      return packHasRenderableStudyContent(pack) ? pack : null;
    } catch (error) {
      return null;
    }
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
      state.bridgeGeneratorScript = safeText(payload.generatorScript);
      state.aiGenerationReady = Boolean(payload.studyPackGenerationConfigured);
      state.uploadMarkingReady = Boolean(payload.uploadMarkingConfigured || payload.geminiConfigured || payload.deepseekConfigured);
      const providerHint = payload.geminiConfigured
        ? `${payload.geminiModel || "Gemini 2.5 Flash"} thinking marking ready`
        : payload.deepseekConfigured
          ? "DeepSeek marking ready"
          : "Bridge online, but API keys still needed for upload marking";
      setBridgeStatus(true, providerHint);
      await loadOfficialTopicOptions();
      await loadRecommendations();
    } catch (error) {
      state.aiGenerationReady = false;
      state.uploadMarkingReady = false;
      state.bridgeGeneratorScript = "";
      const publicSite = window.location.hostname.endsWith("github.io");
      const usingBundledSnapshot = applyBundledSnapshot();
      const libraryCount = Number(state.librarySummary?.count) || 0;
      const snapshotStats = state.catalogStats || {};
      setBridgeStatus(
        false,
        usingBundledSnapshot
          ? `Using bundled library snapshot: ${snapshotStats.syllabusCount || 0} syllabi, ${snapshotStats.subjectCount || 0} subjects, ${snapshotStats.topicPackCount || 0} topic packs${libraryCount ? ` from ${libraryCount.toLocaleString()} library files` : ""}. Upload marking still needs the local bridge or a deployed API backend.`
          : publicSite
            ? "Upload marking needs the local bridge or a deployed API backend; this public page cannot reach your private computer automatically."
            : "Autograder offline. Start the local bridge to enable upload marking."
      );
      if (usingBundledSnapshot) {
        const request = readRequestFromForm();
        fillSelect(elements.syllabusSelect, Object.keys(state.catalog));
        if (Object.keys(state.catalog).includes(request.syllabus)) {
          elements.syllabusSelect.value = request.syllabus;
        }
        syncLevelOptions(request.level);
        syncTopicOptions(request.topic);
        syncChapterOptions(request.chapterIds || request.chapterId);
        syncSubtopicOptions(request.subtopicIds || request.subtopicId);
        syncLearningTargetOptions(request.learningTargets || request.learningTarget);
      }
      state.topicalOptions = [];
      renderOfficialTopicChoices();
    }
    if (state.currentPack) {
      renderWorksheet(state.currentPack);
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
    if (source === "prebuilt") {
      elements.cacheStatus.textContent = `Loaded from prebuilt cache | ${time}`;
      elements.packMeta.textContent = "Prebuilt cache";
      return;
    }
    if (source === "generated") {
      elements.cacheStatus.textContent = `Loaded from generated science bundle | ${time}`;
      elements.packMeta.textContent = "Generated science bundle";
      return;
    }
    if (source === "official") {
      elements.cacheStatus.textContent = `Loaded from official syllabus bundle | ${time}`;
      elements.packMeta.textContent = "Official syllabus bundle";
      return;
    }
    if (source === "a-level") {
      elements.cacheStatus.textContent = `Loaded from Cambridge AS/A Level syllabus bundle | ${time}`;
      elements.packMeta.textContent = "Cambridge AS/A Level syllabus bundle";
      return;
    }
    if (source === "cambridge-curriculum") {
      elements.cacheStatus.textContent = `Loaded from Cambridge Primary/Lower Secondary bundle | ${time}`;
      elements.packMeta.textContent = "Cambridge Primary/Lower Secondary bundle";
      return;
    }
    if (source === "hkdse") {
      elements.cacheStatus.textContent = `Loaded from HKEAA HKDSE bundle | ${time}`;
      elements.packMeta.textContent = "HKEAA HKDSE bundle";
      return;
    }
    if (source === "oxfordaqa") {
      elements.cacheStatus.textContent = `Loaded from OxfordAQA specification bundle | ${time}`;
      elements.packMeta.textContent = "OxfordAQA specification bundle";
      return;
    }
    if (source === "spm") {
      elements.cacheStatus.textContent = `Loaded from SPM/KSSM DSKP bundle | ${time}`;
      elements.packMeta.textContent = "SPM/KSSM DSKP bundle";
      return;
    }
    const sourceLabel = pack.source && pack.source !== "local" ? `AI generated (${pack.source})` : "Freshly generated";
    elements.cacheStatus.textContent = `${sourceLabel} | ${time}`;
    elements.packMeta.textContent = sourceLabel;
  }

  function buildPackSummary(pack) {
    const request = pack?.request || {};
    const coverageCount = requestCoverageLabels(request).length;
    const focusItems = splitIdeas(request.focus || "");
    const parts = [
      safeText(request.syllabus),
      safeText(request.level),
      safeText(request.topic)
    ].filter(Boolean);

    if (coverageCount) {
      parts.push(`${coverageCount} selected point${coverageCount === 1 ? "" : "s"}`);
    }
    if (focusItems.length) {
      const preview = focusItems.slice(0, 2).join(", ");
      const suffix = focusItems.length > 2 ? ` +${focusItems.length - 2} more` : "";
      parts.push(`Focus: ${preview}${suffix}`);
    }
    return parts.join(" | ");
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
    elements.planPanel.hidden = tabName !== "plan";
  }

  function ensureStudyPlan(pack) {
    if (pack?.studyPlan?.days?.length) {
      return pack.studyPlan;
    }
    const request = pack?.request || {};
    const contentTopic = contentTopicForRequest(request);
    const profile = buildTopicProfile(contentTopic);
    const focusItems = Array.isArray(pack?.notes?.focusItems) && pack.notes.focusItems.length
      ? pack.notes.focusItems
      : buildFocusItems(request, profile);
    const plan = buildSevenDayPlan(request, profile, focusItems, pack?.worksheet || {});
    pack.studyPlan = plan;
    return plan;
  }

  function renderStudyPlan(pack) {
    const plan = ensureStudyPlan(pack);
    const days = Array.isArray(plan.days) ? plan.days : [];
    const focusCards = Array.isArray(plan.focusCards) ? plan.focusCards : [];
    elements.planMeta.textContent = `${days.length || 7} days`;
    elements.planIntro.textContent = safeText(plan.intro) || "A 7-day plan has been generated from the selected topics and weak areas.";
    elements.planFocusGrid.innerHTML = focusCards
      .map(
        (card) => `
          <article class="plan-focus-card">
            <span>${escapeHtml(card.label)}</span>
            <strong>${escapeHtml(card.value)}</strong>
          </article>
        `
      )
      .join("");
    elements.planDayList.innerHTML = days
      .map(
        (day, index) => `
          <li class="plan-day-card">
            <div class="plan-day-index">${index + 1}</div>
            <div>
              <h3>${escapeHtml(day.title)}</h3>
              <p class="hub-copy">${escapeHtml(day.goal)}</p>
              <ul class="point-list">
                ${(Array.isArray(day.tasks) ? day.tasks : []).map((task) => `<li>${escapeHtml(task)}</li>`).join("")}
              </ul>
            </div>
          </li>
        `
      )
      .join("");
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

    const generatedPdfUrl = resolveApiUrl(pack.worksheet.generatedPdfUrl);
    const generatedAnswerKeyUrl = resolveApiUrl(pack.worksheet.generatedAnswerKeyUrl);
    const canGenerateOfficial = canGenerateOfficialWorksheet(pack.request);
    const command = safeText(pack.worksheet.generatorCommand);
    const generatorScript = safeText(pack.worksheet.generatorScript || state.bridgeGeneratorScript);
    const note = safeText(pack.worksheet.scriptNote);
    if (command || generatorScript) {
      elements.worksheetScriptWrap.hidden = false;
      elements.worksheetScriptNote.textContent = command
        ? note || "This exam-style PDF came from the local Python topical paper generator."
        : "Local Python script path for exam-style worksheet generation.";
      elements.worksheetScriptCommand.textContent = command || generatorScript;
    } else {
      elements.worksheetScriptWrap.hidden = true;
      elements.worksheetScriptNote.textContent = "The local Python script used for this worksheet will appear here.";
      elements.worksheetScriptCommand.textContent = "";
    }

    elements.generateExamStyleButton.disabled = !canGenerateOfficial;
    elements.downloadGeneratedWorksheetButton.disabled = !generatedPdfUrl;
    elements.downloadAnswerKeyButton.textContent = generatedAnswerKeyUrl ? "Download official answer key" : "Download answer key";

    if (generatedPdfUrl) {
      elements.worksheetActionStatus.textContent = "Exam-style PDF generated from the local Python script. You can download it again any time.";
    } else if (!state.bridgeOnline) {
      elements.worksheetActionStatus.textContent = "Quick PDF and print view work now. Start the local bridge to generate official exam-style PDFs.";
    } else if (!canGenerateOfficial) {
      elements.worksheetActionStatus.textContent = "Select supported official syllabus topics to generate an exam-style PDF from the local Python script.";
    } else {
      elements.worksheetActionStatus.textContent = "Generate the exam-style PDF from the local Python script, then download the finished file.";
    }
  }

  function renderPack(pack, source) {
    state.currentPack = pack;
    initializeQuizSessions(pack);
    elements.studyWorkspace.hidden = false;
    elements.packTitle.textContent = pack.title;
    elements.packSubtitle.textContent = buildPackSummary(pack);
    if (!pack.studyPlan?.days?.length) {
      ensureStudyPlan(pack);
      persistCurrentPack();
    }
    elements.planCount.textContent = String(pack.studyPlan?.days?.length || 7);
    elements.notesCount.textContent = String(pack.notes.noteCards.length);
    elements.questionCount.textContent = String(pack.quiz.totalQuestions);
    if (elements.worksheetCount) {
      elements.worksheetCount.textContent = String(pack.worksheet.questions.length);
    }
    renderStudyPlan(pack);
    renderNotes(pack);
    renderQuiz();
    renderWorksheet(pack);
    updateCacheStatus(source, pack);
    setActiveTab("plan");
    window.localStorage.setItem(LAST_PACK_KEY, pack.cacheKey);
  }

  async function generateOrLoadPack(request) {
    const key = buildRequestKey(request);
    const store = loadCacheStore();
    if (store[key] && packHasRenderableStudyContent(store[key])) {
      renderPack(store[key], "cache");
      return;
    }
    if (store[key]) {
      delete store[key];
      saveCacheStore(store);
    }

    let pack;
    const prebuiltPack = buildPrebuiltPack(request);
    if (prebuiltPack) {
      store[key] = prebuiltPack;
      saveCacheStore(store);
      renderPack(prebuiltPack, "prebuilt");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const generatedSciencePack = buildGeneratedSciencePack(request);
    if (generatedSciencePack) {
      store[key] = generatedSciencePack;
      saveCacheStore(store);
      renderPack(generatedSciencePack, "generated");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const officialIgcsePack = buildOfficialIgcseSubjectPack(request);
    if (officialIgcsePack) {
      store[key] = officialIgcsePack;
      saveCacheStore(store);
      renderPack(officialIgcsePack, "official");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const officialCambridgeALevelPack = buildOfficialCambridgeALevelSubjectPack(request);
    if (officialCambridgeALevelPack) {
      store[key] = officialCambridgeALevelPack;
      saveCacheStore(store);
      renderPack(officialCambridgeALevelPack, "a-level");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const officialCambridgePrimaryLowerSecondaryPack = buildOfficialCambridgePrimaryLowerSecondaryPack(request);
    if (officialCambridgePrimaryLowerSecondaryPack) {
      store[key] = officialCambridgePrimaryLowerSecondaryPack;
      saveCacheStore(store);
      renderPack(officialCambridgePrimaryLowerSecondaryPack, "cambridge-curriculum");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const hkdsePack = buildHkdsePack(request);
    if (hkdsePack) {
      store[key] = hkdsePack;
      saveCacheStore(store);
      renderPack(hkdsePack, "hkdse");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const oxfordAqaPack = buildOxfordAqaPack(request);
    if (oxfordAqaPack) {
      store[key] = oxfordAqaPack;
      saveCacheStore(store);
      renderPack(oxfordAqaPack, "oxfordaqa");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const spmKssmPack = buildSpmKssmPack(request);
    if (spmKssmPack) {
      store[key] = spmKssmPack;
      saveCacheStore(store);
      renderPack(spmKssmPack, "spm");
      elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

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
            topic: contentTopicForRequest(request),
            subject: request.topic,
            subtopic: contentSubtopicForRequest(request),
            chapterIds: request.chapterIds,
            chapterId: request.chapterId,
            chapterTitle: request.chapterTitle,
            subtopicIds: request.subtopicIds,
            subtopicId: request.subtopicId,
            selectedSyllabusCoverage: request.selectedSyllabusCoverage,
            coverageLabels: request.coverageLabels,
            learningTargets: request.learningTargets,
            learningTarget: request.learningTarget,
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
        if (!packHasRenderableStudyContent(pack)) {
          throw new Error("AI generation returned no renderable notes or quiz questions.");
        }
      } catch (error) {
        pack = buildStudyPack(request);
        pack.fallbackReason = safeText(error.message || "AI generation failed");
      } finally {
        elements.generateButton.disabled = false;
        elements.generateButton.textContent = "Generate 7-day plan";
      }
    } else {
      pack = buildStudyPack(request);
    }

    store[key] = pack;
    saveCacheStore(store);
    renderPack(pack, "fresh");
    elements.studyWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
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

  async function downloadRemoteFile(url, fileName) {
    const resolvedUrl = resolveApiUrl(url);
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`Could not download ${fileName || "the file"} (HTTP ${response.status}).`);
    }
    const blob = await response.blob();
    downloadBlob(blob, fileName || fileNameFromUrl(resolvedUrl, "worksheet.pdf"));
    return resolvedUrl;
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
    elements.worksheetActionStatus.textContent = "Quick worksheet PDF downloaded from the current study pack.";
  }

  async function generateExamStyleWorksheet() {
    if (!state.currentPack) {
      return null;
    }
    const request = state.currentPack.request;
    const subject = generatorSubjectForRequest(request);
    const topicIds = (request.topicIds || []).filter(Boolean);
    if (!state.bridgeOnline || !subject || !topicIds.length) {
      return null;
    }

    const chosenTitles = state.topicalOptions
      .filter((option) => topicIds.includes(option.id))
      .map((option) => option.title);

    try {
      elements.generateExamStyleButton.disabled = true;
      elements.generateExamStyleButton.textContent = "Generating exam-style PDF...";
      elements.worksheetActionStatus.textContent = "Generating the official exam-style PDF from the local Python script...";
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
          subtopicIds: request.subtopicIds,
          selectedSyllabusCoverage: request.selectedSyllabusCoverage,
          coverageLabels: request.coverageLabels,
          worksheetLength: request.worksheetLength
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }
      state.currentPack.worksheet.generatorScript = safeText(payload?.generatorScript) || state.bridgeGeneratorScript;
      state.currentPack.worksheet.generatorCommand = safeText(payload?.generatorCommand);
      const targetMarks = Number(payload?.targetMarks) || Number(payload?.result?.generator?.targetMarks) || 0;
      const selectedSubtopicCount = Number(payload?.selectedSubtopicCount) || 0;
      const marksPerSubtopic = Number(payload?.marksPerSubtopic) || 0;
      state.currentPack.worksheet.scriptNote = targetMarks && selectedSubtopicCount && marksPerSubtopic
        ? `Generated by the local topical paper script using ${selectedSubtopicCount} selected subtopics at ${marksPerSubtopic} marks each (${targetMarks} target marks total).`
        : "Generated by the local topical paper script using the selected official syllabus topics.";
      const pdfUrl = resolveApiUrl(payload?.result?.output?.pdfPathLocalUrl || payload?.result?.output?.pdfUrlAbsolute || payload?.result?.output?.pdfUrl);
      const answerKeyUrl = resolveApiUrl(payload?.result?.output?.answerKeyLocalUrl || payload?.result?.output?.answerKeyPdfUrlAbsolute || payload?.result?.output?.markSchemePdfUrl);
      if (!pdfUrl) {
        throw new Error("No generated worksheet PDF URL returned.");
      }
      state.currentPack.worksheet.generatedPdfUrl = pdfUrl;
      state.currentPack.worksheet.generatedPdfName = fileNameFromUrl(pdfUrl, `${slugify(state.currentPack.title)}-exam-style.pdf`);
      state.currentPack.worksheet.generatedAnswerKeyUrl = answerKeyUrl;
      state.currentPack.worksheet.generatedAnswerKeyName = fileNameFromUrl(answerKeyUrl, `${slugify(state.currentPack.title)}-answer-key.pdf`);
      persistCurrentPack();
      renderWorksheet(state.currentPack);
      return {
        pdfUrl,
        answerKeyUrl,
      };
    } catch (error) {
      elements.worksheetActionStatus.textContent = safeText(error.message, "Could not generate the exam-style PDF.");
      return null;
    } finally {
      renderWorksheet(state.currentPack);
      elements.generateExamStyleButton.textContent = "Generate exam-style PDF";
    }
  }

  async function downloadGeneratedExamStyleWorksheet() {
    if (!state.currentPack) {
      return;
    }
    let url = resolveApiUrl(state.currentPack.worksheet.generatedPdfUrl);
    if (!url) {
      const generated = await generateExamStyleWorksheet();
      url = resolveApiUrl(generated?.pdfUrl);
    }
    if (!url) {
      return;
    }
    const fileName = safeText(state.currentPack.worksheet.generatedPdfName) || fileNameFromUrl(url, `${slugify(state.currentPack.title)}-exam-style.pdf`);
    try {
      elements.downloadGeneratedWorksheetButton.disabled = true;
      elements.downloadGeneratedWorksheetButton.textContent = "Downloading exam-style PDF...";
      await downloadRemoteFile(url, fileName);
      elements.worksheetActionStatus.textContent = "Exam-style PDF downloaded.";
    } catch (error) {
      elements.worksheetActionStatus.textContent = safeText(error.message, "Could not download the exam-style PDF.");
    } finally {
      renderWorksheet(state.currentPack);
      elements.downloadGeneratedWorksheetButton.textContent = "Download generated exam PDF";
    }
  }

  async function downloadAnswerKeyPdf() {
    if (!state.currentPack) {
      return;
    }
    const pack = state.currentPack;
    const answerKeyUrl = resolveApiUrl(pack.worksheet.generatedAnswerKeyUrl);
    if (answerKeyUrl) {
      const fileName = safeText(pack.worksheet.generatedAnswerKeyName) || fileNameFromUrl(answerKeyUrl, `${slugify(pack.title)}-answer-key.pdf`);
      try {
        elements.downloadAnswerKeyButton.disabled = true;
        elements.downloadAnswerKeyButton.textContent = "Downloading official answer key...";
        await downloadRemoteFile(answerKeyUrl, fileName);
        elements.worksheetActionStatus.textContent = "Official answer key downloaded.";
        return;
      } catch (error) {
        elements.worksheetActionStatus.textContent = safeText(error.message, "Could not download the official answer key.");
      } finally {
        renderWorksheet(state.currentPack);
      }
    }
    const blob = buildPdfBlob(`${pack.title} Answer Key`, `${pack.subtitle} | Marking points`, pack.worksheet.answerKeyLines);
    downloadBlob(blob, `${slugify(pack.title)}-answer-key.pdf`);
    elements.worksheetActionStatus.textContent = "Answer key downloaded.";
  }

  function openPrintView() {
    if (!state.currentPack) {
      return;
    }

    const pack = state.currentPack;
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
    const html = `
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
          window.addEventListener("load", function () {
            window.focus();
            window.setTimeout(function () { window.print(); }, 120);
          });
        <\/script>
      </body>
      </html>
    `;
    const popupUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const popup = window.open(popupUrl, "_blank");
    if (!popup) {
      elements.worksheetActionStatus.textContent = "Print preview was blocked. Allow pop-ups for this site and try again.";
      window.setTimeout(() => URL.revokeObjectURL(popupUrl), 60000);
      return;
    }
    elements.worksheetActionStatus.textContent = "Print preview opened in a new tab.";
    window.setTimeout(() => URL.revokeObjectURL(popupUrl), 60000);
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
      const message = window.location.hostname.endsWith("github.io")
        ? "Upload marking needs a reachable backend. On this GitHub Pages link, start your local bridge on this computer or deploy the bridge API, then upload again."
        : "The local autograder bridge is offline. Start it, then upload again.";
      renderMarkingResult(`<p class="hub-copy">${escapeHtml(message)}</p>`);
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
        topic: contentTopicForRequest(state.currentPack.request),
        subtopic: contentSubtopicForRequest(state.currentPack.request),
        description: state.currentPack.request.goal,
        answerFormat: "Worksheet upload",
        markScheme: state.currentPack.worksheet.rubricText,
        rubric: state.currentPack.worksheet.rubricText,
        preferredProvider: "gemini",
        preferredModel: "gemini-2.5-flash",
        thinkingBudget: -1,
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
          <p><strong>Provider:</strong> ${escapeHtml(result.provider || "Gemini")} ${result.model ? `(${escapeHtml(result.model)})` : ""}</p>
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
    if (!packHasRenderableStudyContent(pack)) {
      removeCachedPack(lastKey);
      return;
    }
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
      syncChapterOptions();
      syncSubtopicOptions();
      syncLearningTargetOptions();
      await loadOfficialTopicOptions();
      await loadRecommendations();
    });
    elements.chapterSelect.addEventListener("change", async () => {
      syncSubtopicOptions();
      syncLearningTargetOptions();
      await loadRecommendations();
    });
    elements.subtopicSelect.addEventListener("change", async () => {
      syncLearningTargetOptions();
      await loadRecommendations();
    });
    elements.learningTargetSelect.addEventListener("change", async () => {
      syncSubtopicFromLearningTarget();
      await loadRecommendations();
    });
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
    elements.generateExamStyleButton.addEventListener("click", generateExamStyleWorksheet);
    elements.downloadGeneratedWorksheetButton.addEventListener("click", downloadGeneratedExamStyleWorksheet);
    elements.downloadWorksheetButton.addEventListener("click", downloadWorksheetPdf);
    elements.printWorksheetButton.addEventListener("click", openPrintView);
    elements.downloadAnswerKeyButton.addEventListener("click", downloadAnswerKeyPdf);
    elements.markWorksheetButton.addEventListener("click", markUploadedWorksheet);
  }

  function initializeForm() {
    applyBundledSnapshot();
    const request = defaultRequest();
    fillSelect(elements.syllabusSelect, Object.keys(state.catalog || CATALOG));
    elements.syllabusSelect.value = request.syllabus;
    syncLevelOptions(request.level);
    syncTopicOptions(request.topic);
    syncChapterOptions(request.chapterIds || request.chapterId);
    syncSubtopicOptions(request.subtopicIds || request.subtopicId);
    syncLearningTargetOptions(request.learningTargets || request.learningTarget || request.goal);
    elements.paceSelect.value = request.pace;
    elements.worksheetLengthSelect.value = String(request.worksheetLength);
    elements.focusInput.value = request.focus || "";
    renderOfficialTopicChoices();
  }

  async function initializeMotionRuntime() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      const { animate, hover, stagger, inView } = await import("https://cdn.jsdelivr.net/npm/motion@latest/+esm");
      document.documentElement.classList.add("motion-ready");

      animate(
        ".study-hero, .study-builder-card, .study-hero-status .study-pill",
        { opacity: [0, 1], y: [20, 0], filter: ["blur(10px)", "blur(0px)"] },
        { duration: 0.72, delay: stagger(0.08), easing: [0.16, 1, 0.3, 1] }
      );

      inView(".panel-card, .summary-card, .study-panel", (element) => {
        animate(element, { opacity: [0, 1], y: [24, 0] }, { duration: 0.64, easing: [0.16, 1, 0.3, 1] });
      }, { margin: "0px 0px -12% 0px" });

      document.querySelectorAll("button, .study-tab, .lane-pill, .summary-card").forEach((element) => {
        hover(element, () => {
          animate(element, { scale: 1.012 }, { type: "spring", stiffness: 430, damping: 31 });
          return () => animate(element, { scale: 1 }, { type: "spring", stiffness: 430, damping: 31 });
        });
      });
    } catch (error) {
      document.documentElement.classList.remove("motion-ready");
    }
  }

  initializeForm();
  bindEvents();
  updateCacheStatus("", null);
  restoreLastPack();
  checkBridge();
  loadRecommendations();
  initializeMotionRuntime();
})();
