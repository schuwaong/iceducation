const STORAGE_KEY = "cfa-study-coach-state-v6";

const chapters = [
  {
    id: "ethics",
    title: "Ethics and Standards",
    shortTitle: "Ethics",
    topic: "Ethical and Professional Standards",
    weight: "10-15%",
    blurb: "Use a clean decision process for diligence, loyalty, fair dealing, supervision, and corrective disclosures.",
    summary: "Ethics at Level II is less about reciting labels and more about evaluating conduct, policies, and the best next action. Strong answers come from tracing who owed what duty, what facts were known, what controls existed, and how the issue should have been prevented or corrected.",
    teach: "Read ethics cases in sequence. First identify the role and duty, then the act or omission, then the harmed party, then the best preventive or corrective response. Many questions are really testing process quality, not just whether a bad outcome happened.",
    syllabus: [
      "Apply the CFA Institute Code and Standards to realistic research, trading, and client-service cases.",
      "Judge whether firm policies, controls, and supervisory systems are strong enough to prevent violations.",
      "Evaluate diligence and reasonable basis, fair dealing, independence, and client loyalty in context.",
      "Choose the best corrective disclosure or escalation step when prior communications become misleading.",
      "Distinguish legal compliance from the higher professional conduct expected by the Code and Standards."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If analysis reaches clients before assumptions, data, and model mechanics are checked, start with diligence and reasonable basis."
      },
      {
        label: "Exam pattern",
        text: "The vignette often turns on what should have happened next, such as escalation, broad correction, documentation, or supervision."
      },
      {
        label: "Watch for",
        text: "Selective disclosure, weak review procedures, unsupported recommendations, and policies that exist on paper but are not enforced."
      }
    ],
    notes: [
      {
        title: "How to read an ethics vignette",
        points: [
          "Identify the actor first. The duty of a junior analyst, supervisor, trader, and portfolio manager can differ even when they touch the same information.",
          "Separate facts from excuses. Time pressure, client pressure, or reliance on seniority does not remove the requirement for reasonable care.",
          "Ask who could be harmed: existing clients, prospective clients, the market, the employer, or the integrity of the research process.",
          "Finish by asking for the best next action. Level II often rewards the remedy more than the diagnosis."
        ]
      },
      {
        title: "Standards that appear most often",
        points: [
          "Diligence and reasonable basis is triggered when research is distributed without sufficient inquiry, model review, or supportable assumptions.",
          "Fair dealing is about broad and timely treatment of similarly situated clients. High-fee clients do not get first access to corrected research solely because they are important.",
          "Responsibilities of supervisors focus on systems. A repeatable review process, escalation channel, and evidence trail matter more than informal trust.",
          "Loyalty, prudence, and care require client interests to come first when managing, trading, allocating, and communicating."
        ]
      },
      {
        title: "Prevention and correction",
        points: [
          "Good controls include research checklists, approval logs, restricted lists, personal trading rules, and defined review ownership.",
          "When prior communication becomes materially misleading, the correction should be prompt, broad, and distributed through normal channels.",
          "Documentation matters because it proves that assumptions were vetted, conflicts were disclosed, and supervisory review actually happened.",
          "If a colleague may be violating the standards, the right answer is usually escalation through compliance or supervisory channels rather than silence."
        ]
      },
      {
        title: "Common exam traps",
        points: [
          "Do not stop at the first bad act if the question asks for the most appropriate response now.",
          "Firm policy can be weaker than the Standards. Compliance with weak internal policy does not guarantee ethical compliance.",
          "A recommendation can still violate the standards even if it later performs well. Ethics is judged on process and conduct, not investment outcome.",
          "Partial correction is usually not enough if the original recommendation was broadly distributed."
        ]
      }
    ],
    formulas: [
      "What was known, and when was it known?",
      "Was the recommendation supported by enough verified work?",
      "Who should have received equal treatment or equal timing?",
      "What control, review, or disclosure should have prevented this?",
      "If the record is now misleading, what is the fairest corrective action?"
    ],
    schedule: [
      {
        title: "Day 1: Build the ethics frame",
        detail: "Map the standards into research quality, client fairness, conflicts, and supervision. Your goal is to know where each vignette usually lives."
      },
      {
        title: "Day 2: Slow worksheet pass",
        detail: "Work every question aloud. For each wrong option, explain why it fails on duty, process, or corrective action."
      },
      {
        title: "Day 4: Policy and remedy review",
        detail: "Re-read your misses and classify them as prevention errors, disclosure errors, or supervision errors."
      },
      {
        title: "Day 7: Mixed ethics retest",
        detail: "Retake after a gap and make sure the best next step feels obvious even when several answers sound partly reasonable."
      }
    ],
    questions: [
      {
        id: "ethics-1",
        prompt: "An analyst forwards a rough model to a client without checking formulas because the market is moving quickly. Which standard is most directly at risk?",
        concept: "Reasonable basis requires more than having data. The analysis itself must be adequately reviewed before recommendation or distribution.",
        choices: [
          "Diligence and Reasonable Basis",
          "Priority of Transactions",
          "Preservation of Confidentiality",
          "Additional Compensation Arrangements"
        ],
        answer: 0,
        explanation: "The main issue is distributing analysis before establishing a sound analytical basis."
      },
      {
        id: "ethics-2",
        prompt: "A portfolio manager receives a research report from a junior analyst. Before using it with clients, the best next step is to:",
        concept: "Supervisors can rely on team output only when they have a system to review quality and appropriateness.",
        choices: [
          "Use it immediately because team research is internal",
          "Confirm that review procedures were followed and key assumptions are supportable",
          "Wait until the trade is complete, then backfill support",
          "Send the report only to large institutional accounts"
        ],
        answer: 1,
        explanation: "The manager should ensure the report passed a sound review process before client use."
      },
      {
        id: "ethics-3",
        prompt: "A buy-side analyst learns that a valuation input in last week's published recommendation was wrong, making the stock less attractive. The analyst should first:",
        concept: "When prior analysis becomes materially misleading, the duty is to correct the record quickly and fairly.",
        choices: [
          "Wait for the next regular research cycle",
          "Quietly update only the clients who ask",
          "Promptly communicate the correction through the firm's normal distribution channels",
          "Remove the report from internal systems and do nothing else"
        ],
        answer: 2,
        explanation: "A prompt and fair correction is required when prior communication is materially misleading."
      },
      {
        id: "ethics-4",
        prompt: "A research director finds that one sector team uses a documented review checklist and another relies on informal verbal sign-off. The best compliance judgment is:",
        concept: "The standard favors a repeatable supervisory system, not ad hoc habits that depend on personalities.",
        choices: [
          "Both approaches are equally strong if employees are experienced",
          "The informal process is acceptable only for smaller sectors",
          "The informal process creates a weaker supervisory control environment",
          "A review checklist is unnecessary if recommendations performed well historically"
        ],
        answer: 2,
        explanation: "Informal sign-off is weaker because it is harder to verify, monitor, and enforce."
      },
      {
        id: "ethics-5",
        prompt: "A firm updates a recommendation after discovering an omitted risk factor. To satisfy fair dealing, the revised view should be:",
        concept: "Fair dealing focuses on broad, timely, and non-selective distribution of investment changes.",
        choices: [
          "Shared first with the highest-fee clients",
          "Released only after traders inside the firm reposition",
          "Distributed through the firm's standard channels to the relevant client base",
          "Held back until the original analyst confirms price impact"
        ],
        answer: 2,
        explanation: "The corrected recommendation should be distributed through normal channels to all relevant clients fairly."
      },
      {
        id: "ethics-6",
        prompt: "An analyst copies valuation assumptions from an older internal model for a new issuer without testing whether the assumptions still fit. The strongest concern is:",
        concept: "Using precedent is acceptable only if the analyst reassesses whether the assumptions still fit the current facts and company.",
        choices: [
          "Misrepresentation only",
          "Lack of independence and objectivity only",
          "Weak reasonable basis because assumptions were reused without validation",
          "No issue if the prior model belonged to the same firm"
        ],
        answer: 2,
        explanation: "The issue is relying on stale assumptions without validating whether they apply to the new case."
      }
    ]
  },
  {
    id: "quant",
    title: "Quantitative Methods",
    shortTitle: "Quant",
    topic: "Quantitative Methods",
    weight: "5-10%",
    blurb: "Interpret regression output, diagnose model problems, and know when a forecast is usable.",
    summary: "Quant at Level II is about model judgment. You need to know what a statistic is telling you about explanatory power, inference quality, forecast reliability, and whether the structure of the data matches the method being used.",
    teach: "For every model, ask four things: what problem is this model solving, what assumptions make the inference trustworthy, how does the data behave over time, and does the model still work out of sample?",
    syllabus: [
      "Build and interpret multiple regression models, ANOVA output, and joint tests.",
      "Diagnose heteroskedasticity, serial correlation, multicollinearity, and other misspecification issues.",
      "Work with time-series trends, stationarity, autoregressive models, seasonality, and ARCH behavior.",
      "Understand the role of machine learning methods, overfitting control, and model evaluation.",
      "Know the project workflow for data wrangling, feature engineering, training, and testing."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "The F-statistic and the t-statistics answer different questions. Joint significance is not the same as individual significance."
      },
      {
        label: "Exam pattern",
        text: "Many questions are really asking whether a model is trustworthy, not whether you can label a statistic."
      },
      {
        label: "Watch for",
        text: "Overfitting, nonstationarity, residual diagnostics, and confusing statistical significance with economic usefulness."
      }
    ],
    notes: [
      {
        title: "Regression core",
        points: [
          "Multiple regression explains a dependent variable using several predictors. The coefficients tell you the marginal relation of each predictor, holding the others constant.",
          "ANOVA output splits total variation into explained and unexplained pieces. Use it to judge whether the model adds explanatory power as a whole.",
          "A significant coefficient means the estimate is statistically distinguishable from zero, not automatically economically meaningful.",
          "Predicted values are only as credible as the model specification and the reasonableness of the inputs."
        ]
      },
      {
        title: "Misspecification and diagnostics",
        points: [
          "Heteroskedasticity mainly damages standard error reliability, which can make t-statistics look stronger or weaker than they really are.",
          "Serial correlation is especially important in time-series settings because it can distort inference and signal that dynamics are missing from the model.",
          "Multicollinearity makes individual coefficients hard to interpret because highly related predictors compete to explain the same variation.",
          "Influential observations can drive a result. If one extreme point changes the story, your model is fragile."
        ]
      },
      {
        title: "Time-series mindset",
        points: [
          "A stationary series has stable statistical properties over time. If the mean or variance drifts, standard autoregressive tools can become unreliable.",
          "Trend models can fit level or growth behavior, but you should choose linear versus log-linear based on how the variable naturally evolves.",
          "Autoregressive models use a variable's own history to forecast its future values. Always test whether residual autocorrelation suggests more structure is needed.",
          "Unit roots, seasonality, and conditional volatility are all signs that the raw series should not be modeled casually."
        ]
      },
      {
        title: "Machine learning and project workflow",
        points: [
          "Machine learning adds flexible pattern recognition, but the exam still wants you to think like an investor: fit is not enough if the model does not generalize.",
          "Overfitting means the algorithm learns noise in the training set. You fight it with validation discipline, simpler models, or regularization.",
          "A good project begins with data preparation, feature selection, and exploration before training starts. Most weak models fail long before the algorithm step.",
          "Textual data, alternative data, and engineered features can help forecasting, but they also multiply the risk of leakage and spurious precision."
        ]
      }
    ],
    formulas: [
      "Predicted value: y-hat = b0 + b1X1 + ... + bkXk",
      "Use t-tests for individual coefficients and the F-test for joint significance",
      "RMSE compares out-of-sample forecasting accuracy across models",
      "Durbin-Watson near 2 suggests little first-order serial correlation",
      "Adjusted R-squared rewards fit only when added variables earn their keep"
    ],
    schedule: [
      {
        title: "Day 1: Diagnostic map",
        detail: "Review what each regression output item says about fit, inference, and forecast trust."
      },
      {
        title: "Day 2: First worksheet run",
        detail: "Answer slowly and translate every statistic into plain English before choosing."
      },
      {
        title: "Day 4: Time-series reset",
        detail: "Revisit stationarity, AR logic, and what different residual patterns imply."
      },
      {
        title: "Day 7: Mixed retest",
        detail: "Come back cold and verify you can spot overfitting and misspecification immediately."
      }
    ],
    questions: [
      {
        id: "quant-1",
        prompt: "In a multiple regression, one factor's t-statistic is insignificant but the overall F-statistic is significant. The best interpretation is:",
        concept: "The F-test evaluates the model jointly, while each t-test evaluates one coefficient conditional on the others.",
        choices: [
          "The model has no explanatory power at all",
          "At least one coefficient helps explain the dependent variable, even if this specific factor may not",
          "Every coefficient is individually significant",
          "The regression must be misspecified"
        ],
        answer: 1,
        explanation: "A significant F-statistic indicates joint explanatory power even if one specific coefficient is not significant."
      },
      {
        id: "quant-2",
        prompt: "A time-series model shows positively autocorrelated residuals. The most likely result is:",
        concept: "Autocorrelation often distorts the standard errors used for inference.",
        choices: [
          "Standard errors may be understated, making significance appear stronger than it is",
          "The dependent variable is nonstationary by definition",
          "The intercept must be zero",
          "Multicollinearity is automatically solved"
        ],
        answer: 0,
        explanation: "Positive autocorrelation can make standard errors unreliable and statistical significance look overstated."
      },
      {
        id: "quant-3",
        prompt: "A model performs extremely well on training data but poorly on unseen data. The clearest diagnosis is:",
        concept: "In-sample excellence paired with weak out-of-sample performance is a classic sign of memorizing noise.",
        choices: [
          "Underfitting",
          "Look-ahead bias only",
          "Overfitting",
          "Heteroskedasticity"
        ],
        answer: 2,
        explanation: "The model likely captured noise rather than signal."
      },
      {
        id: "quant-4",
        prompt: "Two explanatory variables are highly correlated with each other. Which effect is most likely?",
        concept: "Multicollinearity makes it harder to isolate the individual effect of each predictor.",
        choices: [
          "The model's R-squared must fall sharply",
          "Coefficient estimates become less stable and t-statistics may weaken",
          "Autocorrelation disappears",
          "Forecast error is guaranteed to worsen"
        ],
        answer: 1,
        explanation: "Multicollinearity mainly hurts coefficient precision and interpretability."
      },
      {
        id: "quant-5",
        prompt: "A residual plot shows variance increasing with fitted values. The most direct concern is:",
        concept: "Changing residual variance across the fitted range points to heteroskedasticity.",
        choices: [
          "Heteroskedasticity",
          "Perfect collinearity",
          "Serial independence",
          "Sample selection bias"
        ],
        answer: 0,
        explanation: "A widening residual spread is the standard visual cue for heteroskedasticity."
      },
      {
        id: "quant-6",
        prompt: "A variable is statistically significant but has an economically tiny effect size. The best analyst response is to:",
        concept: "Statistical significance does not automatically make a result useful for investment decisions.",
        choices: [
          "Treat the finding as economically decisive",
          "Ignore the sign because significance is enough",
          "Distinguish statistical significance from economic materiality before using it",
          "Remove all other predictors from the model"
        ],
        answer: 2,
        explanation: "An effect can be statistically real but too small to matter economically."
      }
    ]
  },
  {
    id: "economics",
    title: "Economics",
    shortTitle: "Economics",
    topic: "Economics",
    weight: "5-10%",
    blurb: "Connect currency pricing, parity conditions, policy, and growth to asset returns.",
    summary: "Level II Economics is about transmission. You need to understand how exchange rates, capital flows, policy, and long-run growth feed into asset valuation, expected returns, and macro risk across markets.",
    teach: "Build from mechanics to narrative. Start with spot and forward relationships, then ask what parity says, what policy is doing, and how those macro conditions change expected growth, inflation, and discount rates.",
    syllabus: [
      "Work currency quotations, forward premiums or discounts, triangular arbitrage, and forward mark-to-market value.",
      "Interpret covered and uncovered interest parity, PPP, and the international Fisher effect.",
      "Assess balance-of-payments flows, intervention, capital controls, carry trades, and currency-crisis warning signs.",
      "Evaluate potential GDP, growth accounting, convergence, and the drivers of sustainable economic growth.",
      "Relate trade, demographics, technology, and productivity to long-term market opportunities."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If the question gives spot rates, forward rates, and interest rates together, parity logic is probably the key."
      },
      {
        label: "Exam pattern",
        text: "A strong answer links the macro variable to valuation through rates, growth, margins, or risk premiums."
      },
      {
        label: "Watch for",
        text: "Confusing domestic versus foreign conventions, using parity as a short-run forecasting rule, and ignoring policy credibility."
      }
    ],
    notes: [
      {
        title: "FX market mechanics",
        points: [
          "Know how to read spot and forward quotations cleanly. Bid-offer spreads matter because they determine executable arbitrage, not just theoretical parity.",
          "Triangular arbitrage works only if quoted cross rates are inconsistent after transaction sides are respected. Always choose the correct bid or offer leg.",
          "Forward rates embed current interest rate differentials under covered parity, but they do not guarantee where the future spot rate will land.",
          "The mark-to-market value of a forward changes as spot rates and discounting move after trade initiation."
        ]
      },
      {
        title: "Parity and fair value",
        points: [
          "Covered interest parity is the no-arbitrage condition. Uncovered interest parity is a risk-bearing expectation relationship and often fails in the short run.",
          "PPP is more useful as a long-run valuation anchor than as a tactical timing tool. Misalignments can persist for a long time.",
          "Carry trades exploit yield differentials but can unwind violently when funding conditions tighten or exchange-rate expectations reverse.",
          "Use multiple lenses for currency value: parity conditions, current account trends, productivity differences, and policy stance."
        ]
      },
      {
        title: "Policy, flows, and crisis risk",
        points: [
          "Balance-of-payments flows influence currency demand and supply, but the market impact depends on financing quality and investor confidence.",
          "Tight monetary policy can support a currency through higher yields, but it can also signal economic stress if growth is deteriorating sharply.",
          "Intervention and capital controls may slow currency pressure temporarily, yet they are less effective when the policy regime lacks credibility.",
          "Warning signs of crisis include reserve loss, external imbalances, heavy short-term foreign debt, and a fixed exchange-rate promise that markets no longer trust."
        ]
      },
      {
        title: "Growth and investment implications",
        points: [
          "Potential GDP matters because it shapes sustainable earnings growth, neutral rates, fiscal room, and debt capacity.",
          "Growth accounting separates labor, capital deepening, and total factor productivity, helping you think about whether growth is durable or merely cyclical.",
          "Demographics, immigration, education, and innovation all influence the economy's supply side and therefore long-run asset returns.",
          "Trade openness and incentives for knowledge investment can raise productivity, but the gains are distributed unevenly across sectors and time."
        ]
      }
    ],
    formulas: [
      "Forward premium or discount: (Forward / Spot) - 1",
      "Covered parity anchor: Forward / Spot approximately (1 + r-domestic) / (1 + r-foreign)",
      "Carry trade return depends on yield pickup minus adverse currency move",
      "Potential growth is driven by labor growth, capital deepening, and productivity gains",
      "PPP is a long-run valuation anchor, not a precise short-run timing rule"
    ],
    schedule: [
      {
        title: "Day 1: FX foundations",
        detail: "Drill quotation conventions, parity relationships, and which inputs belong in each currency formula."
      },
      {
        title: "Day 2: Practice arbitrage and carry",
        detail: "Work currency questions step by step and write the cash-flow path before computing."
      },
      {
        title: "Day 4: Growth framework",
        detail: "Review growth accounting and connect potential GDP to both equity and fixed income implications."
      },
      {
        title: "Day 7: Policy synthesis",
        detail: "Come back and explain how rates, inflation, productivity, and capital flows interact in one macro story."
      }
    ],
    questions: [
      {
        id: "economics-1",
        prompt: "A currency is quoted at a forward discount to the domestic investor. Under covered interest parity, the most likely reason is that:",
        concept: "Forward discounts and premiums reflect the interest rate differential embedded in covered parity.",
        choices: [
          "The foreign interest rate is lower than the domestic interest rate",
          "The foreign interest rate is higher than the domestic interest rate",
          "PPP guarantees foreign inflation will fall",
          "The carry trade has already failed"
        ],
        answer: 1,
        explanation: "If the foreign currency is at a forward discount, the foreign interest rate is typically higher than the domestic rate."
      },
      {
        id: "economics-2",
        prompt: "A trader spots inconsistent cross rates among three currencies after accounting for bid and offer quotes. The cleanest interpretation is:",
        concept: "Triangular arbitrage exists only when executable quotes produce a profitable loop.",
        choices: [
          "PPP holds exactly",
          "A triangular arbitrage opportunity may exist",
          "Covered interest parity must be violated",
          "The current account must be in deficit"
        ],
        answer: 1,
        explanation: "Inconsistent cross rates across executable quotes can create triangular arbitrage."
      },
      {
        id: "economics-3",
        prompt: "An investor uses a high-yielding foreign currency to fund a carry trade. Which outcome hurts the strategy most directly?",
        concept: "Carry gains can be overwhelmed by adverse spot-rate moves.",
        choices: [
          "The funding currency depreciates",
          "The investment currency depreciates sharply",
          "Interest rate parity is discussed by central banks",
          "Real GDP growth rises globally"
        ],
        answer: 1,
        explanation: "A sharp depreciation of the investment currency can wipe out the carry pickup."
      },
      {
        id: "economics-4",
        prompt: "Why does potential GDP matter to asset allocators?",
        concept: "Potential growth shapes sustainable earnings growth, rates, and debt capacity.",
        choices: [
          "It determines yesterday's realized inflation only",
          "It helps frame sustainable growth and policy capacity over time",
          "It removes uncertainty from currency forecasts",
          "It guarantees a higher equity risk premium"
        ],
        answer: 1,
        explanation: "Potential GDP helps investors think about sustainable growth, neutral rates, and policy space."
      },
      {
        id: "economics-5",
        prompt: "A country burns reserves while defending a pegged exchange rate and still faces heavy outflows. The best inference is:",
        concept: "Reserve loss plus persistent capital flight is a classic currency-crisis warning sign.",
        choices: [
          "Policy credibility may be weakening and peg risk is rising",
          "PPP must be holding exactly",
          "The peg is more secure because reserves are being used",
          "The current account no longer matters"
        ],
        answer: 0,
        explanation: "Reserve depletion while defending a peg often signals rising devaluation risk."
      },
      {
        id: "economics-6",
        prompt: "Compared with simple capital deepening alone, technological progress is especially important because it:",
        concept: "Technology can raise productivity more broadly than just adding more capital per worker.",
        choices: [
          "Improves productivity without eventually running into the same diminishing return pattern",
          "Guarantees higher wages in every industry immediately",
          "Makes labor force participation irrelevant",
          "Eliminates exchange-rate volatility"
        ],
        answer: 0,
        explanation: "Technological progress supports productivity growth in a way that is not limited to piling up more capital per worker."
      }
    ]
  },
  {
    id: "corporate",
    title: "Corporate Issuers",
    shortTitle: "Corporate",
    topic: "Corporate Issuers",
    weight: "5-10%",
    blurb: "Study payout policy, ESG and governance, cost of capital, and restructuring logic.",
    summary: "Corporate Issuers at Level II asks you to connect managerial actions to value. Dividend changes, repurchases, capital structure choices, and restructurings all send signals and change per-share metrics, risk, and investor interpretation.",
    teach: "Whenever management acts, ask why they are doing it, how the action changes cash distribution, leverage, incentives, and valuation, and what signal the market should take from it.",
    syllabus: [
      "Evaluate dividend policy, dividend signals, payout sustainability, and share repurchase choices.",
      "Compare tax regimes and understand how taxes affect payout decisions and investor outcomes.",
      "Judge governance quality, ownership structure effects, and ESG-related risks and opportunities.",
      "Estimate cost of debt, equity, and WACC using both top-down and bottom-up inputs.",
      "Analyze mergers, acquisitions, divestitures, spin-offs, and balance-sheet restructurings."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If management changes payout, the exam usually wants both the valuation effect and the signal effect."
      },
      {
        label: "Exam pattern",
        text: "Repurchase questions often turn on whether cash or debt financing changes EPS, leverage, or book value per share differently."
      },
      {
        label: "Watch for",
        text: "Confusing an EPS boost with real value creation, overlooking governance incentives, and treating WACC as mechanically stable."
      }
    ],
    notes: [
      {
        title: "Dividend policy and signaling",
        points: [
          "Dividend actions communicate information because managers generally hesitate to raise regular payouts unless they believe the cash flow is sustainable.",
          "Stable dividend policies appeal to investors who value predictability, while payout-ratio approaches let dividends move with earnings.",
          "Extra or liquidating dividends should be interpreted differently from recurring cash dividends because they do not carry the same permanence signal.",
          "Coverage analysis matters. A dividend that outruns free cash flow or normalized earnings may not be durable."
        ]
      },
      {
        title: "Repurchases, taxes, and per-share effects",
        points: [
          "Repurchases can increase EPS simply by shrinking the share count, but that does not prove economic value was created.",
          "Using debt to finance a buyback can amplify per-share earnings while also raising leverage and refinancing risk.",
          "Book value per share can rise or fall after a repurchase depending on the repurchase price relative to book value per share before the transaction.",
          "Tax systems matter because investor preference for dividends versus repurchases changes when corporate and personal taxation differ."
        ]
      },
      {
        title: "Governance, ESG, and cost of capital",
        points: [
          "Ownership structure influences governance quality. Concentrated ownership may improve oversight in some cases but create minority-shareholder risk in others.",
          "ESG analysis is useful when it changes cash flows, capital intensity, legal risk, customer demand, financing costs, or exit multiples.",
          "Cost of capital should reflect both company-specific fundamentals and macro conditions such as rates, spreads, and market risk appetite.",
          "Peer comparisons are essential because WACC estimates are noisy and most meaningful relative to sector economics and capital structure norms."
        ]
      },
      {
        title: "Corporate restructuring",
        points: [
          "Restructuring questions usually ask whether the action improves strategic focus, reduces inefficiency, monetizes assets, or changes financing flexibility.",
          "Acquisitions should be judged on valuation, synergy realism, funding method, and post-deal leverage, not on management's narrative alone.",
          "Divestitures and spin-offs can unlock value when a business segment is worth more separately than inside a conglomerate structure.",
          "Always trace how the transaction changes EPS, net debt to EBITDA, and WACC because the exam often tests those before full valuation detail."
        ]
      }
    ],
    formulas: [
      "Dividend coverage can be framed with net income or free cash flow relative to dividends",
      "WACC = wd x rd x (1 - tax rate) + we x re",
      "Repurchase EPS effect depends on lower share count versus any financing cost",
      "Book value per share impact depends on repurchase price versus pre-buyback book value per share",
      "Higher leverage can lift EPS while still weakening the risk profile"
    ],
    schedule: [
      {
        title: "Day 1: Payout map",
        detail: "Separate dividend policy, signaling, tax effects, and repurchase mechanics into one-page notes."
      },
      {
        title: "Day 2: Work the per-share questions",
        detail: "Practice EPS, coverage, and book value effects until the direction of change feels automatic."
      },
      {
        title: "Day 4: Governance and WACC review",
        detail: "Revisit what actually changes the cost of capital and what only changes the headline story."
      },
      {
        title: "Day 7: Restructuring synthesis",
        detail: "Do a mixed run that forces you to judge motive, valuation, leverage, and signaling together."
      }
    ],
    questions: [
      {
        id: "corporate-1",
        prompt: "A company raises its regular dividend for the first time in years. The market is most likely to interpret this as:",
        concept: "Regular dividend increases often carry information about management's confidence in sustainable cash generation.",
        choices: [
          "A guarantee of higher future earnings in every scenario",
          "A signal that management believes cash flows can support a higher ongoing payout",
          "Proof that repurchases are no longer value enhancing",
          "A reduction in agency costs to zero"
        ],
        answer: 1,
        explanation: "A higher regular dividend usually signals confidence in sustainable future cash flows, not certainty."
      },
      {
        id: "corporate-2",
        prompt: "Compared with a cash-funded repurchase, a debt-funded repurchase is more likely to:",
        concept: "Debt financing can magnify per-share metrics while increasing leverage risk.",
        choices: [
          "Reduce financial leverage",
          "Increase EPS but also raise balance-sheet risk",
          "Leave capital structure unchanged",
          "Eliminate refinancing risk"
        ],
        answer: 1,
        explanation: "Borrowing to buy back shares can boost EPS through fewer shares but increases leverage."
      },
      {
        id: "corporate-3",
        prompt: "A repurchase executed above the firm's pre-transaction book value per share will most likely:",
        concept: "Buying back shares above book value tends to reduce remaining book value per share.",
        choices: [
          "Increase book value per share",
          "Decrease book value per share",
          "Leave book value per share unchanged by definition",
          "Guarantee a higher intrinsic value per share"
        ],
        answer: 1,
        explanation: "Repurchasing above book value per share generally lowers book value per share for remaining shareholders."
      },
      {
        id: "corporate-4",
        prompt: "Why can ESG analysis be financially relevant rather than just qualitative branding?",
        concept: "ESG issues matter when they change expected cash flows, risk, or financing terms.",
        choices: [
          "Because ESG scores remove valuation uncertainty",
          "Because ESG exposures can influence margins, capital costs, legal risk, and terminal value",
          "Because ESG replaces financial analysis in capital budgeting",
          "Because governance has no effect on agency costs"
        ],
        answer: 1,
        explanation: "ESG matters when it changes the economics of the business or the risk investors demand to bear."
      },
      {
        id: "corporate-5",
        prompt: "A firm spins off a noncore division. The strongest valuation argument for the transaction is usually that:",
        concept: "Spin-offs can unlock value when the pieces are worth more separately than together.",
        choices: [
          "Any spin-off automatically lowers WACC",
          "The market may value the focused entities more clearly than the combined conglomerate",
          "The parent no longer needs financial statements",
          "Agency costs disappear permanently"
        ],
        answer: 1,
        explanation: "The main case for a spin-off is improved strategic focus and clearer valuation of the separate businesses."
      },
      {
        id: "corporate-6",
        prompt: "A company keeps its dividend flat despite a temporary earnings decline and strong free cash flow. The best interpretation is:",
        concept: "Management may maintain a stable dividend when the earnings weakness is judged temporary and cash coverage remains solid.",
        choices: [
          "The dividend is necessarily unsustainable",
          "Management may be smoothing payouts because it sees the setback as temporary",
          "Repurchases are prohibited",
          "The cost of equity must fall immediately"
        ],
        answer: 1,
        explanation: "Stable dividends are often maintained when management believes the cash generation remains sufficient despite short-term earnings pressure."
      }
    ]
  },
  {
    id: "fsa",
    title: "Financial Statement Analysis",
    shortTitle: "FSA",
    topic: "Financial Statement Analysis",
    weight: "10-15%",
    blurb: "Translate accounting choices into ratio effects, valuation impact, and earnings quality judgment.",
    summary: "FSA at Level II rewards conversion. You need to turn accounting methods, consolidation choices, currency translation rules, compensation accounting, and reporting quality signals into consequences for profitability, leverage, comparability, and valuation.",
    teach: "When you see an accounting choice, ask what it changes today, what it shifts into the future, how it affects cash interpretation, and how it distorts peer comparison.",
    syllabus: [
      "Analyze intercorporate investments, business combinations, associates, joint ventures, and special entities.",
      "Understand share-based compensation, post-employment benefits, and their modeling implications.",
      "Work foreign currency translation, multinational operations, and the effects of translation methods on ratios.",
      "Evaluate banks, insurers, and the special reporting issues in financial institutions.",
      "Judge earnings quality, cash flow quality, balance-sheet quality, and the adjustments needed for comparability."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If an accounting treatment changes the timing of expense recognition, compare today's earnings boost with tomorrow's drag."
      },
      {
        label: "Exam pattern",
        text: "Many questions move from accounting treatment to ratio effect to valuation implication in one step."
      },
      {
        label: "Watch for",
        text: "Intercorporate investments, translation method effects, pension assumptions, accrual-heavy earnings, and balance-sheet quality."
      }
    ],
    notes: [
      {
        title: "Intercorporate investments and combinations",
        points: [
          "The accounting method depends on the level of influence or control. That choice affects revenue, earnings, assets, liabilities, and leverage ratios.",
          "Acquisition accounting and consolidation can make a company look larger and more levered even if the economic substance was already partly understood by investors.",
          "Equity method investments leave revenue smaller than full consolidation but still transmit investee profitability through earnings.",
          "Analysts must normalize across IFRS and US GAAP differences so that operating performance is comparable before valuation."
        ]
      },
      {
        title: "Compensation and multinational operations",
        points: [
          "Share-based compensation is real compensation expense even when it is non-cash at grant date. Ignoring it can overstate normalized profitability.",
          "Post-employment benefit accounting is sensitive to assumptions such as discount rates, expected returns, and service cost components.",
          "Foreign currency translation method matters because the current rate method and temporal method move exchange-rate effects through different statements.",
          "For multinational firms, analysts should separate true operating improvement from reported growth created by translation."
        ]
      },
      {
        title: "Financial institutions",
        points: [
          "Banks and insurers are balance-sheet driven businesses, so leverage, reserve adequacy, asset quality, and funding structure matter more than standard industrial ratios alone.",
          "CAMELS gives a disciplined bank-analysis framework, but you still need judgment on management, regulation, and off-balance-sheet risk.",
          "Insurance analysis must focus on underwriting quality, reserve assumptions, investment portfolio risk, and capital adequacy.",
          "Financial institutions often look profitable right before stress if credit quality and funding risk are deteriorating beneath the surface."
        ]
      },
      {
        title: "Quality of financial reports",
        points: [
          "High earnings quality means profits are repeatable, cash-supported, and not driven mainly by aggressive accruals or one-off items.",
          "Cash flow quality is weaker when operating cash chronically lags net income, working capital inflates results, or financing is disguised as operating strength.",
          "Balance-sheet quality requires skepticism about asset valuation, capitalization practices, hidden obligations, and off-balance-sheet exposures.",
          "The final exam step is adjustment: restate, normalize, and compare peers on a like-for-like basis before drawing conclusions."
        ]
      }
    ],
    formulas: [
      "Capitalizing a cost usually raises current earnings and assets but creates future amortization drag",
      "FIFO in rising prices usually raises inventory and gross profit relative to LIFO",
      "Lower pension discount rates increase the present value of the pension obligation",
      "Translation method affects where FX gains and losses appear and how ratios move",
      "Persistent earnings minus operating cash flow gaps are a major quality warning sign"
    ],
    schedule: [
      {
        title: "Day 1: Accounting map",
        detail: "List the major method choices and write the direction of effect on earnings, assets, and leverage."
      },
      {
        title: "Day 2: Statement translation",
        detail: "Practice moving from accounting treatment to ratio effect before you look at the answer choices."
      },
      {
        title: "Day 4: Quality review",
        detail: "Revisit earnings quality, cash flow quality, and how to normalize for comparability."
      },
      {
        title: "Day 7: Integrated case pass",
        detail: "Do a mixed retest focused on present-period effect, future reversal, and valuation implication."
      }
    ],
    questions: [
      {
        id: "fsa-1",
        prompt: "If a company uses FIFO during rising input prices, compared with LIFO it will most likely report:",
        concept: "FIFO leaves older, cheaper inventory in cost of goods sold during inflationary periods.",
        choices: [
          "Lower gross profit and lower ending inventory",
          "Higher gross profit and higher ending inventory",
          "Lower gross profit and higher ending inventory",
          "Higher gross profit and lower ending inventory"
        ],
        answer: 1,
        explanation: "FIFO generally boosts gross profit and ending inventory when input costs are rising."
      },
      {
        id: "fsa-2",
        prompt: "A firm capitalizes development costs that a peer expenses immediately. All else equal in the current period, the capitalizing firm will usually show:",
        concept: "Capitalization raises assets and delays recognition of some expense.",
        choices: [
          "Lower assets and lower earnings",
          "Lower assets and higher earnings",
          "Higher assets and higher earnings",
          "Higher assets and lower earnings"
        ],
        answer: 2,
        explanation: "Capitalizing pushes some expense into future periods, which raises current assets and earnings."
      },
      {
        id: "fsa-3",
        prompt: "An increase in a defined benefit pension obligation due to a lower discount rate most directly signals that:",
        concept: "A lower discount rate increases the present value of future pension liabilities.",
        choices: [
          "The economic burden of future pension payments has risen",
          "The pension plan is now overfunded",
          "Service cost must decline immediately",
          "The plan's asset returns improved"
        ],
        answer: 0,
        explanation: "Lower discount rates increase the present value of the pension obligation."
      },
      {
        id: "fsa-4",
        prompt: "A multinational subsidiary uses the current rate method. A depreciation of the subsidiary's local currency versus the parent presentation currency will most likely:",
        concept: "Under the current rate method, exchange-rate changes mainly affect translated balance-sheet values and cumulative translation adjustments.",
        choices: [
          "Raise translated assets and equity in the parent currency",
          "Lower translated assets and equity in the parent currency",
          "Eliminate all translation effects from equity",
          "Force use of the temporal method"
        ],
        answer: 1,
        explanation: "A weaker local currency usually translates into lower reported assets and equity in the parent currency."
      },
      {
        id: "fsa-5",
        prompt: "A company reports strong net income growth but persistently weak operating cash flow. The cleanest takeaway is:",
        concept: "Divergence between earnings and operating cash flow raises an earnings quality question.",
        choices: [
          "Earnings quality may be weaker than headline income suggests",
          "The company is automatically undervalued",
          "Revenue recognition must comply perfectly",
          "Leverage risk has disappeared"
        ],
        answer: 0,
        explanation: "When cash flow lags earnings persistently, analysts should question the quality and sustainability of reported profit."
      },
      {
        id: "fsa-6",
        prompt: "During inflation, converting a LIFO firm's inventory to FIFO for comparability would most likely cause current ratio to:",
        concept: "FIFO inventory is typically higher than LIFO inventory during rising prices.",
        choices: [
          "Decline",
          "Increase",
          "Remain unchanged",
          "Become uninterpretable"
        ],
        answer: 1,
        explanation: "A higher inventory balance raises current assets, which tends to increase the current ratio."
      }
    ]
  },
  {
    id: "equity",
    title: "Equity Investments",
    shortTitle: "Equity",
    topic: "Equity Valuation",
    weight: "10-15%",
    blurb: "Choose the right valuation model and turn assumptions into an implied market story.",
    summary: "Equity at Level II is about model fit and interpretation. A good analyst chooses the valuation approach that matches the business, understands what the current price implies, and knows which assumptions drive the estimate most.",
    teach: "Start with the business and the investor claim. Then ask which cash flow measure is cleanest, whether payout is informative, and what the market price already assumes about growth, profitability, and reinvestment.",
    syllabus: [
      "Use valuation concepts, industry analysis, and model selection for public-company appraisal.",
      "Apply dividend discount models, Gordon growth, H-model logic, PVGO, and justified multiples.",
      "Work free cash flow and residual income frameworks and know when each is most suitable.",
      "Interpret relative valuation signals and the assumptions embedded in market prices.",
      "Handle private-company and sum-of-the-parts valuation contexts when business structure requires it."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If dividends are not a good proxy for economic value, move quickly to FCFF, FCFE, or residual income."
      },
      {
        label: "Exam pattern",
        text: "A large share of Equity is really model selection plus sensitivity to growth, margins, and required return."
      },
      {
        label: "Watch for",
        text: "Mismatch between payout and value creation, unstable growth assumptions, and forgetting what the market price already implies."
      }
    ],
    notes: [
      {
        title: "Model selection first",
        points: [
          "Valuation starts with business reality. Mature dividend payers may fit DDM well, while firms with distorted payouts often require free cash flow or residual income methods.",
          "Absolute models estimate intrinsic value directly from fundamentals. Relative models compare the company to market pricing benchmarks such as P/E, EV/EBITDA, or price to book.",
          "Industry structure matters because competitive intensity, regulation, cyclicality, and capital needs all shape sustainable returns and terminal assumptions.",
          "Sum-of-the-parts valuation becomes useful when a conglomerate contains businesses that deserve different multiples or discount rates."
        ]
      },
      {
        title: "Dividend discount and growth logic",
        points: [
          "The Gordon model is powerful because it connects value, required return, payout, and growth in one simple structure, but it only works when those assumptions are stable enough.",
          "PVGO helps you separate the value of no-growth earnings from the value created by future profitable reinvestment.",
          "Justified P/E and implied growth questions are asking whether the market price is consistent with sustainable fundamentals.",
          "If a small change in growth or required return swings value dramatically, the valuation needs extra skepticism."
        ]
      },
      {
        title: "FCFF, FCFE, and residual income",
        points: [
          "FCFF is useful when capital structure is changing or debt flows make FCFE noisy. It values the firm before subtracting debt claims.",
          "FCFE is attractive when leverage policy is stable and equity cash flows are easier to model cleanly.",
          "Residual income works especially well when dividends are uninformative but accounting book value and clean-surplus relations remain decision useful.",
          "Across all three methods, normalization of margins, reinvestment, and competitive advantage duration is more important than algebra speed."
        ]
      },
      {
        title: "Using the market's price as information",
        points: [
          "An observed market price is not only an output to compare with your value estimate; it is also an input for reverse-engineering market expectations.",
          "If your valuation gap rests entirely on heroic growth or margin expansion, your thesis may be a story rather than an edge.",
          "Private-company valuation often requires more judgment on illiquidity, control, and comparable quality than public-company work.",
          "The best exam answers explain why a model fits the situation, not just what number it produced."
        ]
      }
    ],
    formulas: [
      "Gordon model: P0 = D1 / (r - g)",
      "PVGO = Price - (E1 / r)",
      "Residual income builds value from current book value plus future excess returns on equity",
      "FCFF values the enterprise first, then subtracts debt and other non-equity claims",
      "Justified multiples rise with better growth and profitability and fall with higher required return"
    ],
    schedule: [
      {
        title: "Day 1: Model-fit sheet",
        detail: "Write one line on when DDM, FCFF, FCFE, residual income, and multiples each make the most sense."
      },
      {
        title: "Day 2: Solve valuation questions slowly",
        detail: "Focus on why the model fits the company before worrying about the final number."
      },
      {
        title: "Day 4: Reverse-engineer price",
        detail: "Practice turning market price into implied growth or implied profitability expectations."
      },
      {
        title: "Day 7: Sensitivity run",
        detail: "Retest after a break and see which assumptions move value the most in each framework."
      }
    ],
    questions: [
      {
        id: "equity-1",
        prompt: "A residual income model is especially useful when a company:",
        concept: "Residual income works well when dividends are not informative but accounting book value remains meaningful.",
        choices: [
          "Has highly stable dividends that fully reflect value creation",
          "Pays no dividends and book value provides a useful anchor",
          "Has no accounting statements available",
          "Can only be valued with EV/EBITDA"
        ],
        answer: 1,
        explanation: "Residual income is helpful when payout is uninformative but book value and future excess returns can be modeled."
      },
      {
        id: "equity-2",
        prompt: "A firm has an erratic dividend policy that is disconnected from operating performance. The best first valuation shift is toward:",
        concept: "When dividends are a poor proxy for underlying economics, a broader cash flow or residual income model is often better.",
        choices: [
          "Dividend discount only",
          "FCFF, FCFE, or residual income methods",
          "Ignoring valuation entirely",
          "Only trailing P/E without adjustment"
        ],
        answer: 1,
        explanation: "If dividends are noisy, analysts usually move to FCFF, FCFE, or residual income."
      },
      {
        id: "equity-3",
        prompt: "In the Gordon growth model, holding all else constant, an increase in required return will:",
        concept: "A higher discount rate lowers the present value of a perpetually growing dividend stream.",
        choices: [
          "Increase intrinsic value",
          "Lower intrinsic value",
          "Have no effect if growth is unchanged",
          "Raise PVGO automatically"
        ],
        answer: 1,
        explanation: "Higher required return lowers value in the Gordon framework."
      },
      {
        id: "equity-4",
        prompt: "A stock's market price implies a growth rate far above the analyst's estimate of sustainable growth. The cleanest interpretation is:",
        concept: "Reverse-engineering price helps reveal whether the market is embedding aggressive assumptions.",
        choices: [
          "The stock is automatically cheap",
          "The market may be pricing in more optimistic growth than the analyst believes is sustainable",
          "Residual income cannot be used",
          "Required return no longer matters"
        ],
        answer: 1,
        explanation: "A high implied growth rate suggests the market may be assuming stronger growth than the analyst's base case."
      },
      {
        id: "equity-5",
        prompt: "FCFF is often preferred to FCFE when:",
        concept: "FCFF is typically cleaner when leverage is changing or debt flows distort equity cash flow.",
        choices: [
          "Capital structure is unstable and debt financing is changing materially",
          "Dividends perfectly reflect earning power",
          "The company has no debt at all",
          "Only trailing multiples are available"
        ],
        answer: 0,
        explanation: "FCFF is often easier to model than FCFE when leverage policy is changing."
      },
      {
        id: "equity-6",
        prompt: "PVGO is best understood as the portion of stock value attributable to:",
        concept: "PVGO isolates value from future growth opportunities beyond no-growth earnings power.",
        choices: [
          "Current book value only",
          "Expected liquidation proceeds only",
          "Profitable future reinvestment opportunities",
          "Past accounting accruals"
        ],
        answer: 2,
        explanation: "PVGO captures the value created by future growth opportunities rather than current earnings alone."
      }
    ]
  },
  {
    id: "fixed-income",
    title: "Fixed Income",
    shortTitle: "Fixed Income",
    topic: "Fixed Income",
    weight: "10-15%",
    blurb: "Move from curve interpretation to arbitrage-free pricing, optionality, and credit exposure.",
    summary: "Fixed Income at Level II is about structure. You need to understand how term structure, volatility, optionality, and credit interact so that you can value bonds, compare spread measures, and manage rate and spread risk intelligently.",
    teach: "Treat every bond as a package of cash flows plus risk exposures. Then ask which curve, which volatility assumption, and which embedded option or credit feature changes the value.",
    syllabus: [
      "Interpret spot rates, forward rates, bootstrapping, swap curves, and yield-curve dynamics.",
      "Use arbitrage-free valuation with binomial trees and backward induction for fixed-income instruments.",
      "Analyze callable and putable bonds, OAS, effective duration, and option-sensitive spread behavior.",
      "Evaluate corporate, government, and securitized credit risk and the meaning of credit spreads.",
      "Understand CDS mechanics, pricing intuition, and credit-curve trading uses."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If the bond has optionality, a single yield spread is rarely enough. Think tree, OAS, and effective duration."
      },
      {
        label: "Exam pattern",
        text: "The exam often moves from curve view to pricing method to risk measure in one chain."
      },
      {
        label: "Watch for",
        text: "Mixing par, spot, and forward rates, ignoring volatility in callable bonds, and reading spread changes without context."
      }
    ],
    notes: [
      {
        title: "Term structure and rate dynamics",
        points: [
          "Spot rates price single cash flows, while forward rates describe the market-implied path between future dates under no-arbitrage assumptions.",
          "Bootstrapping turns a par curve into zero rates so each cash flow can be discounted correctly.",
          "Swap curves are widely used because the swap market is deep and often provides a practical benchmark for valuation and relative value work.",
          "Curve views should connect to macro expectations: growth, inflation, central bank policy, and risk appetite all influence benchmark rates and spread behavior."
        ]
      },
      {
        title: "Arbitrage-free valuation framework",
        points: [
          "Arbitrage-free valuation discounts each possible path of cash flows at rates consistent with the term structure rather than forcing everything into one yield.",
          "Binomial interest-rate trees let you map state-dependent paths and use backward induction to value bonds and rate-sensitive claims.",
          "Monte Carlo and term-structure models matter when the path dependency becomes too rich for a simple lattice.",
          "The point is not just math elegance. The framework is necessary whenever cash flows depend on future rate paths."
        ]
      },
      {
        title: "Embedded options and OAS",
        points: [
          "A callable bond equals a straight bond minus the value of the issuer's call option. A putable bond equals a straight bond plus the investor's put option.",
          "Rising rate volatility usually hurts callable bonds because the call option becomes more valuable to the issuer.",
          "OAS attempts to strip out the value of embedded options so spread comparisons are more economically meaningful.",
          "Effective duration is the right sensitivity tool when cash flows themselves can change as rates move."
        ]
      },
      {
        title: "Credit analysis and CDS",
        points: [
          "Credit spreads reflect expected default loss, liquidity conditions, risk appetite, and technical supply-demand factors.",
          "Securitized credit needs collateral, structure, and prepayment analysis in addition to plain issuer analysis.",
          "Government issuer analysis focuses on repayment willingness and capacity through fiscal strength, external balance, monetary flexibility, and political structure.",
          "CDS separate credit risk from funding and ownership of the bond, making them useful for hedging, expressing spread views, and relative-value trades."
        ]
      }
    ],
    formulas: [
      "Use bootstrapped spot rates to value each bond cash flow separately",
      "Callable bond = straight bond - embedded call value",
      "Putable bond = straight bond + embedded put value",
      "Swap spread = swap rate - government yield of similar maturity",
      "Effective duration is preferred when cash flows can change with rates"
    ],
    schedule: [
      {
        title: "Day 1: Curve language",
        detail: "Review the difference among spot, par, forward, and swap rates until each has a distinct role."
      },
      {
        title: "Day 2: Tree-based pricing",
        detail: "Work arbitrage-free valuation problems step by step with backward induction."
      },
      {
        title: "Day 4: Optionality review",
        detail: "Focus on callable, putable, OAS, and why volatility matters to spread interpretation."
      },
      {
        title: "Day 7: Credit overlay",
        detail: "Retest by linking term structure views with spread views and credit instruments."
      }
    ],
    questions: [
      {
        id: "fixed-income-1",
        prompt: "Why is a bootstrapped spot curve useful in bond valuation?",
        concept: "Different bond cash flows occur at different maturities and should be discounted using term-consistent zero rates.",
        choices: [
          "It forces every bond to have the same yield to maturity",
          "It provides maturity-specific discount rates for individual cash flows",
          "It removes credit risk from all bonds",
          "It guarantees a flat yield curve"
        ],
        answer: 1,
        explanation: "Bootstrapping produces the zero-coupon rates needed to discount each cash flow consistently."
      },
      {
        id: "fixed-income-2",
        prompt: "Compared with an otherwise similar straight bond, a callable bond will usually be worth:",
        concept: "The issuer's call right reduces the value to the investor.",
        choices: [
          "More, because the investor receives flexibility",
          "Less, because the issuer owns the embedded option",
          "The same in all rate environments",
          "More only when volatility falls"
        ],
        answer: 1,
        explanation: "A callable bond is worth less than a straight bond because the issuer can redeem it when favorable."
      },
      {
        id: "fixed-income-3",
        prompt: "If interest rate volatility rises, the value of a callable bond most likely:",
        concept: "Higher volatility increases the value of the embedded call held by the issuer.",
        choices: [
          "Rises relative to a straight bond",
          "Falls relative to a straight bond",
          "Becomes identical to a putable bond",
          "Stops depending on the yield curve"
        ],
        answer: 1,
        explanation: "More volatility makes the issuer's call option more valuable, which hurts the investor in the callable bond."
      },
      {
        id: "fixed-income-4",
        prompt: "Why is effective duration preferred to modified duration for a callable bond?",
        concept: "Callable bond cash flows can change when rates move, so duration must allow for that path dependence.",
        choices: [
          "Because modified duration can only be used for zero-coupon bonds",
          "Because effective duration allows for cash-flow changes caused by embedded options",
          "Because effective duration ignores yield changes",
          "Because callable bonds have no convexity"
        ],
        answer: 1,
        explanation: "Effective duration captures the fact that expected cash flows can change when interest rates move."
      },
      {
        id: "fixed-income-5",
        prompt: "A widening credit spread on a corporate bond most directly means that:",
        concept: "A higher spread means investors now require more compensation over the benchmark curve.",
        choices: [
          "The benchmark government yield must have fallen",
          "The bond's required compensation for credit and related risks has increased",
          "Default probability has fallen with certainty",
          "The bond is now risk free"
        ],
        answer: 1,
        explanation: "A wider spread means the market is demanding more compensation for credit and related risks."
      },
      {
        id: "fixed-income-6",
        prompt: "A portfolio manager buys CDS protection on a bond issuer. The most direct objective is to:",
        concept: "Buying protection is a hedge against deterioration in the issuer's credit quality.",
        choices: [
          "Increase the portfolio's exposure to that issuer's default risk",
          "Hedge or reduce credit exposure without necessarily selling the bond",
          "Eliminate all interest rate risk",
          "Convert the bond into equity"
        ],
        answer: 1,
        explanation: "Buying CDS protection is commonly used to reduce or hedge credit risk exposure."
      }
    ]
  },
  {
    id: "derivatives",
    title: "Derivatives",
    shortTitle: "Derivatives",
    topic: "Derivatives",
    weight: "5-10%",
    blurb: "Price forwards, swaps, and options with no-arbitrage logic and interpret option risk.",
    summary: "Derivatives at Level II is fundamentally pricing by replication. You need to know how carry, rates, dividends, volatility, and path choices determine fair value, and how option sensitivities translate into trading and hedging decisions.",
    teach: "For every contract, identify the underlying asset, the carry costs or benefits, the financing assumption, and the state-contingent payoff. Then build the no-arbitrage value from there.",
    syllabus: [
      "Price and value equity, fixed income, currency, and swap-based forward commitments.",
      "Use binomial trees and no-arbitrage logic for European and American options.",
      "Interpret Black-Scholes-Merton and Black model components and assumptions.",
      "Understand the Greeks, delta hedging, gamma risk, and implied volatility.",
      "Recognize arbitrage relationships such as put-call parity and option mispricing setups."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If the instrument has a future delivery price, separate the original no-arbitrage price from the contract's current mark-to-market value."
      },
      {
        label: "Exam pattern",
        text: "A lot of derivatives questions ask whether you understand replication logic, not whether you memorized a formula symbol."
      },
      {
        label: "Watch for",
        text: "Mixing pricing with valuation, forgetting carry benefits, and confusing delta risk with gamma risk."
      }
    ],
    notes: [
      {
        title: "Forward commitments",
        points: [
          "Forwards and futures are priced from spot plus financing costs, adjusted for any income, convenience yield, or storage-like effects relevant to the asset.",
          "The price agreed at initiation makes the contract worth roughly zero at trade date, but value changes later as market conditions move.",
          "Swaps are bundles of forward commitments. Their value depends on the difference between the fixed terms you locked in and current market terms.",
          "Currency and equity swaps are usually easiest to understand as exchanging one return stream for another over time."
        ]
      },
      {
        title: "Option valuation logic",
        points: [
          "Binomial models value options by replicating payoffs across possible future states and discounting risk-neutral expected values.",
          "American options include an exercise choice, so early exercise logic must be checked at each node.",
          "Put-call parity links calls, puts, the underlying, and the strike's present value. Violations imply arbitrage if market frictions are ignored.",
          "Options on rates, currencies, and futures adapt the same no-arbitrage structure to different underlying carry conventions."
        ]
      },
      {
        title: "Black-Scholes-Merton and Black intuition",
        points: [
          "Black-Scholes-Merton gives a closed-form way to price certain European options under specific assumptions, including lognormal price dynamics and frictionless trading.",
          "The model's terms can be interpreted economically as a leveraged position in the underlying combined with financing at the risk-free rate.",
          "Black's model adapts the same intuition to options on futures and some rate products where forward pricing is the natural starting point.",
          "The real exam skill is interpreting model inputs, not just reproducing the formula."
        ]
      },
      {
        title: "Greeks and trading meaning",
        points: [
          "Delta measures first-order price sensitivity to the underlying. A delta hedge offsets that exposure at one point in time.",
          "Gamma measures how fast delta itself changes. High gamma means a hedge can go stale quickly when the underlying moves.",
          "Vega matters whenever implied volatility reprices, even if the underlying has not moved much.",
          "Implied volatility is a market price of optionality. Comparing implied to realized volatility helps frame relative-value views."
        ]
      }
    ],
    formulas: [
      "Forward price begins with spot, then add financing cost and subtract carry benefits where relevant",
      "Current forward value depends on today's market forward versus the originally contracted forward",
      "Put-call parity links call, put, underlying price, and present value of strike",
      "Delta is first-order sensitivity; gamma measures how quickly delta changes",
      "Implied volatility is backed out from market price, not observed directly"
    ],
    schedule: [
      {
        title: "Day 1: Pricing versus valuation",
        detail: "Make sure you can explain the difference between the fair price at initiation and the contract's later value."
      },
      {
        title: "Day 2: Work trees",
        detail: "Do binomial option problems carefully enough that the hedge or replication story feels intuitive."
      },
      {
        title: "Day 4: Greeks pass",
        detail: "Review what each Greek means to a trader who has to manage risk dynamically."
      },
      {
        title: "Day 7: Cross-asset retest",
        detail: "Retake with equity, rates, and currency contracts mixed together so you do not rely on pattern memory."
      }
    ],
    questions: [
      {
        id: "derivatives-1",
        prompt: "For an equity forward with no dividends, the no-arbitrage forward price mainly reflects:",
        concept: "With no income benefits, forward price is driven largely by financing the spot purchase to maturity.",
        choices: [
          "Only expected future earnings growth",
          "Current spot price adjusted for financing cost over the contract term",
          "The option's gamma",
          "The issuer's accounting policy"
        ],
        answer: 1,
        explanation: "For a non-dividend-paying equity, the forward price primarily reflects carrying the spot position at the financing rate."
      },
      {
        id: "derivatives-2",
        prompt: "A long forward position entered at fair value will gain value after initiation if:",
        concept: "The long gains when the market forward or spot value rises above the locked-in contract terms.",
        choices: [
          "The underlying's market value rises relative to the contracted delivery price",
          "Interest rates become irrelevant",
          "The contract becomes an option",
          "The original delivery price is forgotten"
        ],
        answer: 0,
        explanation: "The long benefits when the underlying or current forward value rises relative to the original contract terms."
      },
      {
        id: "derivatives-3",
        prompt: "Put-call parity is most useful because it:",
        concept: "Parity reveals the no-arbitrage relation among calls, puts, the underlying, and financing.",
        choices: [
          "Eliminates all volatility risk",
          "Provides a consistency check that can reveal option mispricing",
          "Prices only American options",
          "Makes delta hedging unnecessary"
        ],
        answer: 1,
        explanation: "Put-call parity is a key no-arbitrage relation used to detect inconsistencies across option prices."
      },
      {
        id: "derivatives-4",
        prompt: "Why does high gamma matter to an options trader running a delta hedge?",
        concept: "High gamma means delta changes quickly, so a hedge must be rebalanced more often.",
        choices: [
          "Because the option stops responding to the underlying",
          "Because the hedge can become inaccurate quickly after price moves",
          "Because implied volatility becomes fixed",
          "Because the option becomes risk free"
        ],
        answer: 1,
        explanation: "High gamma means delta changes rapidly, making a static hedge stale after even modest moves."
      },
      {
        id: "derivatives-5",
        prompt: "Implied volatility is best described as:",
        concept: "Implied volatility is the volatility input that makes a model price match the market price.",
        choices: [
          "A directly observed accounting variable",
          "The historical average return on the underlying",
          "The market's embedded pricing of optionality",
          "The same as realized volatility by definition"
        ],
        answer: 2,
        explanation: "Implied volatility is inferred from observed option prices and reflects the market's pricing of option risk."
      },
      {
        id: "derivatives-6",
        prompt: "A receive-fixed interest rate swap becomes more valuable to the fixed-rate receiver when:",
        concept: "Receiving a relatively high fixed rate gains value when market fixed rates decline.",
        choices: [
          "Market swap rates rise sharply",
          "Floating reference rates disappear",
          "Market swap rates fall after the contract is initiated",
          "The notional principal is exchanged"
        ],
        answer: 2,
        explanation: "Receiving a fixed rate that is above current market rates becomes more attractive when market swap rates fall."
      }
    ]
  },
  {
    id: "alternatives",
    title: "Alternative Investments",
    shortTitle: "Alternatives",
    topic: "Alternative Investments",
    weight: "5-10%",
    blurb: "Cover commodities, real estate, REIT valuation, and hedge fund strategy behavior.",
    summary: "Alternative Investments at Level II is about understanding where returns come from. Commodity exposure, private and public real estate, and hedge fund strategies each have distinct drivers, liquidity profiles, valuation tools, and portfolio roles.",
    teach: "Ask what the investor actually owns, how cash flows or roll mechanics create return, what risks are unique to the structure, and whether the vehicle changes the exposure compared with the underlying asset itself.",
    syllabus: [
      "Understand commodity sectors, futures return components, contango, backwardation, and index construction.",
      "Analyze private real estate value drivers, due diligence, and appraisal and index issues.",
      "Value publicly traded real estate securities using NAV, FFO, AFFO, and relative methods.",
      "Classify hedge fund strategies and know their role, risks, and implementation style.",
      "Compare public versus private real estate vehicles and the trade-offs in access, liquidity, and transparency."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "Commodity returns are not just spot returns. Roll return and collateral return can dominate the experience."
      },
      {
        label: "Exam pattern",
        text: "Real estate questions often test whether you can separate property economics from security-structure effects."
      },
      {
        label: "Watch for",
        text: "Confusing contango with expected spot appreciation, mixing NAV with income-based REIT metrics, and treating all hedge funds as one risk bucket."
      }
    ],
    notes: [
      {
        title: "Commodity exposure",
        points: [
          "Commodities are driven by physical supply-demand dynamics, inventory conditions, storage economics, and sometimes convenience yield.",
          "A fully collateralized commodity futures position can earn spot return, roll return, and collateral return. Those pieces can move in very different directions.",
          "Backwardation tends to support positive roll return when positions are rolled down the curve, while contango can create a drag.",
          "Commodity indexes are construction choices, not neutral truths. Weighting rules and roll methodology can materially change investor outcomes."
        ]
      },
      {
        title: "Private real estate",
        points: [
          "Real estate value depends on location, lease structure, occupancy, rent growth, financing conditions, and replacement economics.",
          "Property types differ. Office, industrial, residential, retail, and specialty assets have distinct cyclical sensitivity and lease behavior.",
          "Due diligence must examine title, tenant quality, capex needs, local market supply, and financing terms, not just headline cap rate.",
          "Private real estate indexes are often appraisal-based and can smooth volatility, creating lagged or understated risk impressions."
        ]
      },
      {
        title: "Public real estate securities",
        points: [
          "REIT valuation often uses NAV alongside operating cash-flow proxies such as FFO and AFFO because accounting income can distort recurring property economics.",
          "NAV is especially helpful when public market pricing appears disconnected from the value of the underlying property portfolio.",
          "Publicly traded vehicles offer liquidity and transparency but can trade with equity-market sentiment that temporarily decouples them from private asset value.",
          "Relative metrics like price to FFO and price to AFFO are only useful when compared against property quality, leverage, and growth expectations."
        ]
      },
      {
        title: "Hedge fund strategy families",
        points: [
          "Equity-related strategies rely on stock selection, factor views, or long-short structure and are still linked meaningfully to equity market conditions.",
          "Event-driven strategies focus on catalysts such as mergers, restructurings, or distressed situations and are sensitive to deal completion and financing conditions.",
          "Relative value strategies usually exploit pricing discrepancies and often carry financing, liquidity, or convergence risk.",
          "Opportunistic or macro-style strategies have wider flexibility, which can be powerful but also makes manager skill and risk control especially important."
        ]
      }
    ],
    formulas: [
      "Commodity total return = spot return + roll return + collateral return",
      "Backwardation can support positive roll return; contango can create roll drag",
      "REIT NAVPS is a property-value-based anchor for publicly traded real estate valuation",
      "FFO and AFFO are often better recurring cash-flow anchors than GAAP net income",
      "Appraisal-based indexes can understate or delay the appearance of true market volatility"
    ],
    schedule: [
      {
        title: "Day 1: Return-source map",
        detail: "Separate commodities, private real estate, public real estate, and hedge funds by what actually drives their returns."
      },
      {
        title: "Day 2: Structure drill",
        detail: "Work questions that distinguish underlying asset economics from the vehicle used to access the exposure."
      },
      {
        title: "Day 4: REIT valuation pass",
        detail: "Review NAV, FFO, and AFFO until you know when each one is the right lens."
      },
      {
        title: "Day 7: Strategy-role review",
        detail: "Retest hedge fund strategy classification and the portfolio job each strategy is trying to do."
      }
    ],
    questions: [
      {
        id: "alternatives-1",
        prompt: "For a fully collateralized commodity futures position, total return is most directly driven by:",
        concept: "Commodity futures exposure can produce more than just spot-price change.",
        choices: [
          "Spot return only",
          "Spot return, roll return, and collateral return",
          "Dividend yield and buybacks",
          "Only changes in appraisal values"
        ],
        answer: 1,
        explanation: "Commodity futures total return is typically decomposed into spot, roll, and collateral return."
      },
      {
        id: "alternatives-2",
        prompt: "A market in contango most commonly implies that rolling a long commodity futures position forward will:",
        concept: "Contango generally creates a negative roll effect for a long investor who keeps buying more expensive deferred contracts.",
        choices: [
          "Create positive roll return",
          "Create roll drag",
          "Remove collateral return",
          "Guarantee spot appreciation"
        ],
        answer: 1,
        explanation: "In contango, a long investor rolling forward often buys higher-priced contracts, which creates a roll drag."
      },
      {
        id: "alternatives-3",
        prompt: "Why can appraisal-based private real estate indexes understate true economic volatility?",
        concept: "Appraisals adjust slowly and can smooth market movements.",
        choices: [
          "Because real estate never changes in value quickly",
          "Because appraisals can lag transactions and smooth prices over time",
          "Because cap rates are constant",
          "Because occupancy never changes"
        ],
        answer: 1,
        explanation: "Appraisal-based indexes often lag market-clearing transactions and therefore smooth volatility."
      },
      {
        id: "alternatives-4",
        prompt: "NAV per share is especially useful for valuing publicly traded real estate securities when:",
        concept: "NAV helps anchor security price to underlying property value.",
        choices: [
          "Underlying property values are irrelevant",
          "The market price may have diverged from the estimated value of the real estate portfolio",
          "FFO is prohibited",
          "The REIT has no assets"
        ],
        answer: 1,
        explanation: "NAV per share is helpful when you want to compare traded price to estimated property value."
      },
      {
        id: "alternatives-5",
        prompt: "An event-driven hedge fund strategy is most likely focused on:",
        concept: "Event-driven strategies seek to monetize catalyst-driven price changes.",
        choices: [
          "Long-term commodity storage economics only",
          "Catalysts such as mergers, restructurings, or distressed situations",
          "Passive buy-and-hold indexing",
          "Only inflation-linked bonds"
        ],
        answer: 1,
        explanation: "Event-driven strategies target catalyst-dependent pricing opportunities such as mergers and restructurings."
      },
      {
        id: "alternatives-6",
        prompt: "Compared with private real estate, publicly traded real estate vehicles usually offer investors:",
        concept: "Public structures typically improve liquidity and market transparency but can trade with broader equity sentiment.",
        choices: [
          "Less liquidity and less transparency",
          "More liquidity and easier secondary-market access",
          "Guaranteed alignment with appraisal values",
          "No exposure to equity-market sentiment"
        ],
        answer: 1,
        explanation: "Public vehicles usually provide greater liquidity and tradability than private real estate investments."
      }
    ]
  },
  {
    id: "portfolio",
    title: "Portfolio Management",
    shortTitle: "Portfolio",
    topic: "Portfolio Management",
    weight: "10-15%",
    blurb: "Tie macro expectations, active skill, ETFs, factor models, and risk systems together.",
    summary: "Portfolio Management at Level II is about integration. You need to translate economic views into market exposures, measure active value added, understand implementation tools such as ETFs, and evaluate risk using factor, VaR, scenario, and backtesting frameworks.",
    teach: "Think like a PM: what is the view, how is it expressed, how is success measured, what risks are being taken, and how do you know the evidence is real rather than backtest noise?",
    syllabus: [
      "Connect business-cycle conditions and expectations to rates, spreads, earnings, valuation multiples, and asset-class behavior.",
      "Measure active management skill with information ratio and the fundamental law of active management.",
      "Understand ETF mechanics, tracking error, premiums or discounts, costs, and portfolio uses.",
      "Apply multifactor models and APT logic to expected return estimation and risk decomposition.",
      "Use VaR, scenario analysis, backtesting, and simulation to measure and manage portfolio risk."
    ],
    highlights: [
      {
        label: "High-yield trigger",
        text: "If the question mentions active value added, tracking risk, or manager skill, information ratio logic is probably central."
      },
      {
        label: "Exam pattern",
        text: "Portfolio Management often asks you to connect a market view to implementation and then to a risk measure."
      },
      {
        label: "Watch for",
        text: "Confusing Sharpe with information ratio, treating ETF price as equal to NAV at all times, and trusting a backtest without checking design flaws."
      }
    ],
    notes: [
      {
        title: "Economics and investment markets",
        points: [
          "Markets react not just to economic levels but to changes in expectations. A good macro call can still lose money if it is already fully priced.",
          "Business-cycle phase influences rates, spreads, earnings expectations, and valuation multiples differently across asset classes.",
          "Credit-sensitive assets care about both benchmark-rate direction and spread direction, so macro views must be decomposed carefully.",
          "Real estate, equities, and fixed income all transmit economic conditions through different combinations of growth, inflation, and risk-premium channels."
        ]
      },
      {
        title: "Active management measurement",
        points: [
          "Information ratio measures active return per unit of tracking risk. It is the clean metric for benchmarking manager value added relative to an index.",
          "The fundamental law says performance capacity depends on skill, breadth, and the manager's ability to translate insights into positions.",
          "High active risk is not automatically good. It only deserves capital when the expected information ratio justifies it.",
          "Active share, tracking error, and factor exposures tell different stories, so no single metric fully captures active behavior."
        ]
      },
      {
        title: "Implementation tools and factor models",
        points: [
          "ETF mechanics matter because creation and redemption help keep trading prices near NAV, but frictions can still produce discounts, premiums, and tracking differences.",
          "ETF costs include explicit fees as well as spreads, market impact, sampling effects, tax characteristics, and potential tracking error.",
          "Multifactor models help estimate expected return, attribute performance, and understand whether a portfolio's apparent alpha is really just factor exposure.",
          "APT-style thinking is useful because it frames expected return as compensation for systematic exposures rather than a single market beta alone."
        ]
      },
      {
        title: "Risk measurement and backtesting",
        points: [
          "VaR summarizes a downside threshold under stated assumptions, but it says little about losses beyond that threshold unless paired with complementary measures.",
          "Historical simulation, parametric VaR, and Monte Carlo each have strengths and blind spots depending on data history, distribution assumptions, and path complexity.",
          "Scenario analysis and sensitivity measures are valuable because they make risk intuitive and can capture regime or factor shocks more directly than VaR alone.",
          "Backtests can look great because of overfitting, survivorship bias, look-ahead bias, or unrealistic trading assumptions, so process discipline matters as much as results."
        ]
      }
    ],
    formulas: [
      "Information ratio = active return / tracking error",
      "Fundamental law anchor: IR approximately IC x TC x sqrt(Breadth)",
      "APT-style expected return adds factor sensitivities times factor risk premiums",
      "VaR is a threshold estimate, not a full description of tail loss severity",
      "Backtest quality depends on data integrity, realistic implementation assumptions, and out-of-sample evidence"
    ],
    schedule: [
      {
        title: "Day 1: PM framework",
        detail: "Link economic view, implementation choice, performance metric, and risk control in one outline."
      },
      {
        title: "Day 2: Skill and ETF worksheet",
        detail: "Practice information ratio, ETF mechanics, and factor-model interpretation together."
      },
      {
        title: "Day 4: Risk systems pass",
        detail: "Review VaR, scenario analysis, and why backtests can mislead even when the chart looks impressive."
      },
      {
        title: "Day 7: Integrated manager review",
        detail: "Retake with questions that force you to judge both return source and implementation risk."
      }
    ],
    questions: [
      {
        id: "portfolio-1",
        prompt: "Compared with the Sharpe ratio, the information ratio is most directly focused on:",
        concept: "The information ratio measures active return relative to benchmark-relative risk.",
        choices: [
          "Return per unit of total volatility only",
          "Active return per unit of tracking risk",
          "Liquidity cost per unit of turnover",
          "Dividend yield relative to risk-free rate"
        ],
        answer: 1,
        explanation: "The information ratio is the benchmark-relative performance metric used to judge active management efficiency."
      },
      {
        id: "portfolio-2",
        prompt: "Under the fundamental law of active management, increasing breadth while holding skill constant should generally:",
        concept: "More independent opportunities can improve information ratio if skill is real and transferable.",
        choices: [
          "Reduce expected value added automatically",
          "Increase the potential information ratio",
          "Eliminate tracking error",
          "Make transfer coefficient irrelevant"
        ],
        answer: 1,
        explanation: "More breadth can raise potential information ratio when the manager has genuine forecasting skill."
      },
      {
        id: "portfolio-3",
        prompt: "An ETF trades at a premium to NAV. The most direct explanation is that:",
        concept: "ETF market price can temporarily diverge from NAV because of trading frictions, demand imbalances, or impaired arbitrage.",
        choices: [
          "ETF prices are legally fixed to NAV",
          "Secondary-market demand and frictions can temporarily push market price above NAV",
          "The authorized participant process has no role",
          "Tracking error is impossible"
        ],
        answer: 1,
        explanation: "ETFs can trade above NAV when market demand and frictions temporarily overpower the arbitrage mechanism."
      },
      {
        id: "portfolio-4",
        prompt: "A multifactor model estimates that a portfolio's excess return is largely explained by value and size exposures. The best conclusion is:",
        concept: "Apparent alpha may actually be factor-driven return.",
        choices: [
          "Manager skill is proven and factors are irrelevant",
          "Some of the portfolio's return may reflect systematic factor tilts rather than pure security-selection alpha",
          "APT has been disproven",
          "The portfolio has no risk"
        ],
        answer: 1,
        explanation: "If factor exposures explain return, the active result may be less idiosyncratic alpha than it first appeared."
      },
      {
        id: "portfolio-5",
        prompt: "Why is VaR alone an incomplete risk measure?",
        concept: "VaR gives a threshold but not the full severity of losses beyond that threshold.",
        choices: [
          "Because it always overstates risk",
          "Because it says little about the magnitude of losses once the threshold is breached",
          "Because it cannot use historical data",
          "Because it ignores every correlation"
        ],
        answer: 1,
        explanation: "VaR summarizes a cutoff level, but it does not fully describe tail-loss severity beyond that point."
      },
      {
        id: "portfolio-6",
        prompt: "A backtest shows excellent returns but relies on revised data that were not available at the time decisions would have been made. The clearest problem is:",
        concept: "Using future information in a historical test creates look-ahead bias.",
        choices: [
          "Tracking error",
          "Look-ahead bias",
          "Contango",
          "Capital deepening"
        ],
        answer: 1,
        explanation: "A backtest that uses information not available at the decision date is contaminated by look-ahead bias."
      }
    ]
  }
];

