package com.assignment.ExpenseVoucherMS.controller;


import com.assignment.ExpenseVoucherMS.dto.RejectRequestDto;
import com.assignment.ExpenseVoucherMS.dto.VoucherRequestDto;
import com.assignment.ExpenseVoucherMS.entity.User;
import com.assignment.ExpenseVoucherMS.entity.Voucher;
import com.assignment.ExpenseVoucherMS.entity.VoucherStatus;
import com.assignment.ExpenseVoucherMS.repository.UserRepository;
import com.assignment.ExpenseVoucherMS.service.FileStorageService;
import com.assignment.ExpenseVoucherMS.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")                                  // NEW
    @PostMapping
    public ResponseEntity<Voucher> createDraft(
            @Valid @RequestBody VoucherRequestDto voucherRequestDto, Authentication auth){
        Long empId = getCurrentUser(auth).getId();                       // CHANGED — was @RequestParam
        return ResponseEntity.ok(voucherService.creteDraft(empId, voucherRequestDto));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/my")
    public ResponseEntity<List<Voucher>> getMyVouchers(Authentication auth){
        Long empId = getCurrentUser(auth).getId();
        return ResponseEntity.ok(voucherService.getAllVoucherOfEmp(empId));
    }

    @PreAuthorize("hasAnyRole('EMPLOYEE','DIRECTOR','ACCOUNT_TEAM')")
    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucher(@PathVariable Long id){
        return ResponseEntity.ok(voucherService.getById(id));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> updateDraft(
            @PathVariable Long id,
            @Valid @RequestBody VoucherRequestDto request,
            Authentication auth) {
        Long empId = getCurrentUser(auth).getId();
        return ResponseEntity.ok(voucherService.updateDraft(id, empId, request));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDraft(
            @PathVariable Long id,
            Authentication auth) {
        Long empId = getCurrentUser(auth).getId();
        voucherService.deleteDraft(id, empId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/{id}/signature")
    public ResponseEntity<Voucher> uploadSignature(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ResponseEntity.ok(voucherService.uploadEmployeeSignature(id, url));
    }

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/{id}/submit")
    public ResponseEntity<Voucher> submitVoucher(
            @PathVariable Long id,
            Authentication auth) {
        Long empId = getCurrentUser(auth).getId();
        return ResponseEntity.ok(voucherService.submit(id, empId));
    }

//    director side maPPING



    @PreAuthorize("hasAnyRole('DIRECTOR','ACCOUNT_TEAM')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Voucher>> getByStatus(@PathVariable VoucherStatus status) {
        return ResponseEntity.ok(voucherService.getByStatus(status));
    }

    @PreAuthorize("hasRole('DIRECTOR')")
    @PostMapping("/{id}/director-signature")
    public ResponseEntity<Voucher> uploadDirectorSignature(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ResponseEntity.ok(voucherService.uploadDirectorSignature(id, url));
    }

    @PreAuthorize("hasRole('DIRECTOR')")// NEW
    @PutMapping("/{id}/approve")
    public ResponseEntity<Voucher> approve(
            @PathVariable Long id,
            Authentication auth) {
        Long directorId = getCurrentUser(auth).getId();
        return ResponseEntity.ok(voucherService.approve(id, directorId));
    }

    @PreAuthorize("hasRole('DIRECTOR')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<Voucher> reject(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequestDto request,
            Authentication auth) {
        Long directorId = getCurrentUser(auth).getId();
        return ResponseEntity.ok(voucherService.reject(id, directorId, request.getReason()));
    }
//    DIRECTOR and ACCOUNTS serch
    @PreAuthorize("hasAnyRole('DIRECTOR','ACCOUNT_TEAM')")
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        return ResponseEntity.ok(voucherService.getAllVouchers());
    }
}
