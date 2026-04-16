package com.civic.policy.repository;

import com.civic.policy.entity.CompareHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompareHistoryRepository extends JpaRepository<CompareHistory, Long> {
	List<CompareHistory> findByUser_IdOrderByComparedAtDesc(Long userId);
}
