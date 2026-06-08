(function () {
  function buildSet(chapterId, startNumber, setLabel, caseTitle, caseText, items) {
    return items.map((item, index) => ({
      id: `${chapterId}-${startNumber + index}`,
      setLabel,
      caseTitle,
      caseText,
      difficulty: item.difficulty,
      prompt: item.prompt,
      concept: item.concept,
      choices: item.choices,
      answer: item.answer,
      explanation: item.explanation
    }));
  }

  window.CFA_L2_SUPPLEMENTAL = {
    baseSets: {
      ethics: [
        {
          ids: ["ethics-1", "ethics-2", "ethics-3"],
          setLabel: "Ethics Item Set 1",
          caseTitle: "Research Distribution Review",
          caseText: "Ridgewell Asset Management is preparing to circulate a time-sensitive recommendation to institutional clients. The lead analyst used a compressed timetable, and the portfolio manager must decide whether the research can be relied on and what should happen if a material error is discovered after release.",
          difficulties: ["Easy", "Medium", "Medium"]
        },
        {
          ids: ["ethics-4", "ethics-5", "ethics-6"],
          setLabel: "Ethics Item Set 2",
          caseTitle: "Supervision and Recommendation Controls",
          caseText: "A research director is comparing team review procedures after discovering inconsistent sign-off habits and stale modeling assumptions across desks. Compliance wants to know whether current controls and correction practices satisfy the Standards.",
          difficulties: ["Medium", "Medium", "Hard"]
        }
      ],
      quant: [
        {
          ids: ["quant-1", "quant-2", "quant-3"],
          setLabel: "Quant Item Set 1",
          caseTitle: "Equity Factor Model Review",
          caseText: "A strategist is reviewing a multi-factor return model used for sector allocation. The committee wants to know what the significance tests imply, whether the residuals are reliable, and whether the model can be trusted outside the estimation sample.",
          difficulties: ["Easy", "Medium", "Medium"]
        },
        {
          ids: ["quant-4", "quant-5", "quant-6"],
          setLabel: "Quant Item Set 2",
          caseTitle: "Forecast Diagnostics Meeting",
          caseText: "An analyst compares several forecasting models and notices unstable coefficients, changing residual variance, and effects that are statistically real but economically weak. The team must decide which model outputs deserve action.",
          difficulties: ["Medium", "Medium", "Hard"]
        }
      ],
      economics: [
        {
          ids: ["economics-1", "economics-2", "economics-3"],
          setLabel: "Economics Item Set 1",
          caseTitle: "Currency Desk Briefing",
          caseText: "A global macro team is evaluating forward currency pricing, cross-rate consistency, and the viability of a carry trade before allocating capital to a tactical foreign exchange strategy.",
          difficulties: ["Easy", "Medium", "Medium"]
        },
        {
          ids: ["economics-4", "economics-5", "economics-6"],
          setLabel: "Economics Item Set 2",
          caseTitle: "Growth and Crisis Risk Outlook",
          caseText: "The team is comparing long-run growth potential across countries while monitoring one pegged-currency regime that is losing reserves and facing increasing market skepticism.",
          difficulties: ["Easy", "Medium", "Medium"]
        }
      ],
      corporate: [
        {
          ids: ["corporate-1", "corporate-2", "corporate-3"],
          setLabel: "Corporate Item Set 1",
          caseTitle: "Payout Policy Committee",
          caseText: "A board committee is considering a dividend increase and a share repurchase plan. Analysts are comparing the signal, the financing method, and the effect on per-share book value and leverage.",
          difficulties: ["Easy", "Medium", "Medium"]
        },
        {
          ids: ["corporate-4", "corporate-5", "corporate-6"],
          setLabel: "Corporate Item Set 2",
          caseTitle: "Governance and Capital Planning",
          caseText: "Management is debating a spin-off and reviewing its governance scorecard, ESG exposures, and long-run financing policy as outside investors reassess the company's cost of capital.",
          difficulties: ["Medium", "Medium", "Medium"]
        }
      ],
      fsa: [
        {
          ids: ["fsa-1", "fsa-2", "fsa-3"],
          setLabel: "FSA Item Set 1",
          caseTitle: "Accounting Policy Comparison",
          caseText: "Two manufacturing peers use different inventory and development-cost policies while also facing changes in pension assumptions. An analyst needs to compare current-period earnings and the economic burden of future obligations.",
          difficulties: ["Easy", "Medium", "Medium"]
        },
        {
          ids: ["fsa-4", "fsa-5", "fsa-6"],
          setLabel: "FSA Item Set 2",
          caseTitle: "Quality of Reporting Review",
          caseText: "A multinational company and its peer differ in translation method and cash-flow quality. The valuation team is adjusting reported ratios to decide whether headline profitability can be trusted.",
          difficulties: ["Medium", "Medium", "Medium"]
        }
      ],
      equity: [
        {
          ids: ["equity-1", "equity-2", "equity-3"],
          setLabel: "Equity Item Set 1",
          caseTitle: "Model Selection Workshop",
          caseText: "A valuation associate is deciding among residual income, free cash flow, and dividend models for issuers with different payout policies and financing structures.",
          difficulties: ["Easy", "Easy", "Medium"]
        },
        {
          ids: ["equity-4", "equity-5", "equity-6"],
          setLabel: "Equity Item Set 2",
          caseTitle: "Implied Expectations Debate",
          caseText: "A portfolio manager compares market-implied growth assumptions with internally estimated sustainable growth and tests whether FCFF and PVGO indicate upside or just an overly optimistic thesis.",
          difficulties: ["Medium", "Medium", "Medium"]
        }
      ],
      "fixed-income": [
        {
          ids: ["fixed-income-1", "fixed-income-2", "fixed-income-3"],
          setLabel: "Fixed Income Item Set 1",
          caseTitle: "Curve and Callable Bond Review",
          caseText: "An analyst is bootstrapping spot rates and comparing straight and callable bonds as interest rate volatility changes. The trading desk wants to understand the valuation impact of the embedded call.",
          difficulties: ["Easy", "Easy", "Medium"]
        },
        {
          ids: ["fixed-income-4", "fixed-income-5", "fixed-income-6"],
          setLabel: "Fixed Income Item Set 2",
          caseTitle: "Spread and Hedge Decisions",
          caseText: "A portfolio team is reviewing spread widening, effective duration, and the use of CDS to reshape credit exposure without liquidating the underlying cash bond position.",
          difficulties: ["Medium", "Medium", "Medium"]
        }
      ],
      derivatives: [
        {
          ids: ["derivatives-1", "derivatives-2", "derivatives-3"],
          setLabel: "Derivatives Item Set 1",
          caseTitle: "Forward Pricing Check",
          caseText: "A derivatives team reviews equity forwards and parity relationships to confirm that market prices remain consistent with carry and no-arbitrage logic.",
          difficulties: ["Easy", "Easy", "Medium"]
        },
        {
          ids: ["derivatives-4", "derivatives-5", "derivatives-6"],
          setLabel: "Derivatives Item Set 2",
          caseTitle: "Option Desk Risk Meeting",
          caseText: "Options traders are discussing why hedge ratios change quickly, how market prices imply volatility assumptions, and why fixed-receiver swaps gain when market rates fall.",
          difficulties: ["Medium", "Medium", "Medium"]
        }
      ],
      alternatives: [
        {
          ids: ["alternatives-1", "alternatives-2", "alternatives-3"],
          setLabel: "Alternatives Item Set 1",
          caseTitle: "Commodity and Property Exposure Review",
          caseText: "An allocation committee compares commodity index exposure with private real estate holdings and wants to understand why realized return and reported volatility can differ from intuition.",
          difficulties: ["Easy", "Medium", "Medium"]
        },
        {
          ids: ["alternatives-4", "alternatives-5", "alternatives-6"],
          setLabel: "REIT and Hedge Fund Strategy Review",
          caseText: "A multi-asset PM compares REIT discounts to NAV and evaluates whether several hedge fund strategies are being used for the right job inside a diversified portfolio.",
          difficulties: ["Medium", "Medium", "Easy"]
        }
      ],
      portfolio: [
        {
          ids: ["portfolio-1", "portfolio-2", "portfolio-3"],
          setLabel: "Portfolio Item Set 1",
          caseTitle: "Manager Skill Measurement",
          caseText: "An institutional CIO is comparing managers using benchmark-relative risk metrics, breadth assumptions, and ETF implementation choices for tactical allocations.",
          difficulties: ["Easy", "Medium", "Medium"]
        },
        {
          ids: ["portfolio-4", "portfolio-5", "portfolio-6"],
          setLabel: "Risk System Governance",
          caseText: "A risk team is investigating whether apparent alpha is really factor exposure and whether a strong backtest is trustworthy when the methodology may be flawed.",
          difficulties: ["Medium", "Medium", "Medium"]
        }
      ]
    },
    studySequences: {
      ethics: [
        {
          title: "Step 1: Learn the standards map",
          detail: "Read the Code and Standards categories in order: loyalty and care, research quality, conflicts, market conduct, and supervision. Before doing any questions, be able to classify each standard by the duty it protects."
        },
        {
          title: "Step 2: Build a violation checklist",
          detail: "Create a one-page checklist with four prompts: what duty was owed, what fact triggered the issue, who was harmed, and what corrective action should have happened. This becomes your default ethics workflow."
        },
        {
          title: "Step 3: Read the chapter notes section by section",
          detail: "Go through the note cards in this order: how to read a vignette, frequent standards, prevention and correction, then exam traps. After each section, say one original example out loud."
        },
        {
          title: "Step 4: Memorize high-frequency remedies",
          detail: "Focus on the recurring actions the exam likes: escalate, document, broaden disclosure, delay distribution until support exists, or improve the supervisory system."
        },
        {
          title: "Step 5: Do item sets untimed",
          detail: "Work the first pass slowly and justify why the wrong answers fail. Ethics improves when you compare answers, not when you race."
        },
        {
          title: "Step 6: Rework misses by error type",
          detail: "Group misses into weak reasonable basis, fair dealing, supervision, or disclosure mistakes. Then redo only those clusters before moving on."
        }
      ],
      quant: [
        {
          title: "Step 1: Master the regression output sheet",
          detail: "Know what each line of output means before solving anything: coefficient, standard error, t-statistic, F-statistic, adjusted R-squared, and RMSE."
        },
        {
          title: "Step 2: Separate model fit from inference",
          detail: "Study the difference between explaining the sample and trusting the estimate. This prevents mixing up statistical significance, economic significance, and forecast usefulness."
        },
        {
          title: "Step 3: Learn the residual problem families",
          detail: "Study heteroskedasticity, serial correlation, multicollinearity, and nonstationarity one by one. Be able to identify the symptom, the damage, and the fix."
        },
        {
          title: "Step 4: Build the time-series ladder",
          detail: "Move from trend models to stationarity to autoregression to conditional volatility. Treat each concept as an extension of the last."
        },
        {
          title: "Step 5: Practice with interpretation-first questions",
          detail: "Before selecting an answer, translate the numbers into plain English. If you cannot explain the output, do not trust your choice."
        },
        {
          title: "Step 6: Finish with model-risk review",
          detail: "Close the chapter by revisiting overfitting, leakage, and out-of-sample testing so you remember that a pretty backtest is not enough."
        }
      ],
      economics: [
        {
          title: "Step 1: Lock in quotation conventions",
          detail: "Start by getting comfortable with spot quotes, forward quotes, domestic versus foreign yield conventions, and bid-offer logic."
        },
        {
          title: "Step 2: Learn parity relationships in order",
          detail: "Study covered interest parity first, then uncovered parity, PPP, and the international Fisher effect. Covered parity is the no-arbitrage anchor."
        },
        {
          title: "Step 3: Practice FX valuation mechanics",
          detail: "Work cross rates, forward premiums, and carry-trade outcomes until you can tell the direction of impact before doing any arithmetic."
        },
        {
          title: "Step 4: Move into macro transmission",
          detail: "After FX mechanics, study how policy, balance-of-payments flows, and reserve pressure affect currencies and crisis risk."
        },
        {
          title: "Step 5: Study growth accounting last",
          detail: "Finish with potential GDP, productivity, labor, capital deepening, and long-run convergence so the macro story connects back to asset returns."
        },
        {
          title: "Step 6: Test yourself with mixed narratives",
          detail: "Do item sets that force you to connect parity, policy, and growth in one story instead of treating them as disconnected formulas."
        }
      ],
      corporate: [
        {
          title: "Step 1: Start with payout policy",
          detail: "Study dividend policy, dividend stability, special dividends, and why payout changes send signals to the market."
        },
        {
          title: "Step 2: Add repurchases and tax effects",
          detail: "Once dividends are clear, compare repurchases funded with cash versus debt and trace how tax regimes influence investor preference."
        },
        {
          title: "Step 3: Learn per-share mechanics",
          detail: "Practice EPS, book value per share, leverage, and coverage changes caused by payout decisions before moving to bigger corporate actions."
        },
        {
          title: "Step 4: Study governance and ESG",
          detail: "Review ownership structure, incentives, board quality, and ESG channels only after you can see how they affect cash flow, risk, and cost of capital."
        },
        {
          title: "Step 5: Finish with WACC and restructuring",
          detail: "End the chapter with cost of capital estimation, spin-offs, acquisitions, and value-unlocking transactions."
        },
        {
          title: "Step 6: Practice the decision chain",
          detail: "On questions, always ask motive, signal, financing effect, leverage effect, and valuation effect in that order."
        }
      ],
      fsa: [
        {
          title: "Step 1: Map the major accounting choices",
          detail: "Begin by listing the methods that change timing, presentation, or control classification: inventory, capitalization, intercorporate investments, pensions, and translation."
        },
        {
          title: "Step 2: Learn statement effects before ratios",
          detail: "For each method, identify what happens first to income, assets, liabilities, and equity. Only then move to margins, leverage, and turnover."
        },
        {
          title: "Step 3: Study intercorporate investments and combinations",
          detail: "Work from significant influence to control so the income statement and balance-sheet changes make logical sense."
        },
        {
          title: "Step 4: Move to pensions, compensation, and translation",
          detail: "These topics are easier once you already think in present value, expense timing, and economic burden rather than just accounting labels."
        },
        {
          title: "Step 5: Learn financial institution analysis separately",
          detail: "Treat banks and insurers as their own subsection because standard industrial-company ratio instincts can mislead you there."
        },
        {
          title: "Step 6: End with quality of reporting",
          detail: "Finish by combining everything into earnings quality, cash-flow quality, and comparability adjustments because that is the Level II payoff."
        }
      ],
      equity: [
        {
          title: "Step 1: Start with business and industry analysis",
          detail: "Before formulas, understand what the company does, how it earns returns, and whether payout policy reflects real economics."
        },
        {
          title: "Step 2: Learn model selection rules",
          detail: "Be able to say when DDM, FCFF, FCFE, residual income, or relative valuation is the natural first choice."
        },
        {
          title: "Step 3: Build your absolute valuation core",
          detail: "Study Gordon growth, multi-stage growth, FCFF, FCFE, and residual income in that order so each model builds on the last."
        },
        {
          title: "Step 4: Add justified multiples and PVGO",
          detail: "Once the absolute models make sense, learn how multiples and growth-opportunity value summarize the same fundamentals from a market angle."
        },
        {
          title: "Step 5: Practice implied expectations",
          detail: "Work backwards from price to growth, margins, or returns on equity. This is where valuation becomes investment judgment."
        },
        {
          title: "Step 6: End with sensitivity work",
          detail: "Finish by testing which assumptions actually move value so you know what matters most under exam pressure."
        }
      ],
      "fixed-income": [
        {
          title: "Step 1: Learn the curve vocabulary",
          detail: "Start with spot, par, forward, and swap rates until each one has a distinct meaning in your head."
        },
        {
          title: "Step 2: Practice bootstrapping and discounting",
          detail: "Before optionality, make sure you can price plain cash flows with term-consistent discount rates."
        },
        {
          title: "Step 3: Move into arbitrage-free valuation",
          detail: "Study trees and backward induction next because they explain why path-dependent fixed-income instruments need more than a single yield."
        },
        {
          title: "Step 4: Add embedded options and OAS",
          detail: "After tree logic is clear, learn callable and putable bonds, effective duration, and how volatility changes option cost."
        },
        {
          title: "Step 5: Finish with credit and CDS",
          detail: "End with spread interpretation, issuer risk, securitized credit, and CDS so you connect interest-rate structure with credit structure."
        },
        {
          title: "Step 6: Review with mixed cases",
          detail: "Practice questions that force you to decide whether the right lens is curve, option, or credit rather than announcing the topic up front."
        }
      ],
      derivatives: [
        {
          title: "Step 1: Separate pricing from valuation",
          detail: "Begin by understanding the difference between the fair contract terms at initiation and the contract's value after market conditions change."
        },
        {
          title: "Step 2: Study forwards and futures first",
          detail: "Lock in carry logic, financing cost, and settlement intuition before adding option asymmetry."
        },
        {
          title: "Step 3: Learn swaps as packages of forwards",
          detail: "Once forwards are clear, swaps become much easier because they are repeated exchanges of return streams."
        },
        {
          title: "Step 4: Move into option trees and parity",
          detail: "Study binomial logic and put-call parity before worrying about the closed-form formulas."
        },
        {
          title: "Step 5: Finish with Greeks and implied volatility",
          detail: "Only after valuation is solid should you focus on delta, gamma, and the trading meaning of implied volatility."
        },
        {
          title: "Step 6: Practice across asset classes",
          detail: "End with mixed equity, rate, and currency questions so the no-arbitrage logic becomes portable."
        }
      ],
      alternatives: [
        {
          title: "Step 1: Identify the true source of return",
          detail: "Start by separating commodity exposure, property cash flow, REIT security behavior, and hedge fund strategy return sources."
        },
        {
          title: "Step 2: Learn commodity mechanics first",
          detail: "Study spot return, roll return, collateral return, and the meaning of contango and backwardation."
        },
        {
          title: "Step 3: Move to private real estate",
          detail: "After commodities, focus on property-level economics, appraisal lag, due diligence, and financing structure."
        },
        {
          title: "Step 4: Then study public real estate valuation",
          detail: "Add NAV, FFO, AFFO, and the difference between owning real estate through a public security and through a private asset."
        },
        {
          title: "Step 5: Finish with hedge fund strategy families",
          detail: "Learn equity hedge, event-driven, relative value, and macro-oriented strategies by the risk they take and the job they play."
        },
        {
          title: "Step 6: Practice structure comparison",
          detail: "Use item sets to compare liquidity, transparency, fee drag, and valuation methods across alternative investment vehicles."
        }
      ],
      portfolio: [
        {
          title: "Step 1: Begin with the macro-to-market chain",
          detail: "Review how growth, inflation, policy, and business-cycle expectations flow into rates, spreads, earnings, and valuation multiples."
        },
        {
          title: "Step 2: Study active management measurement",
          detail: "Learn information ratio, tracking error, breadth, and transfer coefficient before discussing whether a manager is actually skilled."
        },
        {
          title: "Step 3: Add implementation tools",
          detail: "Study ETF creation and redemption, premiums and discounts, and when ETFs are the right implementation vehicle for a view."
        },
        {
          title: "Step 4: Move into multifactor models",
          detail: "Once benchmark-relative thinking is clear, learn how factors explain expected return and active performance."
        },
        {
          title: "Step 5: Finish with risk systems",
          detail: "End with VaR, scenario analysis, simulation, and backtesting weaknesses so you can judge whether a strategy is robust."
        },
        {
          title: "Step 6: Practice manager-review style item sets",
          detail: "Use mixed cases that ask what the view is, how it was implemented, what risks were taken, and whether the evidence is credible."
        }
      ]
    },
    extraQuestions: {
      ethics: [
        ...buildSet("ethics", 7, "Ethics Item Set 3", "Outsourced Research Oversight", "North Elm Advisors hires an outside boutique to help cover small-cap technology issuers. The in-house analyst receives the draft report, notices limited support for certain margins and hears that the vendor may publish a similar view to other clients later that afternoon.", [
          {
            difficulty: "Easy",
            prompt: "Before distributing the outsourced report to clients, the in-house analyst should MOST likely:",
            concept: "Using third-party research does not remove the obligation to establish reasonable basis.",
            choices: [
              "Rely on the vendor's reputation and distribute immediately",
              "Review the report's assumptions and confirm the firm has a reasonable basis for using it",
              "Send it only to discretionary accounts",
              "Rewrite the conclusion but keep the unsupported assumptions"
            ],
            answer: 1,
            explanation: "The firm still needs to review the report and establish a reasonable basis before client distribution."
          },
          {
            difficulty: "Medium",
            prompt: "If the vendor intends to send the same report to other paying subscribers first, the biggest concern for North Elm after it adopts the report internally is:",
            concept: "Fair dealing focuses on the firm's own distribution practices to its relevant client base.",
            choices: [
              "North Elm automatically violates fair dealing because other firms also receive the report",
              "North Elm must ensure its own clients receive the recommendation fairly once it chooses to use it",
              "North Elm may never use third-party research",
              "North Elm should share the report publicly on social media first"
            ],
            answer: 1,
            explanation: "The key issue is whether North Elm distributes the adopted recommendation fairly among its own clients."
          },
          {
            difficulty: "Medium",
            prompt: "The vendor cannot produce backup for one key operating margin assumption. The BEST response is to:",
            concept: "Unsupported assumptions undermine reasonable basis even if the overall view seems plausible.",
            choices: [
              "Use the report because only one assumption is unsupported",
              "Delay use until the unsupported assumption is validated or replaced with supportable analysis",
              "Delete the footnote and distribute the report",
              "Trade for employee accounts before clients are informed"
            ],
            answer: 1,
            explanation: "The recommendation should not be used until the unsupported assumption is properly validated or revised."
          },
          {
            difficulty: "Hard",
            prompt: "Which control would BEST strengthen supervisory oversight of outsourced research?",
            concept: "The strongest answer usually improves repeatability, evidence, and accountability.",
            choices: [
              "Rely on verbal sign-off from whichever portfolio manager is available",
              "Require a documented review checklist and retention of the support used before distribution",
              "Allow each analyst to decide whether review is necessary",
              "Distribute all vendor research without edits to avoid firm responsibility"
            ],
            answer: 1,
            explanation: "A documented review process with retained support is the strongest supervisory control."
          }
        ]),
        ...buildSet("ethics", 11, "Ethics Item Set 4", "Allocation and Client Communications", "Blue Harbor Capital is placing a block trade across multiple discretionary portfolios after its healthcare team upgrades a stock. During the order window, a relationship manager suggests giving favored clients the larger allocations because they recently threatened to withdraw assets.", [
          {
            difficulty: "Easy",
            prompt: "The relationship manager's suggestion MOST directly conflicts with:",
            concept: "Similarly situated clients should be treated fairly in allocations and access to recommendations.",
            choices: [
              "Fair dealing",
              "Confidentiality only",
              "Misrepresentation only",
              "Record retention only"
            ],
            answer: 0,
            explanation: "Preferring threatened or favored clients in a block allocation raises a fair dealing issue."
          },
          {
            difficulty: "Medium",
            prompt: "If the trade is only partially filled, the most appropriate allocation basis is generally:",
            concept: "Policies should allocate partial fills on a fair, pre-established basis.",
            choices: [
              "Largest-fee clients first",
              "Accounts of employees first because they took the original research calls",
              "A fair method consistent with firm policy, such as pro rata or another pre-established approach",
              "Accounts that complained most recently"
            ],
            answer: 2,
            explanation: "A pre-established fair allocation policy such as pro rata is the strongest answer."
          },
          {
            difficulty: "Medium",
            prompt: "Before the recommendation is sent externally, one portfolio manager buys the stock in a personal account. The strongest concern is:",
            concept: "Employee trading should not disadvantage client accounts when a recommendation is pending.",
            choices: [
              "Priority of transactions",
              "Preservation of confidentiality only",
              "No concern if the trade is small",
              "A balance-sheet quality issue"
            ],
            answer: 0,
            explanation: "Trading personally before clients raises a priority of transactions issue."
          },
          {
            difficulty: "Hard",
            prompt: "If an error is later found in the healthcare model after some clients have already traded, Blue Harbor should MOST likely:",
            concept: "Corrections should be prompt, broad, and consistent with the original distribution method.",
            choices: [
              "Wait until performance attribution is complete",
              "Notify only the accounts that bought the stock",
              "Promptly correct the recommendation through the firm's normal communication channels",
              "Delete the original file and avoid further discussion"
            ],
            answer: 2,
            explanation: "A prompt correction through normal channels is the appropriate response to a materially misleading communication."
          }
        ]),
        ...buildSet("ethics", 15, "Ethics Item Set 5", "Supervisory Escalation Case", "A newly promoted research head at Cedar Peak notices that surveillance of employee brokerage statements is behind schedule, investment banking contacts occasionally comment on timing-sensitive transactions, and several analysts are unsure when to escalate potential conflicts to compliance.", [
          {
            difficulty: "Easy",
            prompt: "The research head's FIRST priority should be to:",
            concept: "Supervisory responsibility starts with establishing and enforcing a workable control system.",
            choices: [
              "Assume experienced staff will self-correct",
              "Implement and enforce clear supervisory procedures and escalation channels",
              "Delay action until an actual violation is confirmed",
              "Transfer responsibility entirely to external counsel"
            ],
            answer: 1,
            explanation: "The strongest first step is building and enforcing supervisory procedures."
          },
          {
            difficulty: "Medium",
            prompt: "An analyst hears a banker mention a likely secondary offering before public announcement. The analyst should MOST likely:",
            concept: "Potential material nonpublic information requires immediate caution and escalation.",
            choices: [
              "Trade quickly before the deal is public",
              "Share the idea informally with key clients",
              "Refrain from acting and escalate according to firm procedures",
              "Place the stock on a buy list because the banker sounded confident"
            ],
            answer: 2,
            explanation: "The analyst should not act on the information and should escalate according to firm policy."
          },
          {
            difficulty: "Medium",
            prompt: "Employee account statements have not been reviewed for three months because the compliance officer was on leave. The BEST conclusion is that:",
            concept: "A control that exists but is not actually performed is a weak control.",
            choices: [
              "There is no issue because the policy exists in writing",
              "The lapse indicates a supervisory weakness that should be remedied immediately",
              "Reviews can be skipped if no suspicious trade has yet surfaced",
              "Only the employees are responsible"
            ],
            answer: 1,
            explanation: "A monitoring lapse signals a supervisory weakness even if no violation has yet been detected."
          },
          {
            difficulty: "Hard",
            prompt: "Which policy upgrade would MOST strengthen Cedar Peak's control environment?",
            concept: "The best answer increases clarity, evidence, and accountability rather than relying on good intentions.",
            choices: [
              "Allow ad hoc monitoring whenever time permits",
              "Use written restricted-list, personal-trading, and escalation procedures with periodic testing",
              "Replace all internal controls with annual training only",
              "Rely on senior analysts to decide when conflicts matter"
            ],
            answer: 1,
            explanation: "Formal procedures plus testing are stronger than ad hoc judgment alone."
          }
        ]),
        ...buildSet("ethics", 19, "Ethics Item Set 6", "Compensation and Independence", "A sell-side analyst is offered a speaking fee by a conference sponsor shortly before publishing an update on a company that is actively seeking new financing. The analyst also learns that the sponsor owns a large position in the stock.", [
          {
            difficulty: "Medium",
            prompt: "The speaking-fee offer is MOST likely to raise concern under:",
            concept: "Outside compensation arrangements can compromise objectivity and require firm consent.",
            choices: [
              "Additional compensation arrangements",
              "Record retention only",
              "Soft-dollar standards only",
              "No standard because conferences are educational"
            ],
            answer: 0,
            explanation: "An outside fee tied to the analyst's role raises additional compensation concerns and potential objectivity issues."
          },
          {
            difficulty: "Hard",
            prompt: "If the analyst accepts the fee with employer approval, the analyst should STILL be MOST careful to:",
            concept: "Approval does not eliminate the duty to preserve independence and disclose relevant conflicts appropriately.",
            choices: [
              "Guarantee a favorable rating to maintain the sponsor relationship",
              "Maintain objective analysis and disclose any material conflict according to firm policy",
              "Share unpublished findings with the sponsor first",
              "Stop documenting research support because approval was granted"
            ],
            answer: 1,
            explanation: "Employer approval does not remove the duty to stay objective and disclose material conflicts properly."
          }
        ]),
        ...buildSet("quant", 7, "Quant Item Set 3", "Sector Allocation Regression", "A portfolio strategist runs a multiple regression of quarterly sector returns on earnings revisions, credit spreads, and changes in the policy rate. The model's overall F-statistic is significant, but one coefficient is unstable when another explanatory variable is added.", [
          {
            difficulty: "Easy",
            prompt: "The significant F-statistic MOST likely indicates that:",
            concept: "The F-test evaluates whether the model has joint explanatory power.",
            choices: [
              "Every variable is individually significant",
              "The model explains none of the variation in returns",
              "At least one explanatory variable contributes to explaining returns",
              "Residuals are guaranteed to be homoskedastic"
            ],
            answer: 2,
            explanation: "A significant F-statistic means the model has joint explanatory power even if some individual coefficients are weak."
          },
          {
            difficulty: "Medium",
            prompt: "If the earnings-revision coefficient changes sharply after the spread variable is added, the most likely concern is:",
            concept: "Large coefficient instability after adding a related predictor is a common sign of multicollinearity.",
            choices: [
              "Serial independence",
              "Multicollinearity",
              "Seasonality",
              "Look-ahead bias"
            ],
            answer: 1,
            explanation: "Highly related predictors can make coefficient estimates unstable and harder to interpret."
          },
          {
            difficulty: "Medium",
            prompt: "The BEST way to describe the practical risk of multicollinearity is that it:",
            concept: "Multicollinearity weakens precision and interpretation rather than necessarily destroying overall fit.",
            choices: [
              "Makes every coefficient biased upward",
              "Prevents all forecasting",
              "Makes individual coefficient estimates less precise and less stable",
              "Guarantees a lower adjusted R-squared"
            ],
            answer: 2,
            explanation: "The main issue is weaker precision and interpretability of individual coefficients."
          },
          {
            difficulty: "Hard",
            prompt: "If the strategist wants to keep both economically important variables despite multicollinearity, the MOST appropriate interpretation approach is to:",
            concept: "When predictors are related, analysts should be careful about strong claims on individual coefficients.",
            choices: [
              "Ignore the issue because the F-statistic is significant",
              "Place more weight on the model's joint explanatory power than on precise individual coefficient interpretation",
              "Set the weaker variable's coefficient to zero manually",
              "Assume the signs of both coefficients must be wrong"
            ],
            answer: 1,
            explanation: "With multicollinearity, the model may still be useful jointly even if individual coefficients are imprecise."
          }
        ]),
        ...buildSet("quant", 11, "Quant Item Set 4", "Time-Series Forecasting Review", "An economist estimates an autoregressive model for monthly inflation and notices that residuals remain positively autocorrelated while out-of-sample forecast errors are larger than expected.", [
          {
            difficulty: "Easy",
            prompt: "Residual autocorrelation after fitting an autoregressive model MOST likely suggests that:",
            concept: "Remaining autocorrelation often means the model omitted dynamic structure.",
            choices: [
              "The model may still be missing relevant time-series dynamics",
              "The data are guaranteed to be stationary",
              "The intercept must be dropped",
              "Heteroskedasticity has been eliminated"
            ],
            answer: 0,
            explanation: "Residual autocorrelation suggests the model may still be missing important dynamics."
          },
          {
            difficulty: "Medium",
            prompt: "Large out-of-sample forecast errors despite strong in-sample fit MOST likely indicate:",
            concept: "A common interpretation is that the model fit noise rather than signal.",
            choices: [
              "Underfitting only",
              "Overfitting",
              "Perfect model stability",
              "No need for validation"
            ],
            answer: 1,
            explanation: "Strong in-sample results but weak out-of-sample performance are a classic overfitting signal."
          },
          {
            difficulty: "Medium",
            prompt: "Which metric is MOST directly useful for comparing forecast accuracy across models?",
            concept: "Forecast-comparison metrics focus on prediction error rather than coefficient significance.",
            choices: [
              "F-statistic",
              "RMSE",
              "Durbin-Watson alone",
              "Adjusted book value"
            ],
            answer: 1,
            explanation: "RMSE is commonly used to compare forecast accuracy across competing models."
          },
          {
            difficulty: "Hard",
            prompt: "If inflation displays conditional variance clustering, the economist should be MOST alert to:",
            concept: "Volatility clustering points toward conditional heteroskedasticity such as ARCH behavior.",
            choices: [
              "An ARCH-type feature in the data",
              "Guaranteed multicollinearity",
              "The absence of time dependence",
              "A negative beta"
            ],
            answer: 0,
            explanation: "Volatility clustering is consistent with conditional heteroskedasticity, often modeled with ARCH-type approaches."
          }
        ]),
        ...buildSet("quant", 15, "Quant Item Set 5", "Machine Learning Workflow", "A research team trains a machine learning model on thousands of features, including news sentiment and alternative transaction data, to predict one-month equity returns. The prototype performs extremely well on the training set, but weaker on validation data.", [
          {
            difficulty: "Easy",
            prompt: "The training-versus-validation pattern MOST clearly suggests:",
            concept: "A model that performs much better on training data than on validation data is often overfit.",
            choices: [
              "Overfitting",
              "Guaranteed economic significance",
              "Absence of noise",
              "No need for regularization"
            ],
            answer: 0,
            explanation: "The model likely learned training-set noise rather than generalizable structure."
          },
          {
            difficulty: "Medium",
            prompt: "The BEST reason to reserve a validation sample is to:",
            concept: "Validation helps test whether performance generalizes beyond the training set.",
            choices: [
              "Increase in-sample fit mechanically",
              "Check out-of-sample generalization before deployment",
              "Remove the need for data cleaning",
              "Guarantee positive alpha"
            ],
            answer: 1,
            explanation: "A validation sample helps assess whether the model generalizes to unseen data."
          },
          {
            difficulty: "Medium",
            prompt: "Including future-revised accounting data that were unavailable at the prediction date would create:",
            concept: "Using information not available at the decision point contaminates the model development process.",
            choices: [
              "Look-ahead bias",
              "Only heteroskedasticity",
              "Only seasonality",
              "A lower RMSE by definition"
            ],
            answer: 0,
            explanation: "Using future information introduces look-ahead bias."
          },
          {
            difficulty: "Hard",
            prompt: "Which response would MOST directly reduce the risk that the model is fitting noise?",
            concept: "Regularization and feature discipline are core tools against overfitting.",
            choices: [
              "Add as many additional features as possible",
              "Use validation discipline and constrain model complexity",
              "Ignore out-of-sample weakness if in-sample fit is high",
              "Replace all numeric features with narrative summaries"
            ],
            answer: 1,
            explanation: "Validation plus tighter model complexity control is a direct overfitting countermeasure."
          }
        ]),
        ...buildSet("quant", 19, "Quant Item Set 6", "Economic Materiality Check", "A PM receives a factor model report showing several statistically significant signals. One factor has a robust t-statistic but only moves expected return by a few basis points in the portfolio's likely implementation range.", [
          {
            difficulty: "Medium",
            prompt: "The PM should MOST likely conclude that the factor is:",
            concept: "Statistical significance does not guarantee economic usefulness.",
            choices: [
              "Economically decisive because it is statistically significant",
              "Potentially real statistically but of limited economic value",
              "Incorrect because the t-statistic is nonzero",
              "Guaranteed to improve portfolio Sharpe ratio"
            ],
            answer: 1,
            explanation: "A factor can be statistically significant while still being too small to matter economically."
          },
          {
            difficulty: "Hard",
            prompt: "Which additional step would BEST connect the statistical result to an investment decision?",
            concept: "Portfolio use requires translating signal size into turnover, cost, and expected net benefit.",
            choices: [
              "Compare the effect size with implementation cost and portfolio constraints",
              "Discard all significance tests immediately",
              "Assume trading cost is irrelevant at Level II",
              "Convert the factor into a binary variable only"
            ],
            answer: 0,
            explanation: "The signal's value should be judged against practical implementation cost and constraints."
          }
        ]),
        ...buildSet("economics", 7, "Economics Item Set 3", "Forward Rate Decision", "A US-based manager compares euro spot and one-year forward quotes with short-term dollar and euro interest rates before deciding whether the euro is expensive or cheap in the forward market.", [
          {
            difficulty: "Easy",
            prompt: "Covered interest parity MOST directly links the forward rate to:",
            concept: "Covered parity is the no-arbitrage relationship connecting spot and interest rates to the forward quote.",
            choices: [
              "Only expected inflation",
              "Spot exchange rate and the interest rate differential",
              "Real GDP growth only",
              "Current account balance only"
            ],
            answer: 1,
            explanation: "Covered parity links the forward rate to the spot rate and interest rate differential."
          },
          {
            difficulty: "Medium",
            prompt: "If the euro is at a forward premium to the dollar, the most likely parity-consistent interpretation is that euro interest rates are:",
            concept: "A currency at a forward premium is generally associated with a lower interest rate relative to the other currency.",
            choices: [
              "Lower than dollar interest rates",
              "Higher than dollar interest rates",
              "Exactly equal to dollar rates",
              "Irrelevant to the forward quote"
            ],
            answer: 0,
            explanation: "A forward premium is generally associated with lower interest rates in that currency under covered parity."
          },
          {
            difficulty: "Medium",
            prompt: "The BEST reason not to treat the forward rate as a guaranteed future spot rate is that:",
            concept: "The forward is a parity price, not a certainty forecast.",
            choices: [
              "Forward markets never use interest rates",
              "The forward embeds no-arbitrage pricing, not a guaranteed realized future spot outcome",
              "Spot rates cannot move after trade date",
              "PPP always dominates covered parity"
            ],
            answer: 1,
            explanation: "A forward rate is a no-arbitrage quote, not a guaranteed predictor of the realized spot rate."
          },
          {
            difficulty: "Hard",
            prompt: "If quoted cross rates imply a profitable loop after using the correct bid and offer sides, the manager has identified:",
            concept: "Executable cross-rate inconsistencies create triangular arbitrage opportunities.",
            choices: [
              "Purchasing power parity",
              "Triangular arbitrage",
              "Potential GDP",
              "A growth-accounting residual"
            ],
            answer: 1,
            explanation: "A profitable loop across three currencies is triangular arbitrage."
          }
        ]),
        ...buildSet("economics", 11, "Economics Item Set 4", "Carry Trade and Capital Flows", "A hedge fund borrows in a low-yield funding currency and invests in a high-yield target currency while watching reserve data and external financing conditions in the target economy.", [
          {
            difficulty: "Easy",
            prompt: "The carry trade earns its basic gross return from:",
            concept: "Carry is driven by the interest rate differential, subject to currency movement risk.",
            choices: [
              "Only spot appreciation",
              "The yield differential between the funding and target currencies",
              "Government fiscal deficit alone",
              "Bid-offer spread capture only"
            ],
            answer: 1,
            explanation: "The core source of carry trade return is the yield differential."
          },
          {
            difficulty: "Medium",
            prompt: "The carry trade is most vulnerable when the target currency:",
            concept: "Adverse exchange-rate moves can overwhelm interest-rate pickup.",
            choices: [
              "Appreciates modestly",
              "Depreciates sharply",
              "Keeps a small bid-offer spread",
              "Trades in a deep market"
            ],
            answer: 1,
            explanation: "A sharp depreciation of the invested currency can wipe out carry gains."
          },
          {
            difficulty: "Medium",
            prompt: "Which development would be a classic warning sign of currency stress in the target economy?",
            concept: "Reserve loss and fragile external financing often signal rising crisis risk.",
            choices: [
              "Rising productivity growth",
              "Large reserve losses and dependence on short-term external funding",
              "A narrowing current account deficit financed by stable FDI",
              "Lower import demand due to a cyclical slowdown only"
            ],
            answer: 1,
            explanation: "Reserve depletion plus short-term financing dependence are classic currency-stress signals."
          },
          {
            difficulty: "Hard",
            prompt: "If policymakers defend a peg with heavy intervention but investors doubt the regime, the most likely conclusion is:",
            concept: "Intervention without credibility may only delay adjustment.",
            choices: [
              "The peg is now guaranteed to hold",
              "Policy credibility matters, and intervention alone may not stop pressure",
              "PPP automatically removes speculative attack risk",
              "The funding currency becomes irrelevant"
            ],
            answer: 1,
            explanation: "Without credibility, intervention may not be enough to preserve the peg."
          }
        ]),
        ...buildSet("economics", 15, "Economics Item Set 5", "Growth Accounting Review", "A sovereign analyst compares two emerging economies. One has a young labor force and fast capital accumulation but weak productivity growth. The other has slower labor growth but stronger innovation and educational quality.", [
          {
            difficulty: "Easy",
            prompt: "Potential GDP growth is MOST directly supported by:",
            concept: "Long-run growth is driven by labor, capital, and productivity.",
            choices: [
              "Labor force growth, capital deepening, and productivity gains",
              "Only temporary fiscal stimulus",
              "Only current account surpluses",
              "Only nominal wage growth"
            ],
            answer: 0,
            explanation: "Potential growth depends on labor growth, capital deepening, and productivity."
          },
          {
            difficulty: "Medium",
            prompt: "Compared with capital deepening alone, stronger productivity growth is especially valuable because it:",
            concept: "Productivity improvements can support more durable growth than simple capital accumulation.",
            choices: [
              "Avoids all business cycles",
              "Supports growth without relying solely on adding more capital per worker",
              "Eliminates demographic risk",
              "Guarantees currency appreciation"
            ],
            answer: 1,
            explanation: "Productivity growth can drive durable gains beyond simply adding more capital."
          },
          {
            difficulty: "Medium",
            prompt: "An aging population would MOST likely pressure long-run potential growth through:",
            concept: "Demographics affect labor force growth and, therefore, potential output.",
            choices: [
              "Lower labor-force expansion",
              "Automatic higher productivity",
              "Guaranteed lower inflation only",
              "A stronger current account by definition"
            ],
            answer: 0,
            explanation: "Aging can reduce labor-force growth, which weighs on potential output."
          },
          {
            difficulty: "Hard",
            prompt: "For a long-horizon investor, the country with slower labor growth but stronger innovation may still be attractive because:",
            concept: "Productivity can compensate for demographic drag and support higher sustainable earnings growth.",
            choices: [
              "Innovation has no link to potential GDP",
              "Productivity gains can partly offset weaker demographic support",
              "Capital formation becomes irrelevant",
              "Exchange rates become fixed permanently"
            ],
            answer: 1,
            explanation: "Strong productivity and innovation can offset some demographic headwinds in long-run growth."
          }
        ]),
        ...buildSet("economics", 19, "Economics Item Set 6", "Trade and Convergence Discussion", "A development economist argues that trade openness, institutional quality, and education explain why some lower-income economies converge toward richer economies faster than others.", [
          {
            difficulty: "Medium",
            prompt: "A key reason trade openness can support long-run growth is that it:",
            concept: "Trade can improve specialization, scale, and diffusion of technology.",
            choices: [
              "Guarantees balanced budgets",
              "Can improve specialization and technology diffusion",
              "Eliminates all external shocks",
              "Removes the need for human capital"
            ],
            answer: 1,
            explanation: "Trade openness can support growth through specialization, scale, and technology diffusion."
          },
          {
            difficulty: "Hard",
            prompt: "Why do similar initial income levels NOT guarantee similar convergence outcomes?",
            concept: "Institutions, human capital, policy quality, and productivity conditions matter for convergence speed.",
            choices: [
              "Because only nominal GDP matters",
              "Because institutions and productivity drivers differ across economies",
              "Because capital accumulation has no effect",
              "Because PPP prevents convergence"
            ],
            answer: 1,
            explanation: "Convergence depends on institutions, human capital, and productivity drivers, not just starting income."
          }
        ]),
        ...buildSet("corporate", 7, "Corporate Item Set 3", "Repurchase Financing Case", "Lakefront Systems plans a large buyback after a year of strong cash generation. The CFO is considering whether to use existing cash, new debt, or a combination of both, while investors debate whether the transaction creates value or just optics.", [
          {
            difficulty: "Easy",
            prompt: "A debt-funded repurchase is most likely to increase:",
            concept: "Borrowing to repurchase shares typically raises leverage.",
            choices: [
              "Financial leverage",
              "Dividend tax rate",
              "Working capital automatically",
              "Operating margin by definition"
            ],
            answer: 0,
            explanation: "Debt-funded repurchases usually increase leverage."
          },
          {
            difficulty: "Medium",
            prompt: "An increase in EPS after the buyback would be strongest evidence of value creation if it were accompanied by:",
            concept: "Per-share metrics can be cosmetically improved, so analysts need broader economic context.",
            choices: [
              "No change in underlying cash generation and much higher risk",
              "A repurchase below intrinsic value without impairing balance-sheet resilience",
              "A sharp rise in leverage with no strategic rationale",
              "A decline in free cash flow"
            ],
            answer: 1,
            explanation: "Buying back undervalued shares without damaging financial flexibility is stronger evidence of value creation."
          },
          {
            difficulty: "Medium",
            prompt: "If the repurchase price exceeds pre-buyback book value per share, the transaction will most likely:",
            concept: "Repurchasing above book value per share usually lowers the metric for remaining holders.",
            choices: [
              "Increase book value per share",
              "Decrease book value per share",
              "Leave book value per share unchanged",
              "Eliminate leverage risk"
            ],
            answer: 1,
            explanation: "Repurchasing above book value per share typically lowers book value per share."
          },
          {
            difficulty: "Hard",
            prompt: "The BEST analyst takeaway is that a repurchase should be judged primarily by:",
            concept: "The exam wants economic reasoning, not just accounting optics.",
            choices: [
              "Whether EPS rises immediately",
              "Whether it improves intrinsic value per share net of financing and opportunity cost",
              "Whether management prefers repurchases personally",
              "Whether the share count declines"
            ],
            answer: 1,
            explanation: "Repurchases should be judged by their impact on intrinsic value per share, not just headline EPS."
          }
        ]),
        ...buildSet("corporate", 11, "Corporate Item Set 4", "Dividend Signaling Case", "Maple Ridge Foods has a long history of stable dividends. Earnings drop temporarily after a commodity-cost spike, but free cash flow remains solid and management is debating whether to keep the dividend flat, cut it, or replace it with a special dividend.", [
          {
            difficulty: "Easy",
            prompt: "Maintaining the regular dividend despite a temporary earnings decline may signal that management:",
            concept: "Stable dividends often reflect management's view of sustainable cash generation.",
            choices: [
              "Believes the setback is temporary and the payout remains supportable",
              "Has eliminated all business risk",
              "Must issue debt immediately",
              "Prefers dividends because repurchases are illegal"
            ],
            answer: 0,
            explanation: "Maintaining the regular dividend can signal confidence that the setback is temporary."
          },
          {
            difficulty: "Medium",
            prompt: "Compared with a regular dividend increase, a special dividend is generally interpreted as:",
            concept: "Special dividends carry a weaker permanence signal than regular dividend changes.",
            choices: [
              "A stronger commitment to permanent payout growth",
              "A less permanent distribution decision",
              "A required action under fair dealing",
              "An automatic reduction in WACC"
            ],
            answer: 1,
            explanation: "Special dividends are usually viewed as less permanent than regular dividend increases."
          },
          {
            difficulty: "Medium",
            prompt: "Which metric would be MOST useful in judging whether the dividend is actually sustainable?",
            concept: "Coverage must be assessed using economically relevant cash generation.",
            choices: [
              "Free cash flow coverage",
              "Only stock price momentum",
              "Only goodwill balance",
              "Only reported EPS without adjustment"
            ],
            answer: 0,
            explanation: "Free cash flow coverage is a strong test of payout sustainability."
          },
          {
            difficulty: "Hard",
            prompt: "If management cuts the dividend but simultaneously explains a high-return reinvestment opportunity, the market may respond less negatively because:",
            concept: "The use of retained cash matters to payout interpretation.",
            choices: [
              "Dividend cuts are always bullish",
              "Retaining cash for attractive reinvestment can offset some negative signaling",
              "Investors ignore payout policy entirely",
              "Repurchases and investment are the same thing"
            ],
            answer: 1,
            explanation: "A credible high-return reinvestment rationale can soften the negative signal from a dividend cut."
          }
        ]),
        ...buildSet("corporate", 15, "Corporate Item Set 5", "Governance and WACC Review", "A family-controlled industrial company is expanding into a new region while financing costs are rising. Minority investors worry about related-party transactions and whether the firm's governance profile is increasing the return demanded by capital providers.", [
          {
            difficulty: "Easy",
            prompt: "A weak governance profile can raise valuation concern primarily because it may:",
            concept: "Governance affects agency risk, capital allocation, and the return investors demand.",
            choices: [
              "Lower agency risk automatically",
              "Increase the risk premium demanded by investors",
              "Remove refinancing risk",
              "Guarantee higher payout"
            ],
            answer: 1,
            explanation: "Poor governance can increase perceived agency risk and raise required return."
          },
          {
            difficulty: "Medium",
            prompt: "A family-controlled structure may be beneficial when it:",
            concept: "Ownership concentration can help or hurt depending on incentives and protections.",
            choices: [
              "Prevents all strategic mistakes",
              "Improves long-term oversight without abusing minority shareholders",
              "Eliminates the need for independent directors",
              "Guarantees lower taxes"
            ],
            answer: 1,
            explanation: "Concentrated ownership can help when it supports oversight and aligns long-term incentives."
          },
          {
            difficulty: "Medium",
            prompt: "Which development would MOST likely increase WACC?",
            concept: "Higher perceived risk tends to increase the required return on both debt and equity.",
            choices: [
              "Lower risk premiums and stronger governance",
              "Higher leverage risk and weaker investor protections",
              "A fall in credit spreads and lower policy rates",
              "Improved disclosure and oversight"
            ],
            answer: 1,
            explanation: "Higher leverage risk and weaker protections raise required returns and tend to increase WACC."
          },
          {
            difficulty: "Hard",
            prompt: "Why can ESG analysis matter directly in cost-of-capital work?",
            concept: "ESG matters when it affects economics and risk, not because it is fashionable.",
            choices: [
              "Because ESG scores replace bond yields",
              "Because ESG exposures can change cash-flow risk, legal risk, and financing terms",
              "Because ESG issues have no bearing on valuation",
              "Because governance only affects marketing"
            ],
            answer: 1,
            explanation: "ESG can matter directly when it affects risk, financing access, or expected cash flows."
          }
        ]),
        ...buildSet("corporate", 19, "Corporate Item Set 6", "Spin-Off Review", "Granite Holdings is considering spinning off its medical devices unit from its mature packaging business. Management argues that each business would be easier for investors to value and manage separately.", [
          {
            difficulty: "Medium",
            prompt: "The main value-unlocking argument for the spin-off is that:",
            concept: "Separate businesses can sometimes be worth more apart than together.",
            choices: [
              "Every spin-off lowers taxes",
              "Focused businesses may be valued more clearly as stand-alone entities",
              "Conglomerates can never create value",
              "Spin-offs eliminate cost of equity"
            ],
            answer: 1,
            explanation: "A spin-off can unlock value when investors value the separate businesses more clearly on their own."
          },
          {
            difficulty: "Hard",
            prompt: "Which follow-up question is MOST important before accepting management's argument?",
            concept: "Restructuring value depends on economics, not just narrative simplicity.",
            choices: [
              "Whether the businesses will have sustainable stand-alone capital structures and realistic synergy loss assumptions",
              "Whether each business can adopt a new logo",
              "Whether dividends will definitely rise immediately",
              "Whether accounting policy will become identical"
            ],
            answer: 0,
            explanation: "Analysts should test whether the separated businesses have viable stand-alone economics and financing."
          }
        ]),
        ...buildSet("fsa", 7, "FSA Item Set 3", "Intercorporate Investment Review", "Summit Industrial buys a 30% stake in a supplier and later considers acquiring control. The analyst must compare how the accounting presentation would change under significant influence versus control.", [
          {
            difficulty: "Easy",
            prompt: "A 30% stake with significant influence but not control is MOST likely accounted for using the:",
            concept: "Significant influence usually points to the equity method.",
            choices: [
              "Equity method",
              "Current rate method",
              "Completed-contract method",
              "Cost depletion method"
            ],
            answer: 0,
            explanation: "A 30% stake with significant influence is commonly accounted for under the equity method."
          },
          {
            difficulty: "Medium",
            prompt: "Compared with full consolidation, equity method accounting will usually result in:",
            concept: "Revenue is not fully consolidated under the equity method.",
            choices: [
              "Higher reported revenue",
              "Lower reported revenue",
              "Identical leverage by definition",
              "No effect on net income ever"
            ],
            answer: 1,
            explanation: "The equity method usually reports lower revenue than full consolidation because the investee's sales are not added line by line."
          },
          {
            difficulty: "Medium",
            prompt: "If Summit later acquires control of the supplier, the balance sheet would MOST likely show:",
            concept: "Control usually brings line-by-line recognition of acquired assets and liabilities.",
            choices: [
              "No recognition of the supplier's liabilities",
              "Line-by-line consolidation of the supplier's assets and liabilities",
              "Only dividend income going forward",
              "Only off-balance-sheet disclosure"
            ],
            answer: 1,
            explanation: "Control leads to line-by-line consolidation of assets and liabilities."
          },
          {
            difficulty: "Hard",
            prompt: "Why is comparability adjustment important when one peer uses the equity method and another fully consolidates a similar investment?",
            concept: "Different accounting methods can change reported scale and leverage even if economics are similar.",
            choices: [
              "Because one firm must be violating accounting rules",
              "Because reported revenue, margins, and leverage may differ for accounting reasons rather than economic reasons",
              "Because analysts should never compare such firms",
              "Because equity method firms have no operating risk"
            ],
            answer: 1,
            explanation: "Analysts must adjust for differences in accounting presentation so peer comparisons reflect economics."
          }
        ]),
        ...buildSet("fsa", 11, "FSA Item Set 4", "Share-Based Pay and Pensions", "An analyst is normalizing earnings for a software company that uses stock grants heavily and for a mature industrial firm with a large defined benefit pension plan.", [
          {
            difficulty: "Easy",
            prompt: "Ignoring share-based compensation would MOST likely:",
            concept: "Stock compensation is a real compensation cost even if non-cash at grant date.",
            choices: [
              "Overstate normalized profitability",
              "Understate book value automatically",
              "Eliminate dilution risk",
              "Have no valuation effect"
            ],
            answer: 0,
            explanation: "Ignoring share-based compensation would overstate profitability."
          },
          {
            difficulty: "Medium",
            prompt: "A lower pension discount rate will MOST likely:",
            concept: "Lower discount rates raise the present value of pension obligations.",
            choices: [
              "Reduce the pension obligation",
              "Increase the pension obligation",
              "Eliminate service cost",
              "Raise operating cash flow immediately"
            ],
            answer: 1,
            explanation: "Lower discount rates increase the present value of pension obligations."
          },
          {
            difficulty: "Medium",
            prompt: "The common analytical thread across both stock compensation and pensions is that the analyst should:",
            concept: "The goal is to reflect the true economic burden, not just the convenient accounting view.",
            choices: [
              "Focus only on cash this quarter",
              "Assess the economic cost and future claim on shareholders",
              "Ignore dilution and obligations because they are non-cash",
              "Treat both as extraordinary items"
            ],
            answer: 1,
            explanation: "Both require analysts to capture the true economic burden on shareholders."
          },
          {
            difficulty: "Hard",
            prompt: "Which adjustment is MOST appropriate when comparing a stock-heavy compensation firm to a peer that pays more cash salary?",
            concept: "Comparability requires recognizing compensation economically even if payment form differs.",
            choices: [
              "Exclude stock compensation entirely from both firms",
              "Recognize compensation costs on a comparable economic basis before comparing margins",
              "Use only revenue growth",
              "Value both companies on cash alone"
            ],
            answer: 1,
            explanation: "Margins should be compared after recognizing compensation on a comparable economic basis."
          }
        ]),
        ...buildSet("fsa", 15, "FSA Item Set 5", "Foreign Currency Translation", "A US parent reports a European subsidiary that uses the euro as its functional currency. The euro weakens materially against the dollar over the reporting period.", [
          {
            difficulty: "Easy",
            prompt: "Under the current rate method, a weaker euro would MOST likely cause translated euro-denominated assets to:",
            concept: "A weaker local currency translates into lower reported asset values in the parent currency.",
            choices: [
              "Rise in dollar terms",
              "Fall in dollar terms",
              "Remain unchanged by definition",
              "Convert into liabilities"
            ],
            answer: 1,
            explanation: "A weaker euro usually lowers translated euro-denominated assets in dollar terms."
          },
          {
            difficulty: "Medium",
            prompt: "Why should analysts separate translation effects from operating performance?",
            concept: "Reported growth can change because of currency translation even if local operating performance did not.",
            choices: [
              "Because translation gains are illegal",
              "Because exchange-rate moves can distort reported growth without changing local economics",
              "Because local sales are never relevant",
              "Because subsidiaries stop producing under the current rate method"
            ],
            answer: 1,
            explanation: "Translation can change reported results even when local operating performance is unchanged."
          },
          {
            difficulty: "Medium",
            prompt: "A company with strong reported sales growth but a weaker functional currency may need what additional analyst step?",
            concept: "Analysts often restate performance on a constant-currency basis.",
            choices: [
              "Constant-currency analysis",
              "Elimination of all foreign operations",
              "Use of book value only",
              "Ignoring segment disclosure"
            ],
            answer: 0,
            explanation: "Constant-currency analysis helps isolate operating growth from exchange-rate translation effects."
          },
          {
            difficulty: "Hard",
            prompt: "Translation-method differences between peers matter MOST because they can affect:",
            concept: "Accounting presentation differences can distort comparability across firms.",
            choices: [
              "Only the number of footnotes",
              "Reported equity, profitability metrics, and trend interpretation",
              "Only corporate tax rates",
              "Only credit ratings"
            ],
            answer: 1,
            explanation: "Translation-method differences can affect reported equity and profitability metrics, which matter for peer comparison."
          }
        ]),
        ...buildSet("fsa", 19, "FSA Item Set 6", "Bank Quality Review", "A bank reports stable earnings, but nonperforming assets are rising and wholesale funding dependence has increased. A junior analyst argues that headline ROE proves the franchise remains strong.", [
          {
            difficulty: "Medium",
            prompt: "The strongest rebuttal is that for banks, analysts should focus more heavily on:",
            concept: "Bank analysis requires asset quality and funding quality, not just headline profitability.",
            choices: [
              "Only dividend yield",
              "Asset quality and funding structure in addition to ROE",
              "Only capex intensity",
              "Only gross margin"
            ],
            answer: 1,
            explanation: "For banks, asset quality and funding quality are critical alongside profitability."
          },
          {
            difficulty: "Hard",
            prompt: "Rising nonperforming assets while earnings remain stable most likely suggests:",
            concept: "Headline earnings can look fine even as credit quality deteriorates beneath the surface.",
            choices: [
              "Credit quality may be deteriorating despite calm headline profit",
              "The bank is automatically undervalued",
              "Loan-loss reserves are irrelevant",
              "Wholesale funding has become safer"
            ],
            answer: 0,
            explanation: "Stable earnings do not eliminate the concern created by worsening credit quality."
          }
        ]),
        ...buildSet("equity", 7, "Equity Item Set 3", "Dividend Model Case", "A utility has stable payout, low reinvestment needs, and a long record of predictable dividend growth. An industrial peer has lumpy payout, meaningful leverage changes, and more volatile reinvestment needs.", [
          {
            difficulty: "Easy",
            prompt: "The utility is MOST likely a strong candidate for:",
            concept: "Stable payout businesses often fit dividend discount models well.",
            choices: [
              "Dividend discount valuation",
              "Only liquidation value",
              "Residual income because dividends are meaningless",
              "Ignoring payout completely"
            ],
            answer: 0,
            explanation: "A stable, predictable dividend payer is a classic DDM candidate."
          },
          {
            difficulty: "Medium",
            prompt: "The industrial peer is more likely to require FCFF or FCFE analysis because:",
            concept: "When payout policy is noisy, free cash flow methods can better reflect economics.",
            choices: [
              "Lumpy payout can make dividends a poor proxy for value",
              "Free cash flow is only for utilities",
              "DDM cannot be used for any cyclical firm",
              "Leverage never matters in valuation"
            ],
            answer: 0,
            explanation: "Erratic payout makes free cash flow approaches more useful."
          },
          {
            difficulty: "Medium",
            prompt: "Holding growth constant, a higher required return in the Gordon model will:",
            concept: "A higher discount rate lowers present value in the Gordon model.",
            choices: [
              "Raise value",
              "Lower value",
              "Leave value unchanged",
              "Raise PVGO by definition"
            ],
            answer: 1,
            explanation: "A higher required return lowers value in the Gordon framework."
          },
          {
            difficulty: "Hard",
            prompt: "The BEST reason not to force the same model on both companies is that:",
            concept: "Model choice should follow business reality and investor claim.",
            choices: [
              "Valuation models are interchangeable",
              "A valuation model should fit the company's payout and financing economics",
              "Utilities cannot be valued with any model",
              "Required return only matters for financial firms"
            ],
            answer: 1,
            explanation: "The model should match the company's actual payout and financing characteristics."
          }
        ]),
        ...buildSet("equity", 11, "Equity Item Set 4", "Residual Income Case", "A bank retains most earnings and pays a modest dividend, but its book value is transparent and return on equity is expected to exceed the cost of equity for several years.", [
          {
            difficulty: "Easy",
            prompt: "Residual income is attractive in this setting primarily because:",
            concept: "Residual income works well when book value is meaningful and payout is not the main valuation anchor.",
            choices: [
              "Book value provides a useful anchor and dividends are less informative",
              "The company has no equity",
              "Return on equity no longer matters",
              "Banks cannot be valued with price-based methods"
            ],
            answer: 0,
            explanation: "Residual income is useful when book value is meaningful and dividends are less informative."
          },
          {
            difficulty: "Medium",
            prompt: "Positive residual income exists when return on equity is:",
            concept: "Residual income is created when ROE exceeds the cost of equity.",
            choices: [
              "Below the cost of equity",
              "Equal to the cost of equity",
              "Above the cost of equity",
              "Negative regardless of cost of equity"
            ],
            answer: 2,
            explanation: "Residual income is positive when ROE exceeds the cost of equity."
          },
          {
            difficulty: "Medium",
            prompt: "If excess ROE fades faster than expected, intrinsic value under residual income would MOST likely:",
            concept: "Shorter excess-return duration reduces residual income value.",
            choices: [
              "Rise",
              "Fall",
              "Remain unchanged",
              "Become equal to sales per share"
            ],
            answer: 1,
            explanation: "If excess returns fade faster, the value from future residual income falls."
          },
          {
            difficulty: "Hard",
            prompt: "The most important modeling judgment in this case is the:",
            concept: "The persistence of excess returns often drives residual income value more than mechanical algebra.",
            choices: [
              "Par value of shares",
              "Duration and fade of excess return on equity",
              "Number of footnotes in the annual report",
              "Bid-offer spread of the stock"
            ],
            answer: 1,
            explanation: "Residual income valuation is especially sensitive to how long excess ROE persists."
          }
        ]),
        ...buildSet("equity", 15, "Equity Item Set 5", "Market-Implied Growth", "A consumer brand trades at a premium multiple to peers. The PM's reverse-engineering work suggests the current stock price assumes margin expansion and revenue growth well above the team's base case.", [
          {
            difficulty: "Easy",
            prompt: "Reverse-engineering a stock price is useful because it helps the analyst identify:",
            concept: "The market price embeds assumptions that can be compared with the analyst's view.",
            choices: [
              "The market's implied expectations",
              "Only book value",
              "Only past volatility",
              "Guaranteed alpha"
            ],
            answer: 0,
            explanation: "Reverse-engineering helps identify the assumptions the market price appears to reflect."
          },
          {
            difficulty: "Medium",
            prompt: "If implied growth is much higher than the analyst's sustainable-growth estimate, the cleanest interpretation is that:",
            concept: "A valuation gap may reflect optimistic market assumptions rather than a simple bargain.",
            choices: [
              "The stock is automatically cheap",
              "The market is pricing a more optimistic future than the analyst believes is sustainable",
              "Required return no longer matters",
              "Residual income becomes unusable"
            ],
            answer: 1,
            explanation: "A high implied growth rate suggests the market is embedding more optimism than the analyst's base case."
          },
          {
            difficulty: "Medium",
            prompt: "If your upside case depends entirely on heroic margin expansion, the BEST conclusion is:",
            concept: "Valuation stories that rely on aggressive assumptions deserve skepticism.",
            choices: [
              "The thesis may be fragile",
              "The stock is guaranteed to outperform",
              "Sensitivity analysis is unnecessary",
              "Multiples no longer matter"
            ],
            answer: 0,
            explanation: "A thesis that depends on heroic assumptions is fragile and should be stress-tested carefully."
          },
          {
            difficulty: "Hard",
            prompt: "Which follow-up step is MOST appropriate after identifying aggressive implied assumptions?",
            concept: "The analyst should test whether those assumptions are consistent with industry structure and competitive advantage duration.",
            choices: [
              "Compare the assumptions with industry economics and competitive durability",
              "Ignore peer analysis completely",
              "Switch to book value only",
              "Assume the market cannot be wrong"
            ],
            answer: 0,
            explanation: "The next step is to test whether the implied assumptions are realistic relative to industry economics."
          }
        ]),
        ...buildSet("equity", 19, "Equity Item Set 6", "PVGO and FCFF Comparison", "A high-return software company and a mature distributor have similar current earnings yields, but the software firm reinvests heavily at attractive returns while the distributor returns most cash to shareholders.", [
          {
            difficulty: "Medium",
            prompt: "The software firm's PVGO is most likely higher because:",
            concept: "PVGO captures the value of profitable future growth opportunities.",
            choices: [
              "It has more profitable reinvestment opportunities",
              "It pays a lower dividend today",
              "Its accounting standards are different",
              "Its beta must be zero"
            ],
            answer: 0,
            explanation: "PVGO is higher when profitable future reinvestment opportunities are more valuable."
          },
          {
            difficulty: "Hard",
            prompt: "FCFF may be preferred to FCFE for the software firm if:",
            concept: "FCFF is often cleaner when financing policy is evolving or debt issuance is volatile.",
            choices: [
              "Leverage policy is changing and equity cash flow is noisy",
              "Dividends are perfectly stable",
              "There is no need to value debt claims",
              "Only trailing P/E is observable"
            ],
            answer: 0,
            explanation: "FCFF is often the cleaner valuation tool when leverage and debt flows are changing."
          }
        ]),
        ...buildSet("fixed-income", 7, "Fixed Income Item Set 3", "Bootstrapping and Forward Rates", "A rates analyst bootstraps zero rates from the Treasury curve and uses them to compare the fair value of several cash-flow streams that all share similar maturities but different coupon structures.", [
          {
            difficulty: "Easy",
            prompt: "Bootstrapping is used because:",
            concept: "Different cash flows should be discounted using maturity-specific spot rates.",
            choices: [
              "Every bond should use the same discount rate",
              "It creates maturity-specific discount rates for each cash flow",
              "It eliminates reinvestment risk",
              "It replaces all spread analysis"
            ],
            answer: 1,
            explanation: "Bootstrapping creates the zero rates needed to discount each maturity-specific cash flow."
          },
          {
            difficulty: "Medium",
            prompt: "A forward rate derived from the spot curve MOST directly represents:",
            concept: "Forward rates are the no-arbitrage rates implied for future borrowing or lending periods.",
            choices: [
              "A guaranteed future policy rate",
              "A market-implied future rate under current no-arbitrage conditions",
              "Only realized inflation",
              "Only credit spread"
            ],
            answer: 1,
            explanation: "A forward rate is the market-implied future rate consistent with the current spot curve."
          },
          {
            difficulty: "Medium",
            prompt: "Two bonds with different coupons but identical credit risk and maturity can still require different analysis because:",
            concept: "Cash-flow timing differences matter when the curve is not flat.",
            choices: [
              "Cash-flow timing matters when discount rates vary by maturity",
              "Coupons never affect value",
              "Only duration matters",
              "The spot curve ignores timing"
            ],
            answer: 0,
            explanation: "Cash-flow timing matters because each payment may be discounted at a different spot rate."
          },
          {
            difficulty: "Hard",
            prompt: "Why is the single yield-to-maturity framework weaker than arbitrage-free valuation for many tasks?",
            concept: "A single yield compresses a term structure into one number and can hide path and timing effects.",
            choices: [
              "Because yield to maturity is never used in practice",
              "Because it compresses different discount rates into one number and can hide term-structure detail",
              "Because it ignores all coupon payments",
              "Because it only works for zero-coupon bonds"
            ],
            answer: 1,
            explanation: "Arbitrage-free valuation is stronger when term-structure detail matters and a single yield is too blunt."
          }
        ]),
        ...buildSet("fixed-income", 11, "Fixed Income Item Set 4", "Callable Bond OAS Case", "A manager compares two callable corporate bonds with similar credit quality but different implied volatilities. The spread on one bond appears attractive on a nominal basis, but the team wants to know whether optionality explains the difference.", [
          {
            difficulty: "Easy",
            prompt: "A callable bond can be viewed as:",
            concept: "The investor effectively owns the straight bond and is short the issuer's call option.",
            choices: [
              "A straight bond plus a call owned by the investor",
              "A straight bond minus an issuer call option",
              "A putable bond plus a swap",
              "A zero-coupon bond only"
            ],
            answer: 1,
            explanation: "A callable bond is economically a straight bond minus the value of the issuer's call option."
          },
          {
            difficulty: "Medium",
            prompt: "If implied interest-rate volatility rises, the callable bond should MOST likely:",
            concept: "Higher volatility makes the issuer's call more valuable, which hurts the investor.",
            choices: [
              "Become more valuable than a straight bond",
              "Lose relative value versus a straight bond",
              "Behave exactly like a zero-coupon bond",
              "Ignore spread changes"
            ],
            answer: 1,
            explanation: "Higher volatility increases the value of the issuer's call option and reduces the callable bond's value."
          },
          {
            difficulty: "Medium",
            prompt: "OAS is especially useful because it attempts to:",
            concept: "OAS helps compare spread after adjusting for embedded option cost.",
            choices: [
              "Ignore optionality entirely",
              "Strip out the option effect from the observed spread",
              "Replace duration measurement",
              "Guarantee excess return"
            ],
            answer: 1,
            explanation: "OAS adjusts the spread measure to account for embedded option value."
          },
          {
            difficulty: "Hard",
            prompt: "If one callable bond has a wider nominal spread but a narrower OAS than another, the best interpretation is that:",
            concept: "The wider nominal spread may largely reflect more expensive embedded optionality rather than better credit compensation.",
            choices: [
              "The wider-spread bond is definitely cheaper on a risk-adjusted basis",
              "A larger part of the nominal spread may be compensation for option cost rather than pure credit value",
              "Both bonds must have identical volatility",
              "The narrower OAS bond has lower duration by definition"
            ],
            answer: 1,
            explanation: "A wider nominal spread can be misleading when more of it simply reflects embedded option cost."
          }
        ]),
        ...buildSet("fixed-income", 15, "Fixed Income Item Set 5", "Credit Spread Case", "A credit PM compares a utility bond and a telecom bond after spreads widen across the market. The utility's spread widens modestly, but the telecom bond widens sharply on concerns about refinancing needs.", [
          {
            difficulty: "Easy",
            prompt: "A wider credit spread MOST directly means investors now demand:",
            concept: "Spread widening reflects more compensation required over the benchmark curve.",
            choices: [
              "Less compensation for risk",
              "More compensation for credit and related risks",
              "A lower benchmark yield only",
              "No change in expected return"
            ],
            answer: 1,
            explanation: "A wider credit spread means investors demand more compensation for credit-related risk."
          },
          {
            difficulty: "Medium",
            prompt: "The sharper widening in the telecom bond is most consistent with concern about:",
            concept: "Refinancing pressure can raise perceived default and liquidity risk.",
            choices: [
              "Rising refinancing and issuer-specific risk",
              "Falling leverage",
              "Guaranteed spread compression",
              "Lower coupon frequency"
            ],
            answer: 0,
            explanation: "Refinancing stress can push issuer-specific spread widening."
          },
          {
            difficulty: "Medium",
            prompt: "Which spread component can change even if default expectations are unchanged?",
            concept: "Liquidity and risk appetite also influence spreads.",
            choices: [
              "Only benchmark inflation",
              "Liquidity and risk-premium components",
              "Coupon accrual only",
              "Book value per share"
            ],
            answer: 1,
            explanation: "Spreads can move because of liquidity or risk-appetite changes, not just default probability."
          },
          {
            difficulty: "Hard",
            prompt: "The BEST next analytical step is to compare the telecom issuer's:",
            concept: "Credit analysis requires linking spread move to leverage, coverage, and maturity profile.",
            choices: [
              "Maturity wall, leverage, and cash-flow coverage",
              "Dividend payout only",
              "Stock split history",
              "Tax loss carryforwards only"
            ],
            answer: 0,
            explanation: "Refinancing concerns should be analyzed through maturity schedule, leverage, and coverage."
          }
        ]),
        ...buildSet("fixed-income", 19, "Fixed Income Item Set 6", "CDS Overlay Case", "A portfolio manager wants to reduce exposure to one issuer ahead of a catalyst but prefers not to liquidate the cash bond position because of tax and liquidity considerations.", [
          {
            difficulty: "Medium",
            prompt: "Buying CDS protection would MOST likely help by:",
            concept: "CDS can separate credit exposure from physical bond ownership.",
            choices: [
              "Reducing credit exposure without necessarily selling the bond",
              "Eliminating all interest-rate risk",
              "Converting the bond into cash immediately",
              "Increasing default exposure"
            ],
            answer: 0,
            explanation: "Buying protection is a common way to hedge credit exposure while retaining bond ownership."
          },
          {
            difficulty: "Hard",
            prompt: "The key advantage of the CDS overlay in this situation is that it:",
            concept: "CDS can be an efficient implementation tool when selling the cash bond is costly or undesirable.",
            choices: [
              "Removes all basis risk in all markets",
              "Allows credit hedging while preserving the original cash position",
              "Guarantees positive carry",
              "Stops spread volatility"
            ],
            answer: 1,
            explanation: "The overlay allows targeted credit hedging while leaving the cash position in place."
          }
        ]),
        ...buildSet("derivatives", 7, "Derivatives Item Set 3", "Equity Forward Case", "A trader prices a six-month equity forward on a stock with a known dividend payment before expiry. The desk compares the fair contract price with a quoted forward that appears too high.", [
          {
            difficulty: "Easy",
            prompt: "Relative to a no-dividend stock, the fair forward price on a dividend-paying stock should generally be:",
            concept: "Expected dividends reduce the cost of carrying the stock forward.",
            choices: [
              "Higher because dividends increase value to the long forward",
              "Lower because dividends reduce the carry-adjusted forward price",
              "Identical regardless of dividends",
              "Zero if the dividend is known"
            ],
            answer: 1,
            explanation: "Expected dividends reduce the fair forward price relative to an otherwise similar no-dividend stock."
          },
          {
            difficulty: "Medium",
            prompt: "If the market forward is above no-arbitrage fair value, a classic cash-and-carry response would involve:",
            concept: "When forward is overpriced, the arbitrageur buys the asset and sells the rich forward.",
            choices: [
              "Shorting the stock and buying the forward",
              "Buying the stock and selling the forward",
              "Buying both the stock and the forward only",
              "Doing nothing because arbitrage is impossible"
            ],
            answer: 1,
            explanation: "An overpriced forward invites buying the underlying and selling the forward, subject to frictions."
          },
          {
            difficulty: "Medium",
            prompt: "After the contract is initiated, the long forward gains value when:",
            concept: "The long benefits when the market forward or spot rises relative to the contracted delivery price.",
            choices: [
              "The current market forward rises above the originally contracted forward terms",
              "The contract's delivery price rises automatically",
              "Dividends are forgotten",
              "Time to maturity increases"
            ],
            answer: 0,
            explanation: "The long gains when current market conditions make the original contracted price look favorable."
          },
          {
            difficulty: "Hard",
            prompt: "The case illustrates why analysts should separate forward pricing from forward valuation because:",
            concept: "The fair initiation price and the later mark-to-market value are related but not identical concepts.",
            choices: [
              "Both are always zero",
              "The fair initiation price makes value near zero at trade date, while later value reflects market change",
              "Valuation only matters for options",
              "Pricing only matters for swaps"
            ],
            answer: 1,
            explanation: "The initiation price sets initial value near zero, but later value changes as markets move."
          }
        ]),
        ...buildSet("derivatives", 11, "Derivatives Item Set 4", "Binomial Option Case", "A portfolio manager values a short-dated call option using a one-period and then a two-period binomial tree to understand how replication and risk-neutral pricing produce the option value.", [
          {
            difficulty: "Easy",
            prompt: "The binomial model values an option by:",
            concept: "Binomial valuation is built on replication and risk-neutral pricing.",
            choices: [
              "Discounting expected payoffs using the stock's historical return",
              "Replicating option payoffs across future states and discounting risk-neutral expected values",
              "Ignoring the strike price",
              "Using accounting earnings growth only"
            ],
            answer: 1,
            explanation: "A binomial tree prices the option using replication logic and risk-neutral discounting."
          },
          {
            difficulty: "Medium",
            prompt: "Compared with a European option, an American option requires an extra check at each node because:",
            concept: "American options can be exercised early.",
            choices: [
              "Volatility disappears",
              "Early exercise may be optimal",
              "Put-call parity no longer exists",
              "The underlying no longer matters"
            ],
            answer: 1,
            explanation: "American options require checking whether early exercise is optimal at each node."
          },
          {
            difficulty: "Medium",
            prompt: "The hedge ratio in a one-period binomial tree is intended to:",
            concept: "The hedge ratio creates a replicating portfolio.",
            choices: [
              "Maximize leverage",
              "Replicate the option payoff using the underlying and cash",
              "Estimate historical volatility",
              "Guarantee a positive gamma"
            ],
            answer: 1,
            explanation: "The hedge ratio is chosen to replicate the option payoff."
          },
          {
            difficulty: "Hard",
            prompt: "Why is binomial intuition so valuable even when closed-form formulas are available?",
            concept: "The tree reveals the underlying replication logic and exercise decision structure.",
            choices: [
              "Because closed-form formulas are never tested",
              "Because it shows the state-by-state replication and exercise logic behind option prices",
              "Because it eliminates the need to know volatility",
              "Because it only applies to bonds"
            ],
            answer: 1,
            explanation: "The binomial framework makes the replication and exercise logic of option pricing transparent."
          }
        ]),
        ...buildSet("derivatives", 15, "Derivatives Item Set 5", "Parity and Greeks Case", "An options desk notices that one call-put pair on the same stock and strike looks inconsistent with the stock price and the present value of the strike. The trader is also monitoring how quickly the hedge needs to be rebalanced after large price moves.", [
          {
            difficulty: "Easy",
            prompt: "Put-call parity is primarily used to check whether:",
            concept: "Parity tests consistency across calls, puts, the underlying, and financing.",
            choices: [
              "Option markets are consistent with no-arbitrage",
              "Volatility is always rising",
              "Dividends are zero",
              "Only American options are correctly priced"
            ],
            answer: 0,
            explanation: "Put-call parity is a no-arbitrage consistency check across option prices and the underlying."
          },
          {
            difficulty: "Medium",
            prompt: "Delta is best interpreted as the option's:",
            concept: "Delta measures first-order sensitivity to the underlying.",
            choices: [
              "Sensitivity to time decay only",
              "First-order sensitivity to changes in the underlying price",
              "Sensitivity to accounting policy",
              "Probability of default"
            ],
            answer: 1,
            explanation: "Delta measures how the option's value changes for a small move in the underlying."
          },
          {
            difficulty: "Medium",
            prompt: "Gamma matters to a delta-hedged trader because it describes:",
            concept: "Gamma measures how quickly delta changes as the underlying moves.",
            choices: [
              "How quickly the hedge ratio changes after price moves",
              "The cost of carry on a forward",
              "The current dividend yield",
              "The spread duration of a bond"
            ],
            answer: 0,
            explanation: "Gamma matters because it shows how quickly the hedge ratio itself can become stale."
          },
          {
            difficulty: "Hard",
            prompt: "If gamma is high, the trader should expect:",
            concept: "High gamma means more frequent hedge adjustment may be required.",
            choices: [
              "A more stable static hedge",
              "Less need for rebalancing",
              "More frequent hedge maintenance after price changes",
              "Zero vega"
            ],
            answer: 2,
            explanation: "High gamma implies delta changes quickly, so hedges may need frequent rebalancing."
          }
        ]),
        ...buildSet("derivatives", 19, "Derivatives Item Set 6", "Swap Valuation Case", "An asset manager entered into a pay-floating, receive-fixed interest rate swap six months ago. Since then, comparable market swap rates have fallen meaningfully.", [
          {
            difficulty: "Medium",
            prompt: "The receive-fixed position should MOST likely now be:",
            concept: "Receiving a fixed rate above current market rates is valuable.",
            choices: [
              "More valuable",
              "Less valuable",
              "Worthless",
              "Equivalent to owning equity"
            ],
            answer: 0,
            explanation: "The position becomes more valuable when current market fixed rates fall below the contracted fixed rate."
          },
          {
            difficulty: "Hard",
            prompt: "The valuation gain arises because the contract now lets the manager:",
            concept: "The existing swap fixed rate is favorable relative to current market fixed terms.",
            choices: [
              "Receive a fixed rate above what the market now offers",
              "Avoid all floating-rate exposure forever",
              "Exchange the notional principal",
              "Eliminate counterparty risk"
            ],
            answer: 0,
            explanation: "The receive-fixed leg is valuable because it is above the rate now available in the market."
          }
        ]),
        ...buildSet("alternatives", 7, "Alternatives Item Set 3", "Commodity Index Case", "A multi-asset strategist uses a broad commodity futures index to express an inflation-sensitive view. The curve in several key components is in contango, while collateral yields are modest.", [
          {
            difficulty: "Easy",
            prompt: "The commodity futures investor's total return can include:",
            concept: "Commodity futures exposure has multiple return components.",
            choices: [
              "Spot return only",
              "Spot, roll, and collateral return",
              "Only rental income",
              "Only dividend yield"
            ],
            answer: 1,
            explanation: "Commodity futures returns are often described as spot return plus roll return plus collateral return."
          },
          {
            difficulty: "Medium",
            prompt: "Contango is most likely to create:",
            concept: "Rolling long futures in contango often creates negative roll return.",
            choices: [
              "Positive roll return for a long-only investor",
              "Roll drag for a long-only investor",
              "No effect on return decomposition",
              "Guaranteed spot appreciation"
            ],
            answer: 1,
            explanation: "Contango tends to create roll drag for a long investor repeatedly rolling contracts."
          },
          {
            difficulty: "Medium",
            prompt: "Low collateral yields would most directly reduce which component?",
            concept: "Collateral return depends on the yield earned on the collateral posted against the futures exposure.",
            choices: [
              "Spot return",
              "Collateral return",
              "Convenience yield of the physical commodity only",
              "All return components equally"
            ],
            answer: 1,
            explanation: "Low collateral yields directly reduce the collateral-return component."
          },
          {
            difficulty: "Hard",
            prompt: "The main lesson from this case is that a good inflation view can still disappoint if:",
            concept: "Implementation through futures can underperform because return components move differently.",
            choices: [
              "Spot moves favorably but roll drag and low collateral return offset gains",
              "Only spot price matters",
              "Commodity indexes are identical to physical holdings",
              "Term structure never matters"
            ],
            answer: 0,
            explanation: "Commodity implementation can disappoint when roll drag and low collateral yields offset spot gains."
          }
        ]),
        ...buildSet("alternatives", 11, "Alternatives Item Set 4", "Private Real Estate Case", "A family office is evaluating a warehouse property in a fast-growing logistics corridor. The appraised value looks stable, but local supply is also rising and several large leases renew within two years.", [
          {
            difficulty: "Easy",
            prompt: "A key advantage of private real estate analysis is that it focuses on:",
            concept: "Private real estate valuation starts with property-level cash flow drivers.",
            choices: [
              "Property-level economics such as occupancy, rent, and capex",
              "Only stock-market sentiment",
              "Only management guidance",
              "Only inflation forecasts"
            ],
            answer: 0,
            explanation: "Private real estate analysis centers on property-level economics and cash flow drivers."
          },
          {
            difficulty: "Medium",
            prompt: "The stable appraisal should be interpreted cautiously because:",
            concept: "Appraisals can lag market-clearing conditions.",
            choices: [
              "Appraisal values often move faster than market prices",
              "Appraisal-based valuations may lag changing local supply-demand conditions",
              "Warehouses never face vacancy risk",
              "Lease rollover is irrelevant"
            ],
            answer: 1,
            explanation: "Appraisal values can lag the real change in local market conditions."
          },
          {
            difficulty: "Medium",
            prompt: "Large near-term lease renewals matter primarily because they affect:",
            concept: "Lease rollover affects occupancy, rental rate reset, and near-term cash flow visibility.",
            choices: [
              "Near-term cash flow visibility and occupancy risk",
              "Only depreciation expense",
              "Only currency translation",
              "Only commodity roll return"
            ],
            answer: 0,
            explanation: "Lease rollover is important because it affects future occupancy and rental cash flows."
          },
          {
            difficulty: "Hard",
            prompt: "The most complete due-diligence next step would be to review:",
            concept: "Strong real estate diligence integrates tenant, lease, capex, and market-supply data.",
            choices: [
              "Tenant credit, lease rollover, capex needs, and local supply pipeline",
              "Only current appraised value",
              "Only last year's rental growth",
              "Only property tax history"
            ],
            answer: 0,
            explanation: "Comprehensive due diligence should include tenant, lease, capex, and market-supply analysis."
          }
        ]),
        ...buildSet("alternatives", 15, "Alternatives Item Set 5", "REIT Valuation Case", "A listed industrial REIT trades below the analyst's estimate of NAV per share even though reported GAAP earnings look soft because depreciation expense is high and several development assets have not yet stabilized.", [
          {
            difficulty: "Easy",
            prompt: "NAV per share is helpful here because it:",
            concept: "NAV anchors valuation to the underlying property portfolio.",
            choices: [
              "Connects the traded security to estimated underlying real estate value",
              "Replaces all cash-flow analysis",
              "Guarantees outperformance",
              "Makes leverage irrelevant"
            ],
            answer: 0,
            explanation: "NAV per share helps compare the traded REIT price to underlying property value."
          },
          {
            difficulty: "Medium",
            prompt: "FFO and AFFO are often preferred to GAAP net income because:",
            concept: "Depreciation and recurring property economics can make GAAP net income less useful for recurring cash generation.",
            choices: [
              "They are always higher by rule",
              "They can better reflect recurring real estate operating cash flow",
              "They remove financing cost completely",
              "They eliminate the need for NAV"
            ],
            answer: 1,
            explanation: "FFO and AFFO can provide a better recurring-cash-flow view than GAAP net income."
          },
          {
            difficulty: "Medium",
            prompt: "A discount to NAV does NOT automatically mean mispricing because:",
            concept: "Public REIT prices can reflect leverage, liquidity, governance, or expected deterioration not captured in a simple NAV estimate.",
            choices: [
              "NAV is always wrong",
              "The market may be pricing risk factors not fully captured in the static NAV estimate",
              "REITs cannot trade below NAV",
              "Depreciation expense is always irrelevant"
            ],
            answer: 1,
            explanation: "A discount to NAV may reflect risks or assumptions not fully captured in the NAV estimate."
          },
          {
            difficulty: "Hard",
            prompt: "The strongest follow-up test of the apparent discount is to compare the REIT's:",
            concept: "Value should be checked against property quality, leverage, and cash-flow durability.",
            choices: [
              "Property quality, leverage, and forward cash-flow generation versus peers",
              "Logo design and brand recall",
              "Only last quarter's accounting income",
              "Only spot commodity prices"
            ],
            answer: 0,
            explanation: "The next step is to compare asset quality, leverage, and forward cash-flow durability."
          }
        ]),
        ...buildSet("alternatives", 19, "Alternatives Item Set 6", "Hedge Fund Role Case", "A pension portfolio uses one manager to exploit merger spreads and another to run a relative value fixed-income book with leverage. The CIO wants to be sure each strategy is being judged against the right risk profile.", [
          {
            difficulty: "Medium",
            prompt: "The merger-spread strategy is MOST likely classified as:",
            concept: "Merger arbitrage is a classic event-driven strategy.",
            choices: [
              "Event-driven",
              "Only macro directional",
              "Only long-only equity",
              "Commodity carry"
            ],
            answer: 0,
            explanation: "Merger-spread investing is a classic event-driven hedge fund strategy."
          },
          {
            difficulty: "Hard",
            prompt: "The leveraged relative value fixed-income book should be evaluated carefully for:",
            concept: "Relative value strategies can carry financing and liquidity risk even when directional risk looks small.",
            choices: [
              "Financing and convergence risk",
              "Absence of all tail risk",
              "Only dividend stability",
              "Only commodity storage cost"
            ],
            answer: 0,
            explanation: "Relative value strategies often rely on leverage and can be vulnerable to financing or convergence failure."
          }
        ]),
        ...buildSet("portfolio", 7, "Portfolio Item Set 3", "Business Cycle Allocation", "An institutional PM expects growth to slow while inflation remains sticky. The team is evaluating what this regime could mean for duration, credit spreads, and equity style exposures.", [
          {
            difficulty: "Easy",
            prompt: "The first principle of macro investing in this context is that markets respond to:",
            concept: "Prices move on changes in expectations, not just the current economic level.",
            choices: [
              "Only current economic levels",
              "Changes in expectations about growth, inflation, and policy",
              "Only last quarter's earnings",
              "Only accounting policy choices"
            ],
            answer: 1,
            explanation: "Markets often react to changing expectations rather than static current conditions."
          },
          {
            difficulty: "Medium",
            prompt: "Sticky inflation during slowing growth can complicate bond positioning because:",
            concept: "Growth and inflation can push benchmark yields and spreads in different directions.",
            choices: [
              "Rates and spreads may not move in the same helpful direction",
              "Duration becomes irrelevant",
              "Credit risk disappears",
              "All fixed income becomes defensive"
            ],
            answer: 0,
            explanation: "Slower growth may help rates while sticky inflation or risk aversion can complicate spreads and total fixed-income positioning."
          },
          {
            difficulty: "Medium",
            prompt: "The best implementation habit is to translate the macro view into:",
            concept: "A PM must turn views into explicit exposures and risk budgets.",
            choices: [
              "Specific asset-class, factor, and risk exposures",
              "A general market feeling only",
              "Only a benchmark change",
              "No documented trade expression"
            ],
            answer: 0,
            explanation: "A useful macro view must be translated into explicit exposures and risk budgets."
          },
          {
            difficulty: "Hard",
            prompt: "A correct macro call can still lose money if:",
            concept: "Being right on fundamentals is not enough if the market already priced the view.",
            choices: [
              "The market had already priced the view",
              "Growth matters more than inflation in every case",
              "Factors stop existing",
              "Spreads never change"
            ],
            answer: 0,
            explanation: "A correct view can still disappoint if it was already embedded in market prices."
          }
        ]),
        ...buildSet("portfolio", 11, "Portfolio Item Set 4", "Information Ratio Review", "A consultant compares two managers. Manager A generated higher active return but also much higher tracking error. Manager B generated a smaller active return but did so with much tighter benchmark-relative risk.", [
          {
            difficulty: "Easy",
            prompt: "The information ratio measures:",
            concept: "Information ratio evaluates active return relative to tracking risk.",
            choices: [
              "Return per unit of total volatility",
              "Active return per unit of tracking error",
              "Dividend yield relative to inflation",
              "Credit spread relative to duration"
            ],
            answer: 1,
            explanation: "The information ratio measures active return per unit of tracking error."
          },
          {
            difficulty: "Medium",
            prompt: "A manager with lower active return can still be superior if the manager has:",
            concept: "Efficiency of active risk use matters, not just raw active return.",
            choices: [
              "A stronger information ratio",
              "A lower benchmark weight",
              "Less disclosure",
              "Higher turnover automatically"
            ],
            answer: 0,
            explanation: "A lower active return can still be better if it is earned much more efficiently relative to tracking risk."
          },
          {
            difficulty: "Medium",
            prompt: "Under the fundamental law, breadth matters because:",
            concept: "More independent opportunities can improve potential information ratio when skill is real.",
            choices: [
              "It always reduces costs to zero",
              "More independent opportunities can improve expected value added",
              "It replaces skill",
              "It eliminates transfer coefficient"
            ],
            answer: 1,
            explanation: "Breadth can improve expected information ratio when forecasting skill exists."
          },
          {
            difficulty: "Hard",
            prompt: "The consultant should be careful not to treat high active risk as attractive unless:",
            concept: "Taking more tracking risk is only useful if it is rewarded by sufficient skill.",
            choices: [
              "It is supported by a credible expectation of value added",
              "The manager also has high fees",
              "The benchmark has low volatility",
              "The manager owns many positions"
            ],
            answer: 0,
            explanation: "High active risk only deserves capital when there is credible skill to justify it."
          }
        ]),
        ...buildSet("portfolio", 15, "Portfolio Item Set 5", "ETF Implementation Case", "A tactical allocator wants quick equity exposure through an ETF. The ETF trades at a small premium to NAV on a volatile day, and the PM wants to know whether that invalidates the implementation idea.", [
          {
            difficulty: "Easy",
            prompt: "ETFs can trade away from NAV because:",
            concept: "Secondary-market demand and frictions can create temporary premiums or discounts.",
            choices: [
              "ETF prices are fixed by law",
              "Market demand and trading frictions can temporarily push price away from NAV",
              "Authorized participants never act",
              "NAV is only updated once a year"
            ],
            answer: 1,
            explanation: "ETFs can trade at premiums or discounts because of market frictions and supply-demand conditions."
          },
          {
            difficulty: "Medium",
            prompt: "The creation-redemption mechanism is important because it tends to:",
            concept: "Authorized participant arbitrage helps keep ETF price and NAV aligned over time.",
            choices: [
              "Make tracking error impossible",
              "Help keep ETF price reasonably linked to NAV over time",
              "Eliminate bid-offer spreads",
              "Replace benchmark selection"
            ],
            answer: 1,
            explanation: "Creation and redemption activity helps keep ETF market price linked to underlying NAV."
          },
          {
            difficulty: "Medium",
            prompt: "A small premium to NAV on a volatile day does NOT necessarily invalidate ETF use because:",
            concept: "Implementation choices are judged by speed, liquidity, and overall cost, not by absolute perfection.",
            choices: [
              "Temporary deviations can occur while the vehicle still remains effective for quick exposure",
              "Premiums always guarantee alpha",
              "NAV no longer matters",
              "ETF investors ignore costs"
            ],
            answer: 0,
            explanation: "Temporary deviations can occur without undermining the ETF's practical usefulness for rapid exposure."
          },
          {
            difficulty: "Hard",
            prompt: "The PM should compare the ETF implementation using which broad lens?",
            concept: "Implementation quality includes more than just the printed fee.",
            choices: [
              "Trading spread, tracking behavior, liquidity, and total cost of execution",
              "Only the management fee",
              "Only the premium on one day",
              "Only the benchmark weight"
            ],
            answer: 0,
            explanation: "ETF implementation should be judged using total execution cost, liquidity, and tracking behavior."
          }
        ]),
        ...buildSet("portfolio", 19, "Portfolio Item Set 6", "Risk Backtesting Case", "A risk team is impressed by a strategy's historical simulation results, but one analyst notes that the test used revised macro data and assumed zero transaction costs. The PM also uses VaR as the main board-level risk statistic.", [
          {
            difficulty: "Medium",
            prompt: "Using revised macro data that were unavailable at the decision date creates:",
            concept: "This is a classic look-ahead bias problem.",
            choices: [
              "Look-ahead bias",
              "Contango",
              "Carry benefit",
              "Active share"
            ],
            answer: 0,
            explanation: "The backtest is contaminated by look-ahead bias when it uses unavailable future data."
          },
          {
            difficulty: "Hard",
            prompt: "VaR should be supplemented because it does not fully describe:",
            concept: "VaR gives a threshold but not the full loss severity beyond the cutoff.",
            choices: [
              "How large losses can be once the VaR threshold is breached",
              "Any form of return expectation",
              "The existence of market risk",
              "The benchmark composition"
            ],
            answer: 0,
            explanation: "VaR alone does not fully capture tail-loss severity beyond the stated threshold."
          }
        ])
      ]
    }
  };
})();
