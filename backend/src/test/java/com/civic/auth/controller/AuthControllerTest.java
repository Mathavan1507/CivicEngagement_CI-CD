package com.civic.auth.controller;

import com.civic.auth.repository.UserRepository;
import com.civic.policy.controller.AdminPolicyController;
import com.civic.policy.entity.Policy;
import com.civic.policy.entity.Status;
import com.civic.policy.entity.Summary;
import com.civic.policy.repository.CompareHistoryRepository;
import com.civic.policy.repository.PolicyRepository;
import com.civic.policy.repository.SummaryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
 
import java.util.List;
import java.util.Map;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
class AdminPolicyControllerTest {
 
    @InjectMocks
    private AdminPolicyController controller;
 
    @Mock private PolicyRepository         policyRepo;
    @Mock private SummaryRepository        summaryRepo;
    @Mock private UserRepository           userRepo;
    @Mock private CompareHistoryRepository compareRepo;
 
    private Policy policy;
    private Summary summary;
 
    @BeforeEach
    void setUp() {
        policy = new Policy();
        policy.setId(1L);
        policy.setTitle("Test Policy");
 
        summary = new Summary();
        summary.setId(10L);
        summary.setStatus(Status.PENDING);
    }
 
    @Test
    void getStats_returnsAllCounts() {
        when(policyRepo.count()).thenReturn(5L);
        when(userRepo.count()).thenReturn(20L);
        when(summaryRepo.count()).thenReturn(8L);
        when(summaryRepo.countByStatus(Status.PENDING)).thenReturn(3L);
        when(compareRepo.count()).thenReturn(12L);
 
        Map<String, Object> stats = controller.getStats();
 
        assertEquals(5L,  stats.get("totalPolicies"));
        assertEquals(20L, stats.get("totalUsers"));
        assertEquals(8L,  stats.get("totalSummaries"));
        assertEquals(3L,  stats.get("pendingReviews"));
        assertEquals(12L, stats.get("totalCompares"));
    }
 
    @Test
    void addPolicy_savesAndReturns() {
        when(policyRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
 
        Policy result = controller.addPolicy(policy);
 
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        verify(policyRepo).save(policy);
    }
 
    @Test
    void updatePolicy_updatesFields() {
        Policy updated = new Policy();
        updated.setTitle("Updated Title");
        updated.setDescription("Updated Desc");
        updated.setCategory("New Cat");
        updated.setTags("tag1,tag2");
 
        when(policyRepo.findById(1L)).thenReturn(Optional.of(policy));
        when(policyRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
 
        Policy result = controller.updatePolicy(1L, updated);
 
        assertEquals("Updated Title",   result.getTitle());
        assertEquals("Updated Desc",    result.getDescription());
        assertEquals("New Cat",         result.getCategory());
    }
 
    @Test
    void deletePolicy_exists_deletesAndReturns200() {
        when(policyRepo.existsById(1L)).thenReturn(true);
        when(summaryRepo.findByPolicy_Id(1L)).thenReturn(List.of(summary));
 
        ResponseEntity<?> response = controller.deletePolicy(1L);
 
        assertEquals(200, response.getStatusCode().value());
        verify(summaryRepo).deleteAll(List.of(summary));
        verify(policyRepo).deleteById(1L);
    }
 
    @Test
    void deletePolicy_notFound_returns404() {
        when(policyRepo.existsById(99L)).thenReturn(false);
 
        ResponseEntity<?> response = controller.deletePolicy(99L);
 
        assertEquals(404, response.getStatusCode().value());
        verify(policyRepo, never()).deleteById(any());
    }
 
    @Test
    void approve_setsSummaryStatusToApproved() {
        when(summaryRepo.findById(10L)).thenReturn(Optional.of(summary));
        when(summaryRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
 
        Summary result = controller.approve(10L);
 
        assertEquals(Status.APPROVED, result.getStatus());
    }
 
    @Test
    void reject_setsSummaryStatusToRejected() {
        when(summaryRepo.findById(10L)).thenReturn(Optional.of(summary));
        when(summaryRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
 
        Summary result = controller.reject(10L);
 
        assertEquals(Status.REJECTED, result.getStatus());
    }
}