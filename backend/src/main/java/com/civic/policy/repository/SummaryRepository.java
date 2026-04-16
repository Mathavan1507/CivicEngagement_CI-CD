package com.civic.policy.repository;

import com.civic.policy.entity.Status;
import com.civic.policy.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
	List<Summary> findByPolicy_IdAndStatus(Long policyId, Status status);

	List<Summary> findByPolicy_Id(Long policyId);

	long countByStatus(Status status);
}
