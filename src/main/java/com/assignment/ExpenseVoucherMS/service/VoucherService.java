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

    public List<Voucher> getAllVoucherOfEmp(Long empId){
        return voucherRepository.findByEmployeeId(empId);
    }

}
