---
title: Guanaco
description: A Syntactic Proof Guide for Epistemic Logic
---

<script>
  MathJax = { tex: { inlineMath: [['$', '$']] } };
</script>
<script id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>

# Introduction

In this project, we present a program that helps users write syntactic proofs. We name it _Guanaco_. If you have completed or taught one of the courses _Introduction to Logic_, _Reasoning and Arguing_ or _Logica en Argumentatieleer_ at University of Groningen, then you probably recall the program Fitch. Guanaco is much like Fitch, except that it concerns syntactic proofs instead of natural deduction. Just like in Fitch, users of Guanaco enter formulas on lines and provide a justification for those formulas. The justifications are the rules and axioms of the logics $\mathbf{K\_{(m)}}$, $\mathbf{T\_{(m)}}$, $\mathbf{S4\_{(m)}}$, $\mathbf{S5\_{(m)}}$, $\mathbf{PA\_{(m)}}$, $\mathbf{KEC\_{(m)}}$, $\mathbf{TEC\_{(m)}}$, $\mathbf{S4EC\_{(m)}}$, $\mathbf{S5EC\_{(m)}}$ or $\mathbf{PAC\_{(m)}}$ in which the users aims to derive a chosen formula. Guanaco then evaluates whether the justification is applied correctly. This helps users successfully complete syntactic proofs.

The strategy that Guanaco employs is building proofs _bottom-up_. This means that users start with the formula that they wish to derive. If this formula can only be derived by a rule, then Guanaco exploits the properties of this formula to extract new formulas the relevant rule is applied to. If the formula is an instantiation of an axiom, no new formulas are extracted. The same process is then applied until each formula has a justification and no new ones are produced. At that point, the proof is complete. We explain this bottom-up strategy further in the _[Bottom-up strategy](#bottom-up-strategy)_ section.

The intended goal of this program is mostly educational. We hope that students will be able to use Guanaco to guide them with making syntactic proofs correctly, and we hope that Guanaco aids teachers with teaching syntactic proofs. To fully facilitate this kind of use, we may need to revise Guanaco in the future with usability in mind. For now, we aim to make Guanaco work correctly for the variety of logics taught in the course _Logical Aspects of Multi-Agent Systems_.

## Overview
The website is structured as follows. Under _[Syntactic Proofs](#syntactic-proofs)_, we briefly explain syntactic proofs and what they look like. We discuss the rules and axioms of the logics $\mathbf{K\_{(m)}}$, $\mathbf{T\_{(m)}}$, $\mathbf{S4\_{(m)}}$, $\mathbf{S5\_{(m)}}$, $\mathbf{PA\_{(m)}}$, $\mathbf{KEC\_{(m)}}$, $\mathbf{TEC\_{(m)}}$, $\mathbf{S4EC\_{(m)}}$, $\mathbf{S5EC\_{(m)}}$ and $\mathbf{PAC\_{(m)}}$. Under _[Implementation](#implementation)_, we discuss Guanaco in more detail. We explain the bottom-up strategy that Guanaco employs. We then discuss some technical details of the program. Furthermore, we provide a detailed explanation of how Guanaco generates proofs. Under _[Results](#results)_, we provide multiple examples of derivations made with Guanaco. These examples are syntactic proofs provided in [Meyer & Hoek (1995)](#references) and [Van Ditmarsch et al. (2007)](#references), and show that the program treats them correctly. Finally, we discuss Guanaco's limitations and perspectives for further research under _[Discussion](#discussion)_ and we provide a list of the relevant literature under _[References](#references)_.

# Syntactic proofs

Syntactic proofs are done using axiom systems. An axiom system $\Gamma$ is a set of axioms and derivation rules. Given a formula $\varphi$, if we want to show that $\varphi$ is $\Gamma$-provable, we have to give a derivation. A derivation of a formula $\varphi$ is a finite sequence of formulas $\varphi_1, \varphi_2, \dots, \varphi_n=\varphi$, where each $\varphi_i$ for $1 \leq i \leq n$ is either an instance of one of the axioms or the conclusion of a derivation rule of which the premises have been derived already, i.e. the premises appear as $\varphi_j$ in the sequence with $j < i$. When we can derive an epistemic formula $\varphi$ using the axioms and derivation rules of $\Gamma$, we write $\Gamma \vdash \varphi$. In this case, $\varphi$ is called a $\Gamma$-theorem.

Visually, a syntactic proof is presented like this:

| Line number | Axiom system |          |   Formula   |      Justification      |
| :---------: | :----------: | :------: | :---------: | :---------------------: |
|     $1$     |   $\Gamma$   | $\vdash$ | $\varphi_1$ | $\mathbf{A}/\mathbf{R}$ |
|    $...$    |   $\Gamma$   | $\vdash$ |    $...$    | $\mathbf{A}/\mathbf{R}$ |
|     $i$     |   $\Gamma$   | $\vdash$ | $\varphi_i$ | $\mathbf{A}/\mathbf{R}$ |
|    $...$    |   $\Gamma$   | $\vdash$ |    $...$    | $\mathbf{A}/\mathbf{R}$ |
|     $n$     |   $\Gamma$   | $\vdash$ | $\varphi_n$ | $\mathbf{A}/\mathbf{R}$ |

So each member of the sequence of formulas has its own line, specifying the used axiom system $\Gamma$, the formula itself and the justification for that formula (an axiom $\mathbf{A}$ or rule $\mathbf{R}$ of $\Gamma$). If the justification is a rule, then the premises to which the rule is applied are cited.

## The language: Epistemic Formulas

Each formula $\varphi$ is a formula of a _language_. In Guanaco, there are four available languages: $\mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$, $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$, $\mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$ and $\mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$. When we present axiom systems later, we specify for which language it is an axiom system.

Let $\mathbf{P}$ be a set of propositional atoms; $\mathbf{P} = \lbrace p_n : n \in \mathbb{N} \rbrace $. Let $\mathbf{A}$ be a set of $m$ agents; $\mathbf{A} = \lbrace 1, \dots, m \rbrace $. The set $\mathcal{L}\_\mathbf{K}^m(\mathbf{P})$ of epistemic formulas $\varphi, \psi, \dots$ over $\mathbf{A}$ is the smallest set closed under:

1. If $p \in \mathbf{P}$, then $p \in \mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$.
2. If $\varphi, \psi \in \mathcal{L}^m_{\mathbf{K}}(\mathbf{P}) $, then $(\varphi \land \psi), \lnot \varphi \in \mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$.
3. If $\varphi \in \mathcal{L}^m\_{\mathbf{K}}(\mathbf{P})$, then $K\_{i}\varphi \in \mathcal{L}^m\_{\mathbf{K}}(\mathbf{P})$, for all $i \in \mathbf{A}$.

Moreover, let $\varphi \lor \psi, \varphi \rightarrow \psi$, $\varphi \leftrightarrow \psi$ and $\bot$ be abbreviations for $\lnot(\lnot\varphi \land \lnot \psi)$, $\lnot \varphi \lor \psi$, $(\varphi \rightarrow \psi) \land (\psi \rightarrow \varphi)$ and $p\wedge\neg p$ (where $p$ is a propositional atom) respectively. Additionally, we use the abbreviation $M_i\varphi$ for $\lnot K_i \lnot \varphi$.

The language $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$ is an extension of $\mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$; it also contains the operators $E$ and $C$. The formula $E\varphi$ means 'Everybody knows $\varphi$' and is defined as the conjunction of all agents in $\mathbf{A}$ knowing $\varphi$, i.e. $E\varphi = \bigwedge\_{i \in \mathbf{A}} K_i\varphi$. The formula $C\varphi$ means that there is common knowledge of a formula $\varphi$ and it is defined as $C\varphi = \varphi \land E\varphi \land EE\varphi \land \dots = {\bigwedge} \_{n=0} ^{\infty} E^n\varphi$.

So the language $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$ is the smallest set closed under:
1. If $p \in \mathbf{P}$, then $p \in \mathcal{L}^m\_{\mathbf{KEC}}(\mathbf{P})$.
2. If $\varphi, \psi \in \mathcal{L}^m\_{\mathbf{KEC}}(\mathbf{P}) $, then $(\varphi \land \psi), \lnot \varphi \in \mathcal{L}^m\_{\mathbf{KEC}}(\mathbf{P}) $.
3. If $\varphi \in \mathcal{L}^m\_{\mathbf{KEC}}(\mathbf{P})$, then $K\_i\varphi \in \mathcal{L}^m\_{\mathbf{KEC}}(\mathbf{P})$, for all $i \in \mathbf{A}$.
4. If $\varphi \in \mathcal{L}^m\_{\mathbf{KEC}}(\mathbf{P})$, then $E\varphi, C\varphi \in \mathcal{L}^m\_{\mathbf{KEC}}(\mathbf{P})$.

The language $\mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$ is an extension of $\mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$; it also contains the operator $[\varphi]$. A formula $[\varphi]\psi$ means "after a public announcement of $\varphi$, $\psi$ holds". The language $\mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$ is the smallest set closed under:
1. If $p \in \mathbf{P}$, then $p \in \mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$.
2. If $\varphi, \psi \in \mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$, then $(\varphi \land \psi), \lnot \varphi \in \mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P}) $.
3. If $\varphi \in \mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$, then $K\_i\varphi \in \mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$, for all $i \in \mathbf{A}$.
4. If $\varphi,\psi \in \mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$, then $[\varphi]\psi \in \mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$.

