package com.civic.compare.dto;
 
public class PolicyDto {
 
    private Long id;
    private String title;
    private String description;
    private String category;
    private String tags;
 
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
 
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
 
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
 
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
 
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
}
 