const supplemental = window.CFA_L2_SUPPLEMENTAL || {
  baseSets: {},
  studySequences: {},
  extraQuestions: {}
};

applySupplementalContent(chapters, supplemental);

const LEVEL_ONE_ID = "level1";
const LEVEL_TWO_ID = "level2";
const LEVEL_CUSTOM_ID = "custom";
const LEVEL_THREE_ID = "level3";
const LEVEL_IDS = [LEVEL_ONE_ID, LEVEL_TWO_ID, LEVEL_CUSTOM_ID];

const levelConfigs = {
  [LEVEL_CUSTOM_ID]: buildCustomLevelConfig(),
  [LEVEL_ONE_ID]: {
    id: LEVEL_ONE_ID,
    label: "Level I",
    heroLabel: "CFA Level I Tutor",
    heroCopy: "Built around the current CFA Level I topic structure, this coach uses original practice questions, quick teaching notes, and a replay queue for anything you miss.",
    mapTitle: "Current Level I Topic Map",
    pathTitle: "Level I Run",
    practiceIntro: "Level I uses standalone 3-choice questions. Use the concept cue to frame the answer before you lock in A, B, or C.",
    chapters: prepareLevelChapters(window.CFA_LEVEL_ONE?.chapters || [], {
      mode: "standalone",
      questionLabel: "Level I MCQ",
      questionTitleSuffix: "Standalone Question",
      chapterOrder: [
        "ethics",
        "quant",
        "economics",
        "fsa",
        "corporate",
        "equity",
        "fixed-income",
        "derivatives",
        "alternatives",
        "portfolio"
      ]
    })
  },
  [LEVEL_TWO_ID]: {
    id: LEVEL_TWO_ID,
    label: "Level II",
    heroLabel: "CFA Level II Tutor",
    heroCopy: "Built around the current CFA Level II topic structure, this coach uses original item-set style practice, longer study notes, and a replay queue for anything you miss.",
    mapTitle: "Current Level II Topic Map",
    pathTitle: "Level II Run",
    practiceIntro: "Level II uses item-set style questions built around a short case vignette. The case context will appear here.",
    chapters: prepareLevelChapters(chapters, {
      mode: "item-set",
      questionLabel: "Item Set",
      questionTitleSuffix: "Item Set",
      chapterOrder: [
        "ethics",
        "quant",
        "economics",
        "corporate",
        "fsa",
        "equity",
        "fixed-income",
        "derivatives",
        "alternatives",
        "portfolio"
      ]
    })
  },
  [LEVEL_THREE_ID]: {
    id: LEVEL_THREE_ID,
    label: "Level III",
    locked: true
  }
};

