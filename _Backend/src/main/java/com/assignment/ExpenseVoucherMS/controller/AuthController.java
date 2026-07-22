package com.assignment.ExpenseVoucherMS.controller;

import com.assignment.ExpenseVoucherMS.dto.*;
import com.assignment.ExpenseVoucherMS.entity.User;
import com.assignment.ExpenseVoucherMS.repository.UserRepository;
import com.assignment.ExpenseVoucherMS.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponseDto(token, user.getEmail(), user.getRole().name(), user.getId()));
    }

    @PostMapping("/register")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<?> registerUser(@Valid @RequestBody CreateUserDto request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .empId(request.getEmpId())
                .build();

        userRepository.save(newUser);
        return ResponseEntity.ok("User created successfully");
    }
}