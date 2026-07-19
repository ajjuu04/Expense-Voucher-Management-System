package com.assignment.ExpenseVoucherMS.repository;

import com.assignment.ExpenseVoucherMS.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
}