let allChapterIds = [];
let allQuestionIds = new Set();

refreshCurrentLevelData(LEVEL_ONE_ID);

const state = loadState();
refreshCurrentLevelData(state.currentLevel);
loadLevelProgressIntoRoot(state.currentLevel);

const lessonList = document.getElementById("lesson-list");
const stageTitle = document.getElementById("stage-title");
const progressCaption = document.getElementById("progress-caption");
const progressFill = document.getElementById("progress-fill");
const chapterTopic = document.getElementById("chapter-topic");
const chapterStatus = document.getElementById("chapter-status");
const chapterTitle = document.getElementById("chapter-title");
const chapterSummary = document.getElementById("chapter-summary");
const chapterTeach = document.getElementById("chapter-teach");
const weightCaption = document.getElementById("weight-caption");
const syllabusList = document.getElementById("syllabus-list");
const highlightGrid = document.getElementById("highlight-grid");
const notesSections = document.getElementById("notes-sections");
const formulaList = document.getElementById("formula-list");
const scheduleCaption = document.getElementById("schedule-caption");
const scheduleList = document.getElementById("schedule-list");
const notesTab = document.getElementById("notes-tab");
const practiceTab = document.getElementById("practice-tab");
const notesView = document.getElementById("notes-view");
const practiceView = document.getElementById("practice-view");
const notesStartButton = document.getElementById("notes-start-button");
const questionTopic = document.getElementById("question-topic");
const replayState = document.getElementById("replay-state");
const questionSetLabel = document.getElementById("question-set-label");
const questionDifficulty = document.getElementById("question-difficulty");
const questionPosition = document.getElementById("question-position");
const vignetteTitle = document.getElementById("vignette-title");
const vignetteCopy = document.getElementById("vignette-copy");
const questionPrompt = document.getElementById("question-prompt");
const conceptCopy = document.getElementById("concept-copy");
const answerGrid = document.getElementById("answer-grid");
const feedbackPanel = document.getElementById("feedback-panel");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackBody = document.getElementById("feedback-body");
const continueButton = document.getElementById("continue-button");
const skipButton = document.getElementById("skip-question");
const startButton = document.getElementById("start-session");
const resetButton = document.getElementById("reset-progress");
const masteredCount = document.getElementById("mastered-count");
const queueCount = document.getElementById("queue-count");
const streakCount = document.getElementById("streak-count");
const correctCount = document.getElementById("correct-count");
const missedCount = document.getElementById("missed-count");
const repeatCount = document.getElementById("repeat-count");
const reviewList = document.getElementById("review-list");
const teachingCard = document.getElementById("teaching-card");
const heroLevelLabel = document.getElementById("hero-level-label");
const heroTextCopy = document.getElementById("hero-text-copy");
const topicMapTitle = document.getElementById("topic-map-title");
const topicPills = document.getElementById("topic-pills");
const pathTitle = document.getElementById("path-title");
const levelCustomTab = document.getElementById("level-custom-tab");
const level1Tab = document.getElementById("level-1-tab");
const level2Tab = document.getElementById("level-2-tab");
const level3Tab = document.getElementById("level-3-tab");
const questionYear = document.getElementById("question-year");

