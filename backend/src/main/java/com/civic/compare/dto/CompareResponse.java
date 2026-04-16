package com.civic.compare.dto;
 
import java.util.List;
 
public class CompareResponse {
 
    private PolicyDto policy1;
    private PolicyDto policy2;
    private List<DiffBlock> blocks;
    private String insight;
 
    public PolicyDto getPolicy1() { return policy1; }
    public void setPolicy1(PolicyDto policy1) { this.policy1 = policy1; }
 
    public PolicyDto getPolicy2() { return policy2; }
    public void setPolicy2(PolicyDto policy2) { this.policy2 = policy2; }
 
    public List<DiffBlock> getBlocks() { return blocks; }
    public void setBlocks(List<DiffBlock> blocks) { this.blocks = blocks; }
 
    public String getInsight() { return insight; }
    public void setInsight(String insight) { this.insight = insight; }
}