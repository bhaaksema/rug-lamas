import equal from 'fast-deep-equal';

// function to compare formulas
export function checkRule(formula, rule) {
  return checkRuleFormula(formula, rule.formula,
    new Array(rule.agents), new Array(rule.holes))[0]
}

function checkRuleFormula(formula, rule, agents, holes) {
  if (rule.type === "hole") {
    if (holes[rule.hole] === undefined) {
      holes[rule.hole] = formula
      return [true, agents, holes]
    } else {
      return [equal(holes[rule.hole], formula), agents, holes]
    }
  }

  if (formula.type !== rule.type) return [false, agents, holes]
  let result

  switch (rule.type) {
    case "conjunction":
    case "disjunction":
      if (formula.formulas.length !== rule.formulas.length) {
        return [false, agents, holes]
      } else {
        for (let i = 0; i < formula.formulas.length; i++) {
          [result, agents, holes] = checkRuleFormula(formula.formulas[i], rule.formulas[i], agents, holes)
          if (!result) return [false, agents, holes]
        }
        return [true, agents, holes]
      }
    case "implication":
    case "equivalence":
      [result, agents, holes] = checkRuleFormula(formula.left, rule.left, agents, holes)
      if (!result) return [false, agents, holes]
      return checkRuleFormula(formula.right, rule.right, agents, holes)
    case "negation":
      return checkRuleFormula(formula.formula, rule.formula, agents, holes)
    case "K":
    case "M":
      if (agents[rule.agent] === undefined) {
        agents[rule.agent] = formula.agent
        return checkRuleFormula(formula.formula, rule.formula, agents, holes)
      } else if (agents[rule.agent] !== formula.agent) {
        return [false, agents, holes]
      } else {
        return checkRuleFormula(formula.formula, rule.formula, agents, holes)
      }
    default:
      return [false, agents, holes]
  }
}

// (K{0} Phi & K{0} (Phi -> Psi)) -> K{0} Psi
let A2 = {
  name: "A2", type: "axiom", agents: 1, holes: 2,
  formula: {
    type: "implication",
    left: {
      type: "conjunction",
      formulas: [
        { type: "K", agent: 0, formula: { type: "hole", hole: 0 } },
        {
          type: "K", agent: 0, formula: {
            type: "implication", left: { type: "hole", hole: 0 }, right: { type: "hole", hole: 1 }
          }
        }
      ]
    },
    right: { type: "K", agent: 0, formula: { type: "hole", hole: 1 } }
  }
}

export let rulesList = [A2]