function loadState() {
  const base = {
    currentLevel: LEVEL_ONE_ID,
    levelProgress: {},
    unlockedChapters: [...allChapterIds],
    completedChapters: [],
    selectedChapterId: chapters[0]?.id || null,
    activeChapterId: null,
    currentView: "notes",
    queue: [],
    masteredQuestionIds: [],
    currentQuestionId: null,
    selectedChoice: null,
    awaitingContinue: false,
    stats: {
      correct: 0,
      missed: 0,
      streak: 0
    },
    repeatIds: []
  };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return base;
    }

    const parsed = JSON.parse(raw);
    const merged = {
      ...base,
      ...parsed,
      stats: {
        ...base.stats,
        ...(parsed.stats || {})
      }
    };

    merged.currentLevel = levelConfigs[merged.currentLevel] ? merged.currentLevel : LEVEL_ONE_ID;
    merged.levelProgress = normalizeLevelProgress(merged.levelProgress);
    migrateLegacyRootProgress(merged);
    return merged;
  } catch (error) {
    return base;
  }
}

function createEmptyLevelProgress(levelId) {
  const level = levelConfigs[levelId];
  const chapterIds = level?.chapters?.map((chapter) => chapter.id) || [];

  return {
    unlockedChapters: [...chapterIds],
    completedChapters: [],
    selectedChapterId: chapterIds[0] || null,
    activeChapterId: null,
    currentView: "notes",
    queue: [],
    masteredQuestionIds: [],
    currentQuestionId: null,
    selectedChoice: null,
    awaitingContinue: false,
    stats: {
      correct: 0,
      missed: 0,
      streak: 0
    },
    repeatIds: []
  };
}

