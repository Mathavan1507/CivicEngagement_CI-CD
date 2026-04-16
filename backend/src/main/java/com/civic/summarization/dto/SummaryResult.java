package com.civic.summarization.dto;

public class SummaryResult {
	private String summary;
	private int originalSentences;
	private int summarySentences;

	public SummaryResult() {
	}

	public SummaryResult(String summary, int orig, int summ) {
		this.summary = summary;
		this.originalSentences = orig;
		this.summarySentences = summ;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String s) {
		this.summary = s;
	}

	public int getOriginalSentences() {
		return originalSentences;
	}

	public void setOriginalSentences(int n) {
		this.originalSentences = n;
	}

	public int getSummarySentences() {
		return summarySentences;
	}

	public void setSummarySentences(int n) {
		this.summarySentences = n;
	}
}