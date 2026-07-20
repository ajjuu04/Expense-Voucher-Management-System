package com.assignment.ExpenseVoucherMS.service;


import com.assignment.ExpenseVoucherMS.dto.VoucherRequestDto;
import com.assignment.ExpenseVoucherMS.entity.User;
import com.assignment.ExpenseVoucherMS.entity.Voucher;
import com.assignment.ExpenseVoucherMS.entity.VoucherStatus;
import com.assignment.ExpenseVoucherMS.repository.UserRepository;
import com.assignment.ExpenseVoucherMS.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final UserRepository userRepository;
    private final VoucherRepository voucherRepository;

    public Voucher creteDraft(Long empId, @RequestBody VoucherRequestDto requestDto){
        User emp = userRepository.findById(empId).orElseThrow(()-> new RuntimeException("Employee with this id NOt Found"));

        Long nextVoucherID = voucherRepository.count() +1;
        String voucherNumber = "PG" + LocalDate.now().getYear() + "-" +String.format("%04d",nextVoucherID);

        Voucher currVoucher = Voucher.builder()
                .department(requestDto.getDepartment())
                .expenseTitle(requestDto.getExpenseTitle())
                .expenseCategory(requestDto.getExpenseCategory())
                .expenseDesc(requestDto.getExpenseDescription())
                .expDate(requestDto.getExpenseDate())
                .amount(requestDto.getAmount())
                .employee(emp)
                .voucherNumber(voucherNumber)
                .status(VoucherStatus.DRAFT)
                .voucherDate(LocalDate.now())
                .build();

        return voucherRepository.save(currVoucher);
    }

    public Voucher getById(Long voucherId){
        return voucherRepository.findById(voucherId).orElseThrow(()-> new RuntimeException("Voucher with this id NOt Found"));
    }


//    sign filles

    public List<Voucher> getAllVoucherOfEmp(Long empId){
        return voucherRepository.findByEmployeeId(empId);
    }

    public Voucher updateDraft(Long voucherId, Long employeeId, VoucherRequestDto req) {
        Voucher voucher = getById(voucherId);

        if (!voucher.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("u cant edit this voucher");
        }
        if (voucher.getStatus() != VoucherStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT voucher can edited");
        }

        voucher.setDepartment(req.getDepartment());
        voucher.setExpenseTitle(req.getExpenseTitle());
        voucher.setExpenseCategory(req.getExpenseCategory());
        voucher.setExpenseDesc(req.getExpenseDescription());
        voucher.setExpDate(req.getExpenseDate());
        voucher.setAmount(req.getAmount());

        return voucherRepository.save(voucher);
    }

    public void deleteDraft(Long voucherId, Long employeeId) {
        Voucher voucher = getById(voucherId);

        if (!voucher.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Not authorized to delete this voucher");
        }
        if (voucher.getStatus() != VoucherStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT vouchers can be deleted");
        }

        voucherRepository.delete(voucher);
    }

    public Voucher uploadEmployeeSignature(Long voucherId, String signatureUrl) {

        Voucher voucher = getById(voucherId);

        if (voucher.getStatus() != VoucherStatus.DRAFT) {
            throw new RuntimeException("Employee sign can only b added while the voucher in DRAFT status");
        }

        voucher.setEmployeeSignUrl(signatureUrl);
        return voucherRepository.save(voucher);
    }

    public Voucher submit(Long voucherId, Long employeeId) {
        Voucher voucher = getById(voucherId);

        if (!voucher.getEmployee().getId().equals(employeeId)) {
            throw new RuntimeException("Not authorized to submit voucher");
        }
        if (voucher.getStatus() != VoucherStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT vouchers can submitted");
        }
        if (voucher.getEmployeeSignUrl() == null) {
            throw new RuntimeException("Sign is required before submitting");
        }

        voucher.setStatus(VoucherStatus.PENDING);
        return voucherRepository.save(voucher);
    }



//    voucher director acceees

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll().stream()
                .filter(v -> v.getStatus() != VoucherStatus.DRAFT)
                .toList();
    }

    public List<Voucher> getByStatus(VoucherStatus status) {
        return voucherRepository.findByStatus(status);
    }

    public Voucher uploadDirectorSignature(Long voucherId, String signatureUrl) {
        Voucher voucher = getById(voucherId);
        if (voucher.getStatus() != VoucherStatus.PENDING){
            throw new RuntimeException("Director sign can only b added to PENDING voucher");
        }
        voucher.setDirectorSignUrl(signatureUrl);
        return voucherRepository.save(voucher);
    }

    public Voucher approve(Long voucherId, Long directorId) {
        Voucher voucher = getById(voucherId);
        User director = userRepository.findById(directorId)
                .orElseThrow(() -> new RuntimeException("Director not found"));

        if (voucher.getStatus() != VoucherStatus.PENDING) {
            throw new RuntimeException("Only PENDING vouchers can be approved");
        }
        if (voucher.getDirectorSignUrl() == null) {
            throw new RuntimeException("Director signature is required before approval");
        }

        voucher.setStatus(VoucherStatus.APPROVED);
        voucher.setDirector(director);
        voucher.setApprovalDate(LocalDateTime.now());
        return voucherRepository.save(voucher);
    }

    public Voucher reject(Long voucherId, Long directorId, String reason) {
        Voucher voucher = getById(voucherId);
        User director = userRepository.findById(directorId)
                .orElseThrow(() -> new RuntimeException("Director not found"));

        if (voucher.getStatus() != VoucherStatus.PENDING) {
            throw new RuntimeException("Only PENDING vouchers can be rejected");
        }

        voucher.setStatus(VoucherStatus.REJECTED);
        voucher.setDirector(director);
        voucher.setApprovalDate(LocalDateTime.now());
        voucher.setRejectReason(reason);
        return voucherRepository.save(voucher);
    }

}