function normalizeLevelProgress(progressByLevel) {
  const normalized = {};

  LEVEL_IDS.forEach((levelId) => {
    const incoming = progressByLevel?.[levelId] || {};
    normalized[levelId] = {
      ...createEmptyLevelProgress(levelId),
      ...incoming,
      stats: {
        ...createEmptyLevelProgress(levelId).stats,
        ...(incoming.stats || {})
      }
    };
  });

  return normalized;
}

function migrateLegacyRootProgress(rootState) {
  const legacyLevelId = LEVEL_TWO_ID;
  const legacyProgress = rootState.levelProgress[legacyLevelId];
  const hasLegacySelections = Array.isArray(rootState.completedChapters)
    || Array.isArray(rootState.masteredQuestionIds)
    || Array.isArray(rootState.queue);

  if (!hasLegacySelections) {
    return;
  }

  const shouldCopyLegacy = !legacyProgress.completedChapters.length
    && !legacyProgress.masteredQuestionIds.length
    && !legacyProgress.queue.length
    && !legacyProgress.repeatIds.length
    && (!legacyProgress.selectedChapterId || legacyProgress.selectedChapterId === levelConfigs[legacyLevelId].chapters[0]?.id);

  if (!shouldCopyLegacy) {
    return;
  }

  rootState.levelProgress[legacyLevelId] = {
    ...legacyProgress,
    unlockedChapters: Array.isArray(rootState.unlockedChapters) && rootState.unlockedChapters.length
      ? [...rootState.unlockedChapters]
      : [...legacyProgress.unlockedChapters],
    completedChapters: Array.isArray(rootState.completedChapters) ? [...rootState.completedChapters] : [],
    selectedChapterId: rootState.selectedChapterId || legacyProgress.selectedChapterId,
    activeChapterId: rootState.activeChapterId || null,
    currentView: rootState.currentView || "notes",
    queue: Array.isArray(rootState.queue) ? [...rootState.queue] : [],
    masteredQuestionIds: Array.isArray(rootState.masteredQuestionIds) ? [...rootState.masteredQuestionIds] : [],
    currentQuestionId: rootState.currentQuestionId || null,
    selectedChoice: Number.isInteger(rootState.selectedChoice) ? rootState.selectedChoice : null,
    awaitingContinue: Boolean(rootState.awaitingContinue),
    stats: {
      ...legacyProgress.stats,
      ...(rootState.stats || {})
    },
    repeatIds: Array.isArray(rootState.repeatIds) ? [...rootState.repeatIds] : []
  };
}

