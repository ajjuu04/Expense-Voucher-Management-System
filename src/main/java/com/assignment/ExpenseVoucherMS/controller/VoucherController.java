package com.assignment.ExpenseVoucherMS.controller;


import com.assignment.ExpenseVoucherMS.dto.VoucherRequestDto;
import com.assignment.ExpenseVoucherMS.entity.User;
import com.assignment.ExpenseVoucherMS.entity.Voucher;
import com.assignment.ExpenseVoucherMS.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping
    public ResponseEntity<Voucher> createDraft(
            @RequestParam Long empId, @Valid @RequestBody VoucherRequestDto voucherRequestDto){
        return ResponseEntity.ok(voucherService.creteDraft(empId,voucherRequestDto));
    }

    @GetMapping("/employee/{empid}")
    public ResponseEntity<List<Voucher>> getByEmployee(@PathVariable Long empid){
        return ResponseEntity.ok(voucherService.getAllVoucherOfEmp(empid));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucher(@PathVariable Long id){
        return ResponseEntity.ok(voucherService.getById(id));
    }

}
