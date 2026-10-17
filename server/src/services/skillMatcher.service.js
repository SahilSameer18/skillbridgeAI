/**
 * Skill matcher — resolves a free-text skill gap string (from Gemini) to a
 * seeded Skill record, purely in server logic. No prompt changes, no AI calls.
 *
 * Pipeline: exact match -> bounded alias/keyword match (earliest wins) -> fuzzy fallback -> null
 */

// Calibrated threshold: For terms with length >= 5, 0.80 allows a 1-character typo
// (e.g. "Doker" -> "Docker" with similarity 5/6 = 0.833, "Reakt" -> "React" with similarity 4/5 = 0.80).
// For 4-character terms, 0.85 requires exact or near-exact match to prevent noisy collisions.
const MIN_FUZZY_TERM_LENGTH = 4;
export const getFuzzyThreshold = (termLength) => (termLength >= 5 ? 0.80 : 0.85);

/**
 * Loads all seeded skills once. Call this ONCE per report generation
 * (not once per skill gap) and reuse the result across all gaps.
 */
async function loadSkillsForMatching(prisma) {
  const skills = await prisma.skill.findMany({
    select: { id: true, name: true, aliases: true },
  });

  // Pre-lowercase everything once so matching doesn't repeat this work per gap.
  return skills.map((skill) => ({
    id: skill.id,
    terms: [skill.name.toLowerCase(), ...skill.aliases.map((a) => a.toLowerCase())],
  }));
}

/**
 * Finds the index of `term` inside `text` such that it is not immediately
 * preceded or followed by an alphanumeric character (i.e. it's a whole
 * token, not part of a longer word). Returns -1 if no such occurrence exists.
 *
 * This is what stops "java" from matching inside "javascript", "js" from
 * matching inside "json", and "go" from matching inside "django"/"mongo".
 */
export function findBoundedSubstring(text, term) {
  let fromIndex = 0;
  while (fromIndex <= text.length) {
    const idx = text.indexOf(term, fromIndex);
    if (idx === -1) return -1;

    const beforeChar = idx > 0 ? text[idx - 1] : null;
    const afterChar = idx + term.length < text.length ? text[idx + term.length] : null;
    const beforeOk = !beforeChar || !/[a-z0-9]/i.test(beforeChar);
    const afterOk = !afterChar || !/[a-z0-9]/i.test(afterChar);

    if (beforeOk && afterOk) return idx;
    fromIndex = idx + 1;
  }
  return -1;
}

export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export function similarity(a, b) {
  if (a.length === 0 && b.length === 0) return 1;
  const distance = levenshtein(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

/**
 * Resolves a single raw skill gap string to a skill id.
 * Pure function — no DB calls, no side effects. `skills` is the array
 * returned by loadSkillsForMatching().
 */
export function matchSkillGap(rawSkillText, skills) {
  const normalized = rawSkillText.toLowerCase().trim();

  // 1. Exact match — the whole gap text equals a skill name/alias exactly.
  for (const skill of skills) {
    if (skill.terms.includes(normalized)) {
      return { skillId: skill.id, matchType: "exact" };
    }
  }

  // 2. Bounded alias/keyword match. If multiple skills are mentioned in one
  // gap (e.g. "Cloud Infrastructure (AWS/Azure/GCP)"), the one whose term
  // appears EARLIEST in the text wins. Ties broken by longer (more specific) term.
  let best = null; // { skillId, position, termLength }
  for (const skill of skills) {
    for (const term of skill.terms) {
      const position = findBoundedSubstring(normalized, term);
      if (position === -1) continue;
      if (
        !best ||
        position < best.position ||
        (position === best.position && term.length > best.termLength)
      ) {
        best = { skillId: skill.id, position, termLength: term.length };
      }
    }
  }
  if (best) return { skillId: best.skillId, matchType: "alias" };

  // 3. Fuzzy fallback — catches typos on an otherwise-literal tool name
  // (e.g. "Doker" -> Docker). Deliberately checked per-token against each skill's terms.
  const tokens = normalized.split(/[^a-z0-9+.]+/).filter((t) => t.length >= 3);

  let fuzzyBest = null; // { skillId, score }
  for (const skill of skills) {
    for (const term of skill.terms) {
      if (term.length < MIN_FUZZY_TERM_LENGTH) continue;
      const threshold = getFuzzyThreshold(term.length);
      for (const token of tokens) {
        const score = similarity(token, term);
        if (score >= threshold && (!fuzzyBest || score > fuzzyBest.score)) {
          fuzzyBest = { skillId: skill.id, score };
        }
      }
    }
  }
  if (fuzzyBest) return { skillId: fuzzyBest.skillId, matchType: "fuzzy" };

  // No match — gap will be saved with skillId: null, no resources shown.
  return { skillId: null, matchType: "none" };
}

/**
 * Batch helper: takes raw skillGaps array and active prisma client,
 * resolves skillId for each gap, and automatically splits compound gaps
 * (e.g. "Docker/Kubernetes") into separate gap cards if multiple distinct skills match.
 */
async function attachSkillIds(skillGaps, prisma) {
  const skills = await loadSkillsForMatching(prisma);
  const results = [];

  for (const gap of skillGaps) {
    // Check if the gap mentions multiple slash/parenthesized skills (e.g. "Docker/Kubernetes")
    if (gap.skill && (gap.skill.includes("/") || gap.skill.includes(" / "))) {
      const cleanSegments = gap.skill
        .replace(/[()]/g, " ")
        .split("/")
        .map((s) => s.trim())
        .filter((s) => s.length >= 2);

      const segmentMatches = cleanSegments
        .map((segment) => ({
          segment,
          match: matchSkillGap(segment, skills),
        }))
        .filter((item) => item.match.skillId !== null);

      const uniqueSkillIds = new Set(segmentMatches.map((m) => m.match.skillId));
      if (uniqueSkillIds.size >= 2) {
        for (const item of segmentMatches) {
          results.push({
            ...gap,
            skill: item.segment,
            skillId: item.match.skillId,
          });
        }
        continue;
      }
    }

    // Default single skill resolution
    const { skillId } = matchSkillGap(gap.skill, skills);
    results.push({ ...gap, skillId });
  }

  return results;
}

export { loadSkillsForMatching, attachSkillIds };