function loadLevelProgressIntoRoot(levelId) {
  const levelProgress = state.levelProgress[levelId] || createEmptyLevelProgress(levelId);

  state.unlockedChapters = [...levelProgress.unlockedChapters];
  state.completedChapters = [...levelProgress.completedChapters];
  state.selectedChapterId = levelProgress.selectedChapterId;
  state.activeChapterId = levelProgress.activeChapterId;
  state.currentView = levelProgress.currentView;
  state.queue = [...levelProgress.queue];
  state.masteredQuestionIds = [...levelProgress.masteredQuestionIds];
  state.currentQuestionId = levelProgress.currentQuestionId;
  state.selectedChoice = levelProgress.selectedChoice;
  state.awaitingContinue = levelProgress.awaitingContinue;
  state.stats = { ...levelProgress.stats };
  state.repeatIds = [...levelProgress.repeatIds];
}

function persistRootProgressIntoLevel(levelId) {
  state.levelProgress[levelId] = {
    unlockedChapters: [...state.unlockedChapters],
    completedChapters: [...state.completedChapters],
    selectedChapterId: state.selectedChapterId,
    activeChapterId: state.activeChapterId,
    currentView: state.currentView,
    queue: [...state.queue],
    masteredQuestionIds: [...state.masteredQuestionIds],
    currentQuestionId: state.currentQuestionId,
    selectedChoice: state.selectedChoice,
    awaitingContinue: state.awaitingContinue,
    stats: { ...state.stats },
    repeatIds: [...state.repeatIds]
  };
}

