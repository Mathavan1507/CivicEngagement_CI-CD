package com.civic.policy.repository;
 
import com.civic.auth.entity.ContributorType;
import com.civic.policy.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
 
import java.util.List;
 
public interface PolicyRepository extends JpaRepository<Policy, Long> {
 
    List<Policy> findByTitleContainingIgnoreCaseOrDescriptionContaining(String title, String description);
 
    List<Policy> findTop5ByOrderByViewsDesc();
 
    List<Policy> findTop5ByOrderByCreatedAtDesc();
 
    List<Policy> findByCategory(String category);
 
    /**
     * Returns policies whose contributionType matches the given type
     * OR whose contributionType is null (visible to all contributors).
     */
    List<Policy> findByContributionTypeOrContributionTypeIsNull(ContributorType contributionType);
}
 