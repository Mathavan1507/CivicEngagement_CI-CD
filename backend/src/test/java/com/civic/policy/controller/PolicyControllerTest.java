package com.civic.policy.controller;
 
import com.civic.auth.entity.ContributorType;
import com.civic.auth.entity.Role;
import com.civic.auth.entity.Users;
import com.civic.auth.repository.UserRepository;
import com.civic.policy.entity.Policy;
import com.civic.policy.repository.PolicyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
 
import java.util.List;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
@ExtendWith(MockitoExtension.class)
class PolicyControllerTest {
 
    @InjectMocks
    private PolicyController controller;
 
    @Mock private PolicyRepository repo;
    @Mock private UserRepository   userRepo;
    @Mock private Authentication   auth;
 
    private Users regularUser;
    private Users contributorUser;
    private Policy policy1;
 
    @BeforeEach
    void setUp() {
        regularUser = new Users();
        regularUser.setEmail("user@test.com");
        regularUser.setRole(Role.USER);
 
        contributorUser = new Users();
        contributorUser.setEmail("contrib@test.com");
        contributorUser.setRole(Role.CONTRIBUTOR);
        contributorUser.setContributorType(ContributorType.EDUCATOR);
 
        policy1 = new Policy();
        policy1.setId(1L);
        policy1.setTitle("Education Policy");
        policy1.setViews(10);
    }
 
    @Test
    void getAll_regularUser_returnsAllPolicies() {
        when(auth.getName()).thenReturn("user@test.com");
        when(userRepo.findByEmail("user@test.com")).thenReturn(Optional.of(regularUser));
        when(repo.findAll()).thenReturn(List.of(policy1));
 
        List<Policy> result = controller.getAll(auth);
 
        assertEquals(1, result.size());
        verify(repo).findAll();
    }
 
    @Test
    void getAll_contributorUser_returnsFilteredPolicies() {
        when(auth.getName()).thenReturn("contrib@test.com");
        when(userRepo.findByEmail("contrib@test.com")).thenReturn(Optional.of(contributorUser));
        when(repo.findByContributionTypeOrContributionTypeIsNull(ContributorType.EDUCATOR))
                .thenReturn(List.of(policy1));
 
        List<Policy> result = controller.getAll(auth);
 
        assertEquals(1, result.size());
        verify(repo).findByContributionTypeOrContributionTypeIsNull(ContributorType.EDUCATOR);
        verify(repo, never()).findAll();
    }
 
    @Test
    void getById_incrementsViewCount() {
        when(repo.findById(1L)).thenReturn(Optional.of(policy1));
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));
 
        Policy result = controller.getById(1L);
 
        assertEquals(11, result.getViews());
        verify(repo).save(policy1);
    }
 
    @Test
    void getById_notFound_throwsException() {
        when(repo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(Exception.class, () -> controller.getById(99L));
    }
 
    @Test
    void search_delegatesToRepository() {
        when(repo.findByTitleContainingIgnoreCaseOrDescriptionContaining("edu", "edu"))
                .thenReturn(List.of(policy1));
 
        List<Policy> result = controller.search("edu");
 
        assertEquals(1, result.size());
    }
 
    @Test
    void trending_returnsTop5ByViews() {
        when(repo.findTop5ByOrderByViewsDesc()).thenReturn(List.of(policy1));
 
        List<Policy> result = controller.trending();
 
        assertEquals(1, result.size());
        verify(repo).findTop5ByOrderByViewsDesc();
    }
 
    @Test
    void newest_returnsTop5ByCreatedAt() {
        when(repo.findTop5ByOrderByCreatedAtDesc()).thenReturn(List.of(policy1));
 
        List<Policy> result = controller.newest();
 
        assertEquals(1, result.size());
    }
 
    @Test
    void byCategory_delegatesToRepository() {
        when(repo.findByCategory("health")).thenReturn(List.of(policy1));
 
        List<Policy> result = controller.byCategory("health");
 
        assertEquals(1, result.size());
        verify(repo).findByCategory("health");
    }
}
 