Now, $\mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$ is an extension of $\mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$; it also contains the operators $E$ and $C$ as defined before. So the language $\mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$ is the smallest set closed under:
1. If $p \in \mathbf{P}$, then $p \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$.
2. If $\varphi, \psi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$, then $(\varphi \land \psi), \lnot \varphi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$.
3. If $\varphi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$, then $K\_i\varphi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$, for all $i \in \mathbf{A}$.
4. If $\varphi,\psi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$, then $[\varphi]\psi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$, for all $i \in \mathbf{A}$.
5. If $\varphi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$, then $E\varphi, C\varphi \in \mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$ for $B \subseteq \mathbf{A}$.

Note that in [Van Ditmarsch et al. (2007)](#references), the $C$ and $E$ operators are followed by a subscript $B$, which signifies the group that has common knowledge or mutual knowledge. In [Meyer & Hoek (1995)](#references), it is assumed that $B=\mathbf{A}$. We adopt the same strategy here. So the language $\mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$ and the logic $\mathbf{PAC\_{(m)}}$ we present here is not identical to the language and logic presented in Van Ditmarsch (2007). The language and logic presented in Van Ditmarsch (2007) are able to express 'mixed' theorems, namely theorems with multiple operators $C$ and $E$ where group $B$ differs between these operators. What we present here cannot express those theorems.
We chose to adopt this limitation due to time constraints; now that we drop the subscript $B$, $\mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$ and $\mathbf{PAC\_{(m)}}$ are straightforward extensions of $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$ and $\mathbf{S5EC\_{(m)}}$ respectively.

## Axiom Systems

In Guanaco, there are ten available axiom systems $\Gamma$ available: $\mathbf{K\_{(m)}}$, $\mathbf{T\_{(m)}}$, $\mathbf{S4\_{(m)}}$, $\mathbf{S5\_{(m)}}$, $\mathbf{PA\_{(m)}}$, $\mathbf{KEC\_{(m)}}$, $\mathbf{TEC\_{(m)}}$, $\mathbf{S4EC\_{(m)}}$, $\mathbf{S5EC\_{(m)}}$ and $\mathbf{PAC\_{(m)}}$. Each of these logics provides a set of rules and axioms to make syntactic proofs with. Optionally, the user can enter the amount of agents $m$. Here is a list of all rules and axioms encoded into Guanaco:

| Axiom or rule name                   |                                            Rule or axiom                                             |  Abbreviation  |
| ------------------------------------ | :--------------------------------------------------------------------------------------------------: | :------------: |
| Propositional tautologies            |                             All (instances of) propositional tautologies                             | $\mathbf{A1}$  |
| Modus ponens for knowledge           |    $(K_i \varphi \land K_i(\varphi \rightarrow \psi)) \rightarrow K_i \psi$ for $i = 1, \dots, m$    | $\mathbf{A2}$  |
| Distribution of $K$ over implication |     $K_i(\varphi \rightarrow \psi) \rightarrow (K_i \varphi\to K_i \psi)$ for $i = 1, \dots, m$      | $\mathbf{A2}'$ |
| Knowledge implies truth              |                         $K_i\varphi \rightarrow \varphi$ for $i=1, \dots m$                          | $\mathbf{A3}$  |
| Positive introspection               |                     $K_i\varphi \rightarrow K_iK_i\varphi$ for $i = 1, \dots, m$                     | $\mathbf{A4}$  |
| Negative introspection               |               $\lnot K_i \varphi \rightarrow K_i \lnot K_i\varphi$ for $i=1, \dots m$                | $\mathbf{A5}$  |
| Definition of $E$                    |                 $E\varphi \leftrightarrow (K_1\varphi \land \dots \land K_m\varphi)$                 | $\mathbf{A6}$  |
| Common knowledge implies truth       |                                    $C\varphi \rightarrow \varphi$                                    | $\mathbf{A7}$  |
| Mix of common knowledge              |                                   $C\varphi \rightarrow EC\varphi$                                   | $\mathbf{A8}$  |
| Modus ponens for common knowledge    |                   $(C\varphi \land C(\varphi \rightarrow \psi)) \rightarrow C\psi$                   | $\mathbf{A9}$  |
| Distribution of $C$ over implication |                    $C(\varphi \rightarrow \psi) \rightarrow (C\varphi\to C\psi)$                     | $\mathbf{A9}'$ |
| Induction of common knowledge        |             $C(\varphi \rightarrow E\varphi) \rightarrow (\varphi \rightarrow C\varphi)$             | $\mathbf{A10}$ |
| Atomic permanence                    |                        $\[\varphi\]p \leftrightarrow (\varphi \rightarrow p)$                        | $\mathbf{A11}$ |
| Announcement and negation            |          $\[\varphi\]\lnot\psi \leftrightarrow (\varphi \rightarrow \lnot\[\varphi\]\psi) $          | $\mathbf{A12}$ |
| Announcement and conjunction         |       $\[\varphi\](\psi \land \chi) \leftrightarrow (\[\varphi\]\psi \land \[\varphi\]\chi) $        | $\mathbf{A13}$ |
| Announcement and knowledge           | $\[\varphi\]K_i\psi \leftrightarrow (\varphi \rightarrow K_i\[\varphi\]\psi) $ for $i = 1, \dots, m$ | $\mathbf{A14}$ |
| Announcement composition             |           $\[\varphi\]\[\psi\]\chi \leftrightarrow \[\varphi \land \[\varphi\]\psi\]\chi $           | $\mathbf{A15}$ |
| Modus ponens                         |                        $\dfrac{\varphi \quad \varphi \rightarrow \psi}{\psi}$                        | $\mathbf{R1}$  |
| Necessitation of knowledge           |                         $\dfrac{\varphi}{K\_i\varphi}$ for $i = 1, \dots, m$                         | $\mathbf{R2}$  |
| Necessitation of common knowledge    |                                     $\dfrac{\varphi}{C\varphi}$                                      | $\mathbf{R3}$  |
| Necessitation of announcements       |                                  $\dfrac{\varphi}{\[\psi\]\varphi}$                                  | $\mathbf{R4}$  |
| Announcement and common knowledge    |      $\dfrac{\chi\to[\varphi]\psi \quad \chi \wedge \varphi \to E\chi}{\chi\to[\varphi]C\psi}$       | $\mathbf{R5}$  |

All axioms and rules are from [Meyer & Hoek (1995)](#references) and [Van Ditmarsch et al. (2007)](#references). Note that $\mathbf{A2}$ and $\mathbf{A2}'$ are propositionally equivalent, and so are $\mathbf{A9}$ and $\mathbf{A9}'$. Furthermore, $A6$ is available only if the amount of $m$ is specified by the user.

Now, the axiom systems are defined in terms of which axioms and rules hold in them.

| Axiom system           | Axioms and rules                                                                     | Relations between systems                                                    | Language                                      |
| ---------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------- |
| $\mathbf{K\_{(m)}}$    | $\mathbf{A1}-\mathbf{A2}'$ and $\mathbf{R1}-\mathbf{R2}$                             |                                                                              | $\mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$     |
| $\mathbf{T\_{(m)}}$    | $\mathbf{A1}-\mathbf{A3}$ and $\mathbf{R1}-\mathbf{R2}$                              | $\mathbf{K\_{(m)}} + \mathbf{A3}$                                            | $\mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$     |
| $\mathbf{S4\_{(m)}}$   | $\mathbf{A1}-\mathbf{A4}$ and $\mathbf{R1}-\mathbf{R2}$                              | $\mathbf{T\_{(m)}} + \mathbf{A4}$                                            | $\mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$     |
| $\mathbf{S5\_{(m)}}$   | $\mathbf{A1}-\mathbf{A5}$ and $\mathbf{R1}-\mathbf{R2}$                              | $\mathbf{S4\_{(m)}} + \mathbf{A5}$                                           | $\mathcal{L}\_{\mathbf{K}}^m(\mathbf{P})$     |
| $\mathbf{PA\_{(m)}}$   | $\mathbf{A1}-\mathbf{A5}$, $\mathbf{A1}1-\mathbf{A15}$ and $\mathbf{R1}-\mathbf{R2}$ | $\mathbf{S5\_{(m)}} + \mathbf{A11}-\mathbf{A15}$                             | $\mathcal{L}\_{\mathbf{K[]}}(\mathbf{A,P})$   |
| $\mathbf{KEC\_{(m)}}$  | $\mathbf{A1}-\mathbf{A2}'$, $\mathbf{A6}-\mathbf{A10}$ and $\mathbf{R1}-\mathbf{R3}$ | $\mathbf{K\_{(m)}} + \mathbf{A6}-\mathbf{A10} + \mathbf{R3}$                 | $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$   |
| $\mathbf{TEC\_{(m)}}$  | $\mathbf{A1}-\mathbf{A3}$, $\mathbf{A6}-\mathbf{A10}$ and $\mathbf{R1}-\mathbf{R3}$  | $\mathbf{KEC\_{(m)}} + \mathbf{A3}$                                          | $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$   |
| $\mathbf{S4EC\_{(m)}}$ | $\mathbf{A1}-\mathbf{A4}$, $\mathbf{A6}-\mathbf{A10}$ and $\mathbf{R1}-\mathbf{R3}$  | $\mathbf{TEC\_{(m)}} + \mathbf{A4}$                                          | $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$   |
| $\mathbf{S5EC\_{(m)}}$ | $\mathbf{A1}-\mathbf{A10}$ and $\mathbf{R1}-\mathbf{R3}$                             | $\mathbf{S4EC\_{(m)}} + \mathbf{A5}$                                         | $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$   |
| $\mathbf{PAC\_{(m)}}$  | $\mathbf{A1}-\mathbf{A15}$ and $\mathbf{R1}-\mathbf{R5}$                             | $\mathbf{S5EC\_{(m)}} + \mathbf{A11}-\mathbf{A15} + \mathbf{R4}-\mathbf{R5}$ | $\mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$ |

## Shortcut rules

The table below shows the shortcut rules encoded into Guanaco. Each of these rules is available in all axiom systems, except for ED and CD, which are available only in axiom systems for languages with the $E$ and $C$ operators.

| Rule name                                  |                                                                        Rule                                                                         | Abbreviation                  |
| ------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------: | ----------------------------- |
| $K$-distribution                           |                                                  $\dfrac{\varphi\to\psi}{K\_i\varphi\to K\_i\psi}$                                                  | $\mathbf{KD}$                 |
| Equivalence-introduction                   |                                     $\dfrac{\varphi\to\psi \quad \psi \to \varphi}{\varphi\leftrightarrow\psi}$                                     | $\mathbf{EI}$                 |
| Equivalence-elimination                    |                                                $\dfrac{\varphi\leftrightarrow\psi}{\varphi\to\psi}$                                                 | $\mathbf{EE}$                 |
| Equivalence-elimination                    |                                                $\dfrac{\varphi\leftrightarrow\psi}{\psi\to\varphi}$                                                 | $\mathbf{EE}'$                |
| $K$-distribution ($\leftrightarrow$)       |                                      $\dfrac{\varphi\leftrightarrow\psi}{K\_i\varphi\leftrightarrow K\_i\psi}$                                      | $\mathbf{KD} \leftrightarrow$ |
| Hypothetical syllogism                     |                                            $\dfrac{\varphi\to\chi \quad \chi \to \psi}{\varphi\to\psi}$                                             | $\mathbf{HS}$                 |
| Hypothetical syllogism ($\leftrightarrow$) |                            $\dfrac{\varphi\leftrightarrow\chi\quad\chi\leftrightarrow\psi}{\varphi\leftrightarrow\psi}$                             | $\mathbf{HS} \leftrightarrow$ |
| Left-right strengthening                   |                                          $\dfrac{\varphi\to\psi}{(\varphi\wedge\chi)\to(\psi\wedge\chi)}$                                           | $\mathbf{LR}$                 |
| Contra-position                            |                                                  $\dfrac{\varphi\to\psi}{\neg\psi\to\neg\varphi}$                                                   | $\mathbf{CP}$                 |
| No contradiction                           |                                              $\dfrac{(\varphi\wedge\neg\psi)\to\bot}{\varphi\to\psi}$                                               | $\mathbf{NC}$                 |
| Combining                                  |                   $\dfrac{\varphi\_1\to\psi\_1 \quad \varphi\_2\to\psi\_2}{(\varphi\_1\wedge\varphi\_2)\to(\psi\_1\wedge\psi_2)}$                   | $\mathbf{CO}$                 |
| Combining  ($\leftrightarrow$)             | $\dfrac{\varphi\_1\leftrightarrow\psi\_1 \quad \varphi\_2\leftrightarrow\psi\_2}{(\varphi\_1\wedge\varphi\_2)\leftrightarrow(\psi\_1\wedge\psi_2)}$ | $\mathbf{CO} \leftrightarrow$ |
| Substitution                               |                           $\dfrac{\varphi\_1\leftrightarrow\varphi\_2}{\psi\leftrightarrow\psi\[\varphi\_1/\varphi\_2\]}$                           | $\mathbf{SUB}$                |
| No contradiction                           |                                              $\dfrac{(\varphi\wedge\psi)\to\bot}{\psi\to\neg\varphi}$                                               | $\mathbf{NC}'$                |
| $E$-distribution                           |                                                     $\dfrac{\varphi\to\psi}{E\varphi\to E\psi}$                                                     | $\mathbf{ED}$                 |
| $C$-distribution                           |                                                     $\dfrac{\varphi\to\psi}{C\varphi\to C\psi}$                                                     | $\mathbf{CD}$                 |

# Implementation

In this section, we cover the important details of the implementation strategy. We first present the parsing process of our program, followed by our employed strategies for the implementation of axioms and rules.

## Input parsing

For a user to be able to provide a syntactic proof, the user needs to be able to enter formulas. For this purpose, we developed an easy to type input language for formulas. The program interprets formulas in this language using a lexer and a parser, together they take a string of symbols as input and provide an abstract syntax tree representation as output. Often, the program has to display formulas stored in this format to the user, so we also developed an easy to read display language with Unicode symbols for the usual operators, in the translation to this display language, disambiguating brackets are added automatically. The goal of these different languages is that entering a formula should be easy, so we chose symbols that are on the keyboard for the input language, but displayed formulas should look like the formulas of the books [Meyer & Hoek (1995)](#references) and [Van Ditmarsch et al. (2007)](#references). That is why the input language and display language are different, even though they represent the same formula.

| Input                                | Interpretation                                         | Displayed formula | Formula of the relevant language |
| ------------------------------------ | ------------------------------------------------------ | ----------------- | -------------------------------- |
| `pn`                                 | propositional atom `n`, where `n` is an integer        | pn                | $p\_n$                           |
| `fn`                                 | formula `n`, where `n` is an integer                   | fn                | $\varphi\_n$                     |
| `!x`                                 | negation of the formula `x`                            | ¬`x`              | $\neg\varphi$                    |
| `x & y`                              | conjunction of the formulas `x` and `y`                | `x` ∧&#xFE0E; `y` | $\varphi\wedge\psi$              |
| `x ︱ y`                              | disjunction of the formulas `x` and `y`                | `x` ∨&#xFE0E; `y` | $\varphi\vee\psi$                |
| `x -> y`                             | implication of `x` to `y`                              | `x` →&#xFE0E; `y` | $\varphi\to\psi$                 |
| <code>x&nbsp;<&#8209;>&nbsp;y</code> | biimplication of `x` and `y`                           | `x` ↔&#xFE0E; `y` | $\varphi\leftrightarrow\psi$     |
| `Kan x`                              | agent `an` (where `n` is an integer) knows formula `x` | Kan`x`            | $K\_{i}\varphi$                  |
| `Kn x`                               | the agent `n`$\in \mathbf{A}$ knows formula `x`        | Kn`x`             | $K\_{n}\varphi$                  |
| `Ex`                                 | everybody knows formula `x`                            | E`x`              | $E\varphi$                       |
| `Cx`                                 | there is common knowledge of formula `x`               | C`x`              | $C\varphi$                       |
| `[x]y`                               | announcement of `x` followed by `y`                    | [`x`]`y`          | $\[\varphi\]\psi$                |
| `T`                                  | tautology                                              | ⊤                 | $\top$                           |
| `F`                                  | contradiction                                          | ⊥                 | $\bot$                           |

If only one atom, formula or agent is needed in the user's proof, the user can omit the integer `n` without issue. Furthermore, we support the alternative letters `p`, `q`, `r` and `s` for propositional atoms, `f`, `g`, and `h` for formulas, and `a`, `i` and `j` for agents. In order to facilitate infinitely many possible inputs, the parser is able to distinguish between inputs for all integers. For example, the parser recognizes that `p1` and `p2` are two different propositional atoms, that `f1` and `f2` are two different formulas, and that `a1` and `a2` are different agents.

To avoid ambiguity, the user is required to place brackets around binary operators if and only if the binary operator is a _subformula_. For example, the parser does not recognize the input `f & g | h`, but it does recognize `(f & g) | h` and `f & (g | h)`. The parser ignores any white spaces in the input, so the user can use white spaces in the way they like.

## Schemes

The rules and axioms of the available logics are _schemes_; they represent not one theorem, but infinitely many. This is because an axiom is defined on formulas $\varphi$, which can represent any formula of the respective language. For example, take the axiom $\mathbf{A3}$, ($K\_i\varphi\to\varphi$). We can instantiate this axiom on any formula of our language to get a theorem of $\mathbf{T\_{(m)}}$. For example, $K\_ip\to p$ is a theorem of $\mathbf{T\_{(m)}}$, but so are $K\_i\neg p\to\neg p$ and $K\_i(p\to q)\to(p\to q)$. Moreover, schemes can instantiate schemes: $K\_i\neg\varphi\to\neg\varphi$ is also an instantiation of $\mathbf{A3}$, even though it is a scheme.

Our program's processing engine is built to handle this flexibility of rules and axioms. For all axioms, it treats the formulas on which they are defined as indexed 'holes', which are any formula or scheme of the language. For example, axiom $\mathbf{A3}$ is roughly encoded as `K agent0 hole0 -> hole0`. Then, if the users provides the line `Ka1!!f -> !!f` as an input, when it encounters `!!f` in the first occurrence of `hole0`, it checks whether `!!f` is also in the second occurrence. In this case, it is, so the program recognizes it as an instantiation of $\mathbf{A3}$. This strategy is generalized for axioms with multiple 'holes' and extended to remember the structure of formulas to generate the premises of rules.

## Bottom-up strategy

In many cases, syntactic proofs are finished by applying rules. Guanaco employs a _bottom-up_ strategy for rules. For any formula $\varphi$ of the relevant language, there is a set of rules of which the conclusion has the same formulaic structure as $\varphi$. Only those rules are available to justify $\varphi$. The premises for these rules can then be automatically generated. 

For example, suppose we try to derive $K\_i(p\wedge q)\to K\_ip$. Normally, we would start with the propositional tautology $(p\wedge q)\to p$ and apply $K$-distribution ($\mathbf{KD}$) to it. With the bottom-up strategy, we do it the opposite way. We start with the formula we aim to derive $K\_i(p\wedge q)\to K\_ip$ and then we generate the premise on which we would apply $\mathbf{KD}$ to get to this formula. So, in this case, justifying a line with $\mathbf{KD}$ means that (1) the line is a conditional, (2) the conditional has $K\_i$ before both the antecedent and consequent, and (3) its premise is the same conditional without the $K\_i$ before the antecedent and consequent. So if the user justifies a line with $\mathbf{KD}$, Guanaco automatically generates a new line above with the same conditional but without the $K\_i$ before the antecedent and consequent.

Note that with this bottom-up strategy, the user cannot add lines to the proof by themselves. To get more lines, the user needs to select a rule that generates new lines.

Users can use Guanaco and its bottom-up strategy to complete proofs. First, the user enters the formula they wish to give a derivation of. Then they apply a justification to the line with this formula. If it is an axiom, the proof is finished. If it is a rule, new premises are generated which need a justification. The proof will thus get a tree structure; applying rules with two premises splits the line's branch into two branches, applying rules with one premise prolongs the line's branch, and applying an axiom closes the line's branch. A derivation is then complete if and only if all branches of the tree are closed by axioms.

This means that the user has to select justifications strategically if they want to give the shortest derivation possible. If a line can be justified with an axiom, then this is always the most efficient choice, since it immediately closes the branch. If no axiom can justify the line, then the user has to figure out what the least amount of applications of rules is in order to close the branch. Note that Guanaco cannot do this for the user, since $\mathbf{R1}$ is _always_ available; the formulaic structure of the conclusion of $\mathbf{R1}$ allows for _any_ formula. But $\mathbf{R1}$ is often not the only rule available, nor is it often the most efficient. So the user has to determine by themselves what rules are the best choices in those cases. This is an educative strength of Guanaco's bottom-up strategy, because it forces users to think strategically about justifications.

## Writing syntactic proofs in Guanaco

In this section, we discuss the user's perspective using Guanaco to derive a particular formula $\varphi$.

First, the user selects the axiom system $\Gamma$ they want to work with. There is a drop down menu on the left for this. Optionally, they can select the number of agents $m$ that they want in their system.

Second, the user provides the formula $\varphi$ they wish to derive in the 'goal' box. They must use our input language representation of the formula in order for Guanaco to parse it. While the user is typing, Guanaco displays the user input on the first (and only) proof line. Guanaco will also check, and notify the user, whether the user input parses to a well-formed formula. As soon as it is well-formed, the goal box will light up green and give a check mark.

Third, the user must now choose a justification for the displayed line. There is a drop down menu to the right of the line. The items of the drop down menu are the available axioms and rules. An axiom or rule is available if and only if (1) the axiom system $\Gamma$ selected by the user contains it and (2) the line that the user is trying to justify has the same formulaic structure as the axiom or as the conclusion of the rule. For example, $K\_i(p\wedge q)\to K\_ip$ has the same formulaic structure as the conclusion of $\mathbf{KD}$, but not as the conclusion of $\mathbf{R2}$. So $\mathbf{KD}$ will be available to justify this line, but $\mathbf{R2}$ will not be. Therefore $\mathbf{KD}$ will be an item of the drop down menu, and $\mathbf{R2}$ wont. Whenever the user selects a rule, Guanaco generates one or two (depending on whether the chosen rule has one or two premises) new lines above the justified line and displays the relevant premise formula(s) one the new line(s). 

Fourth, there are a few rules that need user input. The premises of the rules $\mathbf{R1}$, $\mathbf{HS}$ and $\mathbf{HS}\leftrightarrow$ contain formulas that are not in the conclusion. For example, if we try to derive $\varphi \to \psi$ with $\mathbf{HS}$, then we would generate two premises: $\varphi \to \chi$ and $\chi \to \psi$. But what should $\chi$ be? Guanaco cannot determine this by itself. So if the user selects $\mathbf{R1}$, $\mathbf{HS}$ or $\mathbf{HS}\leftrightarrow$, the user needs to provide a formula. Guanaco generates the premises and shows a question mark (?) where user input is required. Below the generated premises, there is an input box where the user can enter a formula. Here, the user will need to use our special input language again. When the user provides a well-formed formula as input, the user can click on the 'enter' button (or press enter on their keyboard). Guanaco then replaces the question mark with the provided input formula and the input box disappears. For example, if one uses $\mathbf{HS}$ to justify $\varphi\to\psi$, then Guanaco displays $\varphi\to\ ?$ and $? \to \psi$ on two new lines above. If the user provides $\chi$ as input, then it updates the two new lines to $\varphi\to \chi$ and $\chi \to \psi$.

Finally, when all lines have been justified and Guanaco gives a green check mark for each of the lines, the user knows that their syntactic proof is correct and complete.

There are some cases where the user will have to use some rules differently than working on paper. Firstly in [Meyer & Hoek (1995)](#references), the rules $\mathbf{HS}$, $\mathbf{HS}\leftrightarrow$, $\mathbf{CO}$ and $\mathbf{CO}$ $\leftrightarrow$ allow for more than two premises. But Guanaco cannot determine how many premises they should generate. For example, we can justify $\varphi \to \psi$ with $\mathbf{HS}$ with two premises, but also three, four or more. For instance, we could use $\varphi \to \chi$, $\chi \to \tau$ and $\tau\to\psi$ (this is three premises).
But this is not problematic. If we can use these rules with $n$ premises, we can also use them with 2 premises $n-1$ times. For example, suppose we want to prove $\varphi\to\psi$ from the premises $\varphi \to \chi$, $\chi \to \tau$ and $\tau\to\psi$. Instead of applying $\mathbf{HS}$ once using all three premises, we can also apply $\mathbf{HS}$ twice ($3-1=2$) to get the same result. In this case we get $\varphi\to\tau$ by applying $\mathbf{HS}$ to $\varphi \to \chi$ and $\chi \to \tau$, and then we get $\varphi\to\psi$ by applying $\mathbf{HS}$ to $\varphi \to \tau$ and $\tau\to\psi$.
So due to time constraints for this project, we do not facilitate $\mathbf{HS}$, $\mathbf{HS}\leftrightarrow$, $\mathbf{CO}$ and $\mathbf{CO}\leftrightarrow$ with more than two premises. This will not entail issues for the program, except for some user inconvenience. Secondly, operators like $\land$ and $\leftrightarrow$ are not commutative. For example, this means that you cannot prove $(\chi \land \varphi) \rightarrow (\chi \land \psi)$ with $\mathbf{LR}$ immediately. Since in _Epistemic Logic for AI and Computer Science_, the rule is given in the form $(\varphi \land \chi) \rightarrow (\psi \land \chi)$, you would first need to use an application of $\mathbf{R1}$, where you give as input $(\varphi \land \chi) \rightarrow (\psi \land \chi)$, creating one instance of $\mathbf{A1}$, and the formula that you can prove with $\mathbf{LR}$. The same problem might arise when working with biimplications, the user will have to swap the two subformulas using an application of $\mathbf{R1}$ as well. Thirdly, conjunctions and disjunctions cannot be chained. For example, writing the formula $p \land q \land r$ will not be accepted, the user will need to use either $p \land (q \land r)$ or $(p \land q) \land r$. This is especially relevant when using the axiom $\mathbf{A6}$. For example, when working with 3 agents, the parser only recognizes $E\varphi \leftrightarrow (K_1 \varphi \land (K_2 \varphi \land K_3 \varphi))$ as an instance of $\mathbf{A6}$, so it is important that the brackets are on the right of the conjunction.

Following the steps outlined above, the user can never make mistakes; in the sense that every axiom or rule they can select is applicable, and every premise is generated automatically by Guanaco. And for rules that require input, Guanaco accepts the input only if it is well-formed. Moreover, if a user does not provide input when required, justification drop down menu is not available for lines that contain a question mark. So the user cannot apply axioms or rules incorrectly, and the proof is only complete if all lines are justified.

# Results

We have collected multiple **[proofs written in Guanaco](https://github.com/bhaaksema/guanaco-doc/tree/main/examples "Guanaco Examples on GitHub")**. These examples cover most of the important axioms and rules, so you can see how to use each of them are used in practice. When using Guanaco for the first time, it is useful to look at these examples, especially to learn how the input parsing works.

Note: In the proofs of Cf → K1f and ¬Cf → C¬Cf, there is no justification for the first line. For the former, this proof is also included in the list of proofs and for the latter, the proof can be found in _Epistemic Logic for AI and Computer Science, Exercise 2.1.2.1(viii)._

# Discussion

We believe that Guanaco can actually be used by students and teachers for educational purposes, just like the program _Fitch_ is used in first-year and minor introductions in logic. In this section, we present the educational advantages and uses we see for Guanaco. Afterwards, we discuss what the current limitations of Guanaco and what future work on the tool could look like.

## Educational advantages

We believe that Guanaco has the following educational advantages:

- **The user must enter well-formed formulas.** Users can never attempt to, and get stuck trying to, derive formulas that are not well-formed, because Guanaco's parser rejects formulas that are not well-formed. Therefore, the user is forced to understand the syntax of the logical languages encoded into Guanaco.

- **The user can never make mistakes.** As described above, there is no way for users to apply a formula incorrectly without them knowing. Axioms cannot be applied incorrectly because they are only available to the user if they are applicable. Premises of rules are always automatically generated by Guanaco. So whatever Guanaco generates, it will be correct. The users role here is to _make the right choices_.
The user has to select the axioms or rules that lets them finish the proof most efficiently. This coincides with the next advantage:

- **The user can focus on the logic and proof instead of on the notation.** If the user just wants to develop their intuition by making a lot of proofs, Guanaco is a perfect fit. Guanaco removes the obstacle of notation and writing, and this significantly increases the speed of proof-making. This is particularly effective when there are multiple ways to derive a given formula. This means that the user has multiple choices between axioms or rules to justify the same line. The choice they make on that line will affect what new lines are generated and thereby how the rest of the proof is completed. This allows users to quickly make multiple proof attempts and explore what a proof would look like if they use different rules. It is even more effective when users have to use modus ponens; because the antecedent of the conditional premise is not part of the conclusion, the user has to come up with a formula. Whatever formula they enter here will affect how they can complete the proof. The user cannot mindlessly apply rules; they have to think about what premises they need to justify the relevant line. Of course, this advantage is a double-edged sword; if the user uses Guanaco _only_, they will have difficulty making the proofs by hand. So users should not restrict their practice with syntactic proofs to using Guanaco.

We see the following uses for Guanaco:

- **Students can use Guanaco to develop their intuition about syntactic proofs.** As described above, using Guanaco to quickly explore proofs and try out different justifications helps students develop their intuition about making syntactic proofs.

- **Students can use Guanaco to check their hand-written proofs.** If you make syntactic proofs by hand, it is worth checking whether your proof is correct. Guanaco can serve as a quick verification of your proof. You enter the formula you derived by hand and select exactly those justifications that you used when you wrote the proof by hand. If a justification is not available, you made a mistake. If a generated premise is a different formula than your premise, then you made a mistake. If Guanaco does not give a green check mark whenever you enter or select something you wrote by hand, you made a mistake. If you identified a mistake, in this way, you can fix it by hand and then check it again. Repeat this process until there are no mistakes. 

- **Teachers can use Guanaco to check students' hand-written proofs.** In the same way as described above, teachers can check whether a student's proof is correct. There is a limitation here; teachers can only find the first mistake bottom-up, because Guanaco will not allow the teacher to proceed entering the student's proof if there is a mistake in it. In that case, the teacher has to fix the mistake and continue. But it is not guaranteed that other mistakes the student made will still emerge when the teacher continues entering the proof in Guanaco.
So what we think is that Guanaco helps the teacher quickly check whether a proof is correct if it looks promising at first glance. If there is a subtle mistake that the teacher might not find with grading by hand, Guanaco will automatically spot it. But if the student's proof is obviously incorrect, even at first glance, then grading by hand will probably be more accurate. So teachers can use Guanaco as grading aid, but cannot rely on it.

## Limitations

- **Guanaco only supports the bottom-up strategy.** As should be clear by now, there is no way in Guanaco to make proofs top-down. Sometimes making proofs top-down is desirable, and in those cases Guanaco might not be the best tool to use.

- **Guanaco only spots the first mistake in hand written proofs bottom-up.** Therefore it cannot always be used to fix incorrect proofs (even though it can be used as a proof checker).

- **Guanaco cannot remember previously made proofs.** There is currently no way to save proofs. This also means that users cannot use theorems they have derived before as justifications in their proofs. This is often done in hand-written proofs, and makes proof-writing significantly easier.

- **Guanaco does not support $\mathbf{HS}$, $\mathbf{HS}\leftrightarrow$, $\mathbf{CO}$ and $\mathbf{CO}\leftrightarrow$ for more than two premises.** This is not a problem, but is it inconvenient for the user, because it makes certain proofs somewhat longer.

- **Conjunctions and disjunctions cannot be chained.** For example, the conjunction $p\wedge q\wedge r$ can only be parsed as $(p\wedge q)\wedge r$ or $p\wedge (q\wedge r)$. Chaining conjunctions and disjunctions is quite useful for rules such as $\mathbf{CO}$, $\mathbf{CO}\leftrightarrow$ and $\mathbf{LR}$. Strictly speaking this is not a problem, but it can be quite inconvenient for the user at times.
In an earlier version of Guanaco, we did facilitate conjunction/disjunction chaining. We removed this feature when we realized that we would not facilitate rules with more than two premises. For example, if the user wants to apply $\mathbf{CO}$ to $(p\wedge q\wedge r)\rightarrow(p\wedge q\wedge r)$ with two premises, Guanaco cannot determine which two biconditionals are the premises. There are two possibilities: either the premises are $(p\wedge q)\to(p\wedge q)$ and $r\to r$, or they are $p\to p$ and $(q\wedge r)\to(q\wedge r)$. But applying $\mathbf{CO}$ to $((p\wedge q)\wedge r)\to((p\wedge q)\wedge r)$ works;
Guanaco can determine that the premises in this case must be $(p\wedge q)\to(p\wedge q)$ and $r\to r$.
  
- **Guanaco cannot express and derive mixed theorems for common knowledge and mutual knowledge.** We dropped subscript $B$ for operators $C$ and $E$. Conveniently, this means that $\mathcal{L}\_{\mathbf{KEC[]}}(\mathbf{A,P})$ is straightforward extensions of $\mathcal{L}\_{\mathbf{KEC}}^m(\mathbf{P})$, and $\mathbf{PAC\_{(m)}}$ is a straightforward extension of $\mathbf{S5EC\_{(m)}}$. 

Except for the limitation that Guanaco only supports the bottom-up strategy, each of these limitations could be resolved if work on Guanaco continues somewhere in the future.

# References

Meyer, J. C., & Van Der Hoek, W. (1995). _Epistemic Logic for AI and Computer Science._ Cambridge University Press.

Van Ditmarsch, H., Van Der Hoek, W., & Kooi, B. (2007). _Dynamic Epistemic Logic._ Springer.
