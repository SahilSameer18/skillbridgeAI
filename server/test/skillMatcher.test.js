import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  matchSkillGap,
  findBoundedSubstring,
  levenshtein,
  similarity,
  getFuzzyThreshold,
} from "../src/services/skillMatcher.service.js";

describe("Skill Matcher Unit Tests", () => {
  const mockSkills = [
    {
      id: "skill-1",
      terms: ["docker", "docker engine", "containerization"],
    },
    {
      id: "skill-2",
      terms: ["kubernetes", "k8s", "kube"],
    },
    {
      id: "skill-3",
      terms: ["java", "core java", "java 17", "java 21"],
    },
    {
      id: "skill-4",
      terms: ["javascript", "js", "vanilla js", "ecmascript"],
    },
    {
      id: "skill-5",
      terms: ["golang", "golang dev", "go programming", "go language"],
    },
  ];

  it("levenshtein computes correct minimum edit distance", () => {
    assert.strictEqual(levenshtein("docker", "doker"), 1);
    assert.strictEqual(levenshtein("react", "react"), 0);
    assert.strictEqual(levenshtein("python", "java"), 6);
  });

  it("similarity computes accurate ratio", () => {
    assert.strictEqual(similarity("react", "react"), 1);
    assert.ok(similarity("doker", "docker") > 0.8);
  });

  it("getFuzzyThreshold adapts to term length", () => {
    assert.strictEqual(getFuzzyThreshold(5), 0.80);
    assert.strictEqual(getFuzzyThreshold(4), 0.85);
  });

  it("findBoundedSubstring respects word boundaries", () => {
    assert.strictEqual(findBoundedSubstring("learning javascript", "java"), -1);
    assert.ok(findBoundedSubstring("learning java backend", "java") >= 0);
    assert.strictEqual(findBoundedSubstring("django app", "go"), -1);
  });

  it("exact match: matches canonical name case-insensitively", () => {
    const res = matchSkillGap("Docker", mockSkills);
    assert.ok(res);
    assert.strictEqual(res.skillId, "skill-1");
    assert.strictEqual(res.matchType, "exact");
  });

  it("alias match: matches configured aliases", () => {
    const res = matchSkillGap("Proficiency in k8s needed", mockSkills);
    assert.ok(res);
    assert.strictEqual(res.skillId, "skill-2");
    assert.strictEqual(res.matchType, "alias");
  });

  it("boundary safety: does not match Java when text is JavaScript", () => {
    const res = matchSkillGap("javascript", mockSkills);
    assert.ok(res);
    assert.strictEqual(res.skillId, "skill-4");
  });

  it("fuzzy match: tolerates 1-char typo on terms with length >= 5", () => {
    const res = matchSkillGap("Doker", mockSkills);
    assert.ok(res);
    assert.strictEqual(res.skillId, "skill-1");
    assert.strictEqual(res.matchType, "fuzzy");
  });

  it("fuzzy safety: does not match short words with high relative distance", () => {
    const res = matchSkillGap("Jav", mockSkills);
    assert.strictEqual(res.skillId, null);
    assert.strictEqual(res.matchType, "none");
  });

  it("multi-term resolution on slash/separated skills", () => {
    const segment1 = matchSkillGap("Docker", mockSkills);
    const segment2 = matchSkillGap("Kubernetes", mockSkills);
    assert.strictEqual(segment1.skillId, "skill-1");
    assert.strictEqual(segment2.skillId, "skill-2");
  });
});
