(function () {
  const STORAGE_KEY = "ice-generated-course-v1";
  const YEAR_START = 2020;
  const YEAR_SPAN = 7;

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "custom-course";
  }

  function titleCase(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function normalizeLine(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .replace(/^[\-\u2022\*\d\.\)\(]+/, "")
      .trim();
  }

  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function splitFreeText(value) {
    return unique(
      String(value || "")
        .replace(/\r/g, "")
        .replace(/[;|]/g, "\n")
        .replace(/\.\s+/g, ".\n")
        .split(/\n|,/)
        .map(normalizeLine)
        .filter((item) => item.length > 8)
    );
  }

  function normalizeRequest(raw) {
    const subject = titleCase(raw.subject || "Custom Study Track");
    const goal = normalizeLine(raw.goal || `Build working mastery in ${subject}`);
    const learnerLevel = raw.learnerLevel || "intermediate";
    const quizStyle = raw.quizStyle || "standalone";
    const moduleCount = Math.min(Math.max(Number(raw.moduleCount) || 6, 3), 8);
    const questionsPerModule = Math.min(Math.max(Number(raw.questionsPerModule) || 8, 4), 20);
    const focusAreas = splitFreeText(raw.focusAreas);
    const sourceText = splitFreeText(raw.sourceText);

    return {
      subject,
      goal,
      learnerLevel,
      quizStyle,
      moduleCount,
      questionsPerModule,
      focusAreas,
      sourceText
    };
  }

  function defaultFocusAreas(subject, goal) {
    return [
      `Core vocabulary and first principles for ${subject}`,
      `The main frameworks, methods, or models used in ${subject}`,
      `How ${subject} connects to ${goal.toLowerCase()}`,
      `Worked examples and application drills for ${subject}`,
      `Common mistakes, misconceptions, and traps in ${subject}`,
      `Review, retention, and self-testing for ${subject}`
    ];
  }

  function buildPointPool(request) {
    const seeded = unique([
      ...request.focusAreas,
      ...request.sourceText,
      ...defaultFocusAreas(request.subject, request.goal)
    ]);

    const minimumPoints = request.moduleCount * 4;
    const points = [...seeded];

    while (points.length < minimumPoints) {
      const index = points.length + 1;
      points.push(`${request.subject} practice focus ${index}: connect the idea to ${request.goal.toLowerCase()}`);
    }

    return points;
  }

  function chunkPoints(points, chunkCount) {
    const chunks = Array.from({ length: chunkCount }, () => []);
    points.forEach((point, index) => {
      chunks[index % chunkCount].push(point);
    });
    return chunks;
  }

  function buildModuleTitle(subject, points, index) {
    const seed = normalizeLine(points[0] || `${subject} module ${index + 1}`);
    const words = seed.split(/\s+/).slice(0, 6).join(" ");
    return titleCase(words || `${subject} Module ${index + 1}`);
  }

  function buildHighlights(subject, moduleTitle, points) {
    const [first, second, third] = points;
    return [
      {
        label: "High-yield trigger",
        text: `If a question mentions ${moduleTitle.toLowerCase()}, ground yourself in ${first || `the core language of ${subject}`}.`
      },
      {
        label: "Study lens",
        text: `Link ${moduleTitle.toLowerCase()} back to ${second || `the main process inside ${subject}`}.`
      },
      {
        label: "Watch for",
        text: third || `Loose definitions, skipped steps, and weak recall under pressure in ${subject}.`
      }
    ];
  }

  function buildSyllabus(subject, moduleTitle, points, goal) {
    const seedPoints = points.slice(0, 5);
    const syllabus = [
      `Explain the purpose of ${moduleTitle.toLowerCase()} inside ${subject}.`,
      ...seedPoints.map((point) => point.endsWith(".") ? point : `${point}.`),
      `Use this section to support the wider goal of ${goal.toLowerCase()}.`
    ];

    return unique(syllabus).slice(0, 5);
  }

  function buildNotes(subject, moduleTitle, points, request) {
    const keyPoints = points.slice(0, 4);

    return [
      {
        title: "What this module is trying to teach",
        points: [
          `${moduleTitle} is one part of the wider ${request.subject} track, so the goal is not isolated memorization but usable understanding.`,
          `Students should be able to describe the core idea in plain language, then connect it back to ${request.goal.toLowerCase()}.`,
          `This module should feel clear enough that you can recognize it in a question before you start solving.`
        ]
      },
      {
        title: "Key points pulled from the learning brief",
        points: keyPoints.map((point) => point.endsWith(".") ? point : `${point}.`)
      },
      {
        title: "How to study this section effectively",
        points: [
          `Start by rewriting the main idea of ${moduleTitle.toLowerCase()} in your own words before checking notes again.`,
          `Then turn each bullet into a short explain-out-loud drill so recall becomes active rather than passive.`,
          `Finish with a question pass and track which parts of ${subject} still feel shaky under time pressure.`
        ]
      }
    ];
  }

  function buildFormulas(subject, moduleTitle, points, goal) {
    const anchors = [
      `Define ${moduleTitle.toLowerCase()} in one sentence without using filler words.`,
      `Explain why ${moduleTitle.toLowerCase()} matters for ${goal.toLowerCase()}.`,
      `Turn the strongest bullet in this section into a flashcard prompt.`,
      `Ask what mistake a student is most likely to make in ${moduleTitle.toLowerCase()}.`
    ];

    if (points[0]) {
      anchors[2] = `Flashcard anchor: ${points[0]}`;
    }

    return anchors;
  }

  function buildSchedule(moduleTitle, request) {
    return [
      {
        title: "Step 1: Read the module map",
        detail: `Start by reading the chapter lens, syllabus bullets, and highlights so ${moduleTitle.toLowerCase()} has a clear frame before practice begins.`
      },
      {
        title: "Step 2: Build the notes pass",
        detail: "Rewrite the core bullets in your own words and keep only the lines you would actually want to recall under pressure."
      },
      {
        title: "Step 3: Do a slow first worksheet",
        detail: `Answer the first run of questions slowly and explain why each wrong option fails before moving on.`
      },
      {
        title: "Step 4: Replay only misses",
        detail: "Use the replay lane to revisit weak cards until the explanation feels automatic rather than lucky."
      },
      {
        title: "Step 5: Close with a clean retest",
        detail: `Retake the module after a gap so you know whether ${moduleTitle.toLowerCase()} is actually sticking for this ${request.learnerLevel}-level learner.`
      }
    ];
  }

  function difficultyForIndex(index, total, learnerLevel) {
    if (learnerLevel === "beginner") {
      return index < Math.ceil(total * 0.5) ? "Easy" : index < Math.ceil(total * 0.85) ? "Medium" : "Hard";
    }

    if (learnerLevel === "advanced") {
      return index < Math.ceil(total * 0.2) ? "Medium" : "Hard";
    }

    return index < Math.ceil(total * 0.3) ? "Easy" : index < Math.ceil(total * 0.75) ? "Medium" : "Hard";
  }

  function genericDistractors(subject, moduleTitle, goal) {
    return [
      `Memorize ${moduleTitle.toLowerCase()} without linking it back to ${subject}`,
      `Skip concept building and jump straight to final answers for ${goal.toLowerCase()}`,
      `Treat every question in ${moduleTitle.toLowerCase()} as identical even when the prompt changes`,
      `Rely on recognition only instead of active recall and explanation`
    ];
  }

  function arrangeChoices(correctChoice, distractors, seed) {
    const pool = unique([correctChoice, ...distractors]).slice(0, 3);
    while (pool.length < 3) {
      pool.push(`Distractor ${pool.length + 1}`);
    }

    const variants = [
      pool,
      [pool[1], pool[0], pool[2]],
      [pool[1], pool[2], pool[0]]
    ];

    const choices = variants[seed % variants.length];
    return {
      choices,
      answer: choices.findIndex((choice) => choice === correctChoice)
    };
  }

  function buildQuestionFromPoint(subject, moduleTitle, goal, point, distractors, index, total, learnerLevel, quizStyle, setIndex) {
    const year = YEAR_START + (index % YEAR_SPAN);
    const difficulty = difficultyForIndex(index, total, learnerLevel);
    const templates = [
      {
        prompt: `When a student is trying to master ${moduleTitle.toLowerCase()}, which move is most directly aligned with the learning brief?`,
        concept: `${moduleTitle} should be studied by connecting the idea to a usable explanation, not by passive recognition alone.`,
        correct: point,
        explanation: `This choice matches the study brief because it reinforces the exact point the module is trying to lock in: ${point}`
      },
      {
        prompt: `A student misses a quiz item on ${moduleTitle.toLowerCase()} because they cannot explain the concept clearly. What is the best first fix?`,
        concept: `Weak explanation usually means the core point was never turned into an active-recall step.`,
        correct: `Rewrite and explain this point aloud: ${point}`,
        explanation: `The best repair is to convert the point into an active explanation step rather than just rereading it.`
      },
      {
        prompt: `Which statement best captures a high-priority idea inside ${moduleTitle.toLowerCase()}?`,
        concept: `Each module should have a few anchor ideas that the learner can recognize quickly under pressure.`,
        correct: point,
        explanation: `This is the strongest answer because it directly reflects one of the module's anchored study points.`
      },
      {
        prompt: `If ${moduleTitle.toLowerCase()} shows up in a worksheet tied to ${goal.toLowerCase()}, what should the learner do first?`,
        concept: `A strong first move is to identify the core idea before trying to solve or guess.`,
        correct: `Name the core idea and connect it back to ${point.toLowerCase()}`,
        explanation: `The first step is framing the concept correctly so the rest of the question has structure.`
      },
      {
        prompt: `Which review action is most likely to make ${moduleTitle.toLowerCase()} stick after the first practice pass?`,
        concept: `Replay-based review works best when it targets the missed idea and forces a clean explanation.`,
        correct: `Replay the missed card and explain why ${point.toLowerCase()} is the key idea`,
        explanation: `This uses spaced replay the right way: revisit the exact weak point and explain it cleanly.`
      }
    ];

    const template = templates[index % templates.length];
    const arranged = arrangeChoices(template.correct, distractors, index);

    return {
      id: `${slugify(moduleTitle)}-custom-${index + 1}`,
      year,
      difficulty,
      setLabel: quizStyle === "case" ? `${moduleTitle} Set ${setIndex}` : `Practice Year ${year}`,
      caseTitle: quizStyle === "case" ? `${moduleTitle} Learning Case` : `${moduleTitle} Study Prompt`,
      caseText: quizStyle === "case"
        ? `A student is working through ${subject} with the goal of ${goal.toLowerCase()}. This item set focuses on ${moduleTitle.toLowerCase()} and asks whether the learner can connect the notes, the process, and the review fix cleanly.`
        : `This custom course question is based on the learner brief for ${subject} and is tagged to practice year ${year}.`,
      prompt: template.prompt,
      concept: template.concept,
      choices: arranged.choices,
      answer: arranged.answer,
      explanation: template.explanation
    };
  }

  function buildQuestions(subject, moduleTitle, points, request) {
    const total = request.questionsPerModule;
    const pointPool = unique([
      ...points,
      `The learner should connect ${moduleTitle.toLowerCase()} back to ${request.goal.toLowerCase()}`,
      `The learner should be able to explain ${moduleTitle.toLowerCase()} without reading notes`
    ]);

    const questions = [];
    for (let index = 0; index < total; index += 1) {
      const point = pointPool[index % pointPool.length];
      const distractors = unique([
        ...pointPool.filter((item) => item !== point).slice(0, 2),
        ...genericDistractors(subject, moduleTitle, request.goal)
      ]);

      questions.push(
        buildQuestionFromPoint(
          subject,
          moduleTitle,
          request.goal,
          point,
          distractors,
          index,
          total,
          request.learnerLevel,
          request.quizStyle,
          Math.floor(index / 3) + 1
        )
      );
    }

    return questions;
  }

  function buildCourse(rawRequest) {
    const request = normalizeRequest(rawRequest);
    const pointPool = buildPointPool(request);
    const chunks = chunkPoints(pointPool, request.moduleCount);
    const share = `${Math.max(5, Math.round(100 / request.moduleCount))}-${Math.min(25, Math.round(100 / request.moduleCount) + 4)}%`;
    const subjectSlug = slugify(request.subject);

    const chapters = chunks.map((points, index) => {
      const moduleTitle = buildModuleTitle(request.subject, points, index);
      const chapterId = `${subjectSlug}-${index + 1}`;
      const shortTitle = moduleTitle.split(/\s+/).slice(0, 2).join(" ");

      return {
        id: chapterId,
        title: moduleTitle,
        shortTitle,
        topic: request.subject,
        weight: share,
        blurb: `Use this module to move ${moduleTitle.toLowerCase()} from recognition to active recall.`,
        summary: `${moduleTitle} is part of a custom study track for ${request.subject}. This module is built around the learner goal of ${request.goal.toLowerCase()} and turns the brief into notes, practice, and replay review.`,
        teach: `Study ${moduleTitle.toLowerCase()} by defining the core idea, connecting it to the wider goal, and then testing it until the replay queue is clean.`,
        syllabus: buildSyllabus(request.subject, moduleTitle, points, request.goal),
        highlights: buildHighlights(request.subject, moduleTitle, points),
        notes: buildNotes(request.subject, moduleTitle, points, request),
        formulas: buildFormulas(request.subject, moduleTitle, points, request.goal),
        schedule: buildSchedule(moduleTitle, request),
        questions: buildQuestions(request.subject, moduleTitle, points, request)
      };
    });

    return {
      id: `custom-${subjectSlug}`,
      title: request.subject,
      label: `${request.subject} Custom Track`,
      heroLabel: "Student-built course",
      heroCopy: `Custom course for ${request.subject}. Goal: ${request.goal}.`,
      mapTitle: `${request.subject} Topic Map`,
      pathTitle: `${request.subject} Run`,
      practiceIntro: request.quizStyle === "case"
        ? `This custom course uses short case-style prompts tied to ${request.subject}.`
        : `This custom course uses standalone 3-choice questions tied to ${request.subject}.`,
      quizStyle: request.quizStyle,
      learnerLevel: request.learnerLevel,
      request,
      chapters,
      createdAt: new Date().toISOString()
    };
  }

  function saveCourse(course) {
    if (!window.localStorage) {
      return course;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(course));
    return course;
  }

  function loadCourse() {
    if (!window.localStorage) {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      return parsed && parsed.chapters ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function clearCourse() {
    if (window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function hasCourse() {
    return Boolean(loadCourse());
  }

  window.ICECourseGenerator = {
    STORAGE_KEY,
    buildCourse,
    saveCourse,
    loadCourse,
    clearCourse,
    hasCourse
  };
})();
