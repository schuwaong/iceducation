(function () {
  if (typeof window === "undefined") {
    return;
  }

  const WHOLE_CHAPTER_VALUE = "__whole_chapter__";
  const BIOLOGY_14_IDS = ["14.1", "14.2", "14.3", "14.4", "14.5"];

  function safeText(value) {
    return String(value ?? "").trim();
  }

  function slugify(value) {
    return safeText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "study-pack";
  }

  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function cycleTake(items, count) {
    if (!items.length) {
      return [];
    }
    return Array.from({ length: count }, (_, index) => items[index % items.length]);
  }

  const SUBTOPICS = {
    "14.1": {
      title: "Coordination and response",
      focus: "Nervous coordination, receptors, effectors, neurones, synapses, and reflex arcs",
      important: "The nervous system coordinates fast responses by carrying electrical impulses from receptors to effectors through neurones.",
      card: {
        title: "14.1 Coordination and response",
        points: [
          "A stimulus is a change in the environment; a receptor detects it and an effector carries out the response.",
          "Sensory neurones carry impulses from receptors to the central nervous system; motor neurones carry impulses to effectors.",
          "Relay neurones link sensory and motor neurones inside the central nervous system.",
          "A reflex arc gives a rapid automatic response and helps protect the body from harm."
        ]
      },
      quiz: {
        Foundation: [
          {
            prompt: "Which sequence best describes a simple nervous response?",
            concept: "Nervous coordination follows a receptor to coordinator to effector pathway.",
            choices: ["Receptor, coordinator, effector", "Effector, receptor, coordinator", "Coordinator, effector, receptor"],
            answer: 0,
            explanation: "The receptor detects the stimulus, the central nervous system coordinates, and the effector responds."
          },
          {
            prompt: "What is the role of a sensory neurone?",
            concept: "Neurone direction matters in reflex and response questions.",
            choices: ["Carry impulses to the central nervous system", "Carry impulses to muscles only", "Release hormones into blood"],
            answer: 0,
            explanation: "Sensory neurones carry impulses from receptors towards the central nervous system."
          },
          {
            prompt: "What happens at a synapse?",
            concept: "Synapses pass impulses between neurones using chemicals.",
            choices: ["Chemicals diffuse across a small gap", "Blood carries the impulse", "The neurones fuse into one cell"],
            answer: 0,
            explanation: "A neurotransmitter crosses the synapse and triggers an impulse in the next neurone."
          }
        ],
        Core: [
          {
            prompt: "Why are reflex actions useful?",
            concept: "Reflexes are fast protective responses.",
            choices: ["They protect the body before conscious thought", "They always involve hormones", "They slow responses so the brain can decide"],
            answer: 0,
            explanation: "A reflex response is automatic and rapid, which reduces damage from harmful stimuli."
          },
          {
            prompt: "In a reflex arc, where is the relay neurone found?",
            concept: "The relay neurone sits inside the central nervous system.",
            choices: ["Spinal cord or brain", "Skin receptor", "Muscle effector"],
            answer: 0,
            explanation: "Relay neurones connect sensory and motor neurones inside the central nervous system."
          },
          {
            prompt: "A hand touches a hot object. Which cell detects the heat stimulus?",
            concept: "Receptors detect stimuli before impulses are sent.",
            choices: ["Receptor cell in the skin", "Motor neurone in the arm", "Effector muscle"],
            answer: 0,
            explanation: "The receptor detects the heat stimulus and starts the nervous pathway."
          }
        ],
        Stretch: [
          {
            prompt: "Why can a reflex response happen before the person feels pain consciously?",
            concept: "Reflex arcs can use the spinal cord before conscious brain processing.",
            choices: ["The spinal cord coordinates the response first", "The pain signal is blocked forever", "Hormones reach the muscle first"],
            answer: 0,
            explanation: "The spinal cord can coordinate the reflex quickly while impulses also travel to the brain."
          },
          {
            prompt: "Which answer best compares nervous and hormonal coordination?",
            concept: "Nervous responses are usually faster and shorter-lived than hormonal responses.",
            choices: ["Nervous impulses are fast and targeted; hormones are slower and travel in blood", "Nervous impulses are slow and carried in blood", "Hormones only affect one cell at a time"],
            answer: 0,
            explanation: "Nervous coordination uses rapid impulses; hormones are chemical messengers carried by blood."
          },
          {
            prompt: "A synapse only passes impulses one way. What causes this?",
            concept: "Synapse structure makes transmission directional.",
            choices: ["Neurotransmitter is released from one side and receptors are on the next neurone", "Both neurones release equal hormones", "The gap contains muscle fibres"],
            answer: 0,
            explanation: "The sending neurone releases transmitter and the receiving neurone has matching receptors."
          }
        ]
      },
      worksheet: [
        { lane: "Foundation", marks: 2, prompt: "Define stimulus and response.", answerPoints: ["Stimulus is a change in the environment", "Response is an action caused by the stimulus"] },
        { lane: "Foundation", marks: 3, prompt: "Name the three neurone types in a reflex arc.", answerPoints: ["Sensory neurone", "Relay neurone", "Motor neurone"] },
        { lane: "Core", marks: 4, prompt: "Describe the pathway of a reflex action when a hand touches a hot object.", answerPoints: ["Receptor detects heat or pain", "Impulse travels through sensory and relay neurones", "Motor neurone carries impulse to muscle", "Muscle contracts and pulls hand away"] },
        { lane: "Stretch", marks: 3, prompt: "Explain why synapses slow impulses slightly but are still useful.", answerPoints: ["Transmitter must diffuse across the gap", "Synapses allow one-way transmission", "They help connect neurones in controlled pathways"] }
      ]
    },
    "14.2": {
      title: "Sense organs",
      focus: "Eye structure, retina, pupil reflex, and accommodation",
      important: "Sense organs contain receptor cells; the eye detects light and uses reflexes and accommodation to control vision.",
      card: {
        title: "14.2 Sense organs",
        points: [
          "The retina contains light-sensitive receptor cells that send impulses through the optic nerve.",
          "The iris changes pupil size: circular muscles constrict the pupil in bright light; radial muscles dilate it in dim light.",
          "For near vision, ciliary muscles contract, suspensory ligaments slacken, and the lens becomes thicker.",
          "For distant vision, ciliary muscles relax, suspensory ligaments tighten, and the lens becomes thinner."
        ]
      },
      quiz: {
        Foundation: [
          {
            prompt: "Which part of the eye contains light-sensitive receptor cells?",
            concept: "The retina is the light-detecting surface at the back of the eye.",
            choices: ["Retina", "Iris", "Cornea"],
            answer: 0,
            explanation: "The retina contains receptors that detect light and send impulses to the brain."
          },
          {
            prompt: "What is the function of the optic nerve?",
            concept: "The optic nerve carries impulses from eye to brain.",
            choices: ["Carry impulses to the brain", "Change pupil size", "Focus light before it enters the eye"],
            answer: 0,
            explanation: "The optic nerve carries impulses from the retina to the brain."
          },
          {
            prompt: "What happens to the pupil in bright light?",
            concept: "The pupil reflex controls how much light enters the eye.",
            choices: ["It constricts", "It dilates", "It changes into a lens"],
            answer: 0,
            explanation: "In bright light, circular muscles contract and the pupil becomes smaller."
          }
        ],
        Core: [
          {
            prompt: "What happens during accommodation for a near object?",
            concept: "Near vision needs a thicker lens to refract light more strongly.",
            choices: ["Ciliary muscles contract and the lens becomes thicker", "Ciliary muscles relax and the lens becomes thinner", "The retina moves forward"],
            answer: 0,
            explanation: "For near objects, ciliary muscles contract, ligaments slacken, and the lens becomes thicker."
          },
          {
            prompt: "Why does the pupil reflex protect the retina?",
            concept: "Reducing pupil size reduces light intensity on the retina.",
            choices: ["Less bright light enters the eye", "The lens stops refracting light", "The optic nerve disconnects"],
            answer: 0,
            explanation: "Constriction limits light entering the eye and helps protect light-sensitive cells."
          },
          {
            prompt: "Which eye structure refracts light most as it enters?",
            concept: "The cornea provides most initial refraction.",
            choices: ["Cornea", "Iris", "Blind spot"],
            answer: 0,
            explanation: "The cornea bends light as it enters the eye."
          }
        ],
        Stretch: [
          {
            prompt: "A student says the iris is the hole in the eye. What is the correction?",
            concept: "The iris is muscle tissue; the pupil is the opening.",
            choices: ["The pupil is the hole; the iris controls its size", "The lens is the hole; the pupil focuses light", "The retina is the hole; the iris detects colour"],
            answer: 0,
            explanation: "The pupil is the opening, and the iris controls how wide it is."
          },
          {
            prompt: "Why is the lens thicker for near objects?",
            concept: "Near objects need stronger refraction to focus light on the retina.",
            choices: ["A thicker lens refracts light more strongly", "A thicker lens blocks all light", "A thicker lens makes the retina move"],
            answer: 0,
            explanation: "The thicker lens bends light more so the image focuses on the retina."
          },
          {
            prompt: "What would happen if ciliary muscles could not contract properly?",
            concept: "Ciliary muscle contraction is needed for near accommodation.",
            choices: ["Near objects would be harder to focus", "The pupil would stay black", "The optic nerve would stop carrying impulses"],
            answer: 0,
            explanation: "Without contraction, the lens cannot become thick enough for near focus."
          }
        ]
      },
      worksheet: [
        { lane: "Foundation", marks: 3, prompt: "State the functions of the retina, iris, and optic nerve.", answerPoints: ["Retina detects light", "Iris controls pupil size", "Optic nerve carries impulses to the brain"] },
        { lane: "Foundation", marks: 2, prompt: "Describe what happens to the pupil in bright light.", answerPoints: ["Circular muscles contract", "Pupil becomes smaller so less light enters"] },
        { lane: "Core", marks: 4, prompt: "Describe accommodation for viewing a near object.", answerPoints: ["Ciliary muscles contract", "Suspensory ligaments slacken", "Lens becomes thicker or more convex", "Light is focused on the retina"] },
        { lane: "Stretch", marks: 3, prompt: "Explain why accommodation is needed when looking from a distant object to a near object.", answerPoints: ["Near light rays need stronger refraction", "Lens shape changes", "Image must focus sharply on the retina"] }
      ]
    },
    "14.3": {
      title: "Hormones",
      focus: "Endocrine glands, hormones in blood, insulin, glucagon, adrenaline, and sex hormones",
      important: "Hormones are chemical messengers released by endocrine glands and transported in the blood to target organs.",
      card: {
        title: "14.3 Hormones",
        points: [
          "Hormones are chemicals made by endocrine glands and carried in the blood.",
          "Adrenaline prepares the body for action by increasing heart rate, breathing rate, and glucose availability.",
          "Insulin lowers blood glucose by helping cells take up glucose and helping the liver store glycogen.",
          "Hormonal responses are usually slower than nervous responses but can last longer."
        ]
      },
      quiz: {
        Foundation: [
          {
            prompt: "What is a hormone?",
            concept: "Hormones are chemical messengers carried in blood.",
            choices: ["A chemical messenger carried in blood", "An electrical impulse in a neurone", "A receptor in the eye"],
            answer: 0,
            explanation: "Hormones are released by glands and carried in the blood to target organs."
          },
          {
            prompt: "Which gland releases insulin?",
            concept: "The pancreas controls blood glucose using insulin and glucagon.",
            choices: ["Pancreas", "Adrenal gland", "Pituitary gland"],
            answer: 0,
            explanation: "The pancreas releases insulin when blood glucose is too high."
          },
          {
            prompt: "Which hormone prepares the body for fight or flight?",
            concept: "Adrenaline supports rapid action during danger.",
            choices: ["Adrenaline", "Insulin", "Oestrogen"],
            answer: 0,
            explanation: "Adrenaline increases heart rate and helps prepare muscles for action."
          }
        ],
        Core: [
          {
            prompt: "How does insulin lower blood glucose concentration?",
            concept: "Insulin increases glucose uptake and storage.",
            choices: ["It helps cells take up glucose and the liver store glycogen", "It breaks down all glycogen into glucose", "It stops blood from moving"],
            answer: 0,
            explanation: "Insulin lowers blood glucose by promoting uptake by cells and storage as glycogen."
          },
          {
            prompt: "Why can hormones affect organs far from the gland that releases them?",
            concept: "Hormones travel through the bloodstream.",
            choices: ["They are transported in blood", "They jump across synapses", "They are carried by the optic nerve"],
            answer: 0,
            explanation: "Blood carries hormones around the body, but only target organs respond."
          },
          {
            prompt: "Which statement best describes an endocrine gland?",
            concept: "Endocrine glands release hormones into blood.",
            choices: ["It secretes hormones directly into the blood", "It sends impulses through neurones", "It filters light before it reaches the retina"],
            answer: 0,
            explanation: "Endocrine glands secrete hormones into the bloodstream."
          }
        ],
        Stretch: [
          {
            prompt: "Why are hormonal responses usually slower than nervous responses?",
            concept: "Hormones move in blood rather than along neurones.",
            choices: ["They must be transported through the bloodstream", "They travel through axons as impulses", "They only work inside the eye"],
            answer: 0,
            explanation: "Blood transport is slower than electrical impulses in neurones."
          },
          {
            prompt: "A person has very high blood glucose after meals. Which hormone may be lacking?",
            concept: "Insulin reduces blood glucose concentration.",
            choices: ["Insulin", "Adrenaline", "Testosterone"],
            answer: 0,
            explanation: "Lack of insulin can prevent normal glucose uptake and storage."
          },
          {
            prompt: "Which comparison between insulin and adrenaline is most accurate?",
            concept: "Different hormones have different target effects.",
            choices: ["Insulin lowers blood glucose; adrenaline prepares the body for action", "Both hormones only change pupil size", "Adrenaline stores glucose as glycogen after meals"],
            answer: 0,
            explanation: "Insulin is mainly for glucose control, while adrenaline supports fight or flight."
          }
        ]
      },
      worksheet: [
        { lane: "Foundation", marks: 2, prompt: "Define hormone and endocrine gland.", answerPoints: ["Hormone is a chemical messenger", "Endocrine gland secretes hormones into blood"] },
        { lane: "Foundation", marks: 2, prompt: "State two effects of adrenaline.", answerPoints: ["Increases heart rate", "Increases breathing rate or glucose availability"] },
        { lane: "Core", marks: 4, prompt: "Describe how insulin lowers blood glucose concentration.", answerPoints: ["Pancreas detects high blood glucose", "Pancreas secretes insulin", "Cells take up more glucose", "Liver stores glucose as glycogen"] },
        { lane: "Stretch", marks: 3, prompt: "Compare nervous and hormonal coordination.", answerPoints: ["Nervous is faster and more targeted", "Hormonal is slower and carried in blood", "Hormonal effects can last longer"] }
      ]
    },
    "14.4": {
      title: "Homeostasis",
      focus: "Stable internal conditions, negative feedback, thermoregulation, blood glucose control, and diabetes",
      important: "Homeostasis keeps internal conditions stable using negative feedback when variables move away from the set point.",
      card: {
        title: "14.4 Homeostasis",
        points: [
          "Homeostasis is the maintenance of a stable internal environment.",
          "Negative feedback reverses a change: if a variable rises too high or falls too low, corrective responses bring it back.",
          "Thermoregulation uses sweating, vasodilation, vasoconstriction, shivering, and hair erector muscles.",
          "Blood glucose is controlled mainly by insulin and glucagon acting on cells and the liver."
        ]
      },
      quiz: {
        Foundation: [
          {
            prompt: "What is homeostasis?",
            concept: "Homeostasis means keeping internal conditions stable.",
            choices: ["Maintaining a stable internal environment", "Making all responses faster", "Growing towards light"],
            answer: 0,
            explanation: "Homeostasis keeps conditions such as temperature and glucose within limits."
          },
          {
            prompt: "Which response helps cool the body when it is too hot?",
            concept: "Cooling responses increase heat loss.",
            choices: ["Sweating", "Shivering", "Vasoconstriction"],
            answer: 0,
            explanation: "Sweat evaporates from the skin and removes heat."
          },
          {
            prompt: "Which hormone lowers blood glucose?",
            concept: "Insulin lowers blood glucose concentration.",
            choices: ["Insulin", "Glucagon", "Adrenaline"],
            answer: 0,
            explanation: "Insulin helps cells take up glucose and helps the liver store glycogen."
          }
        ],
        Core: [
          {
            prompt: "What happens to skin blood vessels when the body is too hot?",
            concept: "Vasodilation increases heat loss from the skin.",
            choices: ["They dilate so more blood flows near the skin surface", "They constrict so less heat is lost", "They stop carrying blood"],
            answer: 0,
            explanation: "Vasodilation brings more warm blood near the skin, increasing heat loss."
          },
          {
            prompt: "What happens when blood glucose falls too low?",
            concept: "Glucagon raises blood glucose concentration.",
            choices: ["Glucagon causes glycogen to be broken down into glucose", "Insulin stores more glucose as glycogen", "The iris constricts the pupil"],
            answer: 0,
            explanation: "Glucagon promotes glycogen breakdown in the liver, raising blood glucose."
          },
          {
            prompt: "Why is negative feedback important?",
            concept: "Negative feedback reverses movement away from a set point.",
            choices: ["It corrects changes and returns conditions towards normal", "It always increases the original change", "It prevents receptors from detecting stimuli"],
            answer: 0,
            explanation: "Negative feedback restores the variable towards the normal range."
          }
        ],
        Stretch: [
          {
            prompt: "A person is cold. Which pair of responses would reduce heat loss and increase heat production?",
            concept: "Cold responses conserve and generate heat.",
            choices: ["Vasoconstriction and shivering", "Vasodilation and sweating", "Pupil constriction and insulin release"],
            answer: 0,
            explanation: "Vasoconstriction reduces heat loss; shivering releases heat from muscle contraction."
          },
          {
            prompt: "Why can untreated type 1 diabetes cause high blood glucose?",
            concept: "Type 1 diabetes involves too little insulin.",
            choices: ["Too little insulin means cells take up less glucose", "Too much auxin moves to the root", "The iris cannot control the pupil"],
            answer: 0,
            explanation: "Without enough insulin, glucose remains in the blood instead of entering cells or being stored."
          },
          {
            prompt: "Which answer best explains a negative feedback loop?",
            concept: "A negative feedback loop detects change, coordinates a response, and reverses the change.",
            choices: ["A receptor detects deviation and effectors act to restore normal conditions", "A plant shoot bends towards light", "A sensory neurone becomes a hormone"],
            answer: 0,
            explanation: "Homeostatic control uses receptors, coordination, and effectors to correct deviations."
          }
        ]
      },
      worksheet: [
        { lane: "Foundation", marks: 2, prompt: "Define homeostasis and give one example of a controlled condition.", answerPoints: ["Maintaining stable internal conditions", "Example: body temperature or blood glucose"] },
        { lane: "Foundation", marks: 2, prompt: "Name two responses when the body is too hot.", answerPoints: ["Sweating", "Vasodilation"] },
        { lane: "Core", marks: 4, prompt: "Explain how blood glucose is lowered after a meal.", answerPoints: ["Pancreas detects high glucose", "Insulin is secreted", "Cells take up glucose", "Liver stores glucose as glycogen"] },
        { lane: "Stretch", marks: 4, prompt: "Explain negative feedback using body temperature as the example.", answerPoints: ["Temperature change is detected", "Coordinator triggers effectors", "Responses reverse the temperature change", "Condition returns towards normal"] }
      ]
    },
    "14.5": {
      title: "Tropic responses",
      focus: "Phototropism, geotropism, auxin, shoots, roots, and growth responses",
      important: "Tropic responses are directional plant growth responses controlled by uneven auxin distribution.",
      card: {
        title: "14.5 Tropic responses",
        points: [
          "A tropism is a growth response by a plant towards or away from a stimulus.",
          "Shoots are positively phototropic because they grow towards light; roots are positively geotropic because they grow towards gravity.",
          "In shoots, auxin collects on the shaded side and stimulates extra cell elongation there, bending the shoot towards light.",
          "In roots, high auxin concentration inhibits elongation, so the lower side grows less and the root bends downwards."
        ]
      },
      quiz: {
        Foundation: [
          {
            prompt: "What is phototropism?",
            concept: "Phototropism is a growth response to light.",
            choices: ["Growth response to light", "Growth response to gravity", "A hormone in the pancreas"],
            answer: 0,
            explanation: "Photo means light, so phototropism is growth towards or away from light."
          },
          {
            prompt: "Which plant hormone controls many tropic responses?",
            concept: "Auxin controls cell elongation in shoots and roots.",
            choices: ["Auxin", "Insulin", "Adrenaline"],
            answer: 0,
            explanation: "Auxin affects cell elongation and causes bending in tropic responses."
          },
          {
            prompt: "Which response is shown when roots grow downwards?",
            concept: "Roots usually grow towards gravity.",
            choices: ["Positive geotropism", "Negative phototropism", "Accommodation"],
            answer: 0,
            explanation: "Positive geotropism means growth towards gravity."
          }
        ],
        Core: [
          {
            prompt: "Why does a shoot bend towards light?",
            concept: "Uneven auxin distribution causes unequal growth in shoots.",
            choices: ["Auxin collects on the shaded side and cells there elongate more", "Auxin kills the light side", "Insulin moves to the tip"],
            answer: 0,
            explanation: "More elongation on the shaded side pushes the shoot towards the light."
          },
          {
            prompt: "How does high auxin concentration affect root cells?",
            concept: "Auxin stimulates shoot elongation but inhibits root elongation at high concentration.",
            choices: ["It inhibits elongation", "It always increases elongation", "It changes the pupil size"],
            answer: 0,
            explanation: "In roots, high auxin concentration reduces elongation."
          },
          {
            prompt: "What is positive geotropism?",
            concept: "Positive tropism means growth towards the stimulus.",
            choices: ["Growth towards gravity", "Growth away from gravity", "Growth towards light only"],
            answer: 0,
            explanation: "Roots are positively geotropic because they grow towards gravity."
          }
        ],
        Stretch: [
          {
            prompt: "A root placed horizontally bends downward. What explains the bending?",
            concept: "Auxin distribution and root sensitivity explain geotropism.",
            choices: ["Auxin gathers on the lower side and inhibits elongation there", "Auxin gathers on the upper side and stops all growth", "Adrenaline makes the root contract"],
            answer: 0,
            explanation: "The lower side elongates less, so the root bends down."
          },
          {
            prompt: "Why does the same auxin pattern affect shoots and roots differently?",
            concept: "Shoots and roots respond differently to auxin concentration.",
            choices: ["Auxin stimulates shoot elongation but high auxin inhibits root elongation", "Auxin only exists in animals", "Auxin is a nervous impulse"],
            answer: 0,
            explanation: "The key exam distinction is opposite growth effect in shoots compared with roots."
          },
          {
            prompt: "Which explanation best links phototropism to survival?",
            concept: "Tropic responses improve resource capture.",
            choices: ["Shoots grow towards light to increase photosynthesis", "Roots grow towards light to make insulin", "Leaves close the pupil in bright light"],
            answer: 0,
            explanation: "Growing towards light helps shoots and leaves capture more light for photosynthesis."
          }
        ]
      },
      worksheet: [
        { lane: "Foundation", marks: 2, prompt: "Define tropism and phototropism.", answerPoints: ["Tropism is directional plant growth response", "Phototropism is growth response to light"] },
        { lane: "Foundation", marks: 2, prompt: "Name the hormone involved in tropic responses and where it is produced in shoots.", answerPoints: ["Auxin", "Produced in the shoot tip"] },
        { lane: "Core", marks: 4, prompt: "Explain how a shoot bends towards light.", answerPoints: ["Light causes auxin to collect on shaded side", "Auxin stimulates elongation in shoot cells", "Shaded side grows faster", "Shoot bends towards light"] },
        { lane: "Stretch", marks: 4, prompt: "Explain why roots grow downwards when placed horizontally.", answerPoints: ["Gravity causes auxin to collect on lower side", "High auxin inhibits elongation in root cells", "Lower side grows less than upper side", "Root bends downwards"] }
      ]
    }
  };

  function subtopicIdsFromRequest(request) {
    const coverage = Array.isArray(request?.selectedSyllabusCoverage) ? request.selectedSyllabusCoverage : [];
    const ids = [];
    coverage.forEach((item) => {
      const chapterId = safeText(item?.chapterId);
      const subtopicId = safeText(item?.subtopicId);
      if (chapterId === "14" && subtopicId === WHOLE_CHAPTER_VALUE) {
        ids.push(...BIOLOGY_14_IDS);
        return;
      }
      if (BIOLOGY_14_IDS.includes(subtopicId)) {
        ids.push(subtopicId);
      }
      (Array.isArray(item?.subtopics) ? item.subtopics : []).forEach((subtopic) => {
        const match = safeText(subtopic).match(/\b14\.[1-5]\b/);
        if (match) {
          ids.push(match[0]);
        }
      });
    });

    (Array.isArray(request?.subtopicIds) ? request.subtopicIds : []).forEach((value) => {
      const text = safeText(value);
      if (text === `${WHOLE_CHAPTER_VALUE}:14` || text === WHOLE_CHAPTER_VALUE) {
        ids.push(...BIOLOGY_14_IDS);
        return;
      }
      const match = text.match(/\b14\.[1-5]\b/);
      if (match) {
        ids.push(match[0]);
      }
    });

    const chapterIds = Array.isArray(request?.chapterIds) ? request.chapterIds.map(safeText) : [];
    if (!ids.length && (chapterIds.includes("14") || safeText(request?.chapterId) === "14")) {
      ids.push(...BIOLOGY_14_IDS);
    }
    return unique(ids).filter((id) => SUBTOPICS[id]);
  }

  function requestIsChapter14Biology(request) {
    const syllabus = safeText(request?.syllabus);
    const subject = safeText(request?.topic || request?.subject);
    const chapterTitle = safeText(request?.chapterTitle).toLowerCase();
    return syllabus === "Cambridge IGCSE"
      && (subject === "Biology" || chapterTitle.includes("coordination and response"))
      && subtopicIdsFromRequest(request).length > 0;
  }

  function buildQuizLanes(selectedIds) {
    const lanes = {};
    ["Foundation", "Core", "Stretch"].forEach((lane) => {
      const pool = selectedIds.flatMap((id) =>
        SUBTOPICS[id].quiz[lane].map((question) => ({ ...question, subtopicId: id }))
      );
      lanes[lane] = cycleTake(pool, 3).map((question, index) => ({
        id: `prebuilt-bio14-${slugify(lane)}-${index + 1}`,
        lane,
        prompt: question.prompt,
        concept: `${question.subtopicId} ${SUBTOPICS[question.subtopicId].title}: ${question.concept}`,
        choices: question.choices,
        answer: question.answer,
        explanation: question.explanation
      }));
    });
    return lanes;
  }

  function buildWorksheet(selectedIds) {
    const pool = selectedIds.flatMap((id) =>
      SUBTOPICS[id].worksheet.map((question) => ({ ...question, subtopicId: id }))
    );
    const questions = cycleTake(pool, 12).map((question, index) => ({
      number: index + 1,
      lane: question.lane,
      marks: question.marks,
      prompt: `${question.subtopicId} ${SUBTOPICS[question.subtopicId].title}: ${question.prompt}`,
      answerPoints: question.answerPoints
    }));
    const answerKeyLines = questions.map((question) => {
      const points = question.answerPoints.map((point) => `- ${point}`).join("\n");
      return `Q${question.number} (${question.lane}, ${question.marks} marks) - ${question.prompt}\n${points}`;
    });
    return {
      intro: "Prebuilt Chapter 14 worksheet. Answer in short exam-style points, then check against the answer guide.",
      questions,
      answerKeyLines,
      rubricText: answerKeyLines.join("\n\n")
    };
  }

  function findPrebuiltPack(request) {
    if (!requestIsChapter14Biology(request)) {
      return null;
    }

    const selectedIds = subtopicIdsFromRequest(request);
    const selected = selectedIds.map((id) => SUBTOPICS[id]);
    const allSelected = selectedIds.length === BIOLOGY_14_IDS.length;
    const title = allSelected
      ? "Chapter 14 Coordination and Response Prebuilt Study Pack"
      : `Chapter 14 Prebuilt Pack: ${selectedIds.join(", ")}`;
    const quizLanes = buildQuizLanes(selectedIds);
    const worksheet = buildWorksheet(selectedIds);
    const totalQuestions = Object.values(quizLanes).reduce((sum, lane) => sum + lane.length, 0);

    return {
      id: `prebuilt-bio14-${selectedIds.join("-").replaceAll(".", "")}`,
      generatedAt: "2026-06-14T00:00:00.000Z",
      provider: "prebuilt-cache",
      title,
      subtitle: "Cambridge IGCSE Biology - Chapter 14 - bundled cache",
      notes: {
        focusItems: selected.map((item, index) => `${selectedIds[index]} ${item.focus}`),
        importantPoints: selected.map((item, index) => `${selectedIds[index]} ${item.important}`),
        noteCards: [
          {
            title: "Prebuilt learning map",
            points: [
              "Use this pack when the AI backend is slow or unavailable.",
              "Each selected Chapter 14 subtopic has its own note card, quiz coverage, and worksheet practice.",
              "Start with the coverage checklist, then test each subtopic through Foundation, Core, and Stretch."
            ]
          },
          ...selected.map((item) => item.card),
          {
            title: "Exam method for Chapter 14",
            points: [
              "Always name the stimulus, receptor, coordinator, effector, and response when a control pathway is tested.",
              "For eye questions, separate pupil reflex from accommodation; they are not the same process.",
              "For homeostasis, write the negative feedback loop as detect, coordinate, respond, return to normal.",
              "For tropisms, state whether auxin stimulates or inhibits elongation in the plant part being tested."
            ]
          }
        ]
      },
      quiz: {
        lanes: quizLanes,
        totalQuestions
      },
      worksheet,
      recommendations: {
        recommendedFocus: selected.map((item, index) => `${selectedIds[index]} ${item.title}`),
        recommendedTopicIds: ["14"],
        topicMatches: [],
        libraryMatches: []
      }
    };
  }

  window.IC_EDUCATE_PREBUILT_PACKS = {
    find: findPrebuiltPack
  };
})();
