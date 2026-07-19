package com.assignment.ExpenseVoucherMS.repository;

import com.assignment.ExpenseVoucherMS.entity.Voucher;
import com.assignment.ExpenseVoucherMS.entity.VoucherStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    List<Voucher> findByEmployeeId(Long employeeId);
    List<Voucher> findByStatus(VoucherStatus status);
}