function saveState() {
  persistRootProgressIntoLevel(state.currentLevel);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function refreshCurrentLevelData(levelId) {
  if (levelId === LEVEL_CUSTOM_ID) {
    levelConfigs[LEVEL_CUSTOM_ID] = buildCustomLevelConfig();
  }

  const level = levelConfigs[levelId] || levelConfigs[LEVEL_ONE_ID];
  chapters.length = 0;
  level.chapters.forEach((chapter) => {
    chapters.push(chapter);
  });
  allChapterIds = chapters.map((chapter) => chapter.id);
  allQuestionIds = new Set(chapters.flatMap((chapter) => chapter.questions.map((question) => question.id)));
}

function buildCustomLevelConfig() {
  const customCourse = window.ICECourseGenerator?.loadCourse?.();

  if (!customCourse) {
    return {
      id: LEVEL_CUSTOM_ID,
      label: "Custom",
      heroLabel: "Custom course",
      heroCopy: "No custom course has been generated yet. Go back to the master page and create one first.",
      mapTitle: "Custom Topic Map",
      pathTitle: "Custom Run",
      practiceIntro: "Generate a custom course from the master page to load practice here.",
      chapters: prepareLevelChapters([
        {
          id: "custom-start",
          title: "Create your custom study site",
          shortTitle: "Custom Start",
          topic: "Custom course",
          weight: "100%",
          blurb: "Use the generator form on the master page to create your first custom track.",
          summary: "This space is reserved for student-built courses. Once a learning brief is generated, the modules, notes, and replay questions will appear here automatically.",
          teach: "Go back to the main page, fill in the subject and goals, then reopen this coach.",
          syllabus: [
            "Choose the topic the student wants to learn.",
            "Define the learning goal and focus areas.",
            "Generate modules, notes, and replay-based questions.",
            "Return here to study the generated track."
          ],
          highlights: [
            {
              label: "Next step",
              text: "Open the master page and generate a custom study site."
            },
            {
              label: "Use case",
              text: "This pipeline works for revision tracks, new topics, and subject-specific drill sites."
            },
            {
              label: "Format",
              text: "The generated course will use the same study-note and practice layout as the CFA tutor."
            }
          ],
          notes: [
            {
              title: "How the custom pipeline works",
              points: [
                "The student enters a topic, goal, and focus areas on the hub page.",
                "The builder turns that input into modules, notes, and quiz questions.",
                "The coach then loads the generated course as its own study lane."
              ]
            }
          ],
          formulas: [
            "Prompt -> modules",
            "Modules -> notes",
            "Notes -> replay practice",
            "Replay -> retention"
          ],
          schedule: [
            {
              title: "Step 1: Generate the course",
              detail: "Use the builder on the hub page."
            },
            {
              title: "Step 2: Open the coach",
              detail: "The generated content will load here automatically."
            }
          ],
          questions: [
            {
              id: "custom-start-1",
              year: 2026,
              difficulty: "Easy",
              setLabel: "Custom Builder",
              caseTitle: "Generate first",
              caseText: "The custom study lane becomes active once a student learning brief has been generated from the hub page.",
              prompt: "What should the student do first to use the custom course lane?",
              concept: "The custom lane depends on a generated course brief.",
              choices: [
                "Generate a course from the master page",
                "Reset Level II progress",
                "Open the replay queue first"
              ],
              answer: 0,
              explanation: "The custom lane only becomes populated after generating a custom course from the hub."
            }
          ]
        }
      ], {
        mode: "standalone",
        questionLabel: "Custom MCQ",
        questionTitleSuffix: "Custom Question",
        chapterOrder: ["custom-start"]
      })
    };
  }

  return {
    id: LEVEL_CUSTOM_ID,
    label: "Custom",
    heroLabel: "Student-built course",
    heroCopy: `Custom study site for ${customCourse.title}.`,
    mapTitle: `${customCourse.title} Topic Map`,
    pathTitle: `${customCourse.title} Run`,
    practiceIntro: customCourse.practiceIntro,
    chapters: prepareLevelChapters(customCourse.chapters || [], {
      mode: customCourse.quizStyle === "case" ? "item-set" : "standalone",
      questionLabel: customCourse.quizStyle === "case" ? "Custom Set" : "Custom MCQ",
      questionTitleSuffix: customCourse.quizStyle === "case" ? "Case Set" : "Standalone Question",
      chapterOrder: (customCourse.chapters || []).map((chapter) => chapter.id)
    })
  };
}

function prepareLevelChapters(sourceChapters, options) {
  return sourceChapters
    .map((chapter) => ({
      ...chapter,
      questions: (chapter.questions || []).map((question, index) => normalizeQuestion({
        ...question,
        year: question.year || defaultYearByIndex(index),
        difficulty: question.difficulty || "Medium",
        setLabel: options.mode === "item-set"
          ? (question.setLabel || `${chapter.title} Item Set`)
          : `Practice Year ${question.year || defaultYearByIndex(index)}`,
        caseTitle: options.mode === "item-set"
          ? (question.caseTitle || chapter.title)
          : `${chapter.title} ${options.questionTitleSuffix}`,
        caseText: options.mode === "item-set"
          ? (question.caseText || chapter.summary)
          : `${chapter.summary} This Level I question is tagged to the ${question.year || defaultYearByIndex(index)} practice set.`
      }))
    }))
    .sort((left, right) => {
      const leftIndex = options.chapterOrder.indexOf(left.id);
      const rightIndex = options.chapterOrder.indexOf(right.id);
      return leftIndex - rightIndex;
    });
}

function defaultYearByIndex(index) {
  const baseYear = 2020;
  return baseYear + (index % 7);
}

function getChapterById(chapterId) {
  return chapters.find((chapter) => chapter.id === chapterId) || null;
}

function getQuestionById(questionId) {
  for (const chapter of chapters) {
    const match = chapter.questions.find((question) => question.id === questionId);
    if (match) {
      return match;
    }
  }

  return null;
}

function applySupplementalContent(chapterList, config) {
  const flattenedExtraQuestions = Object.values(config.extraQuestions || {}).flat();

  chapterList.forEach((chapter) => {
    const chapterBaseSets = config.baseSets?.[chapter.id] || [];
    const chapterExtraQuestions = flattenedExtraQuestions.filter(
      (question, index, list) =>
        question.id?.startsWith(`${chapter.id}-`) &&
        list.findIndex((item) => item.id === question.id) === index
    );
    const chapterStudySequence = config.studySequences?.[chapter.id] || [];

    chapter.questions = chapter.questions.map((question) => normalizeQuestion({
      difficulty: "Medium",
      setLabel: `${chapter.title} Item Set`,
      caseTitle: chapter.title,
      caseText: chapter.summary,
      ...question
    }));

    chapterBaseSets.forEach((setConfig) => {
      setConfig.ids.forEach((questionId, index) => {
        const match = chapter.questions.find((question) => question.id === questionId);
        if (!match) {
          return;
        }

        match.setLabel = setConfig.setLabel;
        match.caseTitle = setConfig.caseTitle;
        match.caseText = setConfig.caseText;
        match.difficulty = setConfig.difficulties[index] || match.difficulty;
      });
    });

    chapter.questions = [...chapter.questions, ...chapterExtraQuestions.map((question) => normalizeQuestion(question))];

    if (chapterStudySequence.length) {
      chapter.schedule = chapterStudySequence;
    }
  });
}

function normalizeQuestion(question) {
  const normalizedChoices = Array.isArray(question.choices) ? [...question.choices] : [];
  let normalizedAnswer = Number(question.answer) || 0;

  if (normalizedChoices.length > 3) {
    const correctChoice = normalizedChoices[normalizedAnswer];
    const wrongChoices = normalizedChoices.filter((choice, index) => index !== normalizedAnswer);
    const trimmedWrongChoices = wrongChoices.slice(0, 2);
    const finalChoices = [...trimmedWrongChoices, correctChoice];

    finalChoices.sort((left, right) => {
      const leftScore = scoreChoiceQuality(left, correctChoice);
      const rightScore = scoreChoiceQuality(right, correctChoice);
      return leftScore - rightScore;
    });

    normalizedAnswer = finalChoices.findIndex((choice) => choice === correctChoice);
    return {
      ...question,
      choices: finalChoices,
      answer: normalizedAnswer
    };
  }

  if (normalizedChoices.length === 3) {
    return {
      ...question,
      choices: normalizedChoices,
      answer: Math.min(Math.max(normalizedAnswer, 0), 2)
    };
  }

  return question;
}

function scoreChoiceQuality(choice, correctChoice) {
  const choiceWords = String(choice).toLowerCase().split(/\W+/).filter(Boolean);
  const correctWords = new Set(String(correctChoice).toLowerCase().split(/\W+/).filter(Boolean));
  let overlap = 0;

  choiceWords.forEach((word) => {
    if (correctWords.has(word)) {
      overlap += 1;
    }
  });

  return -overlap;
}

function getQuestionIndex(chapter, questionId) {
  return chapter.questions.findIndex((question) => question.id === questionId);
}

function ensureStateIntegrity() {
  refreshCurrentLevelData(state.currentLevel);
  state.unlockedChapters = [...allChapterIds];
  state.completedChapters = state.completedChapters.filter((chapterId) => allChapterIds.includes(chapterId));
  state.masteredQuestionIds = state.masteredQuestionIds.filter((questionId) => allQuestionIds.has(questionId));
  state.repeatIds = state.repeatIds.filter((questionId) => allQuestionIds.has(questionId));
  state.queue = state.queue.filter((questionId) => allQuestionIds.has(questionId));

  if (!state.selectedChapterId || !getChapterById(state.selectedChapterId)) {
    state.selectedChapterId = chapters[0].id;
  }

  if (state.activeChapterId && !getChapterById(state.activeChapterId)) {
    state.activeChapterId = null;
  }

  if (state.currentView !== "notes" && state.currentView !== "practice") {
    state.currentView = "notes";
  }

  if (state.currentQuestionId && !allQuestionIds.has(state.currentQuestionId)) {
    state.currentQuestionId = state.queue[0] || null;
  }
}

function switchLevel(levelId) {
  const nextLevel = levelConfigs[levelId];
  if (!nextLevel || nextLevel.locked || levelId === state.currentLevel) {
    return;
  }

  persistRootProgressIntoLevel(state.currentLevel);
  state.currentLevel = levelId;
  refreshCurrentLevelData(levelId);
  loadLevelProgressIntoRoot(levelId);
  ensureStateIntegrity();
  saveState();
  render();
}

function getSelectedChapter() {
  return getChapterById(state.selectedChapterId) || chapters[0];
}

function selectChapter(chapterId) {
  const chapter = getChapterById(chapterId);
  if (!chapter) {
    return;
  }

  state.selectedChapterId = chapterId;
  if (state.activeChapterId !== chapterId) {
    state.currentView = "notes";
  }
  saveState();
  render();
}

function startChapter(chapterId) {
  const chapter = getChapterById(chapterId);
  if (!chapter) {
    return;
  }

  state.selectedChapterId = chapterId;
  state.activeChapterId = chapterId;
  state.currentView = "practice";
  state.queue = chapter.questions.map((question) => question.id);
  state.repeatIds = [];
  state.currentQuestionId = state.queue[0] || null;
  state.selectedChoice = null;
  state.awaitingContinue = false;
  saveState();
  render();
}

function finishChapter() {
  const chapter = getChapterById(state.activeChapterId);
  if (!chapter) {
    return;
  }

  if (!state.completedChapters.includes(chapter.id)) {
    state.completedChapters.push(chapter.id);
  }

  state.activeChapterId = null;
  state.currentView = "notes";
  state.queue = [];
  state.currentQuestionId = null;
  state.selectedChoice = null;
  state.awaitingContinue = false;
  state.repeatIds = [];
  saveState();
}

function moveQuestionToReplay(questionId) {
  const queueWithoutCurrent = state.queue.filter((id) => id !== questionId);
  queueWithoutCurrent.push(questionId);
  state.queue = queueWithoutCurrent;

  if (!state.repeatIds.includes(questionId)) {
    state.repeatIds.push(questionId);
  }
}

function advanceQueue() {
  if (!state.currentQuestionId) {
    return;
  }

  state.queue = state.queue.filter((id) => id !== state.currentQuestionId);

  if (!state.queue.length) {
    finishChapter();
    render();
    return;
  }

  state.currentQuestionId = state.queue[0];
  state.selectedChoice = null;
  state.awaitingContinue = false;
  feedbackPanel.hidden = true;
  saveState();
  render();
}

function setView(view) {
  state.currentView = view;
  saveState();
  render();
}

function handleChoice(choiceIndex) {
  if (!state.activeChapterId || state.awaitingContinue) {
    return;
  }

  const question = getQuestionById(state.currentQuestionId);
  if (!question) {
    return;
  }

  state.selectedChoice = choiceIndex;
  state.awaitingContinue = true;

  const isCorrect = choiceIndex === question.answer;
  const alreadyMastered = state.masteredQuestionIds.includes(question.id);

  feedbackPanel.hidden = false;
  feedbackPanel.classList.toggle("correct", isCorrect);
  feedbackPanel.classList.toggle("incorrect", !isCorrect);

  if (isCorrect) {
    feedbackTitle.textContent = "Correct. Keep the streak alive.";
    feedbackBody.textContent = question.explanation;
    state.stats.correct += 1;
    state.stats.streak += 1;

    if (!alreadyMastered) {
      state.masteredQuestionIds.push(question.id);
    }

    state.repeatIds = state.repeatIds.filter((id) => id !== question.id);
  } else {
    feedbackTitle.textContent = "Not quite. This card is coming back.";
    feedbackBody.textContent = `${question.explanation} We'll replay it after a few more cards.`;
    state.stats.missed += 1;
    state.stats.streak = 0;
    moveQuestionToReplay(question.id);
  }

  continueButton.disabled = false;
  saveState();
  renderAnswerOptions(question, true);
  renderSidebar();
}

function handleContinue() {
  if (!state.awaitingContinue) {
    return;
  }

  const question = getQuestionById(state.currentQuestionId);
  if (!question) {
    return;
  }

  if (state.selectedChoice === question.answer) {
    advanceQueue();
  } else {
    state.currentQuestionId = state.queue.find((id) => id !== question.id) || question.id;
    state.selectedChoice = null;
    state.awaitingContinue = false;
    feedbackPanel.hidden = true;
    continueButton.disabled = true;
    saveState();
    render();
  }
}

function handleSkip() {
  if (!state.activeChapterId || !state.currentQuestionId) {
    return;
  }

  moveQuestionToReplay(state.currentQuestionId);
  state.currentQuestionId = state.queue.find((id) => id !== state.currentQuestionId) || state.currentQuestionId;
  state.selectedChoice = null;
  state.awaitingContinue = false;
  feedbackPanel.hidden = true;
  continueButton.disabled = true;
  saveState();
  render();
}

function renderChapterList() {
  lessonList.innerHTML = "";

  chapters.forEach((chapter) => {
    const button = document.createElement("button");
    button.className = "lesson-chip";

    const isComplete = state.completedChapters.includes(chapter.id);
    const isSelected = state.selectedChapterId === chapter.id;
    const isActive = state.activeChapterId === chapter.id;

    if (isComplete) {
      button.classList.add("complete");
    }

    if (isSelected || isActive) {
      button.classList.add("active");
    }

    const statusClass = isComplete ? "complete" : isActive ? "active" : "";
    const statusText = isComplete ? "Mastered" : isActive ? "In Progress" : "Ready";

    button.innerHTML = `
      <div class="lesson-header">
        <strong>${chapter.title}</strong>
        <span class="lesson-status ${statusClass}">${statusText}</span>
      </div>
      <div class="lesson-meta">${chapter.weight} weight | ${chapter.questions.length} questions</div>
      <p class="lesson-blurb">${chapter.blurb}</p>
    `;

    button.addEventListener("click", () => selectChapter(chapter.id));
    lessonList.appendChild(button);
  });
}

function renderAnswerOptions(question, reveal) {
  answerGrid.innerHTML = "";
  const choiceLabels = ["A", "B", "C"];

  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.innerHTML = `
      <span class="answer-letter">${choiceLabels[index] || String(index + 1)}</span>
      <span class="answer-text">${choice}</span>
    `;

    if (state.selectedChoice === index) {
      button.classList.add("selected");
    }

    if (reveal) {
      if (index === question.answer) {
        button.classList.add("correct");
      }

      if (state.selectedChoice === index && index !== question.answer) {
        button.classList.add("incorrect");
      }

      button.disabled = true;
    } else {
      button.addEventListener("click", () => handleChoice(index));
    }

    answerGrid.appendChild(button);
  });
}

