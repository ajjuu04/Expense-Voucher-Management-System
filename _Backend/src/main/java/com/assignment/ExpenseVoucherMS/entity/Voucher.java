package com.assignment.ExpenseVoucherMS.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "voucher_number", nullable = false, unique = true, length = 30)
    private String voucherNumber;

    @Column(name = "voucher_date", nullable = false)
    private LocalDate voucherDate;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expDate;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(name = "exp_title", nullable = false, length = 150)
    private String expenseTitle;

    @Column(name = "expense_category", length = 100)
    private String expenseCategory;

    @Column(name = "expense_description", columnDefinition = "TEXT")
    private String expenseDesc;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @Column(name = "emp_sign_url", length = 255)
    private String employeeSignUrl;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VoucherStatus status = VoucherStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "director_id")
    private User director;

    @Column(name = "director_signature_url", length = 255)
    private String directorSignUrl;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @CreationTimestamp
    @Column(updatable = false,nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updated_at;

}
