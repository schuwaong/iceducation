(function () {
  function buildQuestions(chapterId, items) {
    return items.map((item, index) => ({
      id: `${chapterId}-l1-${index + 1}`,
      year: item.year,
      difficulty: item.difficulty,
      prompt: item.prompt,
      concept: item.concept,
      choices: item.choices,
      answer: item.answer,
      explanation: item.explanation
    }));
  }

  window.CFA_LEVEL_ONE = {
    chapters: [
      {
        id: "ethics",
        title: "Ethics and Standards",
        shortTitle: "Ethics",
        topic: "Ethical and Professional Standards",
        weight: "15-20%",
        blurb: "Learn the Level I ethics decision frame: duty, conflict, disclosure, and the cleanest corrective action.",
        summary: "Level I Ethics is the backbone of the program. You need to recognize the duty that applies, identify the action or omission that threatens that duty, and choose the response that best protects clients, markets, and professional integrity.",
        teach: "Study Ethics by building a decision habit. Start with who owes the duty, then ask what information, conflict, or conduct issue is in play, and finish with the most professional action available now.",
        syllabus: [
          "Apply the Code of Ethics and Standards of Professional Conduct to investment and client situations.",
          "Recognize duties tied to diligence, loyalty, fair dealing, independence, and supervision.",
          "Distinguish material nonpublic information issues from research-quality and disclosure issues.",
          "Identify when personal trading, gifts, compensation, or outside activity create conflicts.",
          "Choose the most appropriate corrective or preventive action when conduct falls short."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "Most Ethics questions improve once you label the duty first and the remedy second."
          },
          {
            label: "Exam pattern",
            text: "Level I often tests whether a conduct issue is prevented by disclosure, abstention, escalation, or better review."
          },
          {
            label: "Watch for",
            text: "Weak research support, selective treatment of clients, gifts that affect objectivity, and personal trading ahead of clients."
          }
        ],
        notes: [
          {
            title: "How to read an Ethics question",
            points: [
              "Locate the role first: analyst, portfolio manager, trader, supervisor, or adviser.",
              "Separate the core fact from the excuse. Time pressure and client pressure rarely eliminate the duty.",
              "Ask which market participant is exposed to harm and what the clean professional response would be."
            ]
          },
          {
            title: "Standards that recur constantly",
            points: [
              "Diligence and Reasonable Basis appears when recommendations are not supported by enough verified work.",
              "Independence and Objectivity appears when gifts, issuer relationships, or pressure could bias judgment.",
              "Fair Dealing is about broad and timely treatment of similarly situated clients."
            ]
          },
          {
            title: "Correction beats concealment",
            points: [
              "If prior communication becomes misleading, the answer is usually prompt correction through normal channels.",
              "When a colleague may be violating standards, escalation through compliance or supervisors is usually stronger than silence.",
              "Good documentation supports that research, disclosures, and approvals were actually completed."
            ]
          }
        ],
        formulas: [
          "Who owed the duty?",
          "What fact, conflict, or conduct put that duty at risk?",
          "Who needed fair treatment or disclosure?",
          "What is the strongest next action now?"
        ],
        schedule: [
          {
            title: "Step 1: Build the duty map",
            detail: "Group the standards into research quality, client fairness, conflicts, market integrity, and supervision so you can place each question quickly."
          },
          {
            title: "Step 2: Drill role-by-role",
            detail: "Practice identifying which duties attach to analysts, portfolio managers, supervisors, and traders before you worry about edge cases."
          },
          {
            title: "Step 3: Add corrective-action logic",
            detail: "Focus on what must happen after a violation risk appears: disclose, abstain, escalate, or correct the record."
          },
          {
            title: "Step 4: Run timed practice",
            detail: "Use short bursts of mixed ethics questions and explain why each wrong option is weaker, not just why the right one wins."
          },
          {
            title: "Step 5: Revisit your misses",
            detail: "Sort misses into duty-identification errors, conflict errors, and remedy errors so the pattern becomes visible."
          }
        ],
        questions: buildQuestions("ethics", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "An analyst circulates a stock recommendation before checking whether a key forecast formula links correctly. The Standard most directly at risk is:",
            concept: "Reasonable basis requires enough investigation and review before distribution.",
            choices: [
              "Diligence and Reasonable Basis",
              "Preservation of Confidentiality",
              "Reference to CFA Institute"
            ],
            answer: 0,
            explanation: "The issue is sending analysis before confirming that it rests on a sound analytical basis."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "A portfolio manager wants to buy a thinly traded bond for client accounts after placing the same order in her personal account. She most likely violated the Standard related to:",
            concept: "Client trades must come before personal trades.",
            choices: [
              "Additional Compensation Arrangements",
              "Priority of Transactions",
              "Responsibilities of Supervisors"
            ],
            answer: 1,
            explanation: "Placing a personal order ahead of client activity conflicts with priority of client transactions."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "A research associate receives an expensive watch from an issuer after publishing favorable coverage. The most appropriate first action is to:",
            concept: "Independence threats should be disclosed and handled under firm policy immediately.",
            choices: [
              "Keep the gift if the report was already published",
              "Disclose the gift to the employer and follow firm policy",
              "Send the gift to clients as a courtesy"
            ],
            answer: 1,
            explanation: "The watch creates an objectivity concern and must be disclosed and managed according to firm policy."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "A supervisor knows trade surveillance reports have not been reviewed for several weeks but takes no action because no complaint has been received. This most likely violates:",
            concept: "Supervisors must make reasonable efforts to prevent and detect violations.",
            choices: [
              "Responsibilities of Supervisors",
              "Communication with Clients",
              "Confidentiality of Prospective Clients"
            ],
            answer: 0,
            explanation: "The lapse is a control and monitoring failure, which falls under supervisory responsibility."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "An adviser discovers that a valuation input used in last week's newsletter was wrong and now makes the recommendation misleading. The adviser should most likely:",
            concept: "Materially misleading prior communication should be corrected promptly and broadly.",
            choices: [
              "Wait for the next scheduled newsletter",
              "Correct the recommendation through the usual distribution channel",
              "Tell only clients who specifically ask about the change"
            ],
            answer: 1,
            explanation: "The fairest response is prompt correction through normal channels to the affected audience."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "A member uses information overheard from an investment banking colleague about an unannounced tender offer to recommend the target company. The strongest concern is:",
            concept: "Trading or recommending on material nonpublic information threatens market integrity.",
            choices: [
              "Material Nonpublic Information",
              "Misrepresentation",
              "Record Retention"
            ],
            answer: 0,
            explanation: "An unannounced tender offer is classic material nonpublic information."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "A candidate writes that she 'passed all CFA exams on the first attempt and is guaranteed to outperform peers' in marketing materials. The most likely violation is:",
            concept: "The CFA designation cannot be used to promise superior investment results.",
            choices: [
              "Reference to CFA Institute, the CFA Designation, and the CFA Program",
              "Loyalty, Prudence, and Care",
              "Fair Dealing"
            ],
            answer: 0,
            explanation: "The statement improperly links the CFA Program to guaranteed superior performance."
          }
        ])
      },
      {
        id: "quant",
        title: "Quantitative Methods",
        shortTitle: "Quant",
        topic: "Quantitative Methods",
        weight: "6-9%",
        blurb: "Lock down return math, probability, time value, and the statistics that show up across the rest of Level I.",
        summary: "Quant at Level I gives you the toolkit the rest of the curriculum depends on. You need clean mechanics for returns, discounting, probability, sampling, and basic regression interpretation so that finance questions stop feeling random.",
        teach: "Study Quant in layers. Start with formulas you can compute directly, then move into interpretation questions about what the number means and when the method is appropriate.",
        syllabus: [
          "Calculate and interpret rates of return, money-weighted and time-weighted performance, and annualization.",
          "Use time value of money, discounted cash flow, and annuity mechanics.",
          "Apply probability concepts, expected value, and basic distribution logic.",
          "Interpret sampling, confidence intervals, hypothesis testing, and common statistical errors.",
          "Read basic correlation and simple regression results in an investment context."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "Quant misses usually come from using the wrong formula family, not hard arithmetic."
          },
          {
            label: "Exam pattern",
            text: "Level I likes quick calculations followed by a simple interpretation question on the same idea."
          },
          {
            label: "Watch for",
            text: "Sign errors, periodicity mismatches, confusing sample vs population inputs, and using arithmetic when geometric thinking is needed."
          }
        ],
        notes: [
          {
            title: "Return mechanics first",
            points: [
              "Holding period return bundles price change and income together.",
              "Time-weighted return removes the effect of external cash flows and is preferred for manager evaluation.",
              "Money-weighted return reflects the investor's actual experience when timing and size of cash flows matter."
            ]
          },
          {
            title: "TVM is everywhere",
            points: [
              "Discounting moves value backward in time; compounding moves it forward.",
              "Know the differences among lump sums, annuities, and perpetuities.",
              "Rate and period consistency matters more than memorizing exotic formulas."
            ]
          },
          {
            title: "Statistics should answer a question",
            points: [
              "Standard deviation describes dispersion, not downside only.",
              "A confidence interval gives a plausible range for a parameter estimate.",
              "Regression and correlation help describe relationships, but they do not automatically prove causation."
            ]
          }
        ],
        formulas: [
          "HPR = (ending value - beginning value + income) / beginning value",
          "PV = FV / (1 + r)^n",
          "Expected return = sum of probability-weighted outcomes",
          "Standard deviation measures spread around the mean"
        ],
        schedule: [
          {
            title: "Step 1: Rebuild the formula base",
            detail: "Start with returns and TVM because those formulas reappear inside fixed income, equity, and portfolio questions."
          },
          {
            title: "Step 2: Add probability and distributions",
            detail: "Practice expected value, variance, and common distribution interpretation until the wording feels routine."
          },
          {
            title: "Step 3: Learn sampling logic",
            detail: "Focus on what confidence intervals and hypothesis tests are actually saying rather than memorizing jargon."
          },
          {
            title: "Step 4: Layer in correlation and regression",
            detail: "Read simple output tables and tie each statistic to investment meaning."
          },
          {
            title: "Step 5: Mix short and calculation items",
            detail: "Alternate quick concept checks with timed computations so the formulas stay usable under pressure."
          }
        ],
        questions: buildQuestions("quant", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "An investor buys a share for $50, receives a $2 dividend, and sells it for $54. The holding period return is closest to:",
            concept: "Holding period return captures both income and capital gain.",
            choices: [
              "8%",
              "12%",
              "16%"
            ],
            answer: 1,
            explanation: "HPR = (54 - 50 + 2) / 50 = 12%."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "The present value of $1,000 to be received in one year at a 5% discount rate is closest to:",
            concept: "Present value discounts future cash flows back one period.",
            choices: [
              "$952",
              "$1,050",
              "$1,100"
            ],
            answer: 0,
            explanation: "PV = 1,000 / 1.05 = about $952."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "A portfolio has a 40% chance of returning 10% and a 60% chance of returning 4%. The expected return is closest to:",
            concept: "Expected return is the probability-weighted average outcome.",
            choices: [
              "5.2%",
              "6.4%",
              "7.0%"
            ],
            answer: 1,
            explanation: "Expected return = 0.4(10%) + 0.6(4%) = 6.4%."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "Which measure is most appropriate for evaluating a portfolio manager when clients add and withdraw cash at different times?",
            concept: "Time-weighted return strips out the effect of external cash flows.",
            choices: [
              "Time-weighted rate of return",
              "Money-weighted rate of return",
              "Nominal required rate of return"
            ],
            answer: 0,
            explanation: "Time-weighted return is preferred for evaluating manager skill because it neutralizes client-driven cash flow timing."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "A wider confidence interval for a mean estimate most likely indicates:",
            concept: "Wider intervals reflect more uncertainty around the estimate.",
            choices: [
              "Greater precision",
              "Less sampling uncertainty",
              "Less precision"
            ],
            answer: 2,
            explanation: "A wider interval means the estimate is less precise."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "Two variables have a correlation of -0.80. This most likely indicates that:",
            concept: "Correlation describes direction and strength of linear association.",
            choices: [
              "They tend to move strongly in opposite directions",
              "One variable causes the other to decline",
              "The variables have identical volatility"
            ],
            answer: 0,
            explanation: "A correlation of -0.80 indicates a strong inverse linear relationship, not causation or equal volatility."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "Rejecting a true null hypothesis in hypothesis testing is best described as:",
            concept: "Type I error means false rejection.",
            choices: [
              "A Type I error",
              "A Type II error",
              "A sampling frame error"
            ],
            answer: 0,
            explanation: "Rejecting a true null hypothesis is a Type I error."
          }
        ])
      },
      {
        id: "economics",
        title: "Economics",
        shortTitle: "Economics",
        topic: "Economics",
        weight: "6-9%",
        blurb: "Study supply and demand, macro policy, growth, and currency logic without losing the asset-market angle.",
        summary: "Level I Economics is about connecting basic micro and macro ideas to investment consequences. You need to understand how prices, output, inflation, trade, and currency changes affect firms, asset classes, and policy decisions.",
        teach: "Move from firm-level logic to economy-level logic. If you can explain who changes behavior after a price, policy, or currency move, the answer usually becomes much clearer.",
        syllabus: [
          "Apply supply, demand, elasticity, and market structure concepts.",
          "Interpret GDP, inflation, unemployment, and business cycle indicators.",
          "Understand fiscal and monetary policy tools and their likely effects.",
          "Analyze trade, comparative advantage, and exchange rate relationships.",
          "Connect macro conditions to investment and corporate outcomes."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "Economics becomes easier when you identify whether the question is about incentives, policy transmission, or currency effects."
          },
          {
            label: "Exam pattern",
            text: "Many questions ask for the most likely direction of change after a shock, not a full macro theory essay."
          },
          {
            label: "Watch for",
            text: "Mixing up short-run and long-run effects, nominal and real quantities, and absolute vs comparative advantage."
          }
        ],
        notes: [
          {
            title: "Micro first principles",
            points: [
              "Demand slopes down because higher prices usually reduce quantity demanded.",
              "Elasticity matters because some buyers or sellers can adjust faster than others.",
              "Market structure affects pricing power, margins, and strategic behavior."
            ]
          },
          {
            title: "Macro indicators need interpretation",
            points: [
              "GDP captures current production, not wealth or market gains.",
              "Inflation changes purchasing power and discount rates.",
              "Business cycle positioning influences cyclicals, defensives, credit, and policy direction."
            ]
          },
          {
            title: "Policy and FX",
            points: [
              "Fiscal policy changes spending or taxation; monetary policy changes money and credit conditions.",
              "Tighter policy usually raises borrowing costs and can slow demand.",
              "Exchange rates influence competitiveness, imported inflation, and cross-border returns."
            ]
          }
        ],
        formulas: [
          "Real GDP strips out price effects",
          "Elasticity = percent change in quantity / percent change in price",
          "Comparative advantage depends on opportunity cost",
          "A stronger domestic currency makes imports cheaper in local terms"
        ],
        schedule: [
          {
            title: "Step 1: Learn the incentive mechanics",
            detail: "Start with supply, demand, elasticity, and market structure so later macro outcomes feel grounded."
          },
          {
            title: "Step 2: Add the macro scorecard",
            detail: "Build fluency in GDP, inflation, unemployment, and business cycle signals."
          },
          {
            title: "Step 3: Layer in policy tools",
            detail: "Memorize what central banks and governments can change and the likely direction of first-order effects."
          },
          {
            title: "Step 4: Connect to currencies and trade",
            detail: "Use parity, trade competitiveness, and capital flows as the bridge to investment questions."
          },
          {
            title: "Step 5: Practice direction-of-change questions",
            detail: "These are common Level I items, and they reward clean causal chains."
          }
        ],
        questions: buildQuestions("economics", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "Gross domestic product is most accurately defined as the market value of all final goods and services produced:",
            concept: "GDP focuses on current final production within a country's borders.",
            choices: [
              "By a country's citizens worldwide in a year",
              "Within a country during a given period",
              "By public companies during a fiscal year"
            ],
            answer: 1,
            explanation: "GDP measures final goods and services produced within a country's borders during a given period."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "Demand for a product is most likely price elastic when:",
            concept: "Demand is more elastic when buyers have substitutes and time to adjust.",
            choices: [
              "Few substitutes exist",
              "The product is a necessity with a tiny budget share",
              "Many close substitutes are available"
            ],
            answer: 2,
            explanation: "Close substitutes make buyers more sensitive to price changes, increasing elasticity."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "A company will remain in the market in the long run only if total revenue is at least equal to:",
            concept: "Long-run shutdown logic compares revenue with total cost.",
            choices: [
              "Fixed cost",
              "Variable cost",
              "Total cost"
            ],
            answer: 2,
            explanation: "In the long run, the firm must cover total cost to remain in operation."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "An expansionary monetary policy is most likely to involve:",
            concept: "Expansionary monetary policy seeks easier credit and lower financing costs.",
            choices: [
              "Raising policy rates",
              "Buying securities to add liquidity",
              "Increasing income tax rates"
            ],
            answer: 1,
            explanation: "Central bank security purchases add reserves and typically support easier monetary conditions."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "Comparative advantage is determined by:",
            concept: "Comparative advantage depends on opportunity cost, not absolute output alone.",
            choices: [
              "Lower opportunity cost",
              "Higher nominal wages",
              "Larger population"
            ],
            answer: 0,
            explanation: "A producer has comparative advantage when it can produce at a lower opportunity cost."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "If a country's currency appreciates against its trading partners, the country's exports are most likely to become:",
            concept: "Currency appreciation makes domestic goods more expensive to foreigners.",
            choices: [
              "More competitive abroad",
              "Less competitive abroad",
              "Unaffected because only inflation matters"
            ],
            answer: 1,
            explanation: "An appreciated currency raises the foreign-currency price of exports, reducing competitiveness."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "During the early expansion phase of the business cycle, which of the following is most likely?",
            concept: "Early expansion often features rising output, improving confidence, and accommodative conditions.",
            choices: [
              "Falling output and rising unemployment",
              "Improving demand and recovering corporate profits",
              "Peak inflation pressure with restrictive policy already in place"
            ],
            answer: 1,
            explanation: "Early expansion usually brings recovering demand, better earnings, and improving labor conditions."
          }
        ])
      },
      {
        id: "corporate",
        title: "Corporate Issuers",
        shortTitle: "Corporate",
        topic: "Corporate Issuers",
        weight: "6-9%",
        blurb: "Learn how governance, capital budgeting, leverage, and working capital decisions feed into firm value.",
        summary: "Corporate Issuers at Level I focuses on value creation through investment and financing choices. You need to understand how firms evaluate projects, manage capital, structure financing, and align managers with owners.",
        teach: "Anchor every corporate question to one of four jobs: choosing projects, funding projects, managing operations, or governing managers. That keeps the logic clean.",
        syllabus: [
          "Evaluate capital projects using NPV, IRR, payback, and related methods.",
          "Understand cost of capital and the effect of financing choices.",
          "Interpret leverage, working capital, and cash conversion decisions.",
          "Analyze basic corporate governance and stakeholder conflicts.",
          "Compare payout and capital structure choices from a value perspective."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "If the question asks what maximizes shareholder value, NPV logic usually dominates shortcut metrics."
          },
          {
            label: "Exam pattern",
            text: "Corporate questions often test whether a measure is about profitability, liquidity, control, or capital efficiency."
          },
          {
            label: "Watch for",
            text: "Confusing financing effects with project quality and mistaking accounting profits for cash-value creation."
          }
        ],
        notes: [
          {
            title: "Project evaluation core",
            points: [
              "NPV directly measures value added to shareholders.",
              "IRR is useful but can mislead when cash flow patterns are unusual or projects differ in scale.",
              "Payback can support liquidity thinking, but it ignores much of project value."
            ]
          },
          {
            title: "Funding and risk",
            points: [
              "The cost of capital reflects the return investors require for the risk they bear.",
              "More leverage can raise return on equity but also raises financial risk.",
              "Capital structure decisions affect flexibility, ratings, and default risk."
            ]
          },
          {
            title: "Governance and operations",
            points: [
              "Strong governance aligns managers with owners and helps constrain agency costs.",
              "Working capital management influences liquidity and short-term operating resilience.",
              "Payout policy choices can signal confidence and shape reinvestment capacity."
            ]
          }
        ],
        formulas: [
          "NPV = present value of inflows - initial outlay",
          "Higher leverage raises financial risk",
          "Shorter cash conversion cycle supports liquidity",
          "Governance quality can reduce agency costs"
        ],
        schedule: [
          {
            title: "Step 1: Master project-choice tools",
            detail: "Start with NPV, IRR, and payback because capital budgeting is the cleanest entry point to the topic."
          },
          {
            title: "Step 2: Add cost of capital",
            detail: "Learn how required returns tie project discount rates to financing sources and risk."
          },
          {
            title: "Step 3: Study leverage and working capital",
            detail: "Focus on what these choices do to risk, flexibility, and operating cash needs."
          },
          {
            title: "Step 4: Layer in governance",
            detail: "Keep stakeholder conflicts and manager-owner alignment in view."
          },
          {
            title: "Step 5: Use mixed corporate drills",
            detail: "Alternate capital budgeting, financing, and governance items so you can classify the question quickly."
          }
        ],
        questions: buildQuestions("corporate", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "The capital budgeting criterion that most directly measures the increase in shareholder wealth is:",
            concept: "NPV aligns most directly with value creation.",
            choices: [
              "Net present value",
              "Payback period",
              "Accounting rate of return"
            ],
            answer: 0,
            explanation: "NPV measures value added after discounting project cash flows."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "A private limited company differs from a sole proprietorship primarily because owners generally have:",
            concept: "Limited liability is a defining feature of the corporate form.",
            choices: [
              "Limited liability",
              "Unlimited liability",
              "No claim on residual profits"
            ],
            answer: 0,
            explanation: "Shareholders in a private limited company typically have liability limited to their investment."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "If a project has a positive NPV, the project most likely should be:",
            concept: "Positive NPV projects add value assuming the analysis is sound.",
            choices: [
              "Accepted",
              "Rejected",
              "Accepted only if its payback is the shortest"
            ],
            answer: 0,
            explanation: "A positive NPV indicates expected value creation."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "An increase in financial leverage is most likely to:",
            concept: "More debt can magnify equity outcomes and risk.",
            choices: [
              "Reduce financial risk in all states",
              "Increase fixed financing obligations",
              "Lower the business risk of the firm's assets"
            ],
            answer: 1,
            explanation: "Debt adds fixed obligations and increases financial risk borne by equity holders."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "The cash conversion cycle is shortest when a firm:",
            concept: "The cycle improves when inventory and receivables turn quickly while payables are stretched prudently.",
            choices: [
              "Collects receivables faster and manages inventory efficiently",
              "Reduces all trade credit offered by suppliers",
              "Increases safety stock regardless of demand"
            ],
            answer: 0,
            explanation: "Faster collections and leaner inventory generally shorten the cash conversion cycle."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "Which board feature most directly supports independent oversight of management?",
            concept: "Governance improves when oversight is not dominated by management.",
            choices: [
              "A board chaired by the CEO",
              "A majority of independent directors",
              "Compensation linked only to annual revenue growth"
            ],
            answer: 1,
            explanation: "Independent directors strengthen board oversight and reduce agency concerns."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "When mutually exclusive projects differ greatly in scale, reliance on IRR alone is most problematic because IRR may:",
            concept: "IRR ranking can conflict with value maximization when projects differ in scale or timing.",
            choices: [
              "Ignore the time value of money",
              "Always exceed the cost of capital",
              "Rank a smaller project above a larger value-creating project"
            ],
            answer: 2,
            explanation: "IRR can mis-rank mutually exclusive projects, whereas NPV directly reflects value added."
          }
        ])
      },
      {
        id: "fsa",
        title: "Financial Statement Analysis",
        shortTitle: "FSA",
        topic: "Financial Statement Analysis",
        weight: "11-14%",
        blurb: "Turn financial statements into insight on profitability, liquidity, leverage, and earnings quality.",
        summary: "Level I FSA is about reading the three core statements, understanding how accounting choices shape them, and translating reported figures into ratio and quality judgments. This is one of the highest-weight and most reusable topics in the exam.",
        teach: "Always move statement by statement. Know what the income statement measures, what the balance sheet stores, and what the cash flow statement explains. Then connect them through ratios and accounting choices.",
        syllabus: [
          "Describe the structure and purpose of the income statement, balance sheet, and cash flow statement.",
          "Analyze revenue, expenses, inventory, long-lived assets, and financing items.",
          "Calculate and interpret profitability, liquidity, leverage, and valuation ratios.",
          "Understand diluted EPS and the effects of basic accounting choices.",
          "Use cash flow patterns and disclosure clues to assess quality."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "If the question feels messy, ask which statement should move first. That often reveals the answer."
          },
          {
            label: "Exam pattern",
            text: "Level I FSA mixes mechanical ratio work with concept questions on how accounting methods change reported numbers."
          },
          {
            label: "Watch for",
            text: "Inventory method effects, depreciation choices, noncash items, and weak operating cash flow relative to earnings."
          }
        ],
        notes: [
          {
            title: "Read the statements as a system",
            points: [
              "The income statement measures performance over a period.",
              "The balance sheet shows resources and obligations at a point in time.",
              "The cash flow statement explains how cash moved through operations, investing, and financing."
            ]
          },
          {
            title: "Accounting choices matter",
            points: [
              "Inventory methods can change cost of sales, ending inventory, and margins.",
              "Depreciation and amortization affect earnings but not current cash directly.",
              "Diluted EPS tests the effect of potential common shares."
            ]
          },
          {
            title: "Quality check",
            points: [
              "Strong earnings with weak operating cash flow deserve extra scrutiny.",
              "Ratio analysis works best when you compare trends and peers.",
              "Disclosures often explain whether a headline ratio is truly durable."
            ]
          }
        ],
        formulas: [
          "Current ratio = current assets / current liabilities",
          "Gross margin = gross profit / revenue",
          "Diluted EPS reflects potential common share conversion",
          "Cash from operations reveals earnings support"
        ],
        schedule: [
          {
            title: "Step 1: Rebuild the three statements",
            detail: "Know the purpose and major line items of each statement before drilling individual accounting rules."
          },
          {
            title: "Step 2: Add core accounting mechanics",
            detail: "Study inventory, depreciation, revenue, and financing effects on the statements."
          },
          {
            title: "Step 3: Layer on ratios",
            detail: "Sort them into profitability, liquidity, leverage, and efficiency so they stop blending together."
          },
          {
            title: "Step 4: Practice diluted EPS and cash-flow analysis",
            detail: "These are common exam-style checks on whether reported earnings are truly supported."
          },
          {
            title: "Step 5: Mix concept and computation",
            detail: "FSA rewards both clean mechanics and good judgment about quality."
          }
        ],
        questions: buildQuestions("fsa", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "Which financial statement reports a company's financial position at a specific point in time?",
            concept: "The balance sheet is a date-specific snapshot.",
            choices: [
              "Balance sheet",
              "Income statement",
              "Statement of cash flows"
            ],
            answer: 0,
            explanation: "The balance sheet shows assets, liabilities, and equity at a point in time."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "Under rising prices, using FIFO rather than weighted average inventory accounting will most likely result in:",
            concept: "FIFO leaves newer, higher-cost inventory on the balance sheet and lower cost of sales on the income statement.",
            choices: [
              "Higher ending inventory",
              "Lower gross profit",
              "Lower current ratio"
            ],
            answer: 0,
            explanation: "With rising prices, FIFO produces higher ending inventory and typically higher gross profit."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "Which cash flow category includes cash paid to acquire equipment?",
            concept: "Purchasing long-lived assets is an investing activity.",
            choices: [
              "Operating activities",
              "Investing activities",
              "Financing activities"
            ],
            answer: 1,
            explanation: "Buying equipment is an investing cash outflow."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "A company with net income of $200 million and 50 million common shares outstanding reports basic EPS of:",
            concept: "Basic EPS divides net income available to common by weighted-average common shares.",
            choices: [
              "$2.00",
              "$4.00",
              "$5.00"
            ],
            answer: 1,
            explanation: "Basic EPS = 200 million / 50 million = $4.00."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "A higher current ratio most directly indicates stronger:",
            concept: "The current ratio is a basic liquidity measure.",
            choices: [
              "Liquidity",
              "Profitability",
              "Operating leverage"
            ],
            answer: 0,
            explanation: "The current ratio compares short-term assets to short-term liabilities and therefore speaks to liquidity."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "Which pattern is most likely to raise concern about earnings quality?",
            concept: "Persistent earnings unsupported by operating cash flow can be a warning sign.",
            choices: [
              "Rising earnings and rising cash flow from operations",
              "Rising earnings and persistently weak cash flow from operations",
              "Stable gross margin and stable receivables days"
            ],
            answer: 1,
            explanation: "If earnings keep rising while operating cash flow does not support them, quality concerns increase."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "Convertible preferred shares are most relevant when calculating:",
            concept: "Potential common shares matter for diluted EPS.",
            choices: [
              "Basic EPS only",
              "Diluted EPS",
              "Current ratio"
            ],
            answer: 1,
            explanation: "Convertible preferred shares affect diluted EPS because they may become common shares."
          }
        ])
      },
      {
        id: "equity",
        title: "Equity Investments",
        shortTitle: "Equity",
        topic: "Equity Investments",
        weight: "11-14%",
        blurb: "Build comfort with markets, security characteristics, industry analysis, and the basic equity valuation toolkit.",
        summary: "Level I Equity introduces how equity markets function, what drives company and industry value, and how basic valuation approaches are used. You need both market-structure knowledge and early valuation judgment.",
        teach: "Separate equity into three layers: market structure, company and industry analysis, and valuation. That prevents definitions, ratios, and model logic from blurring together.",
        syllabus: [
          "Describe equity markets, trading mechanisms, and index construction.",
          "Analyze industry structure, company position, and sources of competitive advantage.",
          "Understand basic valuation approaches such as dividend and multiple-based models.",
          "Know common features of ETFs and investment companies.",
          "Connect equity characteristics to risk and return expectations."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "If a company does not pay dividends today, ask whether the question is pushing you toward a multiple or a cash-flow framing instead."
          },
          {
            label: "Exam pattern",
            text: "Equity questions often move from a market-structure fact into a company-analysis implication."
          },
          {
            label: "Watch for",
            text: "Confusing primary and secondary markets, price and value, and growth stories with sustainable economics."
          }
        ],
        notes: [
          {
            title: "Market structure basics",
            points: [
              "Primary markets are where securities are first issued; secondary markets are where they trade afterward.",
              "Order-driven and quote-driven markets differ in how liquidity is supplied.",
              "Indexes can be price weighted, equal weighted, or market-cap weighted."
            ]
          },
          {
            title: "Industry and company analysis",
            points: [
              "Strong competitive position can support pricing power and returns on capital.",
              "Industry growth alone is not enough if rivalry or entry pressure destroys margins.",
              "Financial and operating metrics should confirm the narrative."
            ]
          },
          {
            title: "Early valuation logic",
            points: [
              "Dividend models suit businesses with payout capacity and stable expectations.",
              "Relative valuation compares pricing multiples across firms or sectors.",
              "A market price can differ from intrinsic value for long periods."
            ]
          }
        ],
        formulas: [
          "Primary market = issuance; secondary market = trading",
          "Market-cap weighting gives larger firms more influence",
          "Intrinsic value may differ from market price",
          "ETFs are pooled vehicles traded like stocks"
        ],
        schedule: [
          {
            title: "Step 1: Learn how the market works",
            detail: "Start with issuance, trading venues, order types, and index construction so the market vocabulary becomes automatic."
          },
          {
            title: "Step 2: Study industry structure",
            detail: "Use competition, barriers, and profitability as the bridge into company analysis."
          },
          {
            title: "Step 3: Add valuation basics",
            detail: "Keep the purpose of each model clear rather than trying to memorize every variation at once."
          },
          {
            title: "Step 4: Tie vehicles to use cases",
            detail: "Know how ETFs and other pooled products fit investor objectives."
          },
          {
            title: "Step 5: Drill blended questions",
            detail: "Practice items that force you to connect market mechanics with valuation judgment."
          }
        ],
        questions: buildQuestions("equity", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "The market where securities are sold to investors for the first time is the:",
            concept: "Primary issuance is distinct from later trading.",
            choices: [
              "Primary market",
              "Secondary market",
              "Dealer market only"
            ],
            answer: 0,
            explanation: "Securities are first sold in the primary market."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "An exchange-traded fund is best described as:",
            concept: "ETFs are pooled investment vehicles traded on exchanges.",
            choices: [
              "A direct ownership claim on one operating company",
              "A pooled investment vehicle whose shares trade intraday",
              "An unsecured corporate bond"
            ],
            answer: 1,
            explanation: "ETF shares represent ownership in a pooled vehicle and trade during the day like stocks."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "A company with durable pricing power and high barriers to entry most likely operates in an industry with:",
            concept: "Barriers and pricing power support stronger competitive position.",
            choices: [
              "Weak competitive advantage",
              "Stronger competitive positioning",
              "No exposure to economic cycles"
            ],
            answer: 1,
            explanation: "Pricing power and entry barriers usually signal a stronger industry position."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "A price-weighted index gives greater influence to stocks with:",
            concept: "Price-weighted indexes depend on share price, not market capitalization.",
            choices: [
              "Higher share prices",
              "Higher dividend yields",
              "Larger book values"
            ],
            answer: 0,
            explanation: "In a price-weighted index, higher-priced stocks have more influence."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "The Gordon growth model is most appropriate when a company is expected to have:",
            concept: "Constant-growth dividend models need a stable, sustainable growth pattern.",
            choices: [
              "Stable dividends growing at a sustainable constant rate",
              "No expected future cash distributions",
              "Highly unpredictable short-term earnings only"
            ],
            answer: 0,
            explanation: "The Gordon model assumes dividends grow at a stable long-run rate."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "A stock trading below an analyst's estimate of intrinsic value is most likely considered:",
            concept: "Intrinsic value greater than market price implies undervaluation.",
            choices: [
              "Undervalued",
              "Fairly valued by definition",
              "Overvalued"
            ],
            answer: 0,
            explanation: "If intrinsic value exceeds price, the security appears undervalued."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "Which statement about secondary markets is most accurate?",
            concept: "Secondary markets support liquidity and price discovery rather than new capital raising for issuers.",
            choices: [
              "They are the main source of new equity capital for issuers",
              "They facilitate trading among investors after issuance",
              "They are used only by institutional investors"
            ],
            answer: 1,
            explanation: "Secondary markets allow investors to trade existing securities and support liquidity and price discovery."
          }
        ])
      },
      {
        id: "fixed-income",
        title: "Fixed Income",
        shortTitle: "Fixed Income",
        topic: "Fixed Income",
        weight: "11-14%",
        blurb: "Study bond features, pricing, yield measures, and interest-rate risk in a clean step-by-step way.",
        summary: "Fixed Income at Level I is about learning how bond cash flows are structured, how discount rates shape value, and how yields and duration help compare risk and return. It is one of the most formula-active parts of the curriculum.",
        teach: "Start with the bond contract and its promised cash flows. Once the cash flows are clear, pricing, yield, and risk measurement become much easier.",
        syllabus: [
          "Describe bond features, issuers, structures, and embedded options.",
          "Calculate and interpret bond prices, yields, and total return drivers.",
          "Understand spot rates, yield curves, and spread concepts at a basic level.",
          "Measure interest-rate sensitivity with duration and convexity intuition.",
          "Recognize credit, liquidity, and prepayment risks."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "Bond questions simplify once you know whether the main issue is cash flow timing, discount rate, or credit risk."
          },
          {
            label: "Exam pattern",
            text: "Level I often pairs a quick price or yield idea with a risk interpretation."
          },
          {
            label: "Watch for",
            text: "Price-yield direction mistakes, mixing coupon rate with required yield, and forgetting that callable bonds cap upside."
          }
        ],
        notes: [
          {
            title: "Cash flows drive price",
            points: [
              "A plain-vanilla bond pays coupons plus principal at maturity.",
              "Bond price is the present value of promised cash flows discounted at required yields.",
              "If required yield rises, price usually falls."
            ]
          },
          {
            title: "Yield is not one single thing",
            points: [
              "Coupon rate is fixed by the contract, while yield reflects market pricing.",
              "Yield to maturity is the internal rate implied by price and promised cash flows.",
              "Spreads compensate for credit, liquidity, or optionality risks."
            ]
          },
          {
            title: "Interest-rate risk",
            points: [
              "Duration approximates price sensitivity to small yield changes.",
              "Longer maturity and lower coupon generally increase duration.",
              "Callable structures reduce upside when rates fall because the issuer may refinance."
            ]
          }
        ],
        formulas: [
          "Bond price = PV of coupons + PV of principal",
          "Price and yield move in opposite directions",
          "Higher duration means greater rate sensitivity",
          "Callable bonds have limited price appreciation when yields fall"
        ],
        schedule: [
          {
            title: "Step 1: Learn the bond contract",
            detail: "Know coupon, maturity, par value, and optionality before doing yield and duration work."
          },
          {
            title: "Step 2: Drill price-yield mechanics",
            detail: "Use short examples until the inverse relationship feels automatic."
          },
          {
            title: "Step 3: Add yield measures and spreads",
            detail: "Focus on what each measure is trying to summarize."
          },
          {
            title: "Step 4: Layer in duration and risk",
            detail: "Understand what makes one bond more rate-sensitive than another."
          },
          {
            title: "Step 5: Practice option effects",
            detail: "Callable and prepayable structures are common sources of confusion and easy exam points once you understand the logic."
          }
        ],
        questions: buildQuestions("fixed-income", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "When market yields rise, the price of an otherwise unchanged fixed-rate bond will most likely:",
            concept: "Bond prices and required yields move in opposite directions.",
            choices: [
              "Rise",
              "Fall",
              "Remain unchanged"
            ],
            answer: 1,
            explanation: "Higher discount rates reduce the present value of the bond's cash flows."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "A bond's coupon rate is best described as the:",
            concept: "Coupon rate is the contractual interest rate applied to par value.",
            choices: [
              "Market-required yield at issuance only",
              "Stated annual interest rate on the bond's face value",
              "Approximate price sensitivity to yield changes"
            ],
            answer: 1,
            explanation: "The coupon rate determines the contractual coupon payment based on face value."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "Which bond generally has the greatest interest-rate sensitivity, all else equal?",
            concept: "Longer maturity and lower coupon raise duration.",
            choices: [
              "A short-maturity high-coupon bond",
              "A long-maturity low-coupon bond",
              "A floating-rate note resetting each month"
            ],
            answer: 1,
            explanation: "Long maturity and low coupon both increase duration and rate sensitivity."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "A bond priced below par most likely has a coupon rate that is:",
            concept: "Discount bonds usually have coupon rates below required yields.",
            choices: [
              "Higher than its required yield",
              "Equal to its required yield",
              "Lower than its required yield"
            ],
            answer: 2,
            explanation: "If required yield exceeds coupon rate, the bond trades below par."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "Duration is most useful as a measure of a bond's:",
            concept: "Duration summarizes price sensitivity to changes in yield.",
            choices: [
              "Credit default probability",
              "Interest-rate sensitivity",
              "Coupon payment frequency"
            ],
            answer: 1,
            explanation: "Duration is primarily used to estimate how bond price changes when yields move."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "Compared with an otherwise similar noncallable bond, a callable bond will most likely have:",
            concept: "Investors demand compensation for issuer call optionality.",
            choices: [
              "Higher required yield",
              "Lower reinvestment risk",
              "Greater upside when rates fall"
            ],
            answer: 0,
            explanation: "Because the call feature benefits the issuer, investors generally require a higher yield."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "The yield curve is best described as the relationship between:",
            concept: "The yield curve maps yields across maturities for comparable credit quality.",
            choices: [
              "Bond coupon rates and credit ratings",
              "Yields and maturities of similar debt instruments",
              "Bond prices and trading volumes"
            ],
            answer: 1,
            explanation: "A yield curve plots yields against maturities for comparable issuers or credit classes."
          }
        ])
      },
      {
        id: "derivatives",
        title: "Derivatives",
        shortTitle: "Derivatives",
        topic: "Derivatives",
        weight: "5-8%",
        blurb: "Learn payoff logic, basic pricing relationships, and why derivatives can change exposure without moving the cash market position.",
        summary: "Level I Derivatives introduces contracts whose value is linked to underlying assets or rates. You need to understand payoff shapes, basic no-arbitrage logic, and the main uses of forwards, futures, options, and swaps.",
        teach: "Draw the economic purpose first. Is the derivative being used to lock in a price, transfer risk, or gain directional exposure? The details become easier once that purpose is clear.",
        syllabus: [
          "Describe key features of forwards, futures, options, and swaps.",
          "Interpret long and short payoff patterns for basic derivative positions.",
          "Understand the role of no-arbitrage and carrying costs in pricing.",
          "Recognize common hedging and exposure-management uses.",
          "Compare derivative exposure with cash-market exposure."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "If you know who benefits when the underlying rises or falls, most derivative questions become manageable."
          },
          {
            label: "Exam pattern",
            text: "Level I usually stays with basic contract logic and payoff direction rather than deep valuation."
          },
          {
            label: "Watch for",
            text: "Mixing up long vs short positions, intrinsic value vs premium, and hedge purpose vs speculation."
          }
        ],
        notes: [
          {
            title: "Forward commitments vs contingent claims",
            points: [
              "Forwards, futures, and swaps create obligations for both sides.",
              "Options give one side a right without an obligation.",
              "That difference is why options require an upfront premium."
            ]
          },
          {
            title: "Payoff direction matters",
            points: [
              "A long forward benefits when the underlying finishes above the contract price.",
              "A call gains from upside in the underlying; a put gains from downside.",
              "A short position generally benefits when the contract loses value to the long."
            ]
          },
          {
            title: "Why firms use derivatives",
            points: [
              "They can hedge price, rate, or currency risk.",
              "They can alter exposure without buying or selling the underlying asset immediately.",
              "They also create leverage, which increases both opportunity and risk."
            ]
          }
        ],
        formulas: [
          "Long call benefits from upside above the strike",
          "Long put benefits from downside below the strike",
          "Long forward gains when spot at expiration exceeds forward price",
          "Options require a premium because the holder has a right, not an obligation"
        ],
        schedule: [
          {
            title: "Step 1: Separate contract families",
            detail: "Know which instruments create obligations and which create rights."
          },
          {
            title: "Step 2: Draw payoffs",
            detail: "Simple payoff intuition is the fastest way to avoid sign mistakes."
          },
          {
            title: "Step 3: Add no-arbitrage basics",
            detail: "Learn why carry and underlying pricing matter to fair value."
          },
          {
            title: "Step 4: Tie contracts to real use cases",
            detail: "Hedging and exposure management questions become easier once purpose is clear."
          },
          {
            title: "Step 5: Practice long-short translation",
            detail: "Most wrong answers in derivatives come from flipping the side of the contract."
          }
        ],
        questions: buildQuestions("derivatives", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "A derivative is best described as a financial instrument whose value is derived from:",
            concept: "Derivative value depends on an underlying variable or asset.",
            choices: [
              "An underlying asset, rate, or index",
              "Only the issuing company's earnings",
              "Past accounting profits only"
            ],
            answer: 0,
            explanation: "Derivatives derive value from underlying assets, rates, indexes, or similar variables."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "A long call option position most likely benefits when the price of the underlying asset:",
            concept: "Calls gain value as the underlying rises above the strike.",
            choices: [
              "Rises",
              "Falls",
              "Stays fixed below the strike forever"
            ],
            answer: 0,
            explanation: "A long call gives the right to buy, so it gains when the underlying price rises."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "A long position in a forward contract will most likely have a gain at expiration when the spot price is:",
            concept: "The long benefits if market price ends above the contract price.",
            choices: [
              "Above the forward price",
              "Equal to zero",
              "Below the forward price"
            ],
            answer: 0,
            explanation: "The long forward gains if the underlying can be bought below market at expiration."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "Which derivative gives the holder a right but not an obligation?",
            concept: "Options are contingent claims with asymmetrical obligation.",
            choices: [
              "Forward contract",
              "Plain-vanilla swap",
              "Option contract"
            ],
            answer: 2,
            explanation: "The option holder has a right, while the writer bears the obligation if exercised."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "A company that wants to lock in the future purchase price of a commodity would most likely use a:",
            concept: "Forward or futures positions can hedge future purchase costs.",
            choices: [
              "Long forward or futures position",
              "Short call option only",
              "Long put option only"
            ],
            answer: 0,
            explanation: "A long forward or futures contract can lock in a future purchase price."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "A fixed-rate payer in an interest rate swap will most likely benefit when market interest rates:",
            concept: "If market fixed rates rise after the swap is entered, paying the old lower fixed rate becomes attractive.",
            choices: [
              "Rise",
              "Fall",
              "Become irrelevant because swaps are off-balance-sheet"
            ],
            answer: 0,
            explanation: "When market fixed rates rise, the obligation to pay a previously lower fixed rate becomes more valuable."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "The no-arbitrage principle in derivatives pricing most directly implies that:",
            concept: "Equivalent payoffs should not sell for meaningfully different prices.",
            choices: [
              "Only options can be fairly priced",
              "Identical economic payoffs should have similar prices",
              "Derivative prices are unrelated to underlying asset values"
            ],
            answer: 1,
            explanation: "No-arbitrage pricing rests on the idea that equivalent payoffs should not persistently trade at different prices."
          }
        ])
      },
      {
        id: "alternatives",
        title: "Alternative Investments",
        shortTitle: "Alternatives",
        topic: "Alternative Investments",
        weight: "7-10%",
        blurb: "Cover private assets, real estate, commodities, hedge funds, and the diversification tradeoffs they bring.",
        summary: "Alternative Investments at Level I introduces asset classes and strategies that behave differently from traditional stocks and bonds. You need to understand return drivers, liquidity constraints, and where alternatives fit in a portfolio.",
        teach: "Classify each alternative by what really drives its return: property cash flow, commodity exposure, private-company value creation, manager skill, or illiquidity premium.",
        syllabus: [
          "Describe the main alternative investment categories and their characteristics.",
          "Understand liquidity, valuation, fee, and transparency differences versus traditional assets.",
          "Identify key return drivers for real estate, commodities, private equity, and hedge funds.",
          "Recognize diversification benefits and implementation constraints.",
          "Compare listed and private forms of similar exposures."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "If the return source is unclear, identify whether the asset is earning cash flow, inflation linkage, manager skill, or illiquidity premium."
          },
          {
            label: "Exam pattern",
            text: "Level I alternatives questions often contrast private and public versions of an exposure."
          },
          {
            label: "Watch for",
            text: "Assuming low reported volatility means low true risk, and ignoring valuation lag in private assets."
          }
        ],
        notes: [
          {
            title: "Know the asset families",
            points: [
              "Real estate can be accessed through private property holdings or listed vehicles such as REITs.",
              "Private equity involves investing in nonpublic companies with long holding periods.",
              "Commodity exposure may come through spot-linked, futures-linked, or producer-linked positions."
            ]
          },
          {
            title: "Risk and liquidity matter",
            points: [
              "Private assets usually have less frequent valuation and lower liquidity.",
              "Fees and manager dispersion can be much higher than in broad public markets.",
              "Reported volatility may understate true economic risk when marks are stale."
            ]
          },
          {
            title: "Portfolio role",
            points: [
              "Alternatives can diversify traditional portfolios because return drivers differ.",
              "Some alternative strategies are more about inflation protection, others about illiquidity or active skill.",
              "Fit depends on the investor's liquidity needs and governance capacity."
            ]
          }
        ],
        formulas: [
          "Private assets often trade liquidity for potential return enhancement",
          "REITs provide listed real estate exposure",
          "Commodity exposure can behave differently from owning the physical good",
          "Low appraisal volatility does not always mean low underlying risk"
        ],
        schedule: [
          {
            title: "Step 1: Map the categories",
            detail: "Start by separating real estate, private equity, commodities, and hedge fund strategies."
          },
          {
            title: "Step 2: Learn the return drivers",
            detail: "Know what actually earns the return in each category."
          },
          {
            title: "Step 3: Study liquidity and valuation differences",
            detail: "These distinctions explain many exam questions on reported versus economic risk."
          },
          {
            title: "Step 4: Add portfolio role",
            detail: "Focus on diversification, inflation linkage, and implementation constraints."
          },
          {
            title: "Step 5: Practice comparison items",
            detail: "Most Level I alternatives questions are easier once you compare two exposures side by side."
          }
        ],
        questions: buildQuestions("alternatives", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "A REIT is most directly associated with exposure to:",
            concept: "REITs are listed vehicles linked to real estate assets.",
            choices: [
              "Real estate",
              "Sovereign debt",
              "Foreign exchange reserves"
            ],
            answer: 0,
            explanation: "REITs provide exposure to real estate assets and related cash flows."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "Compared with public equities, private equity investments are generally:",
            concept: "Private equity usually has less liquidity and longer holding periods.",
            choices: [
              "More liquid",
              "Less liquid",
              "Priced continuously on exchanges"
            ],
            answer: 1,
            explanation: "Private equity investments are typically less liquid than public equities."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "Commodity investments are often considered useful in portfolios because they may:",
            concept: "Commodity exposure can diversify and sometimes hedge inflation sensitivity.",
            choices: [
              "Provide diversification benefits",
              "Eliminate all equity risk",
              "Guarantee positive real returns"
            ],
            answer: 0,
            explanation: "Commodities can diversify portfolios, though they do not eliminate risk or guarantee returns."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "One reason reported volatility for private real estate may appear low is:",
            concept: "Appraisal-based or infrequent valuations can smooth returns.",
            choices: [
              "The underlying assets have no economic risk",
              "Valuations may be infrequent or appraisal based",
              "Cash flows are fixed by law"
            ],
            answer: 1,
            explanation: "Private asset valuations may be smoothed because they are not marked continuously in liquid markets."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "A hedge fund strategy that seeks pricing discrepancies between related securities is most likely pursuing:",
            concept: "Relative value or arbitrage-style strategies focus on mispricing relationships.",
            choices: [
              "Relative value opportunities",
              "Passive index replication only",
              "Real estate development income"
            ],
            answer: 0,
            explanation: "Relative value strategies aim to exploit pricing differences between related instruments."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "The illiquidity premium most directly refers to compensation investors require for:",
            concept: "Investors require extra return when capital cannot be accessed or exited easily.",
            choices: [
              "Accepting restricted exit flexibility",
              "Owning only listed securities",
              "Using no leverage"
            ],
            answer: 0,
            explanation: "The illiquidity premium compensates investors for giving up liquidity."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "Which statement about alternative investments is most accurate?",
            concept: "Alternative assets can diversify but often come with higher complexity and governance demands.",
            choices: [
              "They always reduce overall portfolio risk",
              "They often require greater due diligence and tolerance for complexity",
              "They are valued using identical methods to all public equities"
            ],
            answer: 1,
            explanation: "Alternatives may diversify portfolios, but they typically require more due diligence and governance."
          }
        ])
      },
      {
        id: "portfolio",
        title: "Portfolio Management",
        shortTitle: "Portfolio",
        topic: "Portfolio Management",
        weight: "8-12%",
        blurb: "Tie the curriculum together through risk, return, diversification, investor goals, and asset allocation logic.",
        summary: "Portfolio Management at Level I integrates the curriculum. You need to understand how risk and return interact, why diversification works, what belongs in an IPS, and how managers connect investor objectives to portfolio choices.",
        teach: "Treat portfolio management as the chapter that translates theory into investor decisions. Every question should point back to objective, constraint, risk budget, or implementation choice.",
        syllabus: [
          "Measure and interpret portfolio risk and return.",
          "Understand diversification, covariance, and basic asset allocation logic.",
          "Apply CAPM intuition and the role of systematic versus unsystematic risk.",
          "Construct and interpret basic investment policy statement objectives and constraints.",
          "Compare active and passive implementation choices."
        ],
        highlights: [
          {
            label: "High-yield trigger",
            text: "Most portfolio questions become easier once you identify the investor goal and the binding constraint."
          },
          {
            label: "Exam pattern",
            text: "Level I combines concept questions on diversification with practical IPS and implementation questions."
          },
          {
            label: "Watch for",
            text: "Mixing up total risk with systematic risk and forgetting that not all return is skill."
          }
        ],
        notes: [
          {
            title: "Risk and diversification",
            points: [
              "Diversification reduces unsystematic risk when assets are not perfectly correlated.",
              "Expected return should be judged with the risk taken to earn it.",
              "Covariance and correlation matter because portfolio risk depends on how assets move together."
            ]
          },
          {
            title: "Investor-centered thinking",
            points: [
              "An IPS captures return objectives, risk tolerance, and practical constraints.",
              "Liquidity, time horizon, taxes, legal factors, and unique circumstances all shape implementation.",
              "The same asset may fit one investor and be inappropriate for another."
            ]
          },
          {
            title: "Implementation choices",
            points: [
              "Passive strategies aim to track a benchmark at low cost.",
              "Active strategies seek excess return but add fees and active risk.",
              "Benchmark choice matters because it frames both risk and performance evaluation."
            ]
          }
        ],
        formulas: [
          "Diversification reduces unsystematic risk",
          "Beta captures sensitivity to market movements",
          "Required return depends on investor needs and constraints",
          "IPS constraints shape implementation"
        ],
        schedule: [
          {
            title: "Step 1: Rebuild risk and return basics",
            detail: "Start with expected return, standard deviation, and the meaning of diversification."
          },
          {
            title: "Step 2: Add portfolio construction logic",
            detail: "Study how correlation and covariance change total portfolio behavior."
          },
          {
            title: "Step 3: Learn IPS structure",
            detail: "Know how objectives and constraints translate into portfolio rules."
          },
          {
            title: "Step 4: Layer in CAPM and benchmarking",
            detail: "Use these ideas to connect risk exposure with expected compensation."
          },
          {
            title: "Step 5: Practice investor-fit questions",
            detail: "These are some of the highest-value Level I questions because they integrate multiple topics at once."
          }
        ],
        questions: buildQuestions("portfolio", [
          {
            year: 2020,
            difficulty: "Easy",
            prompt: "Diversification is most effective at reducing:",
            concept: "Diversification mainly reduces idiosyncratic or unsystematic risk.",
            choices: [
              "Systematic risk",
              "Unsystematic risk",
              "Inflation risk only"
            ],
            answer: 1,
            explanation: "Diversification cannot eliminate marketwide risk, but it can reduce unsystematic risk."
          },
          {
            year: 2021,
            difficulty: "Easy",
            prompt: "Beta most directly measures a security's sensitivity to:",
            concept: "Beta captures exposure to broad market movements.",
            choices: [
              "Changes in the market portfolio",
              "Firm-specific accounting policy changes only",
              "Its own average dividend yield"
            ],
            answer: 0,
            explanation: "Beta measures how sensitive a security is to changes in the market portfolio."
          },
          {
            year: 2022,
            difficulty: "Medium",
            prompt: "An investment policy statement most directly helps ensure that portfolio decisions remain aligned with the investor's:",
            concept: "The IPS formalizes objectives and constraints.",
            choices: [
              "Short-term market forecasts only",
              "Objectives and constraints",
              "Manager compensation target only"
            ],
            answer: 1,
            explanation: "The IPS provides the framework for decisions based on the investor's goals and limitations."
          },
          {
            year: 2023,
            difficulty: "Medium",
            prompt: "A passive equity strategy most likely seeks to:",
            concept: "Passive strategies aim to replicate benchmark performance efficiently.",
            choices: [
              "Outperform by concentrated security selection",
              "Track a benchmark at low cost",
              "Eliminate all market exposure"
            ],
            answer: 1,
            explanation: "Passive investing generally focuses on benchmark tracking and cost efficiency."
          },
          {
            year: 2024,
            difficulty: "Medium",
            prompt: "Holding two assets with less than perfect positive correlation most likely:",
            concept: "Imperfect correlation creates diversification benefits.",
            choices: [
              "Reduces the potential diversification benefit to zero",
              "Can reduce portfolio risk",
              "Guarantees higher return"
            ],
            answer: 1,
            explanation: "Imperfect correlation can lower total portfolio risk even if expected return is unchanged."
          },
          {
            year: 2025,
            difficulty: "Hard",
            prompt: "For an investor with a short time horizon and high liquidity needs, which constraint is most likely binding?",
            concept: "Liquidity and time horizon strongly affect suitable portfolio risk.",
            choices: [
              "Liquidity requirement",
              "Ability to tolerate illiquid private assets",
              "Willingness to ignore cash-flow timing"
            ],
            answer: 0,
            explanation: "Short horizon and high liquidity needs make liquidity a key binding constraint."
          },
          {
            year: 2026,
            difficulty: "Hard",
            prompt: "According to basic CAPM intuition, investors are primarily rewarded for bearing:",
            concept: "CAPM compensation is tied to systematic, nondiversifiable risk.",
            choices: [
              "Diversifiable firm-specific risk",
              "Systematic market risk",
              "No risk if the holding period is long enough"
            ],
            answer: 1,
            explanation: "CAPM suggests that expected return compensates investors for systematic risk, not diversifiable risk."
          }
        ])
      }
    ]
  };
})();
