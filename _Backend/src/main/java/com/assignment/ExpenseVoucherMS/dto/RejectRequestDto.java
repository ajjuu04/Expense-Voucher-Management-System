package com.assignment.ExpenseVoucherMS.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectRequestDto {
    @NotBlank(message = "Rejection reason is required")
    private String reason;
}