function renderSidebar() {
  masteredCount.textContent = String(state.masteredQuestionIds.length);
  queueCount.textContent = String(state.queue.length);
  streakCount.textContent = String(state.stats.streak);
  correctCount.textContent = String(state.stats.correct);
  missedCount.textContent = String(state.stats.missed);
  repeatCount.textContent = String(state.repeatIds.length);

  reviewList.innerHTML = "";
  if (!state.repeatIds.length) {
    const item = document.createElement("li");
    item.textContent = "No repeats waiting yet.";
    reviewList.appendChild(item);
    return;
  }

  state.repeatIds.forEach((questionId) => {
    const question = getQuestionById(questionId);
    if (!question) {
      return;
    }

    const item = document.createElement("li");
    item.textContent = question.prompt;
    reviewList.appendChild(item);
  });
}

function renderLevelChrome() {
  const level = levelConfigs[state.currentLevel];
  heroLevelLabel.textContent = level.heroLabel;
  if (heroTextCopy) {
    heroTextCopy.textContent = level.heroCopy;
  }
  topicMapTitle.textContent = level.mapTitle;
  pathTitle.textContent = level.pathTitle;

  topicPills.innerHTML = "";
  chapters.forEach((chapter) => {
    const pill = document.createElement("span");
    pill.textContent = chapter.title;
    topicPills.appendChild(pill);
  });

  const tabStates = [
    [levelCustomTab, LEVEL_CUSTOM_ID],
    [level1Tab, LEVEL_ONE_ID],
    [level2Tab, LEVEL_TWO_ID],
    [level3Tab, LEVEL_THREE_ID]
  ];

  tabStates.forEach(([tab, levelId]) => {
    if (!tab) {
      return;
    }

    const isActive = state.currentLevel === levelId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

function renderNotesView() {
  const chapter = getSelectedChapter();

  chapterTopic.textContent = chapter.topic;
  chapterStatus.textContent = state.completedChapters.includes(chapter.id)
    ? "Mastered chapter"
    : state.activeChapterId === chapter.id
      ? "Worksheet in progress"
      : "Ready to study";
  chapterTitle.textContent = chapter.title;
  chapterSummary.textContent = chapter.summary;
  chapterTeach.textContent = chapter.teach;
  weightCaption.textContent = `${chapter.weight} official topic weight`;
  scheduleCaption.textContent = `${chapter.questions.length} practice questions in this chapter`;
  notesStartButton.textContent = state.activeChapterId === chapter.id ? "Resume Practice Worksheet" : "Open Practice Worksheet";

  syllabusList.innerHTML = "";
  chapter.syllabus.forEach((item) => {
    const point = document.createElement("li");
    point.textContent = item;
    syllabusList.appendChild(point);
  });

  highlightGrid.innerHTML = "";
  chapter.highlights.forEach((item) => {
    const card = document.createElement("article");
    card.className = "highlight-card";
    card.innerHTML = `
      <p class="highlight-label">${item.label}</p>
      <p class="highlight-text">${item.text}</p>
    `;
    highlightGrid.appendChild(card);
  });

  notesSections.innerHTML = "";
  chapter.notes.forEach((section) => {
    const block = document.createElement("article");
    block.className = "note-section";

    const listItems = section.points
      .map((point) => `<li>${point}</li>`)
      .join("");

    block.innerHTML = `
      <h4>${section.title}</h4>
      <ul class="note-points">${listItems}</ul>
    `;
    notesSections.appendChild(block);
  });

  formulaList.innerHTML = "";
  chapter.formulas.forEach((item) => {
    const point = document.createElement("li");
    point.textContent = item;
    formulaList.appendChild(point);
  });

  scheduleList.innerHTML = "";
  chapter.schedule.forEach((step, index) => {
    const block = document.createElement("article");
    block.className = "schedule-step";
    block.innerHTML = `
      <span class="schedule-index">${index + 1}</span>
      <div>
        <h4>${step.title}</h4>
        <p>${step.detail}</p>
      </div>
    `;
    scheduleList.appendChild(block);
  });
}

function renderPracticeView() {
  const chapter = getChapterById(state.activeChapterId);
  const question = getQuestionById(state.currentQuestionId);
  const level = levelConfigs[state.currentLevel];

  if (!chapter || !question) {
    questionTopic.textContent = "Worksheet";
    replayState.textContent = "Idle";
    questionSetLabel.textContent = state.currentLevel === LEVEL_TWO_ID ? "Item Set" : "Year Tag";
    questionDifficulty.textContent = "Medium";
    questionYear.textContent = "Year n/a";
    questionPosition.textContent = "Question 0 of 0";
    vignetteTitle.textContent = "Choose a lesson to load practice.";
    vignetteCopy.textContent = level.practiceIntro;
    questionPrompt.textContent = "Open a chapter's practice worksheet to start answering questions.";
    conceptCopy.textContent = "Missed questions will return later until you clear them correctly.";
    answerGrid.innerHTML = "";
    feedbackPanel.hidden = true;
    continueButton.disabled = true;
    return;
  }

  const totalQuestions = chapter.questions.length;
  const masteredInChapter = chapter.questions.filter((item) => state.masteredQuestionIds.includes(item.id)).length;
  const isReplayCard = state.repeatIds.includes(question.id);
  const questionNumber = getQuestionIndex(chapter, question.id) + 1;

  questionTopic.textContent = chapter.topic;
  replayState.textContent = isReplayCard ? "Replay card" : "Fresh card";
  questionSetLabel.textContent = question.setLabel || (state.currentLevel === LEVEL_TWO_ID ? `${chapter.title} Item Set` : `Year ${question.year || "n/a"}`);
  questionDifficulty.textContent = `${question.difficulty || "Medium"} difficulty`;
  questionYear.textContent = `Year ${question.year || "n/a"}`;
  questionPosition.textContent = `Question ${questionNumber} of ${totalQuestions}`;
  vignetteTitle.textContent = question.caseTitle || chapter.title;
  vignetteCopy.textContent = question.caseText || chapter.summary;
  questionPrompt.textContent = question.prompt;
  conceptCopy.textContent = question.concept;
  feedbackPanel.hidden = !state.awaitingContinue;
  continueButton.disabled = !state.awaitingContinue;

  stageTitle.textContent = chapter.title;
  progressCaption.textContent = `${masteredInChapter}/${totalQuestions} questions cleared`;
  progressFill.style.width = `${Math.round((masteredInChapter / totalQuestions) * 100)}%`;

  if (state.awaitingContinue) {
    renderAnswerOptions(question, true);
  } else {
    feedbackPanel.classList.remove("correct", "incorrect");
    feedbackTitle.textContent = "";
    feedbackBody.textContent = "";
    renderAnswerOptions(question, false);
  }
}

function renderEmptyOrSummaryState() {
  if (state.currentView !== "notes") {
    return;
  }

  const chapter = getSelectedChapter();
  const completedCount = state.completedChapters.length;

  stageTitle.textContent = chapter.title;
  progressCaption.textContent = `${completedCount}/${chapters.length} chapters mastered`;
  progressFill.style.width = `${Math.round((completedCount / chapters.length) * 100)}%`;
  teachingCard.classList.toggle("celebration", completedCount > 0);
}

function renderTabs() {
  const notesActive = state.currentView === "notes";
  notesTab.classList.toggle("active", notesActive);
  notesTab.setAttribute("aria-selected", String(notesActive));
  practiceTab.classList.toggle("active", !notesActive);
  practiceTab.setAttribute("aria-selected", String(!notesActive));
  notesView.hidden = !notesActive;
  practiceView.hidden = notesActive;
}

function render() {
  ensureStateIntegrity();
  renderLevelChrome();
  renderTabs();
  renderChapterList();
  renderNotesView();
  renderPracticeView();
  renderEmptyOrSummaryState();
  renderSidebar();
}

function maybeAutostartFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedLevel = params.get("level");
  if (requestedLevel && levelConfigs[requestedLevel] && requestedLevel !== state.currentLevel) {
    switchLevel(requestedLevel);
    return;
  }

  const shouldAutostart = params.get("autostart") === "1" || window.location.hash === "#start";
  if (!shouldAutostart || state.activeChapterId) {
    return;
  }

  const requestedChapter = params.get("lesson");
  const targetChapter = chapters.find((chapter) => chapter.id === requestedChapter) || chapters[0];
  startChapter(targetChapter.id);
}

notesTab.addEventListener("click", () => setView("notes"));
practiceTab.addEventListener("click", () => {
  if (!state.activeChapterId) {
    startChapter(getSelectedChapter().id);
    return;
  }

  setView("practice");
});

if (levelCustomTab) {
  levelCustomTab.addEventListener("click", () => switchLevel(LEVEL_CUSTOM_ID));
}

level1Tab.addEventListener("click", () => switchLevel(LEVEL_ONE_ID));
level2Tab.addEventListener("click", () => switchLevel(LEVEL_TWO_ID));
level3Tab.addEventListener("click", () => {});

notesStartButton.addEventListener("click", () => {
  if (state.activeChapterId === state.selectedChapterId) {
    setView("practice");
  } else {
    startChapter(state.selectedChapterId);
  }
});

startButton.addEventListener("click", () => {
  const nextChapter = chapters.find((chapter) => !state.completedChapters.includes(chapter.id)) || getSelectedChapter();
  startChapter(nextChapter.id);
});

continueButton.addEventListener("click", handleContinue);
skipButton.addEventListener("click", handleSkip);

resetButton.addEventListener("click", () => {
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

render();
maybeAutostartFromUrl();
