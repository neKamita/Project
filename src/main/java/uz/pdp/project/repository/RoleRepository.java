package uz.pdp.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.project.entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Role.RoleType name